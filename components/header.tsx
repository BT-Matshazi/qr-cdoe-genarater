import { QrCode } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

export function Header() {
  return (
    <header className="border-b border-border bg-background backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <QrCode className="h-6 w-6 text-primary" />
          <span className="font-medium text-lg text-foreground">QR Code Generator</span>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}