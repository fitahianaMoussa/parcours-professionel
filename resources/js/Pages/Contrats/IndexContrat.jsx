import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";
import {
    Search,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    FileText,
    Calendar,
    CheckCircle2,
    XCircle,
    PlusCircle,
    ClipboardList,
    AlertCircle,
    CheckSquare,
    FileWarning,
    Eye
} from "lucide-react";

export default function AgentIndex({ auth, contrats }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({
        key: "nom",
        direction: "asc",
    });

    const itemsPerPage = 4;

    const filteredAgents = contrats.filter((contrat) => {
        const matchesSearch =
            contrat?.agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contrat?.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const sortedAgents = [...filteredAgents].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedAgents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAgents = sortedAgents.slice(
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

    const getContractTypeColor = (type) => {
        const types = {
            "integration": "bg-emerald-100 text-emerald-800",
            "reclassement": "bg-blue-100 text-blue-800",
            "titularisation": "bg-purple-100 text-purple-800",
            "avenant signé": "bg-orange-100 text-orange-800"
        };
        return types[type] || "bg-gray-100 text-gray-800";
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
            <Head title="Gestion des Contrats" />

            <div className="p-6 mx-auto space-y-6">
                {/* Header Section */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                                <ClipboardList className="text-blue-600" />
                                Gestion des Contrats
                            </h2>
                            <p className="text-sm text-gray-500">
                                Gérez et suivez tous les contrats des agents
                            </p>
                        </div>
                        <Link href={route('contrat.create')}>
                            <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                <PlusCircle size={20} />
                                Nouveau Contrat
                            </button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou type de contrat..."
                                className="w-full py-2 pl-10 pr-4 text-gray-700 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FileText size={16} />
                            Total: {sortedAgents.length} contrats
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left cursor-pointer group hover:bg-gray-100"
                                        onClick={() => handleSort("nom")}>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <UserCheck size={18} className="text-blue-600" />
                                            <span>Agent</span>
                                            {sortConfig.key === "nom" && (
                                                sortConfig.direction === "asc" ? 
                                                <ChevronUp size={16} /> : 
                                                <ChevronDown size={16} />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <FileText size={18} className="text-blue-600" />
                                            <span>Type</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <Calendar size={18} className="text-blue-600" />
                                            <span>Période</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedAgents.map((agent) => (
                                    <tr key={agent.id} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {agent.agent.nom}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {agent.agent.prenom}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getContractTypeColor(agent.type)}`}>
                                                {agent.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-gray-400" />
                                                <span>
                                                    {new Date(agent.date_debut).toLocaleDateString()} - 
                                                    {agent.date_fin ? new Date(agent.date_fin).toLocaleDateString() : 'En cours'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={route('contrat.show', agent.id)}>
                                                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                    <Eye size={16} />
                                                    Détails
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                        <div className="text-sm text-gray-500">
                            Affichage {startIndex + 1} - {Math.min(startIndex + itemsPerPage, sortedAgents.length)} sur {sortedAgents.length} contrats
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="px-4 py-2 font-medium text-blue-600 rounded-lg bg-blue-50">
                                {currentPage}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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