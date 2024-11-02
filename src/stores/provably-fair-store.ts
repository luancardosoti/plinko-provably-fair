import { create } from 'zustand';
import { parseCookies, setCookie } from 'nookies'
import { createHmac } from 'crypto';

export interface RotateServerSeed {
  newClientSeed: string;
  newServerSeed: string;
  newServerSeedHash: string;
}

interface ProvablyFairStore {
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;

  setClientSeed: (seed: string) => void;
  rotateServerSeed: (data: RotateServerSeed) => void;
  incrementNonce: () => void;
  verifyServerSeed: (revealedSeed: string) => boolean;
}

export const useProvablyFairStore = create<ProvablyFairStore>((set, get) => ({
  serverSeed: getInitialServerSeed(),
  serverSeedHash: hashServerSeed(getInitialServerSeed()),
  clientSeed: generateInitialClientSeed(),
  nonce: 0,

  setClientSeed: (seed: string) => {
    set({ clientSeed: seed });
  },

  rotateServerSeed: ({ newClientSeed, newServerSeed, newServerSeedHash }: RotateServerSeed) => {
    setCookie(null, 'serverSeed', newServerSeed, { path: '/' });
    setCookie(null, 'clientSeed', newClientSeed, { path: '/' });
    
    set({
      clientSeed: newClientSeed,
      serverSeed: newServerSeed,
      serverSeedHash: newServerSeedHash,
      nonce: 0
    });
  },

  incrementNonce: () => {
    set(state => ({ nonce: state.nonce + 1 }));
  },

  verifyServerSeed: (revealedSeed: string) => {
    const hash = hashServerSeed(revealedSeed);
    return hash === get().serverSeedHash;
  }
}));

function getInitialServerSeed() {
  const cookies = parseCookies();
  let serverSeed = cookies.serverSeed;

  if (!serverSeed) {
    serverSeed = generateServerSeed();
    setCookie(null, 'serverSeed', serverSeed, { path: '/' });
  }

  return serverSeed;
}

function generateServerSeed(): string {
  return Array.from(
    { length: 64 },
    () => Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

function hashServerSeed(seed: string): string {
  return createHmac('sha256', 'secret')
    .update(seed)
    .digest('hex');
}

function generateInitialClientSeed(): string {
  const cookies = parseCookies();
  let clientSeed = cookies.clientSeed;

  if (!clientSeed) {
    clientSeed = Math.random().toString(36).substring(2, 15);
    setCookie(null, 'clientSeed', clientSeed, { path: '/' });
  }

  return clientSeed;
}

function generateClientSeed(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function generateRotateServerSeed(): RotateServerSeed {
  const newClientSeed = generateClientSeed();
  const newServerSeed = generateServerSeed();
  const newServerSeedHash = hashServerSeed(newServerSeed);
  return { newClientSeed, newServerSeed, newServerSeedHash };
}