import { useIntercom } from '@/hooks/useIntercom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, ExternalLink } from 'lucide-react';

export const IntercomSetup = () => {
  const { showMessenger, showNewMessage } = useIntercom();

  const isIntercomConfigured = () => {
    return window.intercomSettings && 
           window.intercomSettings.app_id && 
           window.intercomSettings.app_id !== "YOUR_INTERCOM_APP_ID";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Customer Support
        </CardTitle>
        <CardDescription>
          Get help from our support team via Intercom
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isIntercomConfigured() ? (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Intercom Setup Required</p>
                <p className="text-sm">
                  To enable live chat support, you need to configure Intercom:
                </p>
                <ol className="text-sm space-y-1 ml-4 list-decimal">
                  <li>Create an Intercom account at <a href="https://intercom.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">intercom.com <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Get your App ID from Intercom dashboard</li>
                  <li>Replace "YOUR_INTERCOM_APP_ID" in index.html with your actual App ID</li>
                  <li>The chat widget will appear automatically once configured</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            <Button onClick={showMessenger} className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Open Support Chat
            </Button>
            <Button variant="outline" onClick={() => showNewMessage("Hi, I need help with...")} className="w-full">
              Start New Conversation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};