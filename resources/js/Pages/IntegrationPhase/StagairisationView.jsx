import React from 'react';
import { Head } from '@inertiajs/react';
import { 
  Calendar, 
  ArrowLeft, 
  ClipboardList, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';

const StagiarisationView = ({ agent, stagiarisation, auth }) => {
  return (
    <Authenticated user={auth.user}>
      <div className="min-h-screen py-8 bg-gray-50">
        <Head title={`${agent.nom} ${agent.prenom} - Périodes de Stagiarisation`} />
        
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href={route('integration-phase.show', agent.id)}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour 
            </Link>
          </div>

          {/* Main Content */}
          <div className="overflow-hidden bg-white shadow-lg rounded-xl">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-800">
              <h1 className="flex items-center text-2xl font-bold text-white">
                <ClipboardList className="w-6 h-6 mr-3" />
                Périodes de Stagiarisation
              </h1>
              <p className="mt-2 text-purple-100">
                {agent.nom} {agent.prenom}
              </p>
            </div>

            {/* Summary Card */}
            <div className="p-6">
              <div className="p-4 mb-6 rounded-lg bg-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-600" />
                    <h2 className="font-semibold text-purple-900">Durée Totale de Stagiarisation</h2>
                  </div>
                  <span className="text-lg font-bold text-purple-700">
                    {stagiarisation.duree_totale} mois
                  </span>
                </div>
              </div>

              {/* Periods List */}
              <div className="space-y-4">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Périodes de Stage
                </h3>
                
                {stagiarisation.periodes.length === 0 ? (
                  <div className="flex items-center justify-center p-6 rounded-lg bg-gray-50">
                    <AlertCircle className="w-5 h-5 mr-2 text-gray-400" />
                    <p className="text-gray-500">Aucune période de stage enregistrée</p>
                  </div>
                ) : (
                  stagiarisation.periodes.map((periode, index) => (
                    <div 
                      key={index} 
                      className="p-4 transition-colors border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Période {index + 1}
                            </p>
                            <p className="text-sm text-gray-500">
                              Du {new Date(periode.date_debut).toLocaleDateString()} au{' '}
                              {new Date(periode.date_fin).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                          {periode.duree_mois} mois
                        </span>
                      </div>

                      {periode.commentaires && (
                        <div className="mt-2 pl-9">
                          <p className="text-sm text-gray-600">
                            {periode.commentaires}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
};

export default StagiarisationView;