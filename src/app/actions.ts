'use server';

import { db } from '@/lib/db';
import { encrypt, login } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

import { getSession, logout } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function deleteProjectAction(projectId: number) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project || project.ownerId !== session.user.id) throw new Error('Forbidden');

  await db.project.delete({ where: { id: projectId } });

  await db.auditLog.create({
    data: {
      action: 'DELETE_PROJECT',
      userId: session.user.id,
      details: `Deleted project: ${project.name} (ID: ${projectId})`,
    },
  });

  revalidatePath('/');
}

export async function updateProjectAction(projectId: number, formData: FormData) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as string || 'ACTIVE';

  const project = await db.project.update({
    where: { id: projectId },
    data: { name, description, status },
  });

  await db.auditLog.create({
    data: {
      action: 'UPDATE_PROJECT',
      userId: session.user.id,
      details: `Updated project: ${name}`,
    },
  });

  revalidatePath('/');
  return project;
}

export async function logoutAction() {
  await logout();
  redirect('/login');
}

export async function createProjectAction(formData: FormData) {
  const session = await getSession();
  
  // We check if session exists and has a user with an ID
  if (!session || !session.user || !session.user.id) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    throw new Error('Project name is required');
  }

  const project = await db.project.create({
    data: {
      name,
      description,
      ownerId: session.user.id,
    },
  });

  // Log project creation
  await db.auditLog.create({
    data: {
      action: 'CREATE_PROJECT',
      userId: session.user.id,
      details: `Created project: ${name}`,
    },
  });

  revalidatePath('/');
  return project;
}

export async function deleteTaskAction(taskId: number, projectId: number) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  const task = await db.task.delete({ where: { id: taskId } });

  await db.auditLog.create({
    data: {
      action: 'DELETE_TASK',
      userId: session.user.id,
      details: `Deleted task: ${task.title} from project ${projectId}`,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function createTaskAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  const projectId = parseInt(formData.get('projectId') as string);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string || 'MEDIUM';
  const assigneeIdRaw = formData.get('assigneeId') as string;
  const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw) : null;

  if (!title || !projectId) throw new Error('Title and Project ID are required');

  const task = await db.task.create({
    data: {
      title,
      description,
      priority,
      projectId,
      assigneeId,
    },
  });

  await db.auditLog.create({
    data: {
      action: 'CREATE_TASK',
      userId: session.user.id,
      details: `Created task: ${title} in project ${projectId}${assigneeId ? ` assigned to user ${assigneeId}` : ''}`,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  return task;
}

export async function updateTaskAction(taskId: number, formData: FormData, projectId: number) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string;
  const assigneeIdRaw = formData.get('assigneeId') as string;
  const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw) : null;

  await db.task.update({
    where: { id: taskId },
    data: { title, description, priority, assigneeId },
  });

  await db.auditLog.create({
    data: {
      action: 'UPDATE_TASK',
      userId: session.user.id,
      details: `Updated task: ${title}${assigneeId ? ` assigned to user ${assigneeId}` : ''}`,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function updateTaskStatusAction(taskId: number, status: string, projectId: number) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  await db.task.update({
    where: { id: taskId },
    data: { status },
  });

  await db.auditLog.create({
    data: {
      action: 'UPDATE_TASK_STATUS',
      userId: session.user.id,
      details: `Updated task ${taskId} status to ${status}`,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function addProjectMemberAction(projectId: number, userId: number) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  // Verify ownership
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project || project.ownerId !== session.user.id) throw new Error('Only owners can add members');

  await db.projectMember.upsert({
    where: { projectId_userId: { projectId, userId } },
    update: {},
    create: { projectId, userId, role: 'MEMBER' }
  });

  await db.auditLog.create({
    data: {
      action: 'ADD_COLLABORATOR',
      userId: session.user.id,
      details: `Added user ${userId} to project ${projectId}`,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function removeProjectMemberAction(projectId: number, userId: number) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project || project.ownerId !== session.user.id) throw new Error('Only owners can remove members');

  await db.projectMember.delete({
    where: { projectId_userId: { projectId, userId } }
  });

  await db.auditLog.create({
    data: {
      action: 'REMOVE_COLLABORATOR',
      userId: session.user.id,
      details: `Removed user ${userId} from project ${projectId}`,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function updateProfileAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const position = formData.get('position') as string;

  const user = await db.user.update({
    where: { id: session.user.id },
    data: { name, position },
  });

  // Update session with new name if needed
  await login(user);

  await db.auditLog.create({
    data: {
      action: 'UPDATE_PROFILE',
      userId: session.user.id,
      details: `Updated profile: ${name}, Position: ${position}`,
    },
  });

  revalidatePath('/profile');
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check for specific ADMIN email or first user
  const userCount = await db.user.count();
  const role = (userCount === 0 || email.toLowerCase() === 'bryan-rojas@hotmail.com') ? 'ADMIN' : 'USER';

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  // Log registration
  await db.auditLog.create({
    data: {
      action: 'REGISTER',
      userId: user.id,
      details: `User registered: ${email}`,
    },
  });

  await login(user);
  redirect('/');
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Log login
  await db.auditLog.create({
    data: {
      action: 'LOGIN',
      userId: user.id,
      details: `User logged in: ${email}`,
    },
  });

  await login(user);
  redirect('/');
}
