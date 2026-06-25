import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { StreamPanel } from './components/StreamPanel';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';
import { emit } from './utils/streamBus';
import './App.css';

function AppInner() {
  const [compare, setCompare] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { toggle: toggleTheme } = useTheme();

  const handler = useCallback((e: KeyboardEvent) => {
    if (e.key === 'c' || e.key === 'C') setCompare(v => !v);
    if (e.key === 't' || e.key === 'T') toggleTheme();
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      emit('togglePause');
    }
    if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      setShowShortcuts(v => !v);
    }
  }, [toggleTheme]);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);

  return (
    <div className="app">
      <Header
        compare={compare}
        onCompareChange={setCompare}
        onOpenShortcuts={() => setShowShortcuts(true)}
      />
      <main className={`main ${compare ? 'split' : ''}`}>
        <StreamPanel label={compare ? 'Left' : undefined} />
        {compare && <StreamPanel label="Right" />}
      </main>
      <footer className="footer">
        <span>Keyboard: <kbd>Space</kbd> pause · <kbd>C</kbd> compare · <kbd>T</kbd> theme · <kbd>?</kbd> shortcuts</span>
      </footer>
      <ShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
