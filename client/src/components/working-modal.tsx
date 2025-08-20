import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: () => void;
}

export default function WorkingModal({ isOpen, onClose, onStartChallenge }: WorkingModalProps) {
  console.log("WorkingModal rendered with isOpen:", isOpen);
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
          >
            Close
          </Button>
          <Button 
            onClick={onStartChallenge}
            className="bg-blue-600 hover:bg-blue-700 flex-1"
          >
            Start Foundation Challenge
          </Button>
        </div>
      </div>
    </div>
  );
}