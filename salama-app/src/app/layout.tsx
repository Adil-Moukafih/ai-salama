import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SALAMA - Safety Assurance with Live AI Monitoring & Alerts',
  description: 'Advanced railway safety monitoring system powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap" 
          rel="stylesheet"
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        {children}
        <Script 
          src="https://kit.fontawesome.com/0d11f7e939.js" 
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
