'use client';

import { useState } from 'react';
import { createProjectAction, updateProjectAction } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string;
  dueDate?: Date | null;
}

export default function ProjectForm({ 
  onClose, 
  project 
}: { 
  onClose?: () => void;
  project?: Project;
}) {
  const router = useRouter();
  const isEditing = !!project;
  const [hasDeadline, setHasDeadline] = useState(!!project?.dueDate);

  async function handleSubmit(formData: FormData) {
    try {
      if (isEditing) {
        await updateProjectAction(project.id, formData);
      } else {
        await createProjectAction(formData);
      }
      router.refresh();
      if (onClose) onClose();
    } catch (e) {
      alert(`Failed to ${isEditing ? 'update' : 'create'} project`);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
        {isEditing ? 'Project Configuration' : 'Launch New Project'}
      </h3>
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Project Title
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={project?.name}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 transition-all"
            placeholder="e.g. Q1 Marketing Campaign"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Core Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={project?.description || ''}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-900 transition-all"
            placeholder="What is the main objective?"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isEditing && (
            <div>
              <label htmlFor="status" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Lifecycle Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={project.status}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900"
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          )}

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-2 ml-1">
              <input 
                type="checkbox" 
                id="deadline-toggle" 
                checked={hasDeadline} 
                onChange={(e) => setHasDeadline(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="deadline-toggle" className="text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer">
                Set Deadline?
              </label>
            </div>
            
            {hasDeadline && (
              <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={16} />
                </div>
                <input 
                  type="date" 
                  name="dueDate"
                  defaultValue={project?.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ''}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 text-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Discard
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all hover:scale-[1.02] active:scale-95"
          >
            {isEditing ? 'Update Project' : 'Launch Project'}
          </button>
        </div>
      </form>
    </div>
  );
}