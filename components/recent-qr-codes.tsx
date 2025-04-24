"use client";

import { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface RecentQRCodesProps {
  recentUrls: string[];
  setUrl: Dispatch<SetStateAction<string>>;
  generateQRCode: () => void;
}

export function RecentQRCodes({ recentUrls, setUrl, generateQRCode }: RecentQRCodesProps) {
  const handleSelect = (url: string) => {
    setUrl(url);
    generateQRCode();
  };

  return (
    <CardContent className="pt-6">
      {recentUrls.length > 0 ? (
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {recentUrls.map((url, index) => (
            <motion.div
              key={`${url}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card 
                className="p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleSelect(url)}
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <Link className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate">{url}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <RefreshCw className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
          <CardDescription>No recent QR codes</CardDescription>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a QR code to see it here
          </p>
        </div>
      )}
    </CardContent>
  );
}