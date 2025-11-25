import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

const App = () => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // Update direction and language on change
    const updateDirection = () => {
      const isRTL = i18n.language === 'ar';
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = i18n.language;
      
      // Force re-render of body to apply direction changes
      document.body.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      // Set localized document title
      try {
        const title = t('app.title');
        if (title) document.title = title;
      } catch (e) {
        // ignore if translation not available yet
      }
    };

    // Set initial direction
    updateDirection();

    // Listen for language changes
    i18n.on('languageChanged', updateDirection);

    return () => {
      i18n.off('languageChanged', updateDirection);
    };
  }, [i18n]);

  return (
    <AppRouter />
  );
};

export default App;