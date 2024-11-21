import React from 'react';
import { Head } from '@inertiajs/react';
import { Calendar, User, Briefcase, Clock } from 'lucide-react';
import Authenticated from '@/Layouts/AuthenticatedLayout';

const IntegrationPhaseShow = ({ agent, progression ,auth}) => {
  return (
    <Authenticated
    user={auth.user}
>
    <div className="container px-4 py-8 mx-auto">
      <Head title={`${agent.nom} ${agent.prenom} - Integration Phase`} />
      
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Agent Header */}
        <div className="flex items-center p-6 text-white bg-blue-500">
          <User className="w-12 h-12 mr-4" />
          <div>
            <h1 className="text-2xl font-bold">{agent.nom} {agent.prenom}</h1>
            <p className="text-blue-100">Catégorie: {agent.categorie.nom}</p>
          </div>
        </div>

        {/* Integration Phase Details */}
        <div className="p-6">
          <h2 className="flex items-center pb-2 mb-4 text-xl font-semibold border-b">
            <Briefcase className="mr-3 text-blue-600" />
            Détails de la Phase d'Intégration
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Phase Information */}
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="mb-2 font-medium text-gray-600">Phase Actuelle</h3>
              <div className="flex items-center">
                <Clock className="mr-2 text-blue-500" />
                <span className="font-bold">
                  {progression.type} - Phase {progression.phase}
                </span>
              </div>
            </div>

            {/* Duration Information */}
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="mb-2 font-medium text-gray-600">Durée</h3>
              <div className="flex items-center">
                <Calendar className="mr-2 text-green-500" />
                <span>
                  {progression.duration} mois
                  ({new Date(progression.start_date).toLocaleDateString()} - 
                   {new Date(progression.end_date).toLocaleDateString()})
                </span>
              </div>
            </div>
          </div>

          {/* Grade and Echelon */}
          <div className="p-4 mt-6 rounded-lg bg-gray-50">
            <h3 className="mb-2 font-medium text-gray-600">Grade et Échelon</h3>
            <div className="flex items-center">
              <Briefcase className="mr-2 text-purple-500" />
              <span className="font-bold">
                Grade: {progression.grade} {progression.echelon} Echelon
              </span>
            </div>
          </div>

          {/* Additional Details */}
          {progression.details && (
            <div className="mt-6">
              <h3 className="pb-2 mb-4 text-lg font-semibold border-b">
                Détails Supplémentaires
              </h3>
              <div className="p-4 rounded-lg bg-gray-50">
                {Object.entries(progression.details).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="font-medium text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>{' '}
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </Authenticated>
  );
};

export default IntegrationPhaseShow;