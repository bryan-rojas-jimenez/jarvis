import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Clock } from "lucide-react";

export default async function AuditPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch the last 100 logs
  const logs = await db.auditLog.findMany({
    take: 100,
    orderBy: {
      timestamp: 'desc',
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="mx-4 h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-indigo-600" />
                <span className="text-lg font-bold text-gray-900">System Audit Logs</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Activity History</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest system actions and security events.</p>
            </div>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {logs.length} Entries
            </span>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {logs.map((log) => (
                <li key={log.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 truncate">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {log.action}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="truncate">{log.details}</span>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {log.user?.name || log.user?.email || 'System'}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                        <p>
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {logs.length === 0 && (
                <li className="px-4 py-12 text-center text-gray-500">
                  No activity recorded yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
