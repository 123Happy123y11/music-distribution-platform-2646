import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MessageSquare, Clock, HelpCircle, Bug, DollarSign, Music, Settings, ArrowLeft, CheckCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Support = () => {
  // Get user data safely
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext?.user || null;
  } catch (error) {
    console.log('Auth context not available, using guest mode');
  }

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    category: "",
    subject: "",
    message: "",
    priority: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const supportCategories = [
    {
      value: "technical",
      label: "Technical Issue",
      icon: Bug,
      description: "Upload problems, app bugs, or technical difficulties"
    },
    {
      value: "distribution",
      label: "Distribution",
      icon: Music,
      description: "Questions about music distribution and platform availability"
    },
    {
      value: "royalties",
      label: "Royalties & Payments",
      icon: DollarSign,
      description: "Payment issues, royalty questions, or financial inquiries"
    },
    {
      value: "account",
      label: "Account Settings",
      icon: Settings,
      description: "Profile management, subscription, or account-related issues"
    },
    {
      value: "general",
      label: "General Question",
      icon: HelpCircle,
      description: "General inquiries about SoundWave services"
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@soundwave.com",
      responseTime: "Within 24 hours"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 24/7",
      responseTime: "Immediate response"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Talk to a support specialist",
      contact: "+1 (555) 123-4567",
      responseTime: "Mon-Fri, 9AM-6PM EST"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.category || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success
    toast({
      title: "Support ticket created!",
      description: "We've received your message and will respond within 24 hours. Ticket ID: #" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    });

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after showing success
    setTimeout(() => {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        category: "",
        subject: "",
        message: "",
        priority: "normal"
      });
      setSubmitted(false);
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
              <Link to="/help">
                <Button variant="outline">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Support Center
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Need help? We're here to support you every step of the way. Get in touch with our team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Contact Methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {method.description}
                    </p>
                    <p className="font-semibold text-blue-600 mb-2 hover:text-blue-700 transition-colors">
                      {method.contact}
                    </p>
                    <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      {method.responseTime}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        if (method.icon === Mail) {
                          window.location.href = `mailto:${method.contact}`;
                        } else if (method.icon === Phone) {
                          window.location.href = `tel:${method.contact}`;
                        } else {
                          toast({
                            title: "Live Chat",
                            description: "Live chat feature coming soon!",
                          });
                        }
                      }}
                    >
                      {method.icon === Mail ? "Send Email" : method.icon === Phone ? "Call Now" : "Start Chat"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  {submitted && <CheckCircle className="w-6 h-6 text-green-500 mr-2" />}
                  {submitted ? "Message Sent!" : "Send us a Message"}
                </CardTitle>
                <CardDescription>
                  {submitted 
                    ? "Thank you for contacting us. We'll respond within 24 hours."
                    : "Fill out the form below and we'll get back to you as soon as possible."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your support ticket has been created
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We've received your message and our support team will respond within 24 hours.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link to="/help">
                        <Button variant="outline">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Browse Help Center
                        </Button>
                      </Link>
                      <Link to="/dashboard">
                        <Button>
                          Return to Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleInputChange("priority", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief description of your issue"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide as much detail as possible about your issue or question..."
                      className="min-h-32"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Support Categories & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Categories</CardTitle>
                <CardDescription>
                  Choose the category that best describes your inquiry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportCategories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {category.label}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Before contacting support:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Check our Help Center for quick answers</li>
                  <li>• Make sure you're using the latest version</li>
                  <li>• Include relevant details like error messages</li>
                  <li>• Provide your account email for faster assistance</li>
                </ul>
                <Button 
                  variant="outline" 
                  className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Visit Help Center
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;