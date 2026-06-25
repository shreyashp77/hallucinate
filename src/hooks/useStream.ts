import { useState, useRef, useCallback, useEffect } from 'react';
import { decode } from 'gpt-tokenizer';
import { codeSnippets } from '../content/codeSnippets';
import { textParagraphs } from '../content/textParagraphs';
import { tokenize, type TokenizedContent } from '../utils/tokenizer';
import { calcDelay } from '../utils/jitter';

export type StreamMode = 'code' | 'text';
export type StreamStatus = 'idle' | 'streaming' | 'paused' | 'done';

export interface StreamState {
  status: StreamStatus;
  accumulatedText: string;
  currentIndex: number;
  totalTokens: number;
  elapsedMs: number;
  actualTps: number;
  language: string;
}

export interface ContentInput {
  text: string;
  language: string;
}

export function generateContent(mode: StreamMode, minTokens: number): ContentInput {
  if (mode === 'code') {
    const shuffled = [...codeSnippets].sort(() => Math.random() - 0.5);
    let accumulated = 0;
    const picks: string[] = [];
    let lang = 'text';
    for (const item of shuffled) {
      picks.push(item.code);
      lang = item.language;
      accumulated += tokenize(item.code).ids.length;
      if (accumulated >= minTokens) break;
    }
    return { text: picks.join('\n\n'), language: lang };
  }

  const shuffled = [...textParagraphs].sort(() => Math.random() - 0.5);
  let accumulated = 0;
  const picks: string[] = [];
  for (const item of shuffled) {
    picks.push(item);
    accumulated += tokenize(item).ids.length;
    if (accumulated >= minTokens) break;
  }
  return { text: picks.join('\n\n'), language: 'text' };
}

export function useStream() {
  const [state, setState] = useState<StreamState>({
    status: 'idle',
    accumulatedText: '',
    currentIndex: 0,
    totalTokens: 0,
    elapsedMs: 0,
    actualTps: 0,
    language: '',
  });

  const tokenizedRef = useRef<TokenizedContent | null>(null);
  const tpsRef = useRef(50);
  const jitterRef = useRef(false);
  const startTimeRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const indexRef = useRef(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const tok = tokenizedRef.current;
    if (!tok) return;

    const nextIdx = indexRef.current + 1;

    if (nextIdx >= tok.ids.length) {
      const full = decode(tok.ids);
      setState(s => ({
        ...s,
        status: 'done',
        accumulatedText: full,
        currentIndex: tok.ids.length,
      }));
      stopTimer();
      return;
    }

    indexRef.current = nextIdx;
    const partial = decode(tok.ids.slice(0, nextIdx));
    setState(s => ({
      ...s,
      status: 'streaming',
      accumulatedText: partial,
      currentIndex: nextIdx,
    }));

    const delay = calcDelay(1000 / tpsRef.current, jitterRef.current);
    timerRef.current = window.setTimeout(tick, delay);
  }, [stopTimer]);

  useEffect(() => {
    if (state.status !== 'streaming' && state.status !== 'paused') return;
    const interval = setInterval(() => {
      setState(s => {
        if (s.status !== 'streaming') return s;
        const elapsed = Date.now() - startTimeRef.current;
        const actual = elapsed > 0 ? (s.currentIndex / elapsed) * 1000 : 0;
        return { ...s, elapsedMs: elapsed, actualTps: Math.round(actual * 10) / 10 };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [state.status]);

  const start = useCallback((
    tps: number,
    mode: StreamMode,
    jitter: boolean,
    presetContent?: ContentInput,
  ) => {
    stopTimer();
    tpsRef.current = tps;
    jitterRef.current = jitter;

    let content: string;
    let lang: string;

    if (presetContent) {
      content = presetContent.text;
      lang = presetContent.language;
    } else {
      const minTokens = Math.max(tps * 5, 200);
      const gen = generateContent(mode, minTokens);
      content = gen.text;
      lang = gen.language;
    }

    const tok = tokenize(content);
    tokenizedRef.current = tok;
    indexRef.current = 0;
    startTimeRef.current = Date.now();

    setState({
      status: 'streaming',
      accumulatedText: '',
      currentIndex: 0,
      totalTokens: tok.ids.length,
      elapsedMs: 0,
      actualTps: 0,
      language: lang,
    });

    const delay = calcDelay(1000 / tps, jitter);
    timerRef.current = window.setTimeout(tick, delay);
  }, [stopTimer, tick]);

  const pause = useCallback(() => {
    stopTimer();
    setState(s => (s.status === 'streaming' ? { ...s, status: 'paused' } : s));
  }, [stopTimer]);

  const resume = useCallback(() => {
    setState(s => {
      if (s.status !== 'paused') return s;
      const delay = calcDelay(1000 / tpsRef.current, jitterRef.current);
      timerRef.current = window.setTimeout(tick, delay);
      startTimeRef.current = Date.now() - s.elapsedMs;
      return { ...s, status: 'streaming' };
    });
  }, [tick]);

  const stop = useCallback(() => {
    stopTimer();
    setState({
      status: 'idle',
      accumulatedText: '',
      currentIndex: 0,
      totalTokens: 0,
      elapsedMs: 0,
      actualTps: 0,
      language: '',
    });
    tokenizedRef.current = null;
    indexRef.current = 0;
  }, [stopTimer]);

  return { state, start, pause, resume, stop };
}
