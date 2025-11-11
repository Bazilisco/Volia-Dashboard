import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Grid3x3,
  Video,
  BarChart3,
  Monitor,
  Terminal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import voliaLogo from '@/assets/volia-logo.png';
import voliaLogoMini from '@/assets/volia-logo-mini.png';

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', path: '/dashboard' },
  { icon: Image, label: 'Story', path: '/dashboard/story' },
  { icon: Grid3x3, label: 'Feed', path: '/dashboard/feed' },
  { icon: Video, label: 'Reels', path: '/dashboard/reels' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: Monitor, label: 'Monitor', path: '/dashboard/monitor' },
  { icon: Terminal, label: 'Console', path: '/dashboard/console' },
];

export const DashboardSidebar = ({ collapsed, onToggle }: DashboardSidebarProps) => {
  return (
    <aside
      className={cn(
        'glass-strong border-r border-white/20 transition-all duration-300 flex flex-col relative',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        {!collapsed ? (
          <img src={voliaLogo} alt="VOLIA" className="h-10 w-auto mx-auto" />
        ) : (
          <img src={voliaLogoMini} alt="VOLIA" className="h-10 w-10 mx-auto object-contain" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-white/10 hover:glow-primary',
                isActive && 'bg-primary/20 glow-primary',
                collapsed && 'justify-center'
              )
            }
          >
            <item.icon className="w-5 h-5 text-foreground" />
            {!collapsed && <span className="text-foreground">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full glass-strong flex items-center justify-center hover:glow-primary transition-all duration-200"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-foreground" />
        )}
      </button>
    </aside>
  );
};
