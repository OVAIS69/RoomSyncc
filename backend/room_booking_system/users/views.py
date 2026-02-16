from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login, logout
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer, LoginSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login user"""
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user"""
    logout(request)
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """Get current logged in user"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth_view(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'user': UserSerializer(request.user).data
        })
    return Response({
        'authenticated': False,
        'user': None
    })




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_view(request):
    """Get all users (Admin only)"""
    try:
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can view users'}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all().order_by('username')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    except Exception as e:
        import traceback
        print(traceback.format_exc()) # Print to server console too
        return Response({'detail': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user_view(request):
    """Create a new user (Admin only)"""
    if request.user.role != 'admin':
        return Response({'error': 'Only admins can create users'}, status=status.HTTP_403_FORBIDDEN)

    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Do not log the user in, just return success
        return Response({
            'message': 'User created successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_user_view(request, pk):
    """Update user role or delete user (Admin only)"""
    if request.user.role != 'admin':
        return Response({'error': 'Only admins can manage users'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'DELETE':
        # Prevent deleting yourself
        if user.id == request.user.id:
            return Response({'error': 'Cannot delete your own account'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({'message': 'User deleted successfully'})
        
    elif request.method == 'PUT':
        # Update Role
        new_role = request.data.get('role')
        if new_role:
            # Validate role
            valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
            if new_role not in valid_roles:
                 return Response({'error': f'Invalid role. Choices: {valid_roles}'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Prevent demoting yourself (optional safety)
            if user.id == request.user.id and new_role != 'admin':
                 return Response({'error': 'Cannot change your own role'}, status=status.HTTP_400_BAD_REQUEST)

            user.role = new_role
            user.save()
            return Response({'message': 'User role updated successfully', 'user': UserSerializer(user).data})
            
        return Response({'error': 'No role provided'}, status=status.HTTP_400_BAD_REQUEST)
