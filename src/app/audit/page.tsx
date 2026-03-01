import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Clock, LayoutDashboard } from "lucide-react";
import Notifications from "@/components/Notifications";

export default async function AuditPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Check for ADMIN role
  if (session.user.role !== 'ADMIN') {
    redirect("/");
  }

  // Fetch notifications
  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Fetch the last 100 logs
  const logs = await db.auditLog.findMany({
    take: 100,
    orderBy: {
      timestamp: 'desc',
    },
    include: {
      user: {
        select: { name: true, email: true, role: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-slate-50 rounded-xl transition-colors group text-slate-500 hover:text-indigo-600">
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-xl text-purple-600 shadow-sm">
                  <ShieldAlert size={20} />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">System Audit</h1>
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

      <main className="max-w-5xl mx-auto py-12 px-6 lg:px-10">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Activity Monitor</h2>
          <p className="text-slate-500 font-medium text-sm">Real-time security logs and system operations history.</p>
        </header>

        <div className="bg-white shadow-sm border border-slate-200 rounded-[32px] overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Latest Events</span>
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
              {logs.length} Entries
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <ul role="list" className="divide-y divide-slate-100">
              {logs.map((log) => (
                <li key={log.id} className="px-8 py-6 hover:bg-slate-50/80 transition-all group">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-indigo-600 tracking-tight whitespace-nowrap">
                          {log.action}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-sm font-medium text-slate-600 truncate">
                          {log.details}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                          {log.user?.role && (
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-widest border ${
                              log.user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {log.user.role}
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                            {log.user?.name || log.user?.email || 'System'}
                          </span>
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <Clock className="shrink-0 mr-1.5 h-3 w-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {logs.length === 0 && (
                <li className="px-8 py-20 text-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <ShieldAlert size={24} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No activity recorded</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
