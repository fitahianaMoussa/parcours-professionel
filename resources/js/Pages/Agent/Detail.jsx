import React, { useState } from 'react';
import { format, differenceInYears, startOfYear } from 'date-fns';
import fr from 'date-fns/locale/fr';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
    Calendar, Briefcase, Award, FileText, 
    TrendingUp, Users, Building, ChevronLeft,
    Clock, Bookmark, Map, User, School, Book
  } from 'lucide-react';
import Authenticated from '@/Layouts/AuthenticatedLayout';

// Composants utilitaires
const InfoSection = ({ title, children, icon: Icon }) => (
    <div className="p-6 mb-6 bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="flex items-center mb-4 space-x-2">
        {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );

  const DataRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center py-2 border-b border-gray-100">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500" />}
      <span className="w-1/3 text-gray-600">{label}</span>
      <span className="w-2/3 font-medium text-gray-800">{value || 'Non spécifié'}</span>
    </div>
  );


  const StatCard = ({ title, value, description, icon: Icon }) => (
    <div className="p-6 transition-colors bg-white border border-gray-100 rounded-lg shadow-sm hover:border-indigo-200">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
        <h3 className="text-sm text-gray-500">{title}</h3>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
    </div>
  );

const CareerProgressChart = ({ avancements }) => {
  const data = avancements.map(av => ({
    date: format(new Date(av.date_effet), 'MM/yyyy'),
    indice: av.index_value,
    echelon: av.echelon
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="indice" stroke="#3B82F6" name="Indice" />
          <Line type="monotone" dataKey="echelon" stroke="#10B981" name="Échelon" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ContractDistributionChart = ({ contrats }) => {
  const data = contrats.reduce((acc, contrat) => {
    const type = contrat.type;
    const existingType = acc.find(item => item.type === type);
    if (existingType) {
      existingType.value++;
    } else {
      acc.push({ type, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ServiceTimelineChart = ({ services }) => {
  const data = services.map(service => ({
    poste: service.poste_occupe,
    duree: differenceInYears(
      new Date(service.date_fin || new Date()),
      new Date(service.date_debut)
    )
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="poste" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="duree" fill="#3B82F6" name="Durée (années)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const HistoryTimeline = ({ agent }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);

  const formatDate = (date) => {
    if (!date) return 'Non spécifié';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  // Combine et trie tous les événements historiques
  const getAllEvents = () => {
    const events = [];

    // Ajoute les contrats
    agent.historique.contrats.forEach(contrat => {
      events.push({
        type: 'contrat',
        date: new Date(contrat.date_debut),
        data: contrat,
        color: 'blue',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      });
    });

    // Ajoute les avancements
    agent.historique.avancements.forEach(avancement => {
      events.push({
        type: 'avancement',
        date: new Date(avancement.date_effet),
        data: avancement,
        color: 'green',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      });
    });

    // Ajoute les services
    agent.historique.services.forEach(service => {
      events.push({
        type: 'service',
        date: new Date(service.date_debut),
        data: service,
        color: 'purple',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      });
    });

    // Trie les événements par date décroissante
    return events.sort((a, b) => b.date - a.date);
  };

  const filteredEvents = getAllEvents().filter(event => {
    if (selectedFilter === 'all') return true;
    return event.type === selectedFilter;
  });

  const EventDetail = ({ event }) => {
    switch (event.type) {
      case 'contrat':
        return (
          <div className="p-4 mt-2 rounded-lg bg-blue-50">
            <h4 className="font-medium text-blue-900">Détails du contrat</h4>
            <div className="mt-2 space-y-2 text-sm">
              <p><span className="font-medium">Type:</span> {event.data.type}</p>
              <p><span className="font-medium">Numéro:</span> {event.data.numero_contrat}</p>
              <p><span className="font-medium">Début:</span> {formatDate(event.data.date_debut)}</p>
              <p><span className="font-medium">Fin:</span> {formatDate(event.data.date_fin)}</p>
              {event.data.arretes && event.data.arretes.length > 0 && (
                <div>
                  <p className="mt-2 font-medium">Arrêtés associés:</p>
                  <ul className="pl-4 list-disc">
                    {event.data.arretes.map((arrete, index) => (
                      <li key={index}>{arrete.numero} - {formatDate(arrete.date)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      case 'avancement':
        return (
          <div className="p-4 mt-2 rounded-lg bg-green-50">
            <h4 className="font-medium text-green-900">Détails de l'avancement</h4>
            <div className="mt-2 space-y-2 text-sm">
              <p><span className="font-medium">Grade:</span> {event.data.grade?.grade}</p>
              <p><span className="font-medium">Échelon:</span> {event.data.echelon}</p>
              <p><span className="font-medium">Date d'effet:</span> {formatDate(event.data.date_effet)}</p>
              <p><span className="font-medium">Indice:</span> {event.data.index_value}</p>
              {event.data.arrete && (
                <p><span className="font-medium">Arrêté:</span> {event.data.arrete.numero} du {formatDate(event.data.arrete.date)}</p>
              )}
            </div>
          </div>
        );

      case 'service':
        return (
          <div className="p-4 mt-2 rounded-lg bg-purple-50">
            <h4 className="font-medium text-purple-900">Détails du service</h4>
            <div className="mt-2 space-y-2 text-sm">
              <p><span className="font-medium">Poste:</span> {event.data.poste_occupe}</p>
              <p><span className="font-medium">Lieu:</span> {event.data.lieu}</p>
              <p><span className="font-medium">Début:</span> {formatDate(event.data.date_debut)}</p>
              {event.data.reference && (
                <div>
                  <p className="mt-2 font-medium">Référence:</p>
                  <p>Numéro: {event.data.reference.numero}</p>
                  <p>Type: {event.data.reference.type}</p>
                  <p>Date: {formatDate(event.data.reference.date_reference)}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Historique détaillé</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setSelectedFilter('contrat')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedFilter === 'contrat'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            Contrats
          </button>
          <button
            onClick={() => setSelectedFilter('avancement')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedFilter === 'avancement'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            Avancements
          </button>
          <button
            onClick={() => setSelectedFilter('service')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedFilter === 'service'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }`}
          >
            Services
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
        <div className="space-y-6">
          {filteredEvents.map((event, index) => (
            <div key={index} className="relative pl-12">
              <div
                className={`absolute left-0 p-2 rounded-full bg-${event.color}-100 text-${event.color}-600`}
              >
                {event.icon}
              </div>
              <div className="p-4 transition-colors bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                   onClick={() => setExpandedItem(expandedItem === index ? null : index)}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-sm font-medium text-${event.color}-600`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <p className="mt-1 font-medium text-gray-900">
                      {event.type === 'contrat' && `Contrat ${event.data.type}`}
                      {event.type === 'avancement' && `Avancement au grade ${event.data.grade?.grade}`}
                      {event.type === 'service' && event.data.poste_occupe}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                  </div>
                  <button
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                      expandedItem === index ? 'rotate-180' : ''
                    }`}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {expandedItem === index && <EventDetail event={event} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const AgentDetails = ( { agent,auth } ) => {
console.log(agent)

    const formatDate = (date) => {
        if (!date || isNaN(new Date(date))) return 'Non spécifié';  // Check for invalid date
        return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
      };

  // Calcul des statistiques
  const calculateStats = () => {
    
    const totalYearsOfService = (agent) => {
        // Check if agent or agent.informations_personnelles is undefined or null
        if (!agent || !agent.informations_personnelles || !agent.informations_personnelles.date_entree) {
          return 'Date invalide';  // Return a default message if the date_entree is not available
        }
      
        const dateEntree = new Date(agent.informations_personnelles.date_entree);
      
        // Check if the date is valid
        if (isNaN(dateEntree.getTime())) {
          return 'Date invalide';  // Return a default message or handle accordingly
        }
      
        return differenceInYears(new Date(), dateEntree);
      };
      
      // Calculate the total years of service for each service and then find the average
      const averageTimePerPosition = agent.historique.services.length > 0
        ? agent.historique.services.reduce((total, service) => {
            const years = totalYearsOfService(service);  // Call the function for each service
            return years !== 'Date invalide' ? total + years : total;  // Sum up valid results
          }, 0) / agent.historique.services.length  // Divide by the number of services
        : 0;
      
      console.log(averageTimePerPosition);
      const totalYearsOfSer = (agent) => {
        // Check if agent or agent.informations_personnelles is undefined or null
        if (!agent || !agent.informations_personnelles || !agent.informations_personnelles.date_entree) {
          return 0;  // Return 0 if the date_entree is not available
        }
      
        const dateEntree = new Date(agent.informations_personnelles.date_entree);
      
        // Check if the date is valid
        if (isNaN(dateEntree.getTime())) {
          return 0;  // Return 0 if the date is invalid
        }
      
        return differenceInYears(new Date(), dateEntree);  // Calculate the years of service
      };
      
      const promotionRate = totalYearsOfSer(agent) > 0
        ? agent.historique.avancements.length / totalYearsOfSer(agent)  // Only divide by valid years of service
        : 0;
      
      console.log(promotionRate);
      

    return {
      totalYearsOfService,
      averageTimePerPosition: averageTimePerPosition.toFixed(1),
      promotionRate: (promotionRate * 100).toFixed(1),
      totalContracts: agent.historique.contrats.length,
      totalPositions: agent.historique.services.length
    };
  };

  const stats = calculateStats();

  return (
    <Authenticated user={auth.user}>
    <div className="min-h-screen bg-gray-50">
    {/* Back button */}
    <button 

      className="fixed flex items-center px-4 py-2 mb-5 text-sm font-medium text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm top-4 left-4 hover:bg-gray-50"
    >
      <ChevronLeft className="w-4 h-4 mr-1" />
      Retour
    </button>
    <div className="px-4 py-8 mx-auto max-w-7xl">
      {/* En-tête avec statistiques clés */}
      <div className="mb-8">
      <div className="flex items-center mb-6 ml-10 space-x-3">
            <User className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {agent.informations_personnelles.prenom} {agent.informations_personnelles.nom}
            </h1>
          </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
              icon={Clock}
              title="Années de service"
              value={stats.totalYearsOfService}
              description="Depuis le recrutement"
            />
            <StatCard
              icon={Briefcase}
              title="Moyenne par poste"
              value={`${stats.averageTimePerPosition} ans`}
              description="Durée moyenne par position"
            />
            <StatCard
              icon={TrendingUp}
              title="Taux de promotion"
              value={`${stats.promotionRate}%`}
              description="Promotions par an"
            />
            <StatCard
              icon={FileText}
              title="Total contrats"
              value={stats.totalContracts}
              description="Nombre de contrats"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-5 lg:grid-cols-3">
        {/* Informations détaillées */}
        <div className="space-y-6 lg:col-span-2">
        <InfoSection title="Évolution de carrière" icon={TrendingUp}>
              <CareerProgressChart avancements={agent.historique.avancements} />
            </InfoSection>

            <InfoSection title="Informations personnelles" icon={User}>
              <div className="grid grid-cols-2 gap-4">
                <DataRow icon={Calendar} label="Date d'entrée" value={formatDate(agent.informations_personnelles.date_entree)} />
                <DataRow icon={Users} label="Catégorie" value={agent.informations_personnelles.categorie} />
                <DataRow icon={Bookmark} label="Type de recrutement" value={agent.informations_personnelles.type_recrutement} />
                <DataRow icon={School} label="Diplôme" value={agent.informations_personnelles.diplome} />
                <DataRow icon={Book} label="Corps" value={agent.informations_personnelles.corps} />
                <DataRow icon={FileText} label="Chapitre budgétaire" value={agent.informations_personnelles.chapitre_budgetaire} />
              </div>
            </InfoSection>


          <InfoSection title="Distribution des contrats">
            <ContractDistributionChart contrats={agent.historique.contrats} />
          </InfoSection>

          <InfoSection title="Durée des services">
            <ServiceTimelineChart services={agent.historique.services} />
          </InfoSection>
        </div>

        {/* Panneau latéral */}
        <div className="lg:col-span-1">
          {/* Contrat actuel */}
          {agent.contrat_actuel && (
              <InfoSection title="Contrat actuel" icon={FileText}>
              <div className="space-y-2">
                <DataRow label="Type" value={agent.contrat_actuel.type} />
                <DataRow label="Numéro" value={agent.contrat_actuel.numero_contrat} />
                <DataRow label="Date de début" value={agent.contrat_actuel.date_debuts} />
                <DataRow label="Date de fin" value={agent.contrat_actuel.date_fin} />
                <DataRow label="Statut" value={agent.contrat_actuel.status} />
              </div>
            </InfoSection>
          )}

          {/* Avancement actuel */}
          {agent.avancement_actuel && (
           <InfoSection title="Avancement actuel" icon={Award}>
              <div className="space-y-2">
                <DataRow label="Grade" value={agent.avancement_actuel.grade} />
                <DataRow label="Échelon" value={agent.avancement_actuel.echelon} />
                <DataRow label="Date d'effet" value={agent.avancement_actuel.date_effet} />
                <DataRow label="Indice" value={agent.avancement_actuel.index_value} />
              </div>
            </InfoSection>
          )}

          {/* Service actuel */}
          {agent.service_actuel && (
            <InfoSection title="Service actuel" icon={Building}>
              <div className="space-y-2">
                <DataRow label="Poste" value={agent.service_actuel.poste_occupe} />
                <DataRow label="Lieu" value={agent.service_actuel.lieu} />
                <DataRow label="Depuis" value={formatDate(agent.service_actuel.date_debut)} />
              </div>
            </InfoSection>
          )}
        </div>
      </div>
      <HistoryTimeline agent={agent} />
    </div>
    </div>
    </Authenticated>
  );
};

export default AgentDetails;