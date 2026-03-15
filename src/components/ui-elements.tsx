import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger', size?: 'sm' | 'md' | 'lg', asChild?: boolean }>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-2xl shadow-primary/20 transition-all active:scale-95',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95 border border-border/50',
      outline: 'border-2 border-border/60 bg-transparent hover:bg-muted hover:border-primary text-foreground transition-all active:scale-95',
      ghost: 'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground transition-all rounded-full',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xl shadow-destructive/10 active:scale-95',
    };
    const sizes = {
      sm: 'px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em]',
      md: 'px-8 py-4 text-sm font-black tracking-tight',
      lg: 'px-10 py-5 text-lg font-black tracking-tight',
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-[1.75rem] font-medium transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

export const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'outline' | 'secondary' | 'accent' }) => {
  const variants = {
    default: 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5',
    outline: 'border-2 border-border/60 text-muted-foreground font-black uppercase tracking-widest',
    secondary: 'bg-secondary/80 text-secondary-foreground border border-border/40 backdrop-blur-xl',
    accent: 'bg-accent/10 text-accent border border-accent/30 shadow-sm shadow-accent/5',
  };
  return (
    <span className={cn('inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] transition-all', variants[variant], className)}>
      {children}
    </span>
  );
};

export const Card = ({ children, className, hoverable = true }: { children: React.ReactNode, className?: string, hoverable?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={hoverable ? { y: -12, scale: 1.01, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } : {}}
    className={cn(
      'bg-card text-card-foreground rounded-[3rem] border border-border/30 shadow-2xl shadow-black/[0.02] overflow-hidden transition-all duration-700 hover:shadow-primary/10 hover:border-primary/30',
      className
    )}
  >
    {children}
  </motion.div>
);

export const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn(
    'bg-white/40 dark:bg-black/20 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[3rem] shadow-2xl shadow-black/5',
    className
  )}>
    {children}
  </div>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-16 w-full rounded-[1.75rem] border-2 border-border/50 bg-background/50 px-8 py-4 text-base font-bold ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-primary/5 focus-visible:border-primary transition-all duration-500 backdrop-blur-sm shadow-inner',
        className
      )}
      {...props}
    />
  )
);