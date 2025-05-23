# Glyphify

<div align="center">
  
![Glyphify Logo: Whimsical Digital Artistry](https://github.com/user-attachments/assets/69bbd3de-9d6c-4816-8628-d84a5576cbaa)

**Transform your images into stunning ASCII art with just a few clicks.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Explore_Now-brightgreen?style=for-the-badge)](https://glyphify.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/vijaybartaula/Glyphify?style=for-the-badge&logo=github)](https://github.com/vijaybartaula/Glyphify/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

[**Explore Live**](https://glyphify.vercel.app) • [**Documentation**](https://github.com/vijaybartaula/Glyphify/blob/main/docs/whitepaper.md) • [**Report Bug**](https://github.com/vijaybartaula/Glyphify/blob/main/docs/issues.md) • [**Request Feature**](https://github.com/vijaybartaula/Glyphify/blob/main/docs/issues.md) • [**Demo Video**](https://www.youtube.com/watch?v=H9dAUs1-Kyo)

</div>

---

## Overview

> *"Where pixels meet poetry, and memories become masterpieces of text."*

**Glyphify** revolutionizes the art of image transformation by converting your precious photos into captivating ASCII masterpieces. Launched on March 20, 2025, this cutting-edge web application bridges the gap between modern photography and timeless text-based artistry.

### Why Glyphify Stands Apart

In a digital landscape dominated by AI-generated visuals like OpenAI's latest models and tools like Ghibli, **Glyphify** carves its own unique niche. While others focus on creating new imagery, we celebrate the transformation of your existing memories into retro-inspired, customizable text art that tells stories through characters and symbols.

```ascii
    "   ***     ***   "     Transform any image into
    " *******   ******* "    beautiful ASCII art like this!
    "********* *********"    
    "*******************"    ✨ Your memories, reimagined
    " ***************** "       through the art of text
    "  ***************  "    
    "   *************   "    🎯 Instant, browser-based
    "    ***********    "       conversion in seconds
    "     *********     "    
    "      *******      "    🎨 Endless customization
    "       *****       "       possibilities
    "        ***        "    
    "         *         "    
```

---

## Features That Wow

### **Effortless Image Processing**
- **Drag & Drop Magic**: Simply drop your image and watch the transformation begin
- **Lightning-Fast Conversion**: Browser-based processing delivers results in seconds
- **Universal Format Support**: Works with JPG, PNG, GIF, and more

### **Powerful Customization Engine**
- **Dynamic Character Sets**: Choose from curated symbol collections or create your own
- **Intelligent Color Mapping**: Generate vibrant colored ASCII or classic monochrome
- **Precision Width Control**: Fine-tune detail levels from 50 to 200+ characters wide
- **Real-Time Preview**: Watch your adjustments come to life instantly

### **Flexible Export Options**
- **Multiple Formats**: Download as text files, images, or copy directly to clipboard
- **Social Media Ready**: Optimized outputs for sharing across platforms
- **Print-Friendly**: High-quality exports perfect for physical art pieces

### **Modern User Experience**
- **Responsive Design**: Flawless performance on desktop, tablet, and mobile
- **Theme Flexibility**: Switch between elegant dark and light modes
- **Gallery Inspiration**: Explore curated examples to spark your creativity
- **Offline Capability**: Works without internet after initial load

---

## Tech Stack

Built with modern technologies for optimal performance and developer experience:

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 14 (App Router) |
| **Tailwind CSS** | Styling System | Latest |
| **shadcn/ui** | Component Library | Latest |
| **TypeScript** | Type Safety | Latest |
| **React Hooks** | State Management | 18+ |

---

## Quick Start Guide

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vijaybartaula/glyphify.git
   cd glyphify
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) and start creating!

### Usage Workflow

1. **Upload Your Image**
   - Visit the Convert page
   - Drag your image into the dropzone or click to browse
   - Watch the preview load instantly

2. **Customize Your Art**
   - Adjust character width for detail control
   - Select from various character sets (dense, light, custom)
   - Toggle color output for vibrant results
   - Use invert option for dramatic effects

3. **Generate ASCII Magic**
   - Click "Convert to ASCII" to transform your image
   - Watch real-time preview updates as you adjust settings
   - Experiment with different combinations for unique results

4. **Export & Share**
   - Download as `.txt` file for editing
   - Save as image for social sharing
   - Copy to clipboard for instant pasting

---

## Project Architecture

```
└── vijaybartaula-glyphify/
    ├── components.json
    ├── next.config.mjs
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── app/                     # Next.js App Router
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx             # Landing page
    │   ├── smooth-scroll.tsx
    │   ├── about/               # About page & ASCII art history
    │   │   └── page.tsx
    │   ├── convert/             # Main conversion interface
    │   │   └── page.tsx
    │   └── gallery/             # Inspiration gallery
    │       └── page.tsx
    ├── components/              # Reusable React components
    │   ├── ascii-converter.tsx  # Core conversion interface
    │   ├── ascii-output.tsx     # Result display component
    │   ├── footer.tsx
    │   ├── image-dropzone.tsx   # Upload component
    │   ├── interactive-ascii-preview.tsx
    │   ├── mode-toggle.tsx      # Theme switcher
    │   ├── navbar.tsx
    │   ├── theme-provider.tsx
    │   └── ui/                 # shadcn/ui components
    ├── docs/                    # Project documentation
    │   ├── issues.md
    │   └── whitepaper.md
    ├── hooks/                   # Custom React hooks
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib/                     # Core utilities
    │   ├── ascii-converter.ts   # Conversion algorithms
    │   └── utils.ts             # Helper functions
    └── styles/                  # Global styling
        └── globals.css
```

---

## Core Technology Deep Dive

### ASCII Conversion Engine

The heart of Glyphify lies in our sophisticated conversion algorithm (`lib/ascii-converter.ts`):

```typescript
export async function convertToAscii(
  imageUrl: string,
  width: number,
  charset: string,
  colored: boolean,
  inverted: boolean
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Initialize worker if needed
    if (!asciiWorker) initWorker()

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // Aspect ratio calculation to preserve image quality
      canvas.width = width;
      canvas.height = Math.round(width * img.height / img.width * 0.55); // Account for font aspect ratio
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      if (asciiWorker) {
        asciiWorker.onmessage = (e) => resolve(e.data);
        asciiWorker.postMessage({ imageData: pixels, width: canvas.width, height: canvas.height, charset, colored, inverted });
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}
```

**Key Features:**
- **Pixel Analysis**: Advanced brightness calculation using luminance formulas
- **Character Mapping**: Intelligent mapping of brightness values to ASCII characters
- **Color Preservation**: Optional RGB color information retention
- **Performance Optimization**: Efficient algorithms for real-time conversion

### Character Set System

Choose from carefully curated character sets or create your own:

- **Dense Set**: `@%#*+=-:. ` (High detail, complex images)
- **Light Set**: `.-~:;=!*#$@` (Subtle, minimalist aesthetic)
- **Block Set**: `█▉▊▋▌▍▎▏ ` (Bold, architectural feel)
- **Custom**: Define your own character progression

### Client-Side Processing

All image processing happens in your browser, ensuring:

- **Complete Privacy**: Your images never leave your device
- **Instant Results**: No server round-trips or upload delays
- **Offline Capability**: Works without internet connection
- **Universal Compatibility**: Runs on any modern browser

---

## Advanced Usage Tips

### Creating Stunning Results

1. **Image Selection**
   - High contrast images work best
   - Portraits and silhouettes are ideal
   - Avoid overly busy or cluttered photos

2. **Width Optimization**
   - Start with 80-100 characters for balance
   - Increase to 150+ for detailed images
   - Reduce to 50-70 for social media posts

3. **Character Set Strategy**
   - Dense sets for complex, detailed images
   - Light sets for subtle, artistic effects
   - Block sets for bold, poster-like results

4. **Color Usage**
   - Enable for vibrant, modern ASCII art
   - Disable for classic, retro aesthetics
   - Combine with invert for unique effects

---

## Contributing

We welcome contributions from developers, designers, and ASCII art enthusiasts! Here's how you can help:

### Bug Reports & Feature Requests
- Use our [issue templates](https://github.com/vijaybartaula/Glyphify/blob/main/docs/issues.md)
- Provide detailed reproduction steps
- Include screenshots when applicable

### Code Contributions

1. **Fork & Clone**
   ```bash
   git fork https://github.com/vijaybartaula/Glyphify.git
   git clone your-fork-url
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Develop & Test**
   - Follow our coding standards
   - Add tests for new functionality
   - Ensure responsive design compatibility

4. **Submit Pull Request**
   - Write clear commit messages
   - Reference related issues
   - Include screenshots of changes

### Development Guidelines

- **Code Style**: Follow Prettier and ESLint configurations
- **Commit Format**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Testing**: Add unit tests for utility functions
- **Documentation**: Update README and code comments

---

## Performance & Compatibility

### Performance Metrics
- **Conversion Speed**: < 2 seconds for most images
- **Memory Usage**: Optimized for large image processing
- **Bundle Size**: < 500KB gzipped
- **Lighthouse Score**: 95+ across all categories

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: Full support for all modern JavaScript APIs

---

## Showcase & Community

### Social Media
Share your creations with `#Glyphify` and `#ASCIIArt` to join our growing community!

### Recognition
- Featured on ProductHunt (Coming Soon)
- Mentioned in ASCII Art Communities
- Growing GitHub Star Community

---

## License & Legal

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Third-Party Acknowledgments
- [ASCII Art Archive](https://www.asciiart.eu/) - Historical inspiration
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- All our amazing contributors and community members

---

## Connect With Us

<div align="center">

[![Twitter](https://img.shields.io/twitter/follow/bijaybartaula?style=social)](https://x.com/bijaybartaula)
[![GitHub Profile](https://img.shields.io/badge/GitHub-vijaybartaula-blue?style=social&logo=github)](https://github.com/vijaybartaula)


*Transform your world, one character at a time.*

</div>

---

<div align="center">
  
### Star this repository if Glyphify brings joy to your creative process!

[![Star History Chart](https://api.star-history.com/svg?repos=vijaybartaula/Glyphify&type=Timeline)](https://star-history.com/#vijaybartaula/Glyphify&Timeline)

</div>
