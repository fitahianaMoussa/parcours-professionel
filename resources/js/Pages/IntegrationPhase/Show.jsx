import React from 'react';
import { Head } from '@inertiajs/react';
import { 
  User, 
  Calendar, 
  Clock, 
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    en_cours: {
      color: 'bg-blue-100 text-blue-800',
      icon: <Clock className="w-4 h-4 mr-1 text-blue-600" />
    },
    termine: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
    },
    attention: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <AlertCircle className="w-4 h-4 mr-1 text-yellow-600" />
    }
  };

  const config = statusConfig[status] || statusConfig.en_cours;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const IntegrationPhaseShow = ({ agent, progression, auth }) => {
  return (
    <Authenticated user={auth.user}>
      <div className="min-h-screen py-8 bg-gray-50">
        <Head title={`${agent.nom} ${agent.prenom} - Phase d'Intégration`} />
        
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
  <Link
    href={route('integration-phase.index')}
    className="inline-flex items-center text-blue-600 hover:text-blue-800"
  >
    <ArrowLeft className="w-4 h-4 mr-2" />
    Retour à la liste
  </Link>
  <Link
    href={route('integration-phase.stagiarisation', agent.id)}
    className="inline-flex items-center text-blue-600 hover:text-blue-800"
  >
    Stagiarisation
    <ArrowRight className="w-4 h-4 ml-2" />
  </Link>
        </div>


          <div className="overflow-hidden bg-white shadow-lg rounded-xl">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 sm:p-8">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-white/10">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-white">
                    {agent.nom} {agent.prenom}
                  </h1>
                  <p className="mt-1 text-blue-100">
                    {agent.categorie?.nom}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-6 mb-8 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center mb-4">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Phase Actuelle</h3>
                  </div>
                  <div className="space-y-2">
                    <StatusBadge status={progression.status || 'en_cours'} />
                    <p className="mt-2 text-gray-600">
                      Phase {progression.phase} - {progression.type}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Période</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Du {new Date(progression.start_date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      Au {new Date(progression.end_date).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Durée: {progression.duration} mois
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Détails de l'intégration</h3>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Grade</p>
                      <p className="font-medium text-gray-900">{progression.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Échelon</p>
                      <p className="font-medium text-gray-900">{progression.echelon}</p>
                    </div>
                    {progression.details && Object.entries(progression.details).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="font-medium text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
};

export default IntegrationPhaseShow;