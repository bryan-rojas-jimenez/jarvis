import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { updateProfileAction } from "@/app/actions";
import { User as UserIcon, Mail, Shield, Briefcase, ArrowLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import Notifications from "@/components/Notifications";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch notifications
  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect("/login");

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
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
                  <UserIcon size={20} />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Account Settings</h1>
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

      <main className="max-w-3xl mx-auto py-12 px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-[40px] overflow-hidden border border-slate-200">
          {/* Header/Cover */}
          <div className="h-40 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 relative">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          </div>
          
          <div className="px-10 pb-10">
            <div className="relative flex justify-between items-end -mt-16 mb-10">
              <div className="h-32 w-32 rounded-[32px] bg-white p-1.5 shadow-2xl">
                <div className="h-full w-full rounded-[26px] bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100">
                  <UserIcon size={56} strokeWidth={1.5} />
                </div>
              </div>
              <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-100'
              }`}>
                {user.role} Verified
              </div>
            </div>

            <div className="mb-12">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{user.name || "Identity Pending"}</h1>
              <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest flex items-center gap-2">
                <Mail size={12} className="text-indigo-500" />
                {user.email}
              </p>
            </div>

            <form action={updateProfileAction} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <UserIcon size={18} />
                    </div>
                    <input
                      name="name"
                      type="text"
                      defaultValue={user.name || ''}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
                      placeholder="Your legal name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Organization Role</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Briefcase size={18} />
                    </div>
                    <input
                      name="position"
                      type="text"
                      defaultValue={user.position || ''}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
                      placeholder="e.g. Technical Director"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                <h3 className="text-xs font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Shield size={16} className="text-indigo-600" />
                  System Privileges
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100/50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Access Level</span>
                    <span className="text-sm font-black text-indigo-600">{user.role === 'ADMIN' ? 'Root Administrator' : 'Standard Access'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Security ID</span>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">USR-00{user.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Save Profile Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
