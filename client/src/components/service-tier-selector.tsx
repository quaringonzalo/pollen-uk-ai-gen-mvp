import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Sparkles } from "lucide-react";

interface ServiceTierSelectorProps {
  onTierSelect: (tier: 'standard' | 'premium' | 'white-glove') => void;
  selectedTier?: 'standard' | 'premium' | 'white-glove';
}

export default function ServiceTierSelector({ onTierSelect, selectedTier }: ServiceTierSelectorProps) {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const tiers = [
    {
      id: 'standard',
      name: 'Standard',
      subtitle: 'Quick & Efficient',
      price: 'Lower fee',
      icon: Star,
      colour: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Perfect for urgent hiring needs with proven assessment framework',
      features: [
        'Pre-built skills challenges',
        'Standard behavioural assessment',
        'Automated candidate matching',
        '100% feedback guarantee',
        'Basic profile generation',
        'Notion board integration'
      ],
      limitations: [
        'Limited customization',
        'Standard challenge library only'
      ],
      bestFor: 'Companies who need to fill roles quickly with reliable, skills-first assessment'
    },
    {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Tailored Process',
      price: 'Mid-tier fee',
      icon: Crown,
      colour: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'AI-powered bespoke recruitment process designed for your specific needs',
      features: [
        'Custom skills challenges designed with AI',
        'Enhanced behavioural assessment',
        'Tailored matching algorithms',
        'Company-specific evaluation criteria',
        'Advanced candidate profiles',
        'Dedicated process design consultation',
        'All Standard features included'
      ],
      limitations: [
        'Longer setup time (2-3 days)',
        'Requires initial consultation'
      ],
      bestFor: 'Companies with specific role requirements who want a process designed for their culture and needs'
    },
    {
      id: 'white-glove',
      name: 'White Glove',
      subtitle: 'Full-Service Recruitment',
      price: 'Premium fee',
      icon: Sparkles,
      colour: 'text-gold-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Complete recruitment campaign managed by our expert team',
      features: [
        'Dedicated recruitment manager',
        'Custom end-to-end process design',
        'Active candidate sourcing',
        'Interview coordination',
        'Detailed candidate presentations',
        'Offer negotiation support',
        'Post-hire follow-up',
        'All Premium features included'
      ],
      limitations: [
        'Higher investment required',
        'Longer lead times'
      ],
      bestFor: 'Companies who want to outsource their entire recruitment process to experts'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Service Level</h2>
        <p className="text-muted-foreground">
          Select the recruitment service that best fits your hiring needs and timeline
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const IconComponent = tier.icon;
          const isSelected = selectedTier === tier.id;
          const isHovered = hoveredTier === tier.id;
          
          return (
            <Card 
              key={tier.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? `ring-2 ring-primary ${tier.borderColor} shadow-lg` 
                  : isHovered
                    ? 'shadow-md scale-105'
                    : 'hover:shadow-md'
              }`}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              onClick={() => onTierSelect(tier.id as any)}
            >
              {tier.id === 'premium' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="bg-purple-500">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className={`text-center ${tier.bgColor}`}>
                <div className={`w-12 h-12 rounded-full ${tier.bgColor} flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className={`w-6 h-6 ${tier.colour}`} />
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{tier.subtitle}</p>
                <p className="font-semibold text-lg">{tier.price}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {tier.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Features Included:</h4>
                  <ul className="space-y-1">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.limitations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-orange-600">Considerations:</h4>
                    <ul className="space-y-1">
                      {tier.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm text-orange-600">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Best For:</h4>
                  <p className="text-sm text-muted-foreground">{tier.bestFor}</p>
                </div>

                <Button 
                  className={`w-full ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  variant={isSelected ? "default" : "secondary"}
                >
                  {isSelected ? 'Selected' : `Choose ${tier.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedTier && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">
                  {tiers.find(t => t.id === selectedTier)?.name} Service Selected
                </h4>
                <p className="text-sm text-muted-foreground">
                  You can change this selection at any time before confirming your job posting.
                </p>
              </div>
              <Button>Continue Setup</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}