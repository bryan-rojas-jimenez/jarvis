import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import TaskBoard from "@/components/TaskBoard";
import ProjectMembers from "@/components/ProjectMembers";
import { ArrowLeft, FolderOpen, LayoutDashboard, Shield, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const projectId = parseInt(id);
  if (isNaN(projectId)) notFound();

  // Fetch users for assignment
  const allUsers = await db.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { name: true, email: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      },
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

  // Check if user is owner OR a member OR has an assigned task
  const isOwner = project.ownerId === session.user.id;
  const isMember = project.members.some(m => m.userId === session.user.id);
  const hasAssignedTask = project.tasks.some(t => t.assigneeId === session.user.id);

  if (!isOwner && !isMember && !hasAssignedTask) {
    redirect("/");
  }

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
                  <FolderOpen size={20} />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Project Collaboration</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href={`/projects/${project.id}/report`} 
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100"
              >
                <FileText size={14} />
                Project Report
              </Link>
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</span>
                <span className="text-sm font-bold text-slate-900">{project.status}</span>
              </div>
              <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                <LayoutDashboard size={14} />
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto py-12 px-6 lg:px-10">
        <TaskBoard project={project} tasks={project.tasks} users={allUsers} />
        
        <ProjectMembers 
          projectId={project.id} 
          members={project.members} 
          allUsers={allUsers}
          isOwner={isOwner}
        />
      </main>
    </div>
  );
}
