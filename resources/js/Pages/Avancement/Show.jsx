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

const AdvancementShow = ({ advancement, auth }) => {
   
    const getStatusInfo = (status) => {
        switch(status) {
            case 'integrated':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: <CheckCircle className="mr-1 text-green-600" size={16} />,
                    label: 'Intégré'
                };
            case 'pending':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: <AlertCircle className="mr-1 text-yellow-600" size={16} />,
                    label: 'En attente'
                };
            case 'rejected':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: <AlertCircle className="mr-1 text-red-600" size={16} />,
                    label: 'Rejeté'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: null,
                    label: status
                };
        }
    };

   const statusInfo = getStatusInfo(advancement.status);

    return (
        <Authenticated user={auth.user}>
            <Head title={`Détails Avancement - ${advancement.agent.nom} ${advancement.agent.prenom}`} />
            
            <div className="container px-4 py-8 mx-auto">
                <div className="flex items-center mb-6">
                    <Link 
                        href={route('advancements.indexListe')} 
                        className="flex items-center mr-4 text-blue-600 hover:text-blue-800"
                    >
                        <ChevronLeft className="mr-1" />
                        Retour à la liste
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Agent Information Card */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="flex items-center mb-4 text-xl font-semibold">
                            <User className="mr-3 text-blue-600" />
                            Informations de l'Agent
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nom Complet</p>
                                <p className="font-medium">{advancement.agent?.nom} {advancement.agent.prenom}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date d'Entrée</p>
                                <p className="font-medium">{advancement.agent.date_entree}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Catégorie</p>
                                <p className="font-medium">{advancement.agent.categorie?.nom || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Advancement Details Card */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="flex items-center mb-4 text-xl font-semibold">
                            <Award className="mr-3 text-green-600" />
                            Détails de l'Avancement
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Grade</p>
                                <p className="font-medium">{advancement.grade.grade}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Échelon</p>
                                <p className="font-medium">{advancement.echelon}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Durée</p>
                                <p className="font-medium">{advancement.duree_mois} mois</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Statut</p>
                                <span 
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                                >
                                    {statusInfo.icon}
                                    {statusInfo.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Arrêté Details Card */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="flex items-center mb-4 text-xl font-semibold">
                            <FileText className="mr-3 text-purple-600" />
                            Détails de l'Arrêté
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Numéro d'Arrêté</p>
                                <p className="font-medium">{advancement.arrete.numero_arrete}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date d'Arrêté</p>
                                <p className="font-medium">{advancement.arrete.date_arrete}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date d'Effet</p>
                                <p className="font-medium">{advancement.date_effet}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Type d'Arrêté</p>
                                <p className="font-medium">{advancement.arrete.type_arrete}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="p-6 mt-8 bg-white rounded-lg shadow-md">
                    <h2 className="flex items-center mb-4 text-xl font-semibold">
                        <Calendar className="mr-3 text-orange-600" />
                        Informations Complémentaires
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-gray-500">Date de Début</p>
                            <p className="font-medium">{advancement.date_debut}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date de Fin</p>
                            <p className="font-medium">{advancement.date_fin}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Valeur d'Indice</p>
                            <p className="font-medium">{advancement.index_value}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phase de Contrat</p>
                            <p className="font-medium">{advancement.contract_phase}</p>
                        </div>
                        {advancement.contract_renewal_date && (
                            <div>
                                <p className="text-sm text-gray-500">Date de Renouvellement de Contrat</p>
                                <p className="font-medium">{advancement.contract_renewal_date}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
              
            </div>
        </Authenticated>
    );
};

export default AdvancementShow;