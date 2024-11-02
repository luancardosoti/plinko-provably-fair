import { createHmac } from 'crypto';

interface ByteGeneratorParams {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  cursor: number;
}

export function* byteGenerator({ serverSeed, clientSeed, nonce, cursor }: ByteGeneratorParams) {
  let currentRound = Math.floor(cursor / 32);
  let currentRoundCursor = cursor - (currentRound * 32);

  while (true) {
    const hmac = createHmac('sha256', serverSeed);
    hmac.update(`${clientSeed}:${nonce}:${currentRound}`);
    const buffer = hmac.digest();

    while (currentRoundCursor < 32) {
      yield Number(buffer[currentRoundCursor]);
      currentRoundCursor += 1;
    }
    currentRoundCursor = 0;
    currentRound += 1;
  }
}

export function generateFloats({ 
  serverSeed, 
  clientSeed, 
  nonce, 
  cursor, 
  count 
}: {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  cursor: number;
  count: number;
}) {
  const rng = byteGenerator({ serverSeed, clientSeed, nonce, cursor });
  const bytes: number[] = [];

  while (bytes.length < count * 4) {
    const next = rng.next();
    if (!next.done) {
      bytes.push(next.value);
    }
  }

  return Array.from({ length: Math.floor(bytes.length / 4) }, (_, i) => {
    const chunk = bytes.slice(i * 4, (i + 1) * 4);
    return chunk.reduce((result, value, index) => {
      return result + value / Math.pow(256, index + 1);
    }, 0);
  });
} 