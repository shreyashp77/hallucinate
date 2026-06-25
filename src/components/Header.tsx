import { useTheme } from '../hooks/useTheme';
import { CompareToggle } from './CompareToggle';

interface Props {
  compare: boolean;
  onCompareChange: (v: boolean) => void;
  onOpenShortcuts: () => void;
}

export function Header({ compare, onCompareChange, onOpenShortcuts }: Props) {
  const { theme, toggle } = useTheme();

  return (
    <header className="header">
      <div className="header-left">
        <h1>hallucinate</h1>
        <span className="subtitle">tokens per second visualizer</span>
      </div>
      <div className="header-right">
        <CompareToggle enabled={compare} onChange={onCompareChange} />
        <button className="theme-btn" onClick={toggle} title="Toggle theme (T)">
          [{theme === 'light' ? 'light' : 'dark'}]
        </button>
        <button className="shortcuts-btn" onClick={onOpenShortcuts} title="Keyboard shortcuts (?)">
          [ ? ]
        </button>
      </div>
    </header>
  );
}
