import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, Music, DollarSign, Settings, Users, HelpCircle, BookOpen, MessageSquare, ArrowLeft, ExternalLink } from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);

  const toggleArticle = (article: string) => {
    setExpandedArticles(prev => 
      prev.includes(article) 
        ? prev.filter(a => a !== article)
        : [...prev, article]
    );
  };

  const categories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "New to SoundWave? Start here",
      color: "bg-blue-500",
      articles: 12
    },
    {
      title: "Music Distribution",
      icon: Music,
      description: "Upload and distribute your music",
      color: "bg-purple-500",
      articles: 18
    },
    {
      title: "Royalties & Payments",
      icon: DollarSign,
      description: "Understanding earnings and payouts",
      color: "bg-green-500",
      articles: 8
    },
    {
      title: "Account Settings",
      icon: Settings,
      description: "Manage your account and preferences",
      color: "bg-orange-500",
      articles: 6
    },
    {
      title: "Artist Services",
      icon: Users,
      description: "Promotional tools and artist support",
      color: "bg-pink-500",
      articles: 10
    },
    {
      title: "Technical Support",
      icon: HelpCircle,
      description: "Troubleshooting and technical help",
      color: "bg-red-500",
      articles: 15
    }
  ];

  const faqs = [
    {
      category: "General",
      question: "How long does it take for my music to appear on streaming platforms?",
      answer: "Your music typically appears on major streaming platforms within 24-48 hours after approval. Some platforms like Spotify and Apple Music usually process releases faster, while others may take up to 72 hours during peak periods."
    },
    {
      category: "Distribution",
      question: "Which streaming platforms do you distribute to?",
      answer: "We distribute to 150+ platforms worldwide including Spotify, Apple Music, Amazon Music, YouTube Music, Deezer, Tidal, TikTok, Instagram, Facebook, and many regional platforms across different countries."
    },
    {
      category: "Royalties",
      question: "When and how do I get paid?",
      answer: "Royalty payments are processed monthly, typically by the 15th of each month for the previous month's earnings. Payments are made via PayPal, bank transfer, or check (minimum $50 threshold applies)."
    },
    {
      category: "Distribution",
      question: "Can I distribute cover songs?",
      answer: "Yes, but you need to obtain a mechanical license first. We partner with services like Loudr and Easy Song Licensing to help you secure the proper rights before distribution."
    },
    {
      category: "General",
      question: "Do I keep the rights to my music?",
      answer: "Absolutely! You retain 100% ownership of your master recordings and publishing rights. SoundWave is a distribution service - we never claim ownership of your music."
    },
    {
      category: "Royalties",
      question: "What percentage of royalties do I keep?",
      answer: "Free plan users keep 85% of royalties, while paid plan subscribers keep 100% of their streaming and download royalties. There are no hidden fees or additional charges."
    },
    {
      category: "Technical",
      question: "What audio format should I upload?",
      answer: "We recommend uploading high-quality WAV files (44.1kHz/16-bit minimum) or FLAC files. MP3 files are accepted but may result in quality loss during processing."
    },
    {
      category: "Technical",
      question: "What are the artwork requirements?",
      answer: "Album artwork must be exactly 3000x3000 pixels, in RGB color mode, and saved as JPG or PNG. The image should be high quality with no pixelation or blurriness."
    }
  ];

  const popularArticles = [
    "How to optimize your music for streaming platforms",
    "Understanding streaming royalties and how they work",
    "Best practices for album artwork and metadata",
    "How to pitch your music to Spotify playlists",
    "Setting up pre-release campaigns",
    "Managing multiple artist profiles"
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/support">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Help Center
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find answers to your questions and learn how to make the most of SoundWave
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help articles, guides, and FAQs..."
              className="pl-12 py-4 text-lg bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                  onClick={() => setSelectedCategory(selectedCategory === category.title ? null : category.title)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center transition-all ${selectedCategory === category.title ? 'scale-110' : ''}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="secondary">{category.articles} articles</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {category.description}
                    </CardDescription>
                    {selectedCategory === category.title && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-purple-600 font-medium">
                          Click to explore {category.articles} articles in this category
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {popularArticles.map((article, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-all cursor-pointer hover:scale-102"
                onClick={() => toggleArticle(article)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700 hover:text-purple-600 transition-colors">
                        {article}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  {expandedArticles.includes(article) && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        This article provides comprehensive information about {article.toLowerCase()}. 
                        Click to read the full guide with step-by-step instructions and best practices.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // In a real app, this would navigate to the article
                        }}
                      >
                        Read Full Article
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-1">
                      {faq.category}
                    </Badge>
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still Need Help */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-8">
              <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still need help?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help you succeed.
              </p>
              <Link to="/support">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;