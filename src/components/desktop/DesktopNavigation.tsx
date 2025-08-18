'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';

type NavigationItem = 'home' | 'library' | 'stats' | 'graph';

interface DesktopNavigationProps {
  currentView: NavigationItem;
  onNavigate: (view: NavigationItem) => void;
  totalDueCards: number;
  currentStreak: number;
}

export default function DesktopNavigation({ 
  currentView, 
  onNavigate, 
  totalDueCards, 
  currentStreak 
}: DesktopNavigationProps) {
  const navigationItems = [
    { id: 'home' as NavigationItem, label: 'Home', description: 'Review dashboard' },
    { id: 'library' as NavigationItem, label: 'Library', description: 'Manage contexts' },
    { id: 'stats' as NavigationItem, label: 'Stats', description: 'Analytics' },
    { id: 'graph' as NavigationItem, label: 'Graph', description: 'Knowledge map' }
  ];

  const handleSettings = () => {
    console.log('Settings clicked');
  };

  const handleProfile = () => {
    console.log('Profile clicked');
  };

  return (
    <div className="w-full border-b border-border bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - App title and navigation */}
        <div className="flex items-center space-x-8">
          <div>
            <h1 className="text-xl font-semibold">Total Recall</h1>
          </div>
          
          {/* Navigation tabs */}
          <nav className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-ring ${
                  currentView === item.id
                    ? 'bg-primary-light text-primary'
                    : 'text-muted-foreground hover:text-primary hover:bg-gray-50'
                }`}
              >
                {item.label}
                {currentView === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-light rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Right side - Status and actions */}
        <div className="flex items-center space-x-6">
          {/* Quick stats */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {totalDueCards > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>{totalDueCards} cards due</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <span>🔥</span>
              <span>{currentStreak} day streak</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProfile}
              className="p-2 text-lg"
            >
              👤
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettings}
              className="p-2 text-lg"
            >
              ⚙️
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}