import { Target, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BootcampModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: () => void;
  totalPoints: number;
}

export default function BootcampModal({ isOpen, onClose, onStartChallenge, totalPoints }: BootcampModalProps) {
  if (!isOpen) return null;

  const pointsNeeded = Math.max(0, 500 - totalPoints);
  const challengesNeeded = Math.ceil(pointsNeeded / 100);

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
          <Target className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Pollen Bootcamp</h3>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-orange-900 mb-2">Exclusive 1-Week Programme</h4>
          <p className="text-sm text-orange-800 mb-3">
            An intensive bootcamp open to dedicated contributors, connecting hardworking individuals with exclusive startup opportunities and part-time roles.
          </p>
          <div className="text-sm text-orange-800">
            <strong>Progress:</strong> {totalPoints} / 500 points ({pointsNeeded} points needed)
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">To unlock the bootcamp:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Complete {challengesNeeded} more foundation challenges</li>
            <li>• Earn 500+ total points</li>
            <li>• Demonstrate consistent performance</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">What you'll get:</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Self-directed intensive curriculum</li>
            <li>• Live Slack and video call support</li>
            <li>• Direct startup partnership opportunities</li>
            <li>• Part-time role placements</li>
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