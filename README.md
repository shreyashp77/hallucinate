# hallucinate

tokens per second visualizer.

a terminal-themed tool for seeing what llm token generation speed actually looks like.

stream tokens at configurable speeds (10–1000+ tps) with syntax-highlighted code or plain text, split-screen comparison, latency jitter simulation, and dark/light themes.

## usage

```
npm install
npm run dev
```

press `?` for keyboard shortcuts.

## stack

- react + vite + typescript
- gpt-tokenizer (cl100k_base)
- highlight.js
