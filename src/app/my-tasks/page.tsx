import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ListTodo, ArrowLeft, ExternalLink, Calendar, AlertCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import Notifications from "@/components/Notifications";

export default async function MyTasksPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch notifications
  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Fetch all tasks assigned to this user
  const tasks = await db.task.findMany({
    where: {
      assigneeId: session.user.id,
      status: { not: 'DONE' } // Show pending work by default
    },
    include: {
      project: {
        select: { name: true, id: true }
      }
    },
    orderBy: [
      { priority: 'asc' }, // In a real app we'd need a custom priority weight, but this is fine for now
      { updatedAt: 'desc' }
    ]
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-slate-50 rounded-xl transition-colors group text-slate-500 hover:text-indigo-600">
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                  <ListTodo size={20} />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">My Workspace</h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Notifications notifications={notifications} />
              <div className="h-6 w-px bg-slate-100" />
              <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                <LayoutDashboard size={14} />
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Assigned Tasks</h2>
          <p className="text-slate-500 font-medium">Focus on what matters. Here is your current workload.</p>
        </header>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm">
            <div className="h-20 w-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ListTodo className="h-10 w-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">You're all caught up!</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">No pending tasks assigned to you at the moment.</p>
            <Link href="/" className="mt-8 inline-flex px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all">
              Go to Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      task.priority === 'URGENT' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      task.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      task.priority === 'MEDIUM' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {task.priority}
                    </span>
                    <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-indigo-100">
                      <AlertCircle size={10} />
                      {task.status.replace('_', ' ')}
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-1 mb-3">{task.description || "No description provided."}</p>
                  
                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      Updated {new Date(task.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="h-1 w-1 rounded-full bg-slate-200" />
                    <div className="flex items-center gap-1 text-slate-500">
                      Project: <span className="text-slate-900">{task.project.name}</span>
                    </div>
                  </div>
                </div>

                <Link href={`/projects/${task.project.id}`} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all">
                  Go to Project
                  <ExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}