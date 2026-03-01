'use client';

import { useState } from 'react';
import { Bell, Check, Trash2, Info, AlertTriangle, Calendar as CalendarIcon, X } from 'lucide-react';
import { markNotificationAsReadAction } from '@/app/actions';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: Boolean;
  createdAt: Date;
}

export default function Notifications({ notifications }: { notifications: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  async function handleMarkAsRead(id: number) {
    try {
      await markNotificationAsReadAction(id);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-5 w-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[28px] shadow-2xl shadow-indigo-100 border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Bell size={20} className="text-slate-200" />
                  </div>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-5 hover:bg-slate-50 transition-colors group relative ${!n.read ? 'bg-indigo-50/30' : ''}`}
                    >
                      <div className="flex gap-4">
                        <div className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          n.type === 'URGENT' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {n.type === 'URGENT' ? <AlertTriangle size={14} /> : <Info size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-black text-slate-900 leading-tight mb-1 ${!n.read ? 'pr-6' : ''}`}>
                            {n.title}
                          </p>
                          <p className="text-xs font-medium text-slate-500 leading-relaxed mb-2">
                            {n.message}
                          </p>
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {!n.read && (
                        <button 
                          onClick={() => handleMarkAsRead(n.id)}
                          className="absolute top-5 right-5 p-1.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 rounded-lg shadow-sm transition-all"
                          title="Mark as read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-4 bg-slate-50 text-center">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Close Panel
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
