'use client';

import { useState } from 'react';
import { addProjectMemberAction, removeProjectMemberAction } from '@/app/actions';
import { Users, UserPlus, X, Shield, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string | null;
  email: string;
}

interface Member {
  userId: number;
  user: {
    name: string | null;
    email: string;
  };
  role: string;
}

export default function ProjectMembers({ 
  projectId, 
  members, 
  allUsers,
  isOwner 
}: { 
  projectId: number;
  members: Member[];
  allUsers: User[];
  isOwner: boolean;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredUsers = allUsers.filter(user => 
    !members.some(m => m.userId === user.id) && 
    (user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  async function handleAdd(userId: number) {
    try {
      await addProjectMemberAction(projectId, userId);
      setSearchTerm('');
      setIsAdding(false);
      router.refresh();
    } catch (e) {
      alert('Failed to add member');
    }
  }

  async function handleRemove(userId: number) {
    if (confirm('Remove this member from project?')) {
      try {
        await removeProjectMemberAction(projectId, userId);
        router.refresh();
      } catch (e) {
        alert('Failed to remove member');
      }
    }
  }

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 mt-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Collaboration Team</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Project Members</p>
          </div>
        </div>
        {isOwner && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all"
          >
            {isAdding ? <X size={14} /> : <UserPlus size={14} />}
            {isAdding ? 'Close' : 'Add Member'}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.name || 'Anonymous'}</p>
                    <p className="text-[10px] font-medium text-slate-400">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => handleAdd(user.id)}
                    className="p-2 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                  >
                    <UserPlus size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">No users available</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.userId} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group">
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:scale-110 transition-transform">
              {(member.user.name || member.user.email).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate leading-tight">{member.user.name || 'Anonymous'}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{member.role}</span>
              </div>
            </div>
            {isOwner && (
              <button 
                onClick={() => handleRemove(member.userId)}
                className="p-1.5 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
