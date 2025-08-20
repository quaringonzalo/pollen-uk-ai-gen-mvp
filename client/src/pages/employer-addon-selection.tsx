import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, ArrowRight, ChevronLeft, Clock, Users, Star, 
  Zap, MessageSquare, Calendar, Target, Award, Shield
} from "lucide-react";

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: any;
  availableFor: string[];
  benefit: string;
}

export default function EmployerAddonSelection() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  useEffect(() => {
    const bundle = localStorage.getItem('selectedBundle');
    setSelectedBundle(bundle);
  }, []);

  const addons: Addon[] = [
    {
      id: "urgency-boost",
      name: "Urgency Boost",
      description: "Priority processing and faster candidate delivery",
      price: 100,
      icon: Zap,
      availableFor: ["quick-hire", "smart-match", "hands-off"],
      benefit: "Reduce time-to-fill by 3-5 days"
    },
    {
      id: "enhanced-feedback",
      name: "Enhanced Candidate Feedback",
      description: "Detailed written feedback for all candidates, removing admin burden",
      price: 150,
      icon: MessageSquare,
      availableFor: ["quick-hire", "smart-match"],
      benefit: "Professional feedback to all candidates automatically"
    },
    {
      id: "interview-management",
      name: "Complete Interview Management",
      description: "We schedule, coordinate, and manage all interviews for you",
      price: 200,
      icon: Calendar,
      availableFor: ["quick-hire", "smart-match"],
      benefit: "Zero interview administration on your end"
    },
    {
      id: "skills-assessment",
      name: "Advanced Skills Assessment",
      description: "In-depth technical and practical skills evaluation",
      price: 250,
      icon: Target,
      availableFor: ["quick-hire", "smart-match", "hands-off"],
      benefit: "Comprehensive skills verification beyond challenges"
    },
    {
      id: "onboarding-support",
      name: "Onboarding Success Package",
      description: "30-day new hire support and integration guidance",
      price: 300,
      icon: Users,
      availableFor: ["smart-match", "hands-off", "talent-pipeline"],
      benefit: "Ensure successful integration and retention"
    },
    {
      id: "guarantee-plus",
      name: "Extended Guarantee",
      description: "90-day replacement guarantee instead of standard 30-day",
      price: 200,
      icon: Shield,
      availableFor: ["smart-match", "hands-off", "talent-pipeline"],
      benefit: "Extended protection for your investment"
    },
    {
      id: "market-insights",
      name: "Market Intelligence Report",
      description: "Salary benchmarking and local talent market analysis",
      price: 175,
      icon: Award,
      availableFor: ["smart-match", "hands-off", "talent-pipeline"],
      benefit: "Make informed hiring and compensation decisions"
    }
  ];

  const bundleNames: { [key: string]: string } = {
    "quick-hire": "Quick Hire",
    "smart-match": "Smart Match", 
    "hands-off": "Hands-Off Hiring",
    "talent-pipeline": "Talent Pipeline"
  };

  const bundlePrices: { [key: string]: number } = {
    "quick-hire": 299,
    "smart-match": 599,
    "hands-off": 899,
    "talent-pipeline": 1499
  };

  const availableAddons = addons.filter(addon => 
    selectedBundle && addon.availableFor.includes(selectedBundle)
  );

  const totalAddonPrice = selectedAddons.reduce((total, addonId) => {
    const addon = addons.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);

  const basePrice = selectedBundle ? bundlePrices[selectedBundle] : 0;
  const totalPrice = basePrice + totalAddonPrice;

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleContinue = () => {
    localStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));
    localStorage.setItem('totalPrice', totalPrice.toString());
    window.location.href = '/employer-bundle-details';
  };

  if (!selectedBundle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No bundle selected</h2>
          <Button onClick={() => window.location.href = '/employer-bundle-selection'}>
            Select a bundle first
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.location.href = '/employer-bundle-selection'}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Customize Your Package</h1>
              <p className="text-gray-600">Add optional services to enhance your hiring experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Step 2.5 of 4</span>
            <Progress value={62} className="flex-1 max-w-md" />
            <span className="text-sm text-gray-500">Package Customization</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Selected Bundle Summary */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-900">
                  {bundleNames[selectedBundle]} - £{basePrice.toLocaleString()}
                </h3>
                <p className="text-blue-700">Your selected base package</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/employer-bundle-selection'}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Change Bundle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add-ons Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Optional Add-ons</h2>
          <p className="text-gray-600 mb-6">
            Enhance your package with additional services to address specific needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableAddons.map((addon) => {
              const IconComponent = addon.icon;
              const isSelected = selectedAddons.includes(addon.id);
              
              return (
                <Card 
                  key={addon.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{addon.name}</CardTitle>
                        </div>
                      </div>
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => toggleAddon(addon.id)}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{addon.description}</p>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-900 mb-1">Benefit:</div>
                      <div className="text-sm text-green-800">{addon.benefit}</div>
                    </div>

                    <div className="text-center py-2">
                      <div className="text-2xl font-bold text-gray-900">
                        +£{addon.price}
                      </div>
                      <div className="text-sm text-gray-500">one-time add-on</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Pricing Summary */}
        <Card className="mb-8 bg-gray-900 text-white">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Package Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>{bundleNames[selectedBundle]} (Base Package)</span>
                <span>£{basePrice.toLocaleString()}</span>
              </div>
              
              {selectedAddons.map(addonId => {
                const addon = addons.find(a => a.id === addonId);
                return addon ? (
                  <div key={addonId} className="flex justify-between text-blue-200">
                    <span>+ {addon.name}</span>
                    <span>£{addon.price}</span>
                  </div>
                ) : null;
              })}
              
              {selectedAddons.length > 0 && (
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between text-sm">
                    <span>Add-ons Subtotal</span>
                    <span>£{totalAddonPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Package Price</span>
                  <span>£{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => window.location.href = '/employer-bundle-selection'}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Change Bundle
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={handleContinue}
            >
              Skip Add-ons
            </Button>
            <Button 
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue with Package
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Need help choosing the right add-ons? 
            <Button variant="link" className="p-0 ml-1 h-auto text-blue-600">
              Speak with our team
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}