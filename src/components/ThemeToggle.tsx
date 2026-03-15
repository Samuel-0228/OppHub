import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from './theme-provider';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-secondary/50 backdrop-blur-xl border border-border/50 p-1.5 rounded-full flex items-center gap-1 shadow-inner">
      <button
        onClick={() => setTheme('light')}
        className={`relative p-2.5 rounded-full transition-all duration-500 ${
          theme === 'light' 
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Sun className="w-4 h-4" />
        {theme === 'light' && (
          <motion.div
            layoutId="theme-active"
            className="absolute inset-0 bg-primary rounded-full -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`relative p-2.5 rounded-full transition-all duration-500 ${
          theme === 'dark' 
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Moon className="w-4 h-4" />
        {theme === 'dark' && (
          <motion.div
            layoutId="theme-active"
            className="absolute inset-0 bg-primary rounded-full -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    </div>
  );
}