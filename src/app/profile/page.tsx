import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { updateProfileAction } from "@/app/actions";
import { User as UserIcon, Mail, Shield, Briefcase, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
          {/* Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600" />
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-8">
              <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="h-full w-full rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserIcon size={48} />
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {user.role} Account
              </div>
            </div>

            <div className="mb-10">
              <h1 className="text-3xl font-black text-gray-900">{user.name || "Set your name"}</h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>

            <form action={updateProfileAction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <UserIcon size={16} className="text-indigo-500" />
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={user.name || ''}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase size={16} className="text-indigo-500" />
                    Job Position
                  </label>
                  <input
                    name="position"
                    type="text"
                    defaultValue={user.position || ''}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Senior Developer"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Shield size={16} className="text-indigo-500" />
                  Access & Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Email Address</span>
                    <span className="font-bold text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">User Permissions</span>
                    <span className="font-bold text-indigo-600">{user.role === 'ADMIN' ? 'Full Administrator' : 'Standard User'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Member Since</span>
                    <span className="font-bold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
