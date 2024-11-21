import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useEffect} from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { 
    FiMenu, 
    FiX, 
    FiHome,
    FiUsers,
    FiSettings,
    FiHelpCircle,
    FiBell,
    FiChevronDown,
    FiGrid,
    FiPieChart,
    FiFolder, FiFileText, FiTrendingUp, FiCalendar 
} from 'react-icons/fi';


export default function Authenticated({ user,children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navigationItems = [
        { name: 'Tableau de Board', href: route('dashboard'), icon: FiGrid },
        { name: 'Agent', href: route('agent.index'), icon: FiUsers },
        { name: 'Contrat', href: route('contrat.index'), icon: FiFileText },
        { name: 'Integration', href: route('integration-phase.index'),icon: FiCalendar },
        { name: 'Avancement', href: route('advancements.index'), icon: FiFileText },
        { name: 'Service Rendu',  href: route('service.index'), icon: FiCalendar },
        { name: 'Reclassement', href: '#', icon: FiTrendingUp },
        { name: 'Retraite', href: route('retirement.index'), icon: FiCalendar },
    ];

    const [notifications, setNotifications] = useState([]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // useEffect(() => {
    //     const echo = new Echo({
    //         broadcaster: 'reverb',
    //         key: import.meta.env.VITE_REVERB_APP_KEY,
    //         host: import.meta.env.VITE_REVERB_HOST,
    //         port: import.meta.env.VITE_REVERB_PORT,
    //         scheme: import.meta.env.VITE_REVERB_SCHEME,
    //         forceTLS: true,
    //     });

    //     echo.channel('retirement-notifications')
    //         .listen('RetirementNotificationEvent', (event) => {
    //             setNotifications(prevNotifications => [
    //                 ...prevNotifications,
    //                 {
    //                     id: event.time,
    //                     message: event.message,
    //                     time: event.time
    //                 }
    //             ]);
    //         });

    //     return () => {
    //         echo.leaveChannel('retirement-notifications');
    //     };
    // }, []);

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            host: import.meta.env.VITE_REVERB_HOST,
            port: import.meta.env.VITE_REVERB_PORT,
            scheme: import.meta.env.VITE_REVERB_SCHEME,
            forceTLS: true,
        });

        echo.channel('retirement-notifications')
            .listen('RetirementNotificationEvent', (event) => {
                setNotifications(prevNotifications => [
                    ...prevNotifications,
                    {
                        id: event.time,
                        message: event.message,
                        time: event.time
                    }
                ]);
            });

        return () => {
            echo.leaveChannel('retirement-notifications');
        };
    }, []);


    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-violet-600 to-indigo-600">
                    <Link href="/" className="text-2xl font-bold text-white">
                        Dashboard
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-white lg:hidden hover:text-gray-200"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                <nav className="px-4 mt-8">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 mb-2 text-gray-600 rounded-xl hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 hover:text-violet-600 transition-all duration-300 ${
                                route().current(item.href) ? 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-600 shadow-sm' : ''
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex flex-col min-h-screen lg:ml-64">
                {/* Navbar */}
                <nav className="sticky top-0 h-16 bg-white shadow-sm backdrop-blur-sm bg-white/80">
                    <div className="flex items-center justify-between h-full px-6 mx-auto max-w-7xl">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-600 lg:hidden hover:text-gray-900"
                        >
                            <FiMenu className="w-6 h-6" />
                        </button>

                        {/* Right-aligned elements */}
                        <div className="flex items-center ml-auto space-x-6">
                            {/* Search - Optional */}
                            <div className="hidden md:block">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-64 px-4 py-2 text-sm transition-all bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-violet-500"
                                />
                            </div>

                            {/* Notifications */}
                            <div className="relative">
            <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-600 transition-colors hover:text-violet-600 focus:outline-none"
            >
                <FiBell className="w-6 h-6" />
                <span className="absolute w-2 h-2 rounded-full top-1 right-1 bg-rose-500 ring-2 ring-white"></span>
            </button>

            {notificationsOpen && (
                <div className="absolute right-0 z-50 py-2 mt-3 bg-white border border-gray-100 shadow-lg w-80 rounded-xl">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="px-4 py-3 transition-colors cursor-pointer hover:bg-gray-50"
                        >
                            <p className="text-sm text-gray-800">{notification.message}</p>
                            <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                        </div>
                    ))}
                    <div className="px-4 py-2 mt-1 border-t border-gray-100">
                        <Link href="#" className="text-sm text-violet-600 hover:text-violet-700">View all notifications</Link>
                    </div>
                </div>
            )}
        </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center space-x-3 focus:outline-none"
                                >
                                    <div className="flex items-center justify-center text-white rounded-full shadow-sm w-9 h-9 bg-gradient-to-r from-violet-500 to-indigo-500">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden font-medium text-gray-700 sm:block">{user.name}</span>
                                    <FiChevronDown className="hidden w-4 h-4 text-gray-600 sm:block" />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 z-50 w-48 py-2 mt-3 bg-white border border-gray-100 shadow-lg rounded-xl">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            <FiSettings className="w-4 h-4 mr-2" />
                                            Profile Settings
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center w-full px-4 py-2 text-sm text-left transition-colors text-rose-600 hover:bg-rose-50"
                                        >
                                            <FiX className="w-4 h-4 mr-2" />
                                            Log Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="flex-1 w-full p-6 mx-auto max-w-7xl">
                    {children}
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-gray-900/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
