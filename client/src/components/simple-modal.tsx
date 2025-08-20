import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: () => void;
}

export default function SimpleModal({ isOpen, onClose, onStartChallenge }: SimpleModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
    >
      <div 
        className="bg-white p-6 rounded-lg max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Challenge Locked</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Company challenges are premium opportunities that require you to demonstrate your foundational skills first.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">To unlock this challenge:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Complete at least 1 foundation challenge</li>
            <li>• Verify your core skills</li>
            <li>• Build your profile strength</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="px-8"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}