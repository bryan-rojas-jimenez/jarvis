import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import TaskBoard from "@/components/TaskBoard";
import { ArrowLeft, FolderOpen } from 'lucide-react';
import Link from 'next/link';

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const projectId = parseInt(id);
  if (isNaN(projectId)) notFound();

  // We fetch users to allow assignment
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        orderBy: { updatedAt: 'desc' },
        include: {
          assignee: {
            select: { id: true, name: true, email: true }
          }
        }
      }
    }
  });

  if (!project) notFound();

  // Basic authorization: Only owner can view project
  if (project.ownerId !== session.user.id) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors group">
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="mx-4 h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-indigo-600" />
                <span className="text-lg font-bold text-gray-900">{project.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <TaskBoard project={project} tasks={project.tasks} users={users} />
      </main>
    </div>
  );
}
