
import React, { useState, useEffect } from "react";
import { Consultation } from "@/entities/Consultation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Activity, TrendingUp, Clock } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

import StatsCard from "../components/dashboard/StatsCard";
import MedicalDisclaimer from "../components/common/MedicalDisclaimer";

export default function DashboardPage() {
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    completed: 0,
    avgDuration: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await Consultation.list("-created_date");
    setConsultations(data);
    calculateStats(data);
    setIsLoading(false);
  };

  const calculateStats = (data) => {
    const now = new Date();
    const weekAgo = subDays(now, 7);
    
    const thisWeek = data.filter(c => 
      new Date(c.created_date) >= weekAgo
    ).length;

    const completed = data.filter(c => c.status === "concluida").length;

    setStats({
      total: data.length,
      thisWeek,
      completed,
      avgDuration: completed > 0 ? Math.round(data.length / completed * 15) : 0
    });
  };

  const getWeeklyData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayConsultations = consultations.filter(c => {
        const consultationDate = new Date(c.created_date);
        return consultationDate >= startOfDay(date) && consultationDate <= endOfDay(date);
      });
      
      days.push({
        name: format(date, 'EEE'),
        consultas: dayConsultations.length
      });
    }
    return days;
  };

  const getStatusData = () => {
    const statusCount = consultations.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Concluídas', value: statusCount.concluida || 0, color: '#10b981' },
      { name: 'Em Andamento', value: statusCount.em_andamento || 0, color: '#3b82f6' },
      { name: 'Em Revisão', value: statusCount.revisao || 0, color: '#f59e0b' }
    ];
  };

  const getTopDiagnoses = () => {
    const diagnosesCount = {};
    consultations.forEach(c => {
      c.suggested_diagnoses?.forEach(d => {
        diagnosesCount[d.diagnosis] = (diagnosesCount[d.diagnosis] || 0) + 1;
      });
    });

    return Object.entries(diagnosesCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([diagnosis, count]) => ({ diagnosis, count }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Médico</h1>
          <p className="text-slate-500 mt-2">Acompanhe suas estatísticas de diagnóstico</p>
        </div>

        {/* Medical Disclaimer */}
        <MedicalDisclaimer variant="compact" className="mb-8" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Consultas"
            value={stats.total}
            icon={Users}
            color="blue"
            trend="+12%"
          />
          <StatsCard
            title="Esta Semana"
            value={stats.thisWeek}
            icon={TrendingUp}
            color="green"
            trend="+5%"
          />
          <StatsCard
            title="Concluídas"
            value={stats.completed}
            icon={Activity}
            color="purple"
            trend={`${Math.round((stats.completed / stats.total) * 100)}%`}
          />
          <StatsCard
            title="Tempo Médio"
            value={`${stats.avgDuration}min`}
            icon={Clock}
            color="orange"
            trend="-3min"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Chart */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Consultas dos Últimos 7 Dias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getWeeklyData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="consultas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Chart */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Status das Consultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getStatusData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {getStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Diagnoses */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">
              Diagnósticos Mais Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getTopDiagnoses().map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-slate-900">{item.diagnosis}</span>
                  </div>
                  <span className="text-slate-500 font-medium">{item.count} casos</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
