from django.contrib import admin
from .models import Block, Room


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'room_type', 'capacity', 'block')
    list_filter = ('room_type', 'block')
    search_fields = ('room_number',)
    ordering = ('room_number',)
