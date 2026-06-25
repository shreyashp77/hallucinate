import { encode, decode } from 'gpt-tokenizer';

export interface TokenizedContent {
  ids: number[];
  tokens: string[];
}

export function tokenize(text: string): TokenizedContent {
  const ids = encode(text);
  const tokens = ids.map(id => decode([id]));
  return { ids, tokens };
}
