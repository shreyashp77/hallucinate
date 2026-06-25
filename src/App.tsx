import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { StreamPanel, type StreamPanelHandle } from './components/StreamPanel';
import { ModeSelector } from './components/ModeSelector';
import { StreamControls } from './components/StreamControls';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';
import { generateContent, type StreamMode, type StreamStatus } from './hooks/useStream';
import { emit } from './utils/streamBus';
import './App.css';

function combineStatus(a: StreamStatus, b: StreamStatus): StreamStatus {
  if (a === 'streaming' || b === 'streaming') return 'streaming';
  if (a === 'paused' || b === 'paused') return 'paused';
  if (a === 'done' && b === 'done') return 'done';
  return 'idle';
}

function AppInner() {
  const [compare, setCompare] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { toggle: toggleTheme } = useTheme();

  // split mode shared state
  const [splitMode, setSplitMode] = useState<StreamMode>('text');
  const [p1Status, setP1Status] = useState<StreamStatus>('idle');
  const [p2Status, setP2Status] = useState<StreamStatus>('idle');
  const panel1Ref = useRef<StreamPanelHandle>(null);
  const panel2Ref = useRef<StreamPanelHandle>(null);

  const splitBusy = p1Status === 'streaming' || p1Status === 'paused' || p2Status === 'streaming' || p2Status === 'paused';

  const handler = useCallback((e: KeyboardEvent) => {
    if (e.key === 'c' || e.key === 'C') setCompare(v => !v);
    if (e.key === 't' || e.key === 'T') toggleTheme();
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      if (compare) {
        if (p1Status === 'streaming' || p2Status === 'streaming') {
          panel1Ref.current?.pause();
          panel2Ref.current?.pause();
        } else if (p1Status === 'paused' || p2Status === 'paused') {
          panel1Ref.current?.resume();
          panel2Ref.current?.resume();
        }
      } else {
        emit('togglePause');
      }
    }
    if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      setShowShortcuts(v => !v);
    }
  }, [toggleTheme, compare, p1Status, p2Status]);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);

  const handleSplitStart = useCallback(() => {
    const tps1 = panel1Ref.current?.getTps() ?? 50;
    const tps2 = panel2Ref.current?.getTps() ?? 50;
    const content = generateContent(splitMode, Math.max(tps1, tps2) * 5);
    panel1Ref.current?.start(tps1, splitMode, false, content);
    panel2Ref.current?.start(tps2, splitMode, false, content);
  }, [splitMode]);

  const handleSplitPause = useCallback(() => {
    panel1Ref.current?.pause();
    panel2Ref.current?.pause();
  }, []);

  const handleSplitResume = useCallback(() => {
    panel1Ref.current?.resume();
    panel2Ref.current?.resume();
  }, []);

  const handleSplitStop = useCallback(() => {
    panel1Ref.current?.stop();
    panel2Ref.current?.stop();
  }, []);

  const splitStatus = combineStatus(p1Status, p2Status);

  return (
    <div className="app">
      <Header
        compare={compare}
        onCompareChange={setCompare}
        onOpenShortcuts={() => setShowShortcuts(true)}
      />
      {compare && (
        <div className="panel-controls" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
          <ModeSelector mode={splitMode} onChange={setSplitMode} disabled={splitBusy} />
          <StreamControls
            status={splitStatus}
            onStart={handleSplitStart}
            onPause={handleSplitPause}
            onResume={handleSplitResume}
            onStop={handleSplitStop}
          />
        </div>
      )}
      <main className={`main ${compare ? 'split' : ''}`}>
        <StreamPanel
          ref={panel1Ref}
          label={compare ? 'Left' : undefined}
          showControls={!compare}
          onStatusChange={setP1Status}
        />
        {compare && (
          <StreamPanel
            ref={panel2Ref}
            label="Right"
            showControls={false}
            onStatusChange={setP2Status}
          />
        )}
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
