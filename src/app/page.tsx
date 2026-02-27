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

  return <DashboardClient projects={projects} userName={session.user.name || session.user.email} />;
}
