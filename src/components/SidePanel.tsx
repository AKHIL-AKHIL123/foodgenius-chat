
import React from 'react';
import { Button } from '@/components/ui/button';
import UserDashboard from './UserDashboard';
import { X } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl transition-transform overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
          <h2 className="text-lg font-semibold">Your Nutrition Profile</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 hover:bg-muted"
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="p-4">
          <UserDashboard />
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
