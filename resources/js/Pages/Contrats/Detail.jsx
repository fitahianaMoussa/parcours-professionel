import React from 'react';
import { 
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileSignature,
  Building2,
  ArrowLeft
} from 'lucide-react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

const ContratDetailView = ({ contrat ,auth}) => {
  const agent = contrat.agent;
  
  return (
    <Authenticated user={auth.user}>
    <div className="min-h-screen py-8 bg-gray-50">
    <div className="flex items-center justify-between mb-6">
  <Link
    href={route('contrat.index')}
    className="inline-flex items-center text-blue-600 hover:text-blue-800"
  >
    <ArrowLeft className="w-4 h-4 mr-2" />
    Retour à la liste
  </Link>
        </div>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Contract Header */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Contrat N° {contrat.numero_contrat}
                  </h1>
                  <p className="text-gray-500">
                    Type: {contrat.type}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium
                ${contrat.status === 'en cours' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                }`}>
                {contrat.status}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium
                ${contrat.is_active 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {contrat.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Agent Information */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <User className="w-5 h-5 mr-2" />
              Information de l'Agent
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nom Complet</p>
                <p className="font-medium text-gray-900">{agent.nom} {agent.prenom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Catégorie</p>
                <p className="text-gray-900">{agent.categorie?.nom || 'Non assigné'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type de Recrutement</p>
                <p className="text-gray-900">{agent.type_recrutement}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date d'entrée</p>
                <p className="text-gray-900">{new Date(agent.date_entree).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <FileSignature className="w-5 h-5 mr-2" />
              Détails du Contrat
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date de début</p>
                  <p className="text-gray-900">{new Date(contrat.date_debut).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de fin</p>
                  <p className="text-gray-900">
                    {contrat.date_fin 
                      ? new Date(contrat.date_fin).toLocaleDateString()
                      : 'Non définie'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Renouvellement</p>
                <div className="flex items-center mt-1">
                  {contrat.is_renouvele ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-gray-900">
                        Renouvelé le {new Date(contrat.date_renouvellement).toLocaleDateString()}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-gray-900">Non renouvelé</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Arrêtés Related to This Contract */}
          <div className="p-6 bg-white rounded-lg shadow-sm md:col-span-2">
            <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <FileText className="w-5 h-5 mr-2" />
              Arrêtés Liés
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      N° Arrêté
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      Type
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      Date d'effet
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      Objet
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      Signataire
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contrat.arretes?.map(arrete => (
                    <tr key={arrete.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {arrete.numero_arrete}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                          {arrete.type_arrete}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(arrete.date_effet).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {arrete.objet}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {arrete.signataire}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Authenticated>
  );
};

export default ContratDetailView;