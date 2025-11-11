import { ReactNode, useState, useEffect } from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { DashboardSidebar } from './DashboardSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden glass-strong"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
      
      <div className="flex min-h-screen">
        {/* Mobile overlay */}
        {isMobile && mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        <div className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300' : ''}
          ${isMobile && !mobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
        `}>
          <DashboardSidebar 
            collapsed={sidebarCollapsed && !mobileMenuOpen} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        
        <div className={`flex-1 flex flex-col ${isMobile ? 'w-full' : ''}`}>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
