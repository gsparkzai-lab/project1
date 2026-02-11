// Premium Color Theme for CoachKeith App
export const theme = {
  // Primary Brand Colors
  primary: {
    start: '#6366f1', // Indigo 500
    end: '#8b5cf6',   // Violet 500
    solid: '#7c3aed', // Violet 600
    light: '#eff6ff',
    dark: '#4338ca',
  },

  // Secondary Accents
  secondary: {
    teal: '#14b8a6',
    pink: '#ec4899',
    orange: '#f97316',
    blue: '#3b82f6',
  },

  // Functional Colors
  functional: {
    success: '#10b981',
    successBg: '#d1fae5',
    warning: '#f59e0b',
    warningBg: '#fef3c7',
    error: '#ef4444',
    errorBg: '#fee2e2',
    info: '#0ea5e9',
    infoBg: '#e0f2fe',
  },

  // UI Neutrals (Expanded Gray Scale)
  neutral: {
    white: '#ffffff',
    bg: '#f8fafc',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
  },

  // Rich Gradients
  gradients: {
    primary: ['#6366f1', '#a855f7'] as const,
    secondary: ['#3b82f6', '#06b6d4'] as const,
    success: ['#10b981', '#34d399'] as const,
    royal: ['#7c3aed', '#db2777'] as const,
  },

  // Cards & Visuals
  shadows: {
    sm: { shadowColor: '#64748b', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    md: { shadowColor: '#64748b', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
    lg: { shadowColor: '#4f46e5', shadowOpacity: 0.15, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 12 },
    glow: { shadowColor: '#6366f1', shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 0 }, elevation: 10 },
  },
};
