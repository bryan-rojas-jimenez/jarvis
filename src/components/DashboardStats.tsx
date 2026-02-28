'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, Briefcase, TrendingUp } from 'lucide-react';

interface StatsProps {
  stats: {
    totalProjects: number;
    totalTasks: number;
    byStatus: { [key: string]: number };
    byPriority: { [key: string]: number };
  }
}

export default function DashboardStats({ stats }: StatsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statusData = [
    { name: 'To Do', value: stats.byStatus.TODO, color: '#94a3b8' },
    { name: 'In Progress', value: stats.byStatus.IN_PROGRESS, color: '#6366f1' },
    { name: 'Done', value: stats.byStatus.DONE, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'Low', value: stats.byPriority.LOW, color: '#cbd5e1' },
    { name: 'Medium', value: stats.byPriority.MEDIUM, color: '#6366f1' },
    { name: 'High', value: stats.byPriority.HIGH, color: '#f59e0b' },
    { name: 'Urgent', value: stats.byPriority.URGENT, color: '#ef4444' },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8 mb-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100/20 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
               <Briefcase size={24} />
            </div>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Projects</p>
          <p className="text-4xl font-black text-slate-900 mt-1">{stats.totalProjects}</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-100/20 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <Clock size={24} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">In Progress</p>
          <p className="text-4xl font-black text-slate-900 mt-1">{stats.byStatus.IN_PROGRESS}</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-emerald-100/20 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
               <CheckCircle2 size={24} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Completed</p>
          <p className="text-4xl font-black text-slate-900 mt-1">{stats.byStatus.DONE}</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-rose-100/20 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
               <AlertTriangle size={24} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Urgent Tasks</p>
          <p className="text-4xl font-black text-slate-900 mt-1">{stats.byPriority.URGENT}</p>
        </div>
      </div>

      {/* Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <ListTodo size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Status Analysis</h3>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 20px' }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Priority Distribution</h3>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 20px' }}
                />
                <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={40}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}