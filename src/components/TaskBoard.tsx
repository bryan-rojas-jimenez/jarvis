'use client';

import { useState } from 'react';
import { updateTaskStatusAction, createTaskAction, deleteTaskAction, updateTaskAction } from '@/app/actions';
import { Plus, CheckCircle, Clock, ListTodo, MoreVertical, Calendar, Edit2, Trash2, User as UserIcon, Search, Filter, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string | null;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  assigneeId: number | null;
  assignee?: User | null;
}

interface Project {
  id: number;
  name: string;
  description: string | null;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do', icon: ListTodo, color: 'bg-slate-100 text-slate-700', border: 'border-slate-200' },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: Clock, color: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-100' },
  { value: 'DONE', label: 'Completed', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-100' },
];

export default function TaskBoard({ project, tasks, users }: { project: Project, tasks: Task[], users: User[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const router = useRouter();

  async function handleStatusChange(taskId: number, newStatus: string) {
    try {
      await updateTaskStatusAction(taskId, newStatus, project.id);
      router.refresh();
    } catch (e) {
      alert('Failed to update status');
    }
  }

  async function handleCreateOrUpdateTask(formData: FormData) {
    try {
      if (editingTask) {
        await updateTaskAction(editingTask.id, formData, project.id);
      } else {
        await createTaskAction(formData);
      }
      setIsAdding(false);
      setEditingTask(null);
      router.refresh();
    } catch (e) {
      alert(`Failed to ${editingTask ? 'update' : 'create'} task`);
    }
  }

  async function handleDeleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskAction(taskId, project.id);
        router.refresh();
      } catch (e) {
        alert('Failed to delete task');
      }
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <ListTodo size={16} className="text-white" />
            </div>
            <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Project Hub</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">{project.name}</h2>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">{project.description || "Set clear goals and track your progress through the Kanban board below."}</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Task
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="flex-1 px-3 py-2 bg-transparent focus:outline-none font-medium text-slate-900 placeholder-slate-400 text-sm"
            placeholder="Search tasks by name or detail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 ml-2" />
          <select
            className="bg-transparent pr-8 py-2 text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="URGENT">Urgent Priority</option>
          </select>
        </div>
      </div>

      {(isAdding || editingTask) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md transform animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingTask ? 'Edit Task' : 'New Task'}
                </h3>
                <button onClick={() => { setIsAdding(false); setEditingTask(null); }} className="h-10 w-10 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl flex items-center justify-center transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form action={handleCreateOrUpdateTask} className="space-y-6">
                <input type="hidden" name="projectId" value={project.id} />
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Task Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    defaultValue={editingTask?.title}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                    placeholder="e.g. Design system core"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingTask?.description || ''}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                    placeholder="Describe the task details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                    <select 
                      name="priority" 
                      defaultValue={editingTask?.priority || 'MEDIUM'}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Assignee</label>
                    <select 
                      name="assigneeId" 
                      defaultValue={editingTask?.assigneeId || ''}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                    >
                      <option value="">Unassigned</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name || u.email}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="submit"
                    className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statusOptions.map((column) => (
          <div key={column.value} className="flex flex-col min-h-[600px]">
            <div className={`flex items-center gap-3 mb-6 p-4 rounded-2xl border border-slate-200/60 bg-white shadow-sm`}>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${column.color}`}>
                <column.icon size={18} />
              </div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">{column.label}</h3>
              <span className="ml-auto bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500">
                {filteredTasks.filter(t => t.status === column.value).length}
              </span>
            </div>
            
            <div className="space-y-5 flex-1">
              {filteredTasks.filter(t => t.status === column.value).map((task) => (
                <div key={task.id} className="group bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                  {/* Priority indicator stripe */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                    task.priority === 'URGENT' ? 'bg-rose-500' :
                    task.priority === 'HIGH' ? 'bg-amber-500' :
                    task.priority === 'MEDIUM' ? 'bg-indigo-500' :
                    'bg-slate-300'
                  }`} />

                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors pr-2">{task.title}</h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingTask(task)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-5 leading-relaxed">{task.description}</p>
                  )}
                  
                  <div className="flex items-center gap-3 mb-6">
                    {task.assignee ? (
                      <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 truncate shadow-sm">
                        <div className="h-5 w-5 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] text-white font-black">
                          {task.assignee.name?.charAt(0) || task.assignee.email.charAt(0)}
                        </div>
                        <span className="text-[10px] font-black text-indigo-700 truncate uppercase tracking-tight">{task.assignee.name || task.assignee.email}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-slate-400">
                        <UserIcon size={12} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Unassigned</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border ${
                      task.priority === 'URGENT' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      task.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      task.priority === 'MEDIUM' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {task.priority}
                    </div>
                    <div className="flex gap-1.5">
                      {statusOptions.filter(opt => opt.value !== task.status).map(opt => (
                         <button
                           key={opt.value}
                           onClick={() => handleStatusChange(task.id, opt.value)}
                           className="h-8 w-8 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90"
                           title={`Move to ${opt.label}`}
                         >
                           <ArrowRight size={14} />
                         </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {filteredTasks.filter(t => t.status === column.value).length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/30">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3">
                    <column.icon size={20} className="text-slate-300" />
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Queue Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
