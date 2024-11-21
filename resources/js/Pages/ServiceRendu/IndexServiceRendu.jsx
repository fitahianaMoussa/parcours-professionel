import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";
import {
    Search,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Calendar,
    CheckCircle2,
    AlertCircle,
    PlusCircle,
    ClipboardList,
    User,
} from "lucide-react";

export default function ServiceRenduIndex({ auth, services }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({
        key: "service",
        direction: "asc",
    });

    const itemsPerPage = 5;

    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.poste_occupe.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.reference.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const sortedServices = [...filteredServices].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedServices = sortedServices.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction:
                sortConfig.key === key && sortConfig.direction === "asc"
                    ? "desc"
                    : "asc",
        });
    };

    const getStatusIcon = (isActive) => {
        return isActive ? (
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                <CheckCircle2 size={16} />
                <span>Actif</span>
            </div>
        ) : (
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                <AlertCircle size={16} />
                <span>Inactif</span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Services Rendus" />

            <div className="max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-lg">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold text-gray-800">
                            <ClipboardList className="text-blue-600" />
                            Gestion des Services Rendus
                        </h2>
                        <Link href={route('service.create')}>
                            <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                                <PlusCircle size={20} />
                                Nouveau Service
                            </button>
                        </Link>
                    </div>

                    <div className="relative flex-1 mb-6 min-w-[300px]">
                        <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par service ou catégorie..."
                            className="w-full py-2 pl-10 pr-4 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto rounded-lg">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="px-6 py-3 text-left">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <User size={18} className="text-blue-600" />
                                            <span>Agent</span>
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("service")}
                                    >
                                       
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <Briefcase size={18} className="text-blue-600" />
                                            <span>Service</span>
                                            {sortConfig.key === "service" && (
                                                sortConfig.direction === "asc" ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <ChevronDown size={16} />
                                                )
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <Calendar size={18} className="text-blue-600" />
                                            <span>Période</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <span>Type de Reference</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <span>Statut</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedServices.map((service) => (
                                    <tr key={service.id} className="transition-colors hover:bg-gray-50">
                                       <td className="px-6 py-4 font-medium text-gray-900">
                                            {service.agent.nom} {service.agent.prenom}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {service.poste_occupe}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(service.date_debut).toLocaleDateString()} -{" "}
                                            {new Date(service.date_fin).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {service.reference?.type}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusIcon(service.is_active)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-500">
                            Affichage {startIndex + 1} -{" "}
                            {Math.min(startIndex + itemsPerPage, sortedServices.length)} sur {sortedServices.length} services
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="px-4 py-2 font-medium text-blue-600 rounded-lg bg-blue-50">
                                {currentPage}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
