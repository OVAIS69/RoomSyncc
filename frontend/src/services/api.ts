// API Service for RoomSync Backend
const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8000') + '/api';

// Helper function to get CSRF token from cookies
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

// Helper function for API calls with credentials
const apiCall = async (url: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') || '',
            ...options.headers,
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || JSON.stringify(error));
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// Room API
export const roomAPI = {
    getAll: async () => {
        return apiCall(`${API_BASE}/rooms/`);
    },

    getById: async (id: string) => {
        return apiCall(`${API_BASE}/rooms/${id}/`);
    },

    getByBlock: async () => {
        return apiCall(`${API_BASE}/rooms/by_block/`);
    },

    getTypes: async () => {
        return apiCall(`${API_BASE}/rooms/types/`);
    },

    getBlocks: async () => {
        return apiCall(`${API_BASE}/rooms/blocks/`);
    },

    createBlock: async (name: string) => {
        return apiCall(`${API_BASE}/rooms/blocks/`, {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    },

    deleteBlock: async (id: number) => {
        return apiCall(`${API_BASE}/rooms/blocks/${id}/`, {
            method: 'DELETE',
        });
    },


    create: async (data: any) => {
        return apiCall(`${API_BASE}/rooms/`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: number, data: any) => {
        return apiCall(`${API_BASE}/rooms/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: number) => {
        return apiCall(`${API_BASE}/rooms/${id}/`, {
            method: 'DELETE',
        });
    },
};

// Booking API
export const bookingAPI = {
    getAll: async (params?: { room?: string; date?: string; status?: string }) => {
        const queryParams = new URLSearchParams(params as any).toString();
        const url = `${API_BASE}/bookings/${queryParams ? `?${queryParams}` : ''}`;
        return apiCall(url);
    },

    getById: async (id: number) => {
        return apiCall(`${API_BASE}/bookings/${id}/`);
    },

    create: async (booking: {
        room: number;
        date: string;
        start_time: string;
        end_time: string;
        purpose: string;
        faculty_email?: string;
    }) => {
        return apiCall(`${API_BASE}/bookings/`, {
            method: 'POST',
            body: JSON.stringify(booking),
        });
    },

    update: async (id: number, booking: any) => {
        return apiCall(`${API_BASE}/bookings/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(booking),
        });
    },

    delete: async (id: number) => {
        return apiCall(`${API_BASE}/bookings/${id}/`, {
            method: 'DELETE',
        });
    },

    getByRoom: async (roomId: string, date?: string) => {
        const params = new URLSearchParams({ room_id: roomId });
        if (date) params.append('date', date);
        return apiCall(`${API_BASE}/bookings/by_room/?${params.toString()}`);
    },

    getByDate: async (date: string) => {
        return apiCall(`${API_BASE}/bookings/by_date/?date=${date}`);
    },

    getMyBookings: async () => {
        return apiCall(`${API_BASE}/bookings/my_bookings/`);
    },

    getPending: async () => {
        return apiCall(`${API_BASE}/bookings/pending/`);
    },

    getByStatus: async (status: string) => {
        return apiCall(`${API_BASE}/bookings/?status=${status}`);
    },

    approve: async (id: number) => {
        return apiCall(`${API_BASE}/bookings/${id}/approve/`, {
            method: 'POST',
        });
    },

    reject: async (id: number, rejection_reason?: string) => {
        return apiCall(`${API_BASE}/bookings/${id}/reject/`, {
            method: 'POST',
            body: JSON.stringify({ rejection_reason: rejection_reason || '' }),
        });
    },

    cancel: async (id: number) => {
        return apiCall(`${API_BASE}/bookings/${id}/cancel/`, {
            method: 'POST',
        });
    },
};

// Users API
export const usersAPI = {
    getAll: async () => {
        return apiCall(`${API_BASE}/users/manage/`);
    },

    create: async (userData: any) => {
        return apiCall(`${API_BASE}/users/manage/create/`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    updateRole: async (id: number, role: string) => {
        return apiCall(`${API_BASE}/users/manage/${id}/`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    },

    delete: async (id: number) => {
        return apiCall(`${API_BASE}/users/manage/${id}/`, {
            method: 'DELETE',
        });
    },
};

// Auth API
export const authAPI = {
    register: async (userData: {
        username: string;
        email: string;
        password: string;
        password_confirm: string;
        role: string;
        first_name?: string;
        last_name?: string;
    }) => {
        return apiCall(`${API_BASE}/auth/register/`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    login: async (credentials: { username: string; password: string }) => {
        return apiCall(`${API_BASE}/auth/login/`, {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    logout: async () => {
        return apiCall(`${API_BASE}/auth/logout/`, {
            method: 'POST',
        });
    },

    getCurrentUser: async () => {
        return apiCall(`${API_BASE}/auth/user/`);
    },

    checkAuth: async () => {
        return apiCall(`${API_BASE}/auth/check/`);
    },
};

// Support API
export const supportAPI = {
    getAll: async () => {
        return apiCall(`${API_BASE}/support/messages/`);
    },

    create: async (messageData: { name: string; email: string; message: string }) => {
        return apiCall(`${API_BASE}/support/messages/`, {
            method: 'POST',
            body: JSON.stringify(messageData),
        });
    },

    markAsRead: async (id: number) => {
        return apiCall(`${API_BASE}/support/messages/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ is_read: true }),
        });
    },

    delete: async (id: number) => {
        return apiCall(`${API_BASE}/support/messages/${id}/`, {
            method: 'DELETE',
        });
    },
};

export default {
    room: roomAPI,
    booking: bookingAPI,
    auth: authAPI,
    users: usersAPI,
    support: supportAPI,
};
