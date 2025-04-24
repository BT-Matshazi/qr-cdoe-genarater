export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} QR Code Generator. All rights reserved.</p>
      </div>
    </footer>
  );
}