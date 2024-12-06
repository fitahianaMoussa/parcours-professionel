import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    FiMenu, 
    FiX, 
    FiGrid,
    FiUsers,
    FiFileText,
    FiCalendar,
    FiTrendingUp,
    FiBell,
    FiChevronDown,
    FiSettings,
    FiLogOut
} from 'react-icons/fi';

export default function Authenticated({ user, children }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const navigationItems = [
        { name: 'Tableau de Board', href: '/dashboard', icon: FiGrid, roles: ['admin', 'RH', 'agent'] },
        { name: 'Agent', href: '/agent', icon: FiUsers, roles: ['RH'] },
        { name: 'Contrat', href: '/contrat', icon: FiFileText, roles: ['RH'] },
        { name: 'Integration', href: '/integration-phases', icon: FiCalendar, roles: ['RH'] },
        { name: 'Avancement', href: '/avancement', icon: FiFileText, roles: ['RH'] },
        { name: 'Service Rendu', href: '/serviceRendu', icon: FiCalendar, roles: ['RH'] },
        { name: 'Reclassement', href: '/reclassements', icon: FiTrendingUp, roles: ['RH'] },
        { name: 'Retraite', href: '/retirement', icon: FiCalendar, roles: ['RH'] },
        { name: 'Parcours', href: '/employe/parcours', icon: FiFileText, roles: ['agent'] },
        { name: 'Contrats', href: '/employe/contrats', icon: FiFileText, roles: ['agent'] },
        { name: 'Avancements', href: '/employe/avancements', icon: FiTrendingUp, roles: ['agent'] },
    ];

    const filteredNavigationItems = navigationItems.filter(item => 
        item.roles.includes(user.role)
    );

    const isCurrentRoute = (href) => {
        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>
                {/* Logo Section */}
                <div className="flex items-center h-16 px-6 bg-indigo-600">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
                            <span className="text-xl font-bold text-indigo-600">M</span>
                        </div>
                        <span className="text-xl font-semibold text-white">Modernize</span>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="p-4">
                    <nav className="space-y-1">
                        {filteredNavigationItems.map((item) => {
                            const isActive = isCurrentRoute(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                        isActive
                                            ? 'text-white bg-indigo-600 shadow-md'
                                            : 'text-gray-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                                        isActive
                                            ? 'text-white'
                                            : 'text-gray-400 group-hover:text-indigo-600'
                                    }`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Navigation Bar */}
                <nav className="sticky top-0 z-30 bg-white shadow-sm">
                    <div className="px-4 sm:px-6">
                        <div className="flex items-center justify-between h-16">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 text-gray-600 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none"
                            >
                                <FiMenu className="w-6 h-6" />
                            </button>

                            {/* Search Bar */}
                            <div className="flex-1 hidden max-w-xs ml-8 md:block">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        className="w-full h-10 pl-4 pr-10 text-sm bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center space-x-4">
                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                                        className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none"
                                    >
                                        <FiBell className="w-6 h-6" />
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </button>
                                    
                                    {notificationsOpen && (
                                        <div className="absolute right-0 mt-2 overflow-hidden bg-white rounded-lg shadow-xl w-80">
                                            <div className="p-4 border-b bg-indigo-50">
                                                <h3 className="text-sm font-semibold text-indigo-900">Notifications</h3>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                <div className="p-4 hover:bg-gray-50">
                                                    <p className="text-sm text-gray-800">Pas de notifications</p>
                                                </div>
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
                                        <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                                            <span className="text-sm font-medium text-indigo-600">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="text-sm font-medium text-gray-700">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.role}</div>
                                        </div>
                                        <FiChevronDown className="hidden w-4 h-4 text-gray-400 md:block" />
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-xl">
                                            <div className="py-1">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <FiSettings className="w-4 h-4 mr-2" />
                                                    Paramètres
                                                </Link>
                                                <form action="/logout" method="POST">
                                                    <button
                                                        type="submit"
                                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <FiLogOut className="w-4 h-4 mr-2" />
                                                        Déconnexion
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="p-6">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}