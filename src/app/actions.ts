'use server';

import { db } from '@/lib/db';
import { encrypt, login } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

import { getSession, logout } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

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

export async function createTaskAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) throw new Error('Unauthorized');

  const projectId = parseInt(formData.get('projectId') as string);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string || 'MEDIUM';

  if (!title || !projectId) throw new Error('Title and Project ID are required');

  const task = await db.task.create({
    data: {
      title,
      description,
      priority,
      projectId,
    },
  });

  await db.auditLog.create({
    data: {
      action: 'CREATE_TASK',
      userId: session.user.id,
      details: `Created task: ${title} in project ${projectId}`,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  return task;
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

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
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
