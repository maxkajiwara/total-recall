import { motion } from 'motion/react';
import { Button } from '../ui/button';

interface DesktopTopBarProps {
  totalDueCards: number;
  currentStreak: number;
}

export function DesktopTopBar({ totalDueCards, currentStreak }: DesktopTopBarProps) {
  const handleSettings = () => {
    // TODO: Implement settings modal
    console.log('Settings clicked');
  };

  const handleNotifications = () => {
    // TODO: Implement notifications
    console.log('Notifications clicked');
  };

  return (
    <div className="desktop-topbar flex items-center justify-between px-6 py-4">
      {/* Left side - App title and status */}
      <div className="flex items-center space-x-6">
        <div>
          <h1 className="text-xl font-semibold">Total Recall</h1>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-secondary">
          {totalDueCards > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-custom rounded-full"></div>
              <span>{totalDueCards} cards due</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <span>🔥</span>
            <span>{currentStreak} day streak</span>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNotifications}
          className="p-2"
        >
          🔔
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSettings}
          className="p-2"
        >
          ⚙️
        </Button>
      </div>
    </div>
  );
}