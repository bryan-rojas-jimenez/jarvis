import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import ReportView from "@/components/ReportView";

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
    <ReportView 
      project={project} 
      progress={progress} 
      completedTasks={completedTasks} 
      pendingTasks={pendingTasks} 
    />
  );
}
