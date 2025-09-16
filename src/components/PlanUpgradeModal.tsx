import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Crown, Music, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: Music,
      features: [
        '5 uploads per month',
        'Basic analytics',
        'Standard support',
        'MP3 uploads only'
      ],
      current: user?.plan === 'Free'
    },
    {
      name: 'Artist',
      price: '$9.99',
      period: 'per month',
      icon: Crown,
      features: [
        'Unlimited uploads',
        'Advanced analytics',
        'Priority support',
        'All audio formats',
        'Custom artwork',
        'Release scheduling'
      ],
      current: user?.plan === 'Artist',
      popular: true
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      icon: Zap,
      features: [
        'Everything in Artist',
        'White-label distribution',
        'Advanced royalty splits',
        'API access',
        'Dedicated account manager',
        'Custom domain'
      ],
      current: user?.plan === 'Pro'
    }
  ];

  const handleUpgrade = async (planName: string) => {
    if (planName === user?.plan) return;
    
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user plan in localStorage
      if (user) {
        const updatedUser = { ...user, plan: planName };
        localStorage.setItem('soundwave_user', JSON.stringify(updatedUser));
        
        // In a real app, you'd call an API to update the user's plan
        // await updateUserPlan(planName);
        
        toast({
          title: "Plan upgraded successfully!",
          description: `Welcome to the ${planName} plan. Your new features are now available.`,
        });
        
        onClose();
        
        // Refresh the page to update the user context
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "There was an error upgrading your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative p-6 ${
                  plan.popular
                    ? 'border-2 border-purple-500 shadow-lg'
                    : plan.current
                    ? 'border-2 border-green-500'
                    : 'border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <IconComponent className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={plan.current || isLoading}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {plan.current
                    ? "Current Plan"
                    : isLoading
                    ? "Processing..."
                    : plan.name === 'Free'
                    ? "Downgrade to Free"
                    : `Upgrade to ${plan.name}`
                  }
                </Button>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanUpgradeModal;