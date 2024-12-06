// resources/js/Pages/Reclassement/Historiques.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import { ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Historiques({ reclassements, agent = null }) {
  return (
    <div className="min-h-screen py-6 bg-gray-100">
      <Head title={agent ? `Historique de ${agent.nom}` : "Historique des Reclassements"} />
      
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {agent ? `Historique de ${agent.nom} ${agent.prenom}` : "Historique des Reclassements"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Consultez l'historique des reclassements
            </p>
          </div>
          
          <a
            href={route('reclassements.index')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Retour
          </a>
        </div>

        <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {!agent && (
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Agent
                    </th>
                  )}
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase// resources/js/Pages/Reclassement/Historiques.jsx (continuation)
                  tracking-wider">
                    Ancienne Catégorie
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Nouvelle Catégorie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reclassements.map((reclassement) => (
                  <tr key={reclassement.id} className="hover:bg-gray-50">
                    {!agent && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                              <ClockIcon className="w-6 h-6 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {reclassement.agent.nom} {reclassement.agent.prenom}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(reclassement.date_reclassement).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-gray-100 rounded-full">
                        {reclassement.ancienneCategorie.nom}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                        {reclassement.nouvelleCategorie.nom}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}