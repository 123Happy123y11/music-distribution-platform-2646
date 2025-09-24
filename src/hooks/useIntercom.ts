import { useEffect } from 'react';

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: {
      app_id: string;
      name?: string;
      email?: string;
      created_at?: number;
      user_id?: string;
      [key: string]: any;
    };
  }
}

export const useIntercom = () => {
  useEffect(() => {
    // Initialize Intercom if it's loaded and properly configured
    if (window.Intercom && window.intercomSettings?.app_id && window.intercomSettings.app_id !== 'YOUR_INTERCOM_APP_ID') {
      window.Intercom('boot', window.intercomSettings);
    }
  }, []);

  const updateUser = (userData: {
    name?: string;
    email?: string;
    user_id?: string;
    [key: string]: any;
  }) => {
    if (window.Intercom && window.intercomSettings?.app_id && window.intercomSettings.app_id !== 'YOUR_INTERCOM_APP_ID') {
      window.Intercom('update', userData);
    }
  };

  const showMessenger = () => {
    if (window.Intercom) {
      window.Intercom('show');
    }
  };

  const hideMessenger = () => {
    if (window.Intercom) {
      window.Intercom('hide');
    }
  };

  const showNewMessage = (message?: string) => {
    if (window.Intercom) {
      window.Intercom('showNewMessage', message);
    }
  };

  const trackEvent = (eventName: string, metadata?: any) => {
    if (window.Intercom) {
      window.Intercom('trackEvent', eventName, metadata);
    }
  };

  const shutdown = () => {
    if (window.Intercom && window.intercomSettings?.app_id && window.intercomSettings.app_id !== 'YOUR_INTERCOM_APP_ID') {
      window.Intercom('shutdown');
    }
  };

  return {
    updateUser,
    showMessenger,
    hideMessenger,
    showNewMessage,
    trackEvent,
    shutdown
  };
};