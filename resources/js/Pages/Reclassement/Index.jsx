// resources/js/Pages/Reclassement/Index.jsx
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { UserGroupIcon, ArrowPathIcon, ClockIcon } from '@heroicons/react/24/outline';
import AgentList from './AgentList';
import ReclassementModal from './ReclassementModal';
import Authenticated from '@/Layouts/AuthenticatedLayout';


export default function Index({ categories, initialAgents ,auth}) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Authenticated user={auth.user}>
    <div className="min-h-screen py-6 bg-gray-100">
      <Head title="Gestion des Reclassements" />
      
      <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Reclassements
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Gérez les reclassements des agents éligibles
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Actualiser
            </button>
            
            <a
              href={route('reclassements.historique')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
            >
              <ClockIcon className="w-5 h-5 mr-2" />
              Historique
            </a>
          </div>
        </div>

        <div className="mt-8 overflow-hidden bg-white rounded-lg shadow">
          <AgentList
            agents={initialAgents}
            onReclassement={(agent) => {
              setSelectedAgent(agent);
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>

      {isModalOpen && (
        <ReclassementModal
          agent={selectedAgent}
          categories={categories}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
    </Authenticated>
  );
}