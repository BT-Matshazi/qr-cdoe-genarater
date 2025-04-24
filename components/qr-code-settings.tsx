"use client";

import { Dispatch, SetStateAction } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface QRCodeSettingsProps {
  qrSize: number;
  setQrSize: Dispatch<SetStateAction<number>>;
  fgColor: string;
  setFgColor: Dispatch<SetStateAction<string>>;
  bgColor: string;
  setBgColor: Dispatch<SetStateAction<string>>;
  includeMargin: boolean;
  setIncludeMargin: Dispatch<SetStateAction<boolean>>;
}

export function QRCodeSettings({
  qrSize,
  setQrSize,
  fgColor,
  setFgColor,
  bgColor,
  setBgColor,
  includeMargin,
  setIncludeMargin,
}: QRCodeSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border rounded-md overflow-hidden"
    >
      <div className="flex items-center px-4 py-3 bg-secondary/30">
        <Settings2 className="h-4 w-4 mr-2 text-muted-foreground" />
        <h4 className="text-sm font-medium flex-1">Customization Options</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="p-4 space-y-4 border-t">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="qr-size" className="text-sm">QR Code Size: {qrSize}px</Label>
          </div>
          <Slider
            id="qr-size"
            min={128}
            max={512}
            step={16}
            value={[qrSize]}
            onValueChange={(value) => setQrSize(value[0])}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fg-color" className="text-sm">Foreground Color</Label>
            <div className="flex space-x-2">
              <div 
                className="w-8 h-8 rounded border" 
                style={{ backgroundColor: fgColor }}
              />
              <Input
                id="fg-color"
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bg-color" className="text-sm">Background Color</Label>
            <div className="flex space-x-2">
              <div 
                className="w-8 h-8 rounded border" 
                style={{ backgroundColor: bgColor }}
              />
              <Input
                id="bg-color"
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="margin"
            checked={includeMargin}
            onCheckedChange={setIncludeMargin}
          />
          <Label htmlFor="margin" className="text-sm">Include margin around QR code</Label>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}