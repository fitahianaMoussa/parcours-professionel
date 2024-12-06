import React from 'react';
import { Head } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ClipboardList, Clock, Share, ArrowUpToLine, TrendingUp, Bell } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, trend, variant = 'default' }) => {
  const variants = {
    default: 'bg-white',
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600',
    success: 'bg-gradient-to-br from-green-500 to-green-600',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600'
  };

  const isGradient = variant !== 'default';
  
  return (
    <div className={`${variants[variant]} rounded-xl shadow-lg`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className={`${isGradient ? 'text-white' : 'text-gray-900'}`}>
            <p className={`text-sm font-medium ${isGradient ? 'text-white/80' : 'text-gray-500'}`}>
              {title}
            </p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <div className="flex items-center mt-2 space-x-1">
                <TrendingUp className={`w-4 h-4 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className={`text-sm ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              </div>
            )}
          </div>
          <div className={`rounded-xl p-3 ${isGradient ? 'bg-white/10' : 'bg-blue-50'}`}>
            <Icon className={`w-6 h-6 ${isGradient ? 'text-white' : 'text-blue-500'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, subtitle, children, icon: Icon, actions }) => (
  <div className="bg-white shadow-lg rounded-xl">
    <div className="p-6">
      <div className="flex items-center justify-between pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-5 h-5 text-gray-500" />}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  </div>
);

const DashboardChart = ({ data, xKey, yKey, color }) => (
  <div className="w-full h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          stroke="#94a3b8"
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          axisLine={false} 
          tickLine={false}
          stroke="#94a3b8"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1)',
            padding: '12px'
          }}
        />
        <Bar 
          dataKey={yKey} 
          fill="url(#colorGradient)"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const MetricCard = ({ title, value, className }) => (
  <div className={`p-4 rounded-xl transition-all duration-200 ${className}`}>
    <p className="text-sm font-medium text-gray-600">{title}</p>
    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const Dashboard = ({ auth, stats }) => (
  <Authenticated user={auth.user}>
    <Head title="Tableau de Bord" />
    
    <div className="min-h-screen py-8 bg-slate-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Tableau de Bord
          </h1>
          <button className="inline-flex items-center px-3 py-2 space-x-2 text-sm text-gray-700 transition-colors rounded-lg hover:bg-white">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            title="Agents Actifs"
            value={stats.agents.activeAgents}
            trend={2.5}
            variant="primary"
          />
          <StatCard
            icon={ClipboardList}
            title="Taux de Renouvellement"
            value={`${stats.contrats.renewalRate}%`}
            trend={1.2}
            variant="success"
          />
          <StatCard
            icon={Clock}
            title="Durée Moyenne Services"
            value={`${stats.services.averageDuration}m`}
            trend={-0.8}
            variant="purple"
          />
          <StatCard
            icon={ArrowUpToLine}
            title="Taux de Succès"
            value={`${stats.reclassements.successRate}%`}
            trend={3.4}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Services Chart */}
          <div className="lg:col-span-2">
            <ChartCard
              icon={Share}
              title="Services Rendus"
              subtitle={`Durée moyenne: ${stats.services.averageDuration} mois`}
              actions={
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-600 bg-white rounded-lg hover:bg-gray-50">
                    Semaine
                  </button>
                  <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                    Mois
                  </button>
                </div>
              }
            >
              <DashboardChart
                data={stats.services.servicesByAgent}
                xKey="agent"
                yKey="total"
                color="#3B82F6"
              />
            </ChartCard>
          </div>

          {/* Contrats */}
          <div>
            <ChartCard
              icon={ClipboardList}
              title="Contrats"
            >
              <div className="space-y-4">
                <MetricCard
                  title="Expirant (3 mois)"
                  value={stats.contrats.expiringIn3Months}
                  className="bg-orange-50 hover:bg-orange-100"
                />
                <MetricCard
                  title="Expirant (6 mois)"
                  value={stats.contrats.expiringIn6Months}
                  className="bg-yellow-50 hover:bg-yellow-100"
                />
              </div>
            </ChartCard>
          </div>

          {/* Avancements Chart */}
          <div className="lg:col-span-2">
            <ChartCard
              icon={ArrowUpToLine}
              title="Avancements"
              subtitle={`Durée moyenne: ${stats.avancements.averageDuration} mois`}
              actions={
                <button className="px-3 py-1 text-sm text-gray-600 bg-white rounded-lg hover:bg-gray-50">
                  Voir détails
                </button>
              }
            >
              <DashboardChart
                data={stats.avancements.advancementsByGrade}
                xKey="grade"
                yKey="total"
                color="#8B5CF6"
              />
            </ChartCard>
          </div>

          {/* Agents Stats */}
          <div>
            <ChartCard
              icon={Users}
              title="Agents"
            >
              <div className="space-y-4">
                <MetricCard
                  title="Agents actifs"
                  value={stats.agents.activeAgents}
                  className="bg-blue-50 hover:bg-blue-100"
                />
                <MetricCard
                  title="Agents retraités"
                  value={stats.agents.retiredAgents}
                  className="bg-gray-50 hover:bg-gray-100"
                />
                <MetricCard
                  title="Proche retraite"
                  value={stats.agents.approachingRetirement}
                  className="bg-purple-50 hover:bg-purple-100"
                />
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  </Authenticated>
);

export default Dashboard;