import { Metadata } from 'next';
import { QRCodeGenerator } from '@/components/qr-code-generator';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Generate and download QR codes for any URL',
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <QRCodeGenerator />
      </div>
      <Footer />
    </main>
  );
}