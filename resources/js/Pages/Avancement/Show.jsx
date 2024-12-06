import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowUp, 
    User, 
    Calendar, 
    Award, 
    FileText, 
    CheckCircle, 
    AlertCircle, 
    ChevronLeft 
} from 'lucide-react';
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { formatDateToFrench, getTimeSince } from './dateUtils';

const AdvancementShow = ({ advancement, auth }) => {
    const getStatusInfo = (status) => {
        switch(status) {
            case 'integrated':
                return {
                    color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
                    icon: <CheckCircle className="mr-1.5 text-emerald-500" size={16} />,
                    label: 'Intégré'
                };
            case 'pending':
                return {
                    color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
                    icon: <AlertCircle className="mr-1.5 text-amber-500" size={16} />,
                    label: 'En attente'
                };
            case 'rejected':
                return {
                    color: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
                    icon: <AlertCircle className="mr-1.5 text-rose-500" size={16} />,
                    label: 'Rejeté'
                };
            default:
                return {
                    color: 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20',
                    icon: null,
                    label: status
                };
        }
    };

    const statusInfo = getStatusInfo(advancement.status);

    const InfoCard = ({ title, icon, children, iconColor }) => (
        <div className="overflow-hidden bg-white border rounded-xl border-gray-200/70">
            <div className="p-6">
                <h2 className="flex items-center text-base font-semibold tracking-wide text-gray-900">
                    {React.cloneElement(icon, { className: `mr-2.5 ${iconColor}` })}
                    {title}
                </h2>
                <div className="mt-4 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );

    const InfoField = ({ label, value, isDate = false, className = "" }) => (
        <div className={className}>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900">
                {isDate ? formatDateToFrench(value) : value || 'N/A'}
            </dd>
        </div>
    );

    return (
        <Authenticated user={auth.user}>
            <Head title={`Détails Avancement - ${advancement.agent.nom} ${advancement.agent.prenom}`} />
            
            <div className="px-4 py-8 mx-auto max-w-7xl">
                <nav className="mb-8">
                    <Link 
                        href={route('advancements.indexListe')} 
                        className="inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Retour à la liste
                    </Link>
                </nav>

                <div className="grid gap-6 lg:grid-cols-3">
                    <InfoCard 
                        title="Informations de l'Agent" 
                        icon={<User size={20} />}
                        iconColor="text-blue-500"
                    >
                        <InfoField 
                            label="Nom Complet" 
                            value={`${advancement.agent?.nom} ${advancement.agent.prenom}`}
                        />
                        <InfoField 
                            label="Date d'Entrée" 
                            value={advancement.agent.date_entree}
                            isDate
                        />
                        <InfoField 
                            label="Ancienneté" 
                            value={getTimeSince(advancement.agent.date_entree)}
                        />
                        <InfoField 
                            label="Catégorie" 
                            value={advancement.agent.categorie?.nom}
                        />
                    </InfoCard>

                    <InfoCard 
                        title="Détails de l'Avancement" 
                        icon={<Award size={20} />}
                        iconColor="text-emerald-500"
                    >
                        <InfoField 
                            label="Grade" 
                            value={advancement.grade.grade}
                        />
                        <InfoField 
                            label="Échelon" 
                            value={advancement.echelon}
                        />
                        <InfoField 
                            label="Durée" 
                            value={`${advancement.duree_mois} mois`}
                        />
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Statut</dt>
                            <dd className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                    {statusInfo.icon}
                                    {statusInfo.label}
                                </span>
                            </dd>
                        </div>
                    </InfoCard>

                    <InfoCard 
                        title="Détails de l'Arrêté" 
                        icon={<FileText size={20} />}
                        iconColor="text-purple-500"
                    >
                        <InfoField 
                            label="Numéro d'Arrêté" 
                            value={advancement.arrete.numero_arrete}
                        />
                        <InfoField 
                            label="Date d'Arrêté" 
                            value={advancement.arrete.date_arrete}
                            isDate
                        />
                        <InfoField 
                            label="Date d'Effet" 
                            value={advancement.date_effet}
                            isDate
                        />
                        <InfoField 
                            label="Type d'Arrêté" 
                            value={advancement.arrete.type_arrete}
                        />
                    </InfoCard>
                </div>

                <div className="mt-8">
                    <InfoCard 
                        title="Informations Complémentaires" 
                        icon={<Calendar size={20} />}
                        iconColor="text-orange-500"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoField 
                                label="Date de Début" 
                                value={advancement.date_debut}
                                isDate
                            />
                            <InfoField 
                                label="Date de Fin" 
                                value={advancement.date_fin}
                                isDate
                            />
                            <InfoField 
                                label="Valeur d'Indice" 
                                value={advancement.index_value}
                            />
                            <InfoField 
                                label="Phase de Contrat" 
                                value={advancement.contract_phase}
                            />
                            {advancement.contract_renewal_date && (
                                <InfoField 
                                    label="Date de Renouvellement de Contrat" 
                                    value={advancement.contract_renewal_date}
                                    isDate
                                />
                            )}
                        </div>
                    </InfoCard>
                </div>
            </div>
        </Authenticated>
    );
};

export default AdvancementShow;