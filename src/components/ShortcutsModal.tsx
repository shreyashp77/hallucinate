import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>// keyboard shortcuts</h2>
        <table className="shortcuts-table">
          <tbody>
            <tr><td><kbd>Space</kbd></td><td>Pause / Resume streaming</td></tr>
            <tr><td><kbd>C</kbd></td><td>Toggle compare mode</td></tr>
            <tr><td><kbd>T</kbd></td><td>Toggle dark / light theme</td></tr>
            <tr><td><kbd>?</kbd></td><td>Show this shortcuts modal</td></tr>
            <tr><td><kbd>Esc</kbd></td><td>Close this modal</td></tr>
          </tbody>
        </table>
        <button className="ctrl-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
