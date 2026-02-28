'use client';

import { loginAction } from '@/app/actions';
import Link from 'next/link';
import { FolderOpen, ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200 mb-6">
            <FolderOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome to JARVIS</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your projects with intelligence.</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Sign in to workspace</h2>
          
          <form action={loginAction} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder-slate-400 shadow-inner"
                  placeholder="name@company.com"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder-slate-400 shadow-inner"
                  placeholder="Your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              Access Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium text-sm mb-4">New to JARVIS?</p>
            <Link href="/register" className="inline-flex items-center px-6 py-3 bg-indigo-50 text-indigo-600 font-black rounded-xl hover:bg-indigo-100 transition-all text-xs uppercase tracking-widest">
              Create an account
            </Link>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-xs font-bold mt-8 uppercase tracking-[0.2em]">
          &copy; 2026 JARVIS Management System
        </p>
      </div>
    </div>
  );
}