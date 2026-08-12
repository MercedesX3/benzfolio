'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';

const DarkModeContext = createContext(null);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

const THEME_EVENT = 'themechange';

/**
 * The <html> element is the single source of truth for the theme.
 *
 * A blocking script in layout.js sets the `dark-mode` class before first
 * paint, so dark-mode visitors never see the light palette flash. React then
 * *subscribes* to that class rather than deciding the theme a second time in
 * an effect — which is both what useSyncExternalStore is for and what keeps
 * server and client renders consistent.
 */
function subscribe(onChange) {
  window.addEventListener(THEME_EVENT, onChange);
  // Keep other tabs in step.
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

const getSnapshot = () => document.documentElement.classList.contains('dark-mode');

// The server can't know the visitor's preference; the pre-paint script fixes
// this up before anything is shown.
const getServerSnapshot = () => false;

export const DarkModeProvider = ({ children }) => {
  const isDarkMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleDarkMode = useCallback(() => {
    const next = !document.documentElement.classList.contains('dark-mode');
    document.documentElement.classList.toggle('dark-mode', next);

    try {
      localStorage.setItem('darkMode', JSON.stringify(next));
    } catch {
      // Private mode / storage disabled — the toggle still works for this session.
    }

    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const value = useMemo(
    () => ({ isDarkMode, toggleDarkMode }),
    [isDarkMode, toggleDarkMode]
  );

  return (
    <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>
  );
};
