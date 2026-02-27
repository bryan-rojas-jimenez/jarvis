'use client';

import { useState } from 'react';
import { updateTaskStatusAction, createTaskAction } from '@/app/actions';
import { Plus, CheckCircle, Clock, ListTodo, MoreVertical, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
}

interface Project {
  id: number;
  name: string;
  description: string | null;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do', icon: ListTodo, color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: Clock, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'DONE', label: 'Done', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' },
];

export default function TaskBoard({ project, tasks }: { project: Project, tasks: Task[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  async function handleStatusChange(taskId: number, newStatus: string) {
    try {
      await updateTaskStatusAction(taskId, newStatus, project.id);
      router.refresh();
    } catch (e) {
      alert('Failed to update status');
    }
  }

  async function handleCreateTask(formData: FormData) {
    try {
      await createTaskAction(formData);
      setIsAdding(false);
      router.refresh();
    } catch (e) {
      alert('Failed to create task');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
          <p className="text-sm text-gray-500">{project.description || "No description"}</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Create New Task</h3>
            <form action={handleCreateTask} className="space-y-4">
              <input type="hidden" name="projectId" value={project.id} />
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  placeholder="e.g. Design Logo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select name="priority" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statusOptions.map((column) => (
          <div key={column.value} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <column.icon className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-700">{column.label}</h3>
              <span className="ml-auto bg-white px-2 py-0.5 rounded-full text-xs font-bold border border-gray-200">
                {tasks.filter(t => t.status === column.value).length}
              </span>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === column.value).map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
                    <MoreVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer" />
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      task.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                      task.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                      task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {task.priority}
                    </span>
                    <div className="flex gap-1">
                      {statusOptions.filter(opt => opt.value !== task.status).map(opt => (
                         <button
                           key={opt.value}
                           onClick={() => handleStatusChange(task.id, opt.value)}
                           className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600"
                           title={`Move to ${opt.label}`}
                         >
                           <opt.icon className="h-4 w-4" />
                         </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
