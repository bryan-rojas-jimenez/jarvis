'use client';

import { useState } from 'react';
import ProjectForm from './ProjectForm';
import { Plus, FolderOpen, Calendar, MoreVertical, ShieldAlert, Trash2, Edit2, Search, X, Filter, LayoutGrid, List, ListTodo } from 'lucide-react';
import Link from 'next/link';
import { logoutAction, deleteProjectAction } from '@/app/actions';
import { useRouter } from 'next/navigation';
import DashboardStats from './DashboardStats';

interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    tasks: number;
  };
}

interface DashboardProps {
  projects: Project[];
  userName: string;
  userRole: string;
  stats: {
    totalProjects: number;
    totalTasks: number;
    byStatus: { [key: string]: number };
    byPriority: { [key: string]: number };
  };
}

export default function DashboardClient({ projects, userName, userRole, stats }: DashboardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const router = useRouter();

  async function handleLogout() {
     await logoutAction();
  }

  async function handleDelete(projectId: number) {
    if (confirm('Are you sure you want to delete this project? All tasks will be removed.')) {
      try {
        await deleteProjectAction(projectId);
        router.refresh();
      } catch (e) {
        alert('Failed to delete project');
      }
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (project.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Sidebar Navigation - Desktop */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-10">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                  <FolderOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">JARVIS</span>
              </div>
              
              <div className="hidden md:flex items-center gap-1">
                <Link href="/" className="px-4 py-2 bg-slate-50 text-indigo-600 rounded-lg font-bold text-sm">Dashboard</Link>
                <Link href="/my-tasks" className="px-4 py-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
                  <ListTodo size={16} />
                  My Tasks
                </Link>
                {userRole === 'ADMIN' && (
                  <Link href="/audit" className="px-4 py-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
                    <ShieldAlert size={16} />
                    Audit Logs
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-black text-slate-900 leading-none">{userName}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{userRole} Profile</span>
              </div>
              <Link href="/profile" className="group">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-black text-xs uppercase tracking-wider transition-colors">
                Exit
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto py-10 px-6 lg:px-10">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Workspace</h1>
            <p className="text-slate-500 font-medium">Welcome back, <span className="text-indigo-600 font-bold">{userName}</span>. Here's what's happening today.</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="group relative inline-flex items-center px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Create New Project</span>
          </button>
        </header>

        {/* Dashboard Intelligence */}
        <DashboardStats stats={stats} />

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex-1 max-w-2xl">
            <div className="pl-3">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="flex-1 py-2 text-slate-900 placeholder-slate-400 focus:outline-none font-medium text-sm"
              placeholder="Search projects by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <Filter className="h-4 w-4 text-slate-400 ml-2" />
              <select
                className="bg-transparent pr-8 py-1 text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {(isCreating || editingProject) && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-300 overflow-hidden">
              <div className="p-10">
                 <ProjectForm 
                   project={editingProject || undefined} 
                   onClose={() => {
                     setIsCreating(false);
                     setEditingProject(null);
                   }} 
                 />
              </div>
            </div>
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10">
              {searchQuery || statusFilter !== 'ALL' 
                ? "We couldn't find anything matching your current filters. Try resetting them." 
                : "Your workspace is empty. Start by creating your first project to organize your team."}
            </p>
            {!searchQuery && statusFilter === 'ALL' && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
              >
                Launch First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group relative bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Visual Accent */}
                <div className={`h-2 w-full ${
                  project.status === 'ACTIVE' ? 'bg-emerald-500' : 
                  project.status === 'COMPLETED' ? 'bg-indigo-500' : 'bg-slate-300'
                }`} />
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <FolderOpen className={`h-7 w-7 ${
                        project.status === 'ACTIVE' ? 'text-emerald-600' : 
                        project.status === 'COMPLETED' ? 'text-indigo-600' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex gap-1">
                       <button 
                         onClick={() => setEditingProject(project)}
                         className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                         title="Edit Project"
                       >
                         <Edit2 size={18} />
                       </button>
                       <button 
                         onClick={() => handleDelete(project.id)}
                         className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                         title="Delete Project"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors truncate">{project.name}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 min-h-[40px] mb-6 leading-relaxed">
                    {project.description || "No description provided. Click manage to start planning tasks."}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      project.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      project.status === 'COMPLETED' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {project.status}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link href={`/projects/${project.id}`} className="block w-full py-5 bg-slate-50 hover:bg-slate-900 group/btn transition-all border-t border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-slate-900 group-hover/btn:text-white font-black text-xs uppercase tracking-widest">
                    Manage Workspace
                    <LayoutGrid size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
