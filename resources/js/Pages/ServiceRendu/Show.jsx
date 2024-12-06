import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const ServiceDetails = ({ service,auth }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      completed: <CheckCircleIcon className="w-5 h-5 text-blue-600" />,
      pending: <ClockIcon className="w-5 h-5 text-yellow-600" />
    };
    return icons[status] || <ExclamationCircleIcon className="w-5 h-5 text-gray-600" />;
  };

  const getTypeRecrutementBadge = (type) => {
    const styles = {
      diplome: 'bg-purple-100 text-purple-800',
      budgetaire: 'bg-blue-100 text-blue-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
  };

 

  return (
    <Authenticated user={auth.user}>
    <div className="max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-lg">
    <div className="flex items-center justify-between mb-6">
  <Link
    href={route('service.index')}
    className="inline-flex items-center text-blue-600 hover:text-blue-800"
  >
    <ArrowLeft className="w-4 h-4 mr-2" />
    Retour à la liste
  </Link>
        </div>
        <div className="p-4 mb-6 rounded-lg bg-gray-50">
        <div className="flex items-center mb-4">
          <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-700">Informations Personnelles</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ml-7">
          <div>
            <p className="text-sm text-gray-500">Nom</p>
            <p className="text-gray-700">{service.agent.nom}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Prénom</p>
            <p className="text-gray-700">{service.agent.prenom}</p>
          </div>
        </div>
      </div>

      {/* Recruitment Information */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center mb-4">
            <AcademicCapIcon className="w-5 h-5 mr-2 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-700">Recrutement</h2>
          </div>
          <div className="space-y-3 ml-7">
            <div>
              <p className="text-sm text-gray-500">Type de Recrutement</p>
              <span className={`inline-block px-2 py-1 rounded-full text-sm ${getTypeRecrutementBadge(service.agent.type_recrutement)}`}>
                {service.agent.type_recrutement}
              </span>
            </div>
            {service.agent.diplome && (
              <div>
                <p className="text-sm text-gray-500">Diplôme</p>
                <p className="text-gray-700">{service.agent.diplome}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center mb-4">
            <BuildingLibraryIcon className="w-5 h-5 mr-2 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-700">Affectation</h2>
          </div>
          <div className="space-y-3 ml-7">
            {service.agent.corps && (
              <div>
                <p className="text-sm text-gray-500">Corps</p>
                <p className="text-gray-700">{service.agent.corps}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Chapitre Budgétaire</p>
              <p className="text-gray-700">{service.agent.chapitre_budgetaire}</p>
            </div>
        
          </div>
        </div>
      </div>

      {/* Date Information */}
      <div className="p-4 rounded-lg bg-gray-50">
        <div className="flex items-center mb-4">
          <CalendarIcon className="w-5 h-5 mr-2 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-700">Date d'Entrée</h2>
        </div>
        <div className="ml-7">
          <p className="text-gray-700">
            {format(new Date(service.agent.date_entree), 'dd MMMM yyyy', { locale: fr })}
          </p>
        </div>
      </div>
      {/* En-tête avec statut */}
      <div className="flex items-center justify-between mt-5 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Détails du Service Rendu</h1>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
          {getStatusIcon(service.status)}
          <span className="ml-2 capitalize">{service.status}</span>
        </span>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
        <div className="p-4 transition duration-200 rounded-lg bg-gray-50 hover:bg-gray-100">
          <div className="flex items-center mb-2">
            <BriefcaseIcon className="w-5 h-5 mr-2 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-700">Poste Occupé</h2>
          </div>
          <p className="text-gray-600 ml-7">{service.poste_occupe}</p>
        </div>

        <div className="p-4 transition duration-200 rounded-lg bg-gray-50 hover:bg-gray-100">
          <div className="flex items-center mb-2">
            <MapPinIcon className="w-5 h-5 mr-2 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-700">Lieu</h2>
          </div>
          <p className="text-gray-600 ml-7">{service.lieu}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="p-4 mb-8 rounded-lg bg-gray-50">
        <div className="flex items-center mb-4">
          <CalendarIcon className="w-5 h-5 mr-2 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-700">Période</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ml-7">
          <div>
            <p className="text-sm text-gray-500">Date de début</p>
            <p className="text-gray-700">
              {format(new Date(service.date_debut), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>
          {service.date_fin && (
            <div>
              <p className="text-sm text-gray-500">Date de fin</p>
              <p className="text-gray-700">
                {format(new Date(service.date_fin), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Référence réglementaire */}
      <div className="p-4 rounded-lg bg-gray-50">
        <div className="flex items-center mb-4">
          <DocumentTextIcon className="w-5 h-5 mr-2 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-700">Référence Réglementaire</h2>
        </div>
        <div className="space-y-3 ml-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Numéro</p>
              <p className="text-gray-700">{service.reference.numero}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="text-gray-700">{service.reference.type}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de référence</p>
            <p className="text-gray-700">
              {format(new Date(service.reference.date_reference), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>
          {service.reference.objet && (
            <div>
              <p className="text-sm text-gray-500">Objet</p>
              <p className="text-gray-700">{service.reference.objet}</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </Authenticated>
  );
};

export default ServiceDetails;