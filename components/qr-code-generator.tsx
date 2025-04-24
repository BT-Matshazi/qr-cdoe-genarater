"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCodeSettings } from "./qr-code-settings";
import { RecentQRCodes } from "./recent-qr-codes";
import {
  Loader2,
  Download,
  Copy,
  RefreshCw,
  Link as LinkIcon,
} from "lucide-react";

export function QRCodeGenerator() {
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [qrSize, setQrSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [includeMargin, setIncludeMargin] = useState(true);

  const qrRef = useRef<HTMLDivElement>(null);

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (_) {
      return false;
    }
  };

  const generateQRCode = () => {
    if (!url) {
      toast({
        title: "URL is required",
        description: "Please enter a URL to generate a QR code",
        variant: "destructive",
      });
      setIsError(true);
      return;
    }

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

    if (!isValidUrl(formattedUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      setIsError(true);
      return;
    }

    setIsError(false);
    setIsGenerating(true);

    // Simulate a short delay for better UX
    setTimeout(() => {
      setQrUrl(formattedUrl);

      // Add to recent QR codes if not already in the list
      if (!recentUrls.includes(formattedUrl)) {
        setRecentUrls((prev) => [formattedUrl, ...prev].slice(0, 5));
      }

      setIsGenerating(false);
    }, 600);
  };

  const handleDownload = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.download = `qrcode-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been downloaded successfully",
    });
  };

  const copyToClipboard = async () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);

        toast({
          title: "Copied to clipboard",
          description: "QR code image copied to clipboard",
        });
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Your browser doesn't support clipboard API",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setUrl("");
    setQrUrl("");
    setIsError(false);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          QR Code Generator
        </CardTitle>
        <CardDescription className="text-center">
          Enter a URL to generate a QR code that you can download
        </CardDescription>
      </CardHeader>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid grid-cols-2 mx-6">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="history">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                Enter URL
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={isError ? "border-destructive" : ""}
                  onKeyDown={(e) => e.key === "Enter" && generateQRCode()}
                />
                <Button onClick={generateQRCode} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </div>

            <QRCodeSettings
              qrSize={qrSize}
              setQrSize={setQrSize}
              fgColor={fgColor}
              setFgColor={setFgColor}
              bgColor={bgColor}
              setBgColor={setBgColor}
              includeMargin={includeMargin}
              setIncludeMargin={setIncludeMargin}
            />

            <div className="flex justify-center" ref={qrRef}>
              <AnimatePresence mode="wait">
                {qrUrl ? (
                  <motion.div
                    key="qrcode"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="border border-border rounded-lg p-6 bg-card"
                  >
                    <QRCodeCanvas
                      value={qrUrl}
                      size={qrSize}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level="H"
                      includeMargin={includeMargin}
                      className="mx-auto"
                      imageSettings={{
                        src: "",
                        x: 0,
                        y: 0,
                        height: 0,
                        width: 0,
                        excavate: true,
                      }}
                      style={{ shapeRendering: "geometricPrecision" }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-64 h-64 border border-dashed border-border rounded-lg flex items-center justify-center"
                  >
                    <div className="text-center text-muted-foreground">
                      <LinkIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>Enter a URL and click Generate</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center space-x-2 pt-0">
            <Button variant="outline" onClick={resetForm} disabled={!qrUrl}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={copyToClipboard}
              disabled={!qrUrl}
              variant="secondary"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button onClick={handleDownload} disabled={!qrUrl}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value="history">
          <RecentQRCodes
            recentUrls={recentUrls}
            setUrl={setUrl}
            generateQRCode={generateQRCode}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
