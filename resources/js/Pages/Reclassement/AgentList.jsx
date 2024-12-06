// resources/js/Pages/Reclassement/Components/AgentList.jsx
import React from 'react';
import { UserIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';

export default function AgentList({ agents, onReclassement }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Agent
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Catégorie
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Date d'entrée
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {agents.map((agent) => (
            <tr key={agent.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                      <UserIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {agent.nom} {agent.prenom}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">
                  {agent.categorie.nom}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                  {agent.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {new Date(agent.date_entree).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                <button
                  onClick={() => onReclassement(agent)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  <ArrowUpRightIcon className="w-4 h-4 mr-2" />
                  Reclasser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}