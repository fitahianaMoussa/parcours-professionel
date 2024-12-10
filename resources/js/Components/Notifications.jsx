import React, { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

const NotificationsComponent = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        const subscribeToChannels = () => {
            try {
                // Subscribe to general notifications
                const notificationChannel = window.Echo.private('notifications')
                    .listen('NewNotification', (notification) => {
                        setNotifications(prev => [notification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                    });

                // Subscribe to agent-specific notifications
                let agentChannel;
                if (userId) {
                    agentChannel = window.Echo.private(`agent.${userId}`)
                        .listen('AgentNotification', (notification) => {
                            setNotifications(prev => [notification, ...prev]);
                            setUnreadCount(prev => prev + 1);
                        });
                }

                // Handle connection errors
                window.Echo.connector.pusher.connection.bind('error', (error) => {
                    console.error('Pusher connection error:', error);
                    setConnectionError(error.message);
                });

                // Cleanup function
                return () => {
                    notificationChannel?.unsubscribe();
                    agentChannel?.unsubscribe();
                    window.Echo.connector.pusher.connection.unbind();
                };
            } catch (error) {
                console.error('Error setting up Echo listeners:', error);
                setConnectionError(error.message);
            }
        };

        subscribeToChannels();
    }, [userId]);

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/notifications/${notificationId}/mark-as-read`);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId ? { ...notif, read: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
                <FiBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-4 border-b bg-indigo-50">
                        <h3 className="text-sm font-semibold text-indigo-900">
                            Notifications ({unreadCount} non lues)
                        </h3>
                    </div>
                    {connectionError && (
                        <div className="p-2 bg-red-50 text-red-700 text-sm">
                            Problème de connexion aux notifications: {connectionError}
                        </div>
                    )}
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 hover:bg-gray-50">
                                <p className="text-sm text-gray-800">Pas de notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                    <span className="text-xs text-gray-500">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsComponent;