import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { Printer, FileText, Calendar, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function ProjectReportPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const projectId = parseInt(id);
  if (isNaN(projectId)) notFound();

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { name: true, email: true, position: true } },
      members: {
        include: { user: { select: { name: true, email: true, position: true } } }
      },
      tasks: {
        include: { assignee: { select: { name: true, email: true } } },
        orderBy: { status: 'asc' }
      }
    }
  });

  if (!project) notFound();

  // Basic authorization
  const isOwner = project.ownerId === session.user.id;
  const isMember = project.members.some(m => m.userId === session.user.id);
  if (!isOwner && !isMember && session.user.role !== 'ADMIN') {
    redirect("/");
  }

  const completedTasks = project.tasks.filter(t => t.status === 'DONE').length;
  const pendingTasks = project.tasks.length - completedTasks;
  const progress = project.tasks.length > 0 ? Math.round((completedTasks / project.tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-white p-8 md:p-20 font-sans text-slate-900">
      {/* Action Bar - Hidden on print */}
      <div className="mb-10 flex justify-between items-center print:hidden bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <Link href={`/projects/${project.id}`} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          &larr; Back to Workspace
        </Link>
        <button 
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          <Printer size={18} />
          Print Report / Save PDF
        </button>
      </div>

      {/* Report Header */}
      <div className="border-b-4 border-slate-900 pb-10 mb-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs mb-2">
              <FileText size={14} />
              Official Project Status Report
            </div>
            <h1 className="text-5xl font-black tracking-tight">{project.name || 'Untitled Project'}</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated On</p>
            <p className="font-bold">{new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Owner</p>
            <p className="font-bold text-lg">{project.owner?.name || project.owner?.email || "Unknown"}</p>
            <p className="text-sm text-slate-500">{project.owner?.position || "Management"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-black text-xs uppercase">
              {project.status || 'ACTIVE'}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Deadline</p>
            <p className="font-bold text-lg">
              {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No Limit Set"}
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <section>
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b border-slate-100 pb-2">Description</h2>
          <p className="text-slate-600 leading-relaxed italic">
            "{project.description || "No official description provided for this project."}"
          </p>
        </section>
        <section>
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b border-slate-100 pb-2">Execution Progress</h2>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress) / 100} className="text-indigo-600 transition-all duration-1000" />
              </svg>
              <span className="absolute text-xl font-black">{progress}%</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold"><span className="text-indigo-600">{completedTasks}</span> Tasks Completed</p>
              <p className="text-sm font-bold"><span className="text-slate-400">{pendingTasks}</span> Tasks in Pipeline</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Total Volume: {project.tasks.length}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Task Detailed Inventory */}
      <section className="mb-12">
        <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
          <Clock size={20} className="text-indigo-600" />
          Task Inventory & Resource Allocation
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-4 text-xs font-black uppercase tracking-widest rounded-tl-xl">Task Title</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest">Assignee</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest">Priority</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest">Due Date</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest rounded-tr-xl text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 border-x border-b border-slate-100">
            {project.tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900">{task.title || 'Untitled Task'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight max-w-xs">{task.description || "N/A"}</p>
                </td>
                <td className="p-4 text-sm font-medium text-slate-600">
                  {task.assignee?.name || task.assignee?.email || "Unassigned"}
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${
                    task.priority === 'URGENT' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    task.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {task.priority || 'MEDIUM'}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold text-slate-500">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                </td>
                <td className="p-4 text-right">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    task.status === 'DONE' ? 'text-emerald-600' : 
                    task.status === 'IN_PROGRESS' ? 'text-indigo-600' : 'text-slate-400'
                  }`}>
                    {task.status?.replace('_', ' ') || 'TODO'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Team Section */}
      <section className="mb-20">
        <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
          <Printer size={20} className="text-indigo-600" />
          Authorized Project Members
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Owner</p>
            <p className="font-bold text-sm">{project.owner?.name || project.owner?.email || "Unknown"}</p>
          </div>
          {project.members.map(member => (
            <div key={member.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{member.role || 'MEMBER'}</p>
              <p className="font-bold text-sm">{member.user?.name || member.user?.email || "Unknown"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto pt-10 border-t border-slate-200 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">JARVIS Project Intelligence System</p>
        <p className="text-[9px] text-slate-300 font-medium">This is a confidential document for internal organizational use only.</p>
      </footer>
    </div>
  );
}
