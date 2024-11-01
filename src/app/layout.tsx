import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pigmo',
  description: 'Um jogo de Plinko com sistema provably fair',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={`dark bg-primary-900`}>
        <div className="min-h-screen">
          <header className="border-b border-gray-800 p-4">
            <div className="container mx-auto">
              {/* <Image src="/pigmo.svg" alt="Pigmo" width={100} height={26} /> */}
              <h1 className="text-3xl font-bold tracking-widest text-primary-500">Plinko</h1>
            </div>
          </header>
          
          <main className="container mx-auto py-8">
            {children}
          </main>

          <footer className="border-t border-gray-800 p-4 mt-8">
            <div className="container mx-auto text-center text-gray-500">
              <p>Provably Fair - Todos os resultados são verificáveis</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 