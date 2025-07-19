'use client';

import { Moon, Sun, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';

interface HeaderProps {
  onCreatePost?: () => void;
}

export default function Header({ onCreatePost }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 border-2 border-white/20">
              <Sparkles className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full border-3 border-white animate-bounce"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-black text-2xl bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Contact Page
            </h1>
            <p className="text-sm text-purple-300 -mt-1 font-medium">Quản lý danh bạ</p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-12 h-12 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-purple-400/30 hover:border-purple-400/60 hover:scale-105"
          >
            {theme === 'light' ? (
              <Moon className="h-6 w-6 text-purple-300 hover:text-white transition-colors" />
            ) : (
              <Sun className="h-6 w-6 text-amber-400 hover:text-amber-300 transition-colors" />
            )}
          </Button>

          {/* Create Post Button */}
          {onCreatePost && (
            <Button 
              onClick={onCreatePost} 
              className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:via-cyan-400 hover:to-blue-500 text-white shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 rounded-2xl px-6 py-3 font-bold border border-white/20 hover:scale-105 hover:-translate-y-1"
            >
              <Plus className="h-5 w-5 mr-2 animate-spin hover:animate-none transition-all" />
              <span className="hidden sm:inline">Tạo liên hệ</span>
              <span className="sm:hidden">Tạo</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}