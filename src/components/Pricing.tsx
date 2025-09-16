import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";

interface PricingProps {
  onGetStarted: () => void;
}

const Pricing = ({ onGetStarted }: PricingProps) => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out the platform",
      icon: Star,
      features: [
        "Upload 2 songs per month",
        "Distribution to 50+ platforms",
        "Basic analytics",
        "Email support",
        "Keep 85% of royalties"
      ],
      limitations: [
        "Limited uploads",
        "Standard support only"
      ],
      buttonText: "Start Free",
      popular: false
    },
    {
      name: "Artist",
      price: "$19.99",
      period: "per year",
      description: "Most popular choice for serious artists",
      icon: Zap,
      features: [
        "Unlimited song uploads",
        "Distribution to 150+ platforms",
        "Advanced analytics & insights",
        "Priority support",
        "Keep 100% of royalties",
        "Custom artist page",
        "Pre-release campaigns",
        "Spotify playlist pitching"
      ],
      limitations: [],
      buttonText: "Get Started",
      popular: true
    },
    {
      name: "Label",
      price: "$99.99",
      period: "per year",
      description: "For record labels and music companies",
      icon: Crown,
      features: [
        "Everything in Artist plan",
        "Manage multiple artists",
        "White-label distribution",
        "API access",
        "Dedicated account manager",
        "Custom reporting",
        "Bulk upload tools",
        "Revenue sharing tools",
        "Advanced promotional tools"
      ],
      limitations: [],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pricing for Everyone
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our core distribution 
            service with no hidden fees or long-term contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={index}
                className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? "border-purple-500 shadow-lg scale-105" 
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.popular 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                      : "bg-gray-100"
                  }`}>
                    <IconComponent className={`w-8 h-8 ${
                      plan.popular ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  
                  <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </div>
                    <div className="text-gray-500">
                      {plan.period}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                    onClick={onGetStarted}
                  >
                    {plan.buttonText}
                  </Button>

                  {plan.name === "Free" && (
                    <p className="text-xs text-gray-500 text-center">
                      No credit card required
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              All plans include:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  Worldwide Distribution
                </div>
                <div className="text-gray-600">
                  Get your music on all major streaming platforms globally
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  Keep Your Rights
                </div>
                <div className="text-gray-600">
                  You own 100% of your music and master recordings
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  Fast Release
                </div>
                <div className="text-gray-600">
                  Your music goes live within 24-48 hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;