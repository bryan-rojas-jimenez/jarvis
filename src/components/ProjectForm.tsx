'use client';

import { createProjectAction } from '@/app/actions';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectForm({ onClose }: { onClose?: () => void }) {
  const router = useRouter();

  async function handleCreate(formData: FormData) {
    try {
      await createProjectAction(formData);
      router.refresh();
      if (onClose) onClose();
    } catch (e) {
      alert('Failed to create project');
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Create New Project</h3>
      <form action={handleCreate} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="e.g. Website Redesign"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="Brief description of the project..."
          />
        </div>
        <div className="flex justify-end gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}
