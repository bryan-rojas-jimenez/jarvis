import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const projects = await db.project.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  // Calculate stats for all projects
  const taskStats = await db.task.groupBy({
    by: ['status'],
    where: {
      project: {
        ownerId: session.user.id
      }
    },
    _count: true
  });

  const priorityStats = await db.task.groupBy({
    by: ['priority'],
    where: {
      project: {
        ownerId: session.user.id
      }
    },
    _count: true
  });

  const stats = {
    totalProjects: projects.length,
    totalTasks: taskStats.reduce((acc, curr) => acc + curr._count, 0),
    byStatus: taskStats.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count }), { TODO: 0, IN_PROGRESS: 0, DONE: 0 }),
    byPriority: priorityStats.reduce((acc, curr) => ({ ...acc, [curr.priority]: curr._count }), { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 }),
  };

  return <DashboardClient 
    projects={projects} 
    userName={session.user.name || session.user.email} 
    userRole={session.user.role} 
    stats={stats} 
  />;
}
