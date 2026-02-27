'use client';

import { useState } from 'react';
import ProjectForm from './ProjectForm';
import { Plus, FolderOpen, Calendar, MoreVertical, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { logoutAction } from '@/app/actions';
import { useRouter } from 'next/navigation';

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

export default function DashboardClient({ projects, userName }: { projects: Project[], userName: string }) {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  async function handleLogout() {
     await logoutAction();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">JARVIS</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/audit" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mr-2 flex items-center gap-1">
                <ShieldAlert className="h-4 w-4" />
                Audit Logs
              </Link>
              <div className="mx-2 h-6 w-px bg-gray-200" />
              <span className="text-sm text-gray-500">Welcome, {userName}</span>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                {userName.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your ongoing projects and tasks.</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </button>
        </div>

        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
              <div className="p-6">
                 <ProjectForm onClose={() => setIsCreating(false)} />
              </div>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                          project.status === 'ACTIVE' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <FolderOpen className={`h-6 w-6 ${
                            project.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{project.name}</h3>
                        <p className="text-xs text-gray-500">
                          Created {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                       <MoreVertical className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {project.description || "No description provided."}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                  <div className="text-sm">
                    <Link href={`/projects/${project.id}`} className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                      View Tasks <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}