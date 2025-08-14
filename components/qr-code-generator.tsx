"use client"

import type React from "react"

// Define QRCode types to avoid 'any'
type QRCodeModules = {
    size: number;
    get: (row: number, col: number) => boolean | number;
};

type QRCodeType = {
    modules: QRCodeModules;
};

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Download, QrCode } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

type PatternType =
    | "square"
    | "rounded"
    | "circle"
    | "diamond"
    | "dots"
    | "hexagon"
    | "star"
    | "cross"
    | "plus"
    | "fluid"

export function QRCodeGenerator() {
    const [text, setText] = useState("")
    const [logo, setLogo] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [pattern, setPattern] = useState<PatternType>("square")
    const [dotColor, setDotColor] = useState("#000000")
    const [transparentBackground, setTransparentBackground] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)


    const handleLogoUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file) {
                if (!file.type.startsWith("image/")) {
                    toast.error("Invalid file type", {
                        description: "Please upload an image file (PNG, JPG, etc.)"
                    })
                    return
                }

                setLogo(file)
                const reader = new FileReader()
                reader.onload = (e) => {
                    setLogoPreview(e.target?.result as string)
                }
                reader.readAsDataURL(file)
            }
        },
        [],
    )

    const drawCustomQRCode = useCallback(
        (canvas: HTMLCanvasElement, qrData: QRCodeType, pattern: PatternType, color: string) => {
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            const size = canvas.width
            const margin = 96
            const qrSize = size - margin * 2
            const moduleCount = qrData.modules.size
            const moduleSize = qrSize / moduleCount

            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"

            // Clear canvas with transparent or white background
            if (transparentBackground) {
                ctx.clearRect(0, 0, size, size)
            } else {
                ctx.fillStyle = "#FFFFFF"
                ctx.fillRect(0, 0, size, size)
            }

            ctx.fillStyle = color

            if (pattern === "fluid") {
                // Create a map of active modules for fluid pattern
                const activeModules = new Set<string>()
                for (let row = 0; row < moduleCount; row++) {
                    for (let col = 0; col < moduleCount; col++) {
                        if (qrData.modules.get(row, col)) {
                            const centerX = moduleCount / 2
                            const centerY = moduleCount / 2
                            const logoRadius = moduleCount * 0.2
                            const distance = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2)

                            if (distance >= logoRadius) {
                                activeModules.add(`${row},${col}`)
                            }
                        }
                    }
                }

                // Draw fluid connections
                ctx.beginPath()
                for (let row = 0; row < moduleCount; row++) {
                    for (let col = 0; col < moduleCount; col++) {
                        if (activeModules.has(`${row},${col}`)) {
                            const x = margin + col * moduleSize + moduleSize / 2
                            const y = margin + row * moduleSize + moduleSize / 2

                            // Check for adjacent modules and create flowing connections
                            const hasRight = activeModules.has(`${row},${col + 1}`)
                            const hasDown = activeModules.has(`${row + 1},${col}`)
                            // These variables are used for future enhancements
                            // const hasLeft = activeModules.has(`${row},${col - 1}`)
                            // const hasUp = activeModules.has(`${row - 1},${col}`)

                            // Draw rounded rectangle for the module
                            ctx.roundRect(
                                x - moduleSize * 0.4,
                                y - moduleSize * 0.4,
                                moduleSize * 0.8,
                                moduleSize * 0.8,
                                moduleSize * 0.2,
                            )

                            // Add connecting bridges to adjacent modules
                            if (hasRight) {
                                ctx.roundRect(
                                    x + moduleSize * 0.2,
                                    y - moduleSize * 0.15,
                                    moduleSize * 0.6,
                                    moduleSize * 0.3,
                                    moduleSize * 0.1,
                                )
                            }
                            if (hasDown) {
                                ctx.roundRect(
                                    x - moduleSize * 0.15,
                                    y + moduleSize * 0.2,
                                    moduleSize * 0.3,
                                    moduleSize * 0.6,
                                    moduleSize * 0.1,
                                )
                            }
                        }
                    }
                }
                ctx.fill()
                return
            }

            for (let row = 0; row < moduleCount; row++) {
                for (let col = 0; col < moduleCount; col++) {
                    if (qrData.modules.get(row, col)) {
                        const x = margin + col * moduleSize
                        const y = margin + row * moduleSize

                        // Skip drawing in the center area where logo will be placed
                        const centerX = moduleCount / 2
                        const centerY = moduleCount / 2
                        const logoRadius = moduleCount * 0.2
                        const distance = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2)

                        if (distance < logoRadius) continue

                        // Draw different patterns with high precision
                        switch (pattern) {
                            case "square":
                                ctx.fillRect(x, y, moduleSize, moduleSize)
                                break
                            case "rounded":
                                ctx.beginPath()
                                const radius = moduleSize * 0.3
                                ctx.roundRect(x, y, moduleSize, moduleSize, radius)
                                ctx.fill()
                                break
                            case "circle":
                                ctx.beginPath()
                                ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2.2, 0, 2 * Math.PI)
                                ctx.fill()
                                break
                            case "diamond":
                                ctx.beginPath()
                                ctx.moveTo(x + moduleSize / 2, y)
                                ctx.lineTo(x + moduleSize, y + moduleSize / 2)
                                ctx.lineTo(x + moduleSize / 2, y + moduleSize)
                                ctx.lineTo(x, y + moduleSize / 2)
                                ctx.closePath()
                                ctx.fill()
                                break
                            case "dots":
                                ctx.beginPath()
                                ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 3, 0, 2 * Math.PI)
                                ctx.fill()
                                break
                            case "hexagon":
                                ctx.beginPath()
                                const hexRadius = moduleSize / 2.5
                                const centerXHex = x + moduleSize / 2
                                const centerYHex = y + moduleSize / 2
                                for (let i = 0; i < 6; i++) {
                                    const angle = (i * Math.PI) / 3
                                    const hexX = centerXHex + hexRadius * Math.cos(angle)
                                    const hexY = centerYHex + hexRadius * Math.sin(angle)
                                    if (i === 0) ctx.moveTo(hexX, hexY)
                                    else ctx.lineTo(hexX, hexY)
                                }
                                ctx.closePath()
                                ctx.fill()
                                break
                            case "star":
                                ctx.beginPath()
                                const starRadius = moduleSize / 2.5
                                const centerXStar = x + moduleSize / 2
                                const centerYStar = y + moduleSize / 2
                                for (let i = 0; i < 10; i++) {
                                    const angle = (i * Math.PI) / 5
                                    const radius = i % 2 === 0 ? starRadius : starRadius / 2
                                    const starX = centerXStar + radius * Math.cos(angle - Math.PI / 2)
                                    const starY = centerYStar + radius * Math.sin(angle - Math.PI / 2)
                                    if (i === 0) ctx.moveTo(starX, starY)
                                    else ctx.lineTo(starX, starY)
                                }
                                ctx.closePath()
                                ctx.fill()
                                break
                            case "cross":
                                const crossSize = moduleSize * 0.8
                                const crossThickness = moduleSize * 0.3
                                const centerXCross = x + moduleSize / 2
                                const centerYCross = y + moduleSize / 2
                                // Horizontal bar
                                ctx.fillRect(centerXCross - crossSize / 2, centerYCross - crossThickness / 2, crossSize, crossThickness)
                                // Vertical bar
                                ctx.fillRect(centerXCross - crossThickness / 2, centerYCross - crossSize / 2, crossThickness, crossSize)
                                break
                            case "plus":
                                const plusSize = moduleSize * 0.7
                                const plusThickness = moduleSize * 0.25
                                const centerXPlus = x + moduleSize / 2
                                const centerYPlus = y + moduleSize / 2
                                const cornerRadius = plusThickness / 2

                                // Horizontal bar with rounded ends
                                ctx.beginPath()
                                ctx.roundRect(
                                    centerXPlus - plusSize / 2,
                                    centerYPlus - plusThickness / 2,
                                    plusSize,
                                    plusThickness,
                                    cornerRadius,
                                )
                                ctx.fill()

                                // Vertical bar with rounded ends
                                ctx.beginPath()
                                ctx.roundRect(
                                    centerXPlus - plusThickness / 2,
                                    centerYPlus - plusSize / 2,
                                    plusThickness,
                                    plusSize,
                                    cornerRadius,
                                )
                                ctx.fill()
                                break
                        }
                    }
                }
            }
        },
        [transparentBackground],
    )

    const generateQRCode = useCallback(async () => {
        if (!text.trim()) {
            toast.error("Missing text", {
                description: "Please enter text or URL to generate QR code"
            })
            return
        }

        setIsGenerating(true)

        try {
            const QRCode = (await import("qrcode")).default

            const canvas = canvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext("2d")
            if (!ctx) return

            const size = 1200
            canvas.width = size
            canvas.height = size

            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"

            const qrData = QRCode.create(text, {
                errorCorrectionLevel: "H",
            })

            drawCustomQRCode(canvas, qrData, pattern, dotColor)

            // Add logo if provided
            if (logo && logoPreview) {
                const logoImg = new window.Image()
                logoImg.crossOrigin = "anonymous"

                await new Promise((resolve, reject) => {
                    logoImg.onload = resolve
                    logoImg.onerror = reject
                    logoImg.src = logoPreview
                })

                const tempCanvas = document.createElement("canvas")
                const tempCtx = tempCanvas.getContext("2d")
                if (!tempCtx) return

                const originalWidth = logoImg.naturalWidth
                const originalHeight = logoImg.naturalHeight
                tempCanvas.width = originalWidth
                tempCanvas.height = originalHeight

                tempCtx.imageSmoothingEnabled = true
                tempCtx.imageSmoothingQuality = "high"

                tempCtx.drawImage(logoImg, 0, 0, originalWidth, originalHeight)

                const maxLogoSize = size * 0.28
                const logoAspectRatio = originalWidth / originalHeight

                let logoWidth, logoHeight
                if (logoAspectRatio > 1) {
                    logoWidth = maxLogoSize
                    logoHeight = maxLogoSize / logoAspectRatio
                } else {
                    logoHeight = maxLogoSize
                    logoWidth = maxLogoSize * logoAspectRatio
                }

                const logoX = (size - logoWidth) / 2
                const logoY = (size - logoHeight) / 2

                if (!transparentBackground) {
                    ctx.fillStyle = "#FFFFFF"
                    ctx.beginPath()
                    ctx.arc(size / 2, size / 2, maxLogoSize / 3 + 1, 0, 2 * Math.PI)
                    ctx.fill()
                }

                ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
                ctx.shadowBlur = 8
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 2

                ctx.save()
                ctx.beginPath()
                ctx.arc(size / 2, size / 2, maxLogoSize / 2, 0, 2 * Math.PI)
                ctx.clip()

                ctx.drawImage(tempCanvas, logoX, logoY, logoWidth, logoHeight)
                ctx.restore()

                ctx.shadowColor = "transparent"
                ctx.shadowBlur = 0
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 0
            }

            const dataUrl = canvas.toDataURL("image/png", 1.0)
            setQrCodeDataUrl(dataUrl)

            toast.success("QR Code generated!", {
                description: "Your high-quality QR code with logo has been created successfully."
            })
        } catch (error) {
            console.error("Error generating QR code:", error)
            toast.error("Generation failed", {
                description: "Failed to generate QR code. Please try again."
            })
        } finally {
            setIsGenerating(false)
        }
    }, [text, logo, logoPreview, pattern, dotColor, drawCustomQRCode, transparentBackground])

    const downloadQRCode = useCallback(() => {
        if (!qrCodeDataUrl) return

        const link = document.createElement("a")
        const filename = transparentBackground ? "qr-code-transparent.png" : "qr-code-with-logo.png"
        link.download = filename
        link.href = qrCodeDataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success("Downloaded!", {
            description: "QR code has been saved to your downloads."
        })
    }, [qrCodeDataUrl, transparentBackground])

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        Generate QR Code
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="text">Text or URL</Label>
                        <Textarea
                            id="text"
                            placeholder="Enter text, URL, or any content for your QR code..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pattern">Pattern Style</Label>
                            <Select value={pattern} onValueChange={(value: PatternType) => setPattern(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select pattern style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="square">Square (Classic)</SelectItem>
                                    <SelectItem value="rounded">Rounded Squares</SelectItem>
                                    <SelectItem value="circle">Circles</SelectItem>
                                    <SelectItem value="diamond">Diamonds</SelectItem>
                                    <SelectItem value="dots">Small Dots</SelectItem>
                                    <SelectItem value="hexagon">Hexagons</SelectItem>
                                    <SelectItem value="star">Stars</SelectItem>
                                    <SelectItem value="cross">Crosses</SelectItem>
                                    <SelectItem value="plus">Plus Signs</SelectItem>
                                    <SelectItem value="fluid">Fluid/Organic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Dot Color</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={dotColor}
                                    onChange={(e) => setDotColor(e.target.value)}
                                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                                />
                                <Input
                                    type="text"
                                    value={dotColor}
                                    onChange={(e) => setDotColor(e.target.value)}
                                    placeholder="#000000"
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="transparent"
                            checked={transparentBackground}
                            onCheckedChange={(checked) => setTransparentBackground(checked as boolean)}
                        />
                        <Label
                            htmlFor="transparent"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Transparent background
                        </Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Logo (Optional)</Label>
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Logo
                            </Button>
                            <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            {logo && <span className="text-sm text-muted-foreground">{logo.name}</span>}
                        </div>
                        {logoPreview && (
                            <div className="mt-2">
                                <Image
                                    src={logoPreview || "/placeholder.svg"}
                                    alt="Logo preview"
                                    width={64}
                                    height={64}
                                    className="object-contain border rounded"
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>

                    <Button onClick={generateQRCode} disabled={isGenerating || !text.trim()} className="w-full">
                        {isGenerating ? "Generating..." : "Generate QR Code"}
                    </Button>
                </CardContent>
            </Card>

            {qrCodeDataUrl && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your QR Code</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <div
                                className={`border rounded-lg p-4 ${transparentBackground ? "bg-gray-100 bg-opacity-50" : "bg-white"}`}
                            >
                                <Image
                                    src={qrCodeDataUrl || "/placeholder.svg"}
                                    alt="Generated QR Code"
                                    width={256}
                                    height={256}
                                    className="w-64 h-64"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <Button onClick={downloadQRCode} className="w-full flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download QR Code
                        </Button>
                    </CardContent>
                </Card>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}
