import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, DollarSign, BarChart, Clock, Shield, Headphones } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Globe,
      title: "Global Distribution",
      description: "Get your music on Spotify, Apple Music, Amazon Music, YouTube Music, and 150+ other platforms worldwide."
    },
    {
      icon: DollarSign,
      title: "Keep 100% Rights",
      description: "You own your music and keep all your rights. We never take ownership of your creative work."
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Track your performance with detailed analytics showing streams, revenue, and audience insights."
    },
    {
      icon: Clock,
      title: "Fast Release",
      description: "Your music goes live on all platforms within 24-48 hours. No waiting weeks for distribution."
    },
    {
      icon: Shield,
      title: "Copyright Protection",
      description: "We help protect your music with content ID systems and copyright management tools."
    },
    {
      icon: Headphones,
      title: "Artist Support",
      description: "Get 24/7 support from our team of music industry professionals whenever you need help."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Succeed as an Artist
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the tools and services you need to distribute, 
            promote, and monetize your music across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;