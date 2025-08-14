import { QRCodeGenerator } from "@/components/qr-code-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">QR Code Generator</h1>
            <p className="text-muted-foreground">Create custom QR codes with your logo in the center</p>
          </div>
          <QRCodeGenerator />
        </div>
      </div>
    </main>
  )
}