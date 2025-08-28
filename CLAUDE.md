# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (accessible at http://localhost:3000)
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint code quality checks

## Project Architecture

This is a Next.js 15 QR Code Generator application with the following architecture:

### Core Technologies
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **TailwindCSS v4** for styling
- **shadcn/ui** component library (New York style)
- **qrcode** library for QR code generation

### Project Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - React components
  - `ui/` - shadcn/ui component library
  - `qr-code-generator.tsx` - Main QR code generation component
- `lib/` - Utility functions (mainly `cn` helper for Tailwind classes)
- `public/` - Static assets

### Main Component Architecture
The application is centered around a single main component `QRCodeGenerator` that:
- Handles text/URL input for QR code content
- Supports 10 different pattern styles (square, rounded, circle, diamond, dots, hexagon, star, cross, plus, fluid)
- Allows logo upload and preview with circular cropping
- Supports custom dot colors and transparent backgrounds
- Uses HTML5 Canvas for high-quality QR code rendering (1200x1200px)
- Provides download functionality for generated QR codes

### Key Features
- High-resolution QR code generation with error correction level H
- Multiple visual patterns including an organic "fluid" style with connecting bridges
- Logo integration with automatic sizing and circular clipping
- Canvas-based rendering with anti-aliasing for crisp output
- Toast notifications using Sonner
- Responsive design with Tailwind utilities

### Component System
Uses shadcn/ui components with:
- Path aliases configured (`@/` points to root)
- CSS variables for theming
- Lucide icons
- New York design style