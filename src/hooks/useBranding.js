import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kousa_branding';

const defaultBranding = {
  logoUrl: null,          // base64 or URL of logo image
  logoText: 'KOUSA',     // fallback text
  logoSubtext: 'LUXURY', // fallback subtext
  tagline: 'Auto Import & Care',
  bgType: 'color',        // 'color' | 'gradient' | 'image'
  bgColor: '#f1f5f9',     // used for 'color' mode
  bgGradient: 'from-slate-100 to-slate-200', // used for 'gradient' mode
  bgImageUrl: null,        // base64 or URL for background image
  sidebarColor: '#0a0f1e', // sidebar background color
  accentColor: '#c0111f',  // main accent color (luxury red)
};

export const useBranding = () => {
  const [branding, setBranding] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultBranding, ...JSON.parse(stored) } : defaultBranding;
    } catch {
      return defaultBranding;
    }
  });

  const updateBranding = (updates) => {
    setBranding(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        console.warn('Could not save branding settings');
      }
      return next;
    });
  };

  const resetBranding = () => {
    setBranding(defaultBranding);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleLogoUpload = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target.result;
        updateBranding({ logoUrl });
        resolve(logoUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBgImageUpload = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const bgImageUrl = e.target.result;
        updateBranding({ bgImageUrl, bgType: 'image' });
        resolve(bgImageUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  return {
    branding,
    updateBranding,
    resetBranding,
    handleLogoUpload,
    handleBgImageUpload,
  };
};
