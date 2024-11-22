import React from 'react';
import { Head } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ClipboardList, Clock, Share, ArrowUpToLine } from 'lucide-react';

const DashboardCard = ({ title, icon: Icon, children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}>
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          {Icon && <Icon className="w-5 h-5 text-gray-500" />}
          {title}
        </h2>
      </div>
      {children}
    </div>
  </div>
);

const StatCard = ({ title, value, trend }) => (
  <div className="p-4 transition-colors duration-200 rounded-lg bg-gray-50 hover:bg-gray-100">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <div className="flex items-baseline justify-between mt-2">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <span className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  </div>
);

const DashboardChart = ({ data, xKey, yKey, color }) => (
  <div className="w-full h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Bar 
          dataKey={yKey} 
          fill={color}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const Dashboard = ({ auth, stats }) => (
  <Authenticated user={auth.user}>
    <Head title="Tableau de Bord" />
    
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 transition-shadow duration-200 bg-white rounded-lg shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Agents Actifs</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.agents.activeAgents}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
            <div className="mt-4 text-sm font-medium text-green-500">+2.5% par rapport au mois dernier</div>
          </div>

          <div className="p-6 transition-shadow duration-200 bg-white rounded-lg shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux de Renouvellement</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.contrats.renewalRate}%</p>
              </div>
              <ClipboardList className="w-12 h-12 text-green-500 opacity-20" />
            </div>
            <div className="mt-4 text-sm font-medium text-green-500">+1.2% par rapport au mois dernier</div>
          </div>

          <div className="p-6 transition-shadow duration-200 bg-white rounded-lg shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Durée Moyenne Services</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.services.averageDuration}m</p>
              </div>
              <Clock className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
            <div className="mt-4 text-sm font-medium text-red-500">-0.8% par rapport au mois dernier</div>
          </div>

          <div className="p-6 transition-shadow duration-200 bg-white rounded-lg shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux de Succès</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.reclassements.successRate}%</p>
              </div>
              <ArrowUpToLine className="w-12 h-12 text-indigo-500 opacity-20" />
            </div>
            <div className="mt-4 text-sm font-medium text-green-500">+3.4% par rapport au mois dernier</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Services Chart */}
          <div className="transition-shadow duration-200 bg-white rounded-lg shadow-lg lg:col-span-2 hover:shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <Share className="w-5 h-5 text-gray-500" />
                  Services Rendus
                </h2>
              </div>
              <div className="mb-4 text-2xl font-bold text-gray-700">
                Durée moyenne: {stats.services.averageDuration} mois
              </div>
              <DashboardChart
                data={stats.services.servicesByAgent}
                xKey="agent"
                yKey="total"
                color="#3B82F6"
              />
            </div>
          </div>

          {/* Contrats */}
          <div className="transition-shadow duration-200 bg-white rounded-lg shadow-lg hover:shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <ClipboardList className="w-5 h-5 text-gray-500" />
                  Contrats
                </h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Expirant (3 mois)</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.contrats.expiringIn3Months}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Expirant (6 mois)</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.contrats.expiringIn6Months}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Avancements Chart */}
          <div className="transition-shadow duration-200 bg-white rounded-lg shadow-lg lg:col-span-2 hover:shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <ArrowUpToLine className="w-5 h-5 text-gray-500" />
                  Avancements
                </h2>
              </div>
              <div className="mb-4 text-2xl font-bold text-gray-700">
                Durée moyenne: {stats.avancements.averageDuration} mois
              </div>
              <DashboardChart
                data={stats.avancements.advancementsByGrade}
                xKey="grade"
                yKey="total"
                color="#8B5CF6"
              />
            </div>
          </div>

          {/* Agents Stats */}
          <div className="transition-shadow duration-200 bg-white rounded-lg shadow-lg hover:shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <Users className="w-5 h-5 text-gray-500" />
                  Agents
                </h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Agents actifs</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.agents.activeAgents}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Agents retraités</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.agents.retiredAgents}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Proche retraite</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.agents.approachingRetirement}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Authenticated>
);

export default Dashboard;