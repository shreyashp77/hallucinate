import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import type { StreamStatus } from '../hooks/useStream';

interface Props {
  text: string;
  status: StreamStatus;
  mode: 'code' | 'text';
  language: string;
}

export function StreamOutput({ text, status, mode, language }: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolledAway = useRef(false);
  const isStreaming = status === 'streaming';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      scrolledAway.current = el.scrollHeight - el.scrollTop - el.clientHeight > 30;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (preRef.current && mode === 'code' && language && language !== 'text') {
      const result = hljs.highlight(text, { language, ignoreIllegals: true });
      preRef.current.innerHTML = result.value;
    }
  }, [text, mode, language]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || scrolledAway.current) return;
    el.scrollTop = el.scrollHeight;
  });

  return (
    <div className="term-window">
      <div className="term-titlebar">
        <div className="term-dots">
          <span className="term-dot close" />
          <span className="term-dot minimize" />
          <span className="term-dot maximize" />
        </div>
        <span className="term-filename">
          {mode === 'code' ? `main.${language || 'txt'}` : 'output.txt'}
        </span>
      </div>
      {mode === 'code' ? (
        <div ref={containerRef} className="stream-output code-mode">
          <pre ref={preRef}><code>{text}</code></pre>
          {isStreaming && <span className="cursor" />}
        </div>
      ) : (
        <div ref={containerRef} className="stream-output text-mode">
          <p>
            {text}
            {isStreaming && <span className="cursor" />}
          </p>
        </div>
      )}
    </div>
  );
}
