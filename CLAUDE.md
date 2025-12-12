# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Creastilo AI Xperience is a futuristic AI solutions platform built with React, TypeScript, and Vite. The app showcases multiple AI-powered tools including a gamified lead generation roulette, CRM dashboard, Gen-AI chat assistant, and creative AI studio powered by Google's Gemini API.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Required environment variables in `.env.local` or `.env`:

- `GEMINI_API_KEY`: Google Gemini API key for AI features
- `VITE_SUPABASE_URL`: Supabase project URL (for database features)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

**Important**: The Vite config exposes the Gemini API key as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` at runtime via define configuration.

## Architecture

### Entry Point
- `index.tsx` → renders `App.tsx` into root element
- `App.tsx` is the main orchestrator with routing logic and modal state management

### Component Structure

**Main Layout Components:**
- `Background.tsx`: Animated background with particle effects
- `Navbar.tsx`: Navigation bar with smooth scrolling to sections
- `Hero.tsx`: Landing hero section
- `ToolsSection.tsx`: Multi-tab interface for all interactive tools
- `Jarvis.tsx`: Floating AI assistant chat widget (global, always accessible)
- `Onboarding.tsx`: First-time user experience flow
- `Footer.tsx`, `FAQ.tsx`, `Integrations.tsx`: Supporting sections

**Tool Modules** (in `components/Tools/`):
- `Roulette.tsx`: Gamified lead capture with prize wheel
- `CRMTool.tsx`: Analytics dashboard for leads/prizes
- `GenAIStudio.tsx`: Creative AI suite (copywriting, image generation, voice)
- `NeuralArchitect.tsx`: Enterprise architecture visualization tool
- `GenIAInterface`: Chat interface embedded in ToolsSection (Avatar tool type)

**UI Components** (`components/ui/`):
- `HolographicCard.tsx`: Reusable card with holographic effects
- `badge.tsx`, `button.tsx`: Base UI primitives

### Services Layer

**`services/geminiService.ts`**: Centralized service managing all Gemini API interactions
- Text generation (Flash and Pro models)
- Image generation via Gemini 3 Pro Image Preview
- Voice synthesis using Gemini TTS models
- Chat with function calling (n8n webhook integration for email)
- Live audio sessions for real-time voice chat
- Social media campaign generation with structured JSON output

Key features:
- Model selection: `gemini-2.5-flash` for speed, `gemini-3-pro-preview` for complex reasoning
- Image generation supports aspect ratio and size configuration
- Voice uses 24kHz PCM audio with prebuilt voice configs (Kore, Aoede)
- Function calling pattern for external integrations (currently n8n email webhook)

### Type Definitions

`types.ts` contains core interfaces:
- `Message`: Chat message structure
- `ToolType`: Enum for tool navigation (Roulette, Avatar, CRM, Custom, GenAI, Neural)
- `GenAITool`: Sub-tools within Gen-AI Studio
- `NavItem`: Navigation items

### State Management

No global state library. State managed via:
- React useState/useEffect hooks in components
- Custom events for cross-component communication:
  - `trigger-jarvis`: Components trigger Jarvis to speak specific messages
  - `system-online`: Triggered after onboarding completion
  - `change-tool-tab`: External components can switch active tool tabs

### Styling

- Tailwind CSS (no config file found - using default or inline config)
- Custom gradient and glass-morphism utility classes
- Responsive design with mobile-first approach
- Animation classes: `animate-in`, `fade-in`, `slide-in-from-bottom-2`

### Voice & Audio Features

Two voice interaction modes:

1. **Text-to-Speech (TTS)**: Generate audio from text using Gemini TTS models
   - Uses Web Audio API with 24kHz sample rate
   - Fallback to browser SpeechSynthesis API
   - Context initialization required via user interaction (for iOS/Safari)

2. **Live Audio Chat**: Real-time bidirectional voice conversation
   - Microphone input → 16kHz PCM → Gemini Live API
   - Gemini responses → 24kHz PCM audio output
   - Implemented in `Jarvis.tsx` with ScriptProcessorNode (legacy API, consider AudioWorklet for production)

### API Integration Patterns

**Gemini API**:
- Always instantiate `GoogleGenAI` with `process.env.API_KEY`
- For image/voice features that may use different API keys, re-instantiate client
- Use `responseMimeType: "application/json"` for structured outputs
- Handle function calls in chat sessions for external actions

**N8N Webhook**:
- URL configured in `geminiService.ts` (currently hardcoded)
- Triggered via Gemini function calling when user requests email support
- POST JSON payload with message, contact info, intent, timestamp

### Deployment

- Vercel configuration (`vercel.json`) rewrites all routes to `/index.html` for SPA routing
- Static files served from `public/` directory
- Build output goes to `dist/`

## Common Workflows

**Adding a new tool module:**
1. Create component in `components/Tools/`
2. Add tool type to `ToolType` enum in `types.ts`
3. Register in `ToolsSection.tsx` tab array and renderContent switch
4. Add to `MODULE_GUIDES` for tactical tutorial overlay

**Integrating new Gemini models:**
1. Update `geminiService.ts` with new model name
2. Add method for specific model capability
3. Handle response format (text/JSON/audio/image)

**Adding function calling:**
1. Define `FunctionDeclaration` in `geminiService.ts`
2. Add to tools array in chat config
3. Handle function call in response processing
4. Send function result back via `functionResponse` message

## Important Notes

- The onboarding localStorage check is commented out for demo purposes (App.tsx:21-27)
- API keys are exposed client-side via Vite define - consider backend proxy for production
- Voice features require HTTPS and user interaction to initialize AudioContext
- The app uses experimental/preview Gemini models - check for API changes
- Device-ID validation mentioned in code but implementation not found in current files

## Areas de Oportunidad (Improvement Opportunities)

### 🔒 Security & Environment

**Critical:**
- **API Keys Exposed Client-Side**: `GEMINI_API_KEY` is hardcoded in `.env` (committed to repo) and exposed via Vite's define config. This key is visible in browser DevTools.
  - **Solution**: Implement backend proxy for Gemini API calls, or use environment variables that aren't committed
  - **Affected**: `vite.config.ts:14-15`, `.env:1`

- **Supabase Keys Exposed**: `VITE_SUPABASE_ANON_KEY` is public (expected for frontend) but ensure Row Level Security (RLS) is enabled
  - **Location**: `.env:4`

**Medium:**
- **N8N Webhook URL Hardcoded**: Webhook URL in `geminiService.ts:6` is hardcoded
  - **Solution**: Move to environment variable

### 🏗️ Architecture & Code Quality

**State Management:**
- **No Centralized State**: Multiple components using localStorage + custom events for cross-component communication
  - **Impact**: Data sync issues, race conditions, harder debugging
  - **Affected**: `Roulette.tsx`, `CRMTool.tsx`, `ToolsSection.tsx`
  - **Solution**: Consider React Context, Zustand, or Jotai for global state

**Data Persistence:**
- **localStorage as Database**: Lead/prize data stored in localStorage (client-side only)
  - **Impact**: Data loss on cache clear, no server sync, not scalable
  - **Current**: `Roulette.tsx:153-154`, `CRMTool.tsx:177-182`
  - **Note**: Supabase integration exists but incomplete (`CRMTool.tsx:145-172`)

**Error Handling:**
- **Silent Failures**: 10+ `console.error` calls but no user-facing error UI
  - **Examples**: `geminiService.ts:61-62`, `Roulette.tsx:60`, `CRMTool.tsx:168`
  - **Solution**: Toast notifications, error boundaries, retry mechanisms

**Type Safety:**
- **Loose Typing**: Multiple `any` types, especially in Gemini service
  - **Examples**: `geminiService.ts:29`, `CRMTool.tsx:133-134`
  - **Solution**: Define proper interfaces for Gemini responses, lead data structures

### ⚡ Performance

**React Optimizations:**
- **Missing Memoization**: Large lists rendered without `useMemo`/`React.memo`
  - **Example**: `CRMTool.tsx:201-209` filters on every render
  - **Solution**: Memoize expensive computations, virtualize long lists

**Audio Context:**
- **Legacy API Usage**: `ScriptProcessorNode` (deprecated) in `Jarvis.tsx:161`
  - **Solution**: Migrate to AudioWorklet for better performance and less main-thread blocking

**Bundle Size:**
- **No Code Splitting**: Single bundle loads all tools upfront
  - **Solution**: Lazy load tool components: `const GenAIStudio = lazy(() => import('./Tools/GenAIStudio'))`

### 🧪 Testing & Validation

**Missing Test Coverage:**
- No test files found in project
- **Critical Flows to Test**: Roulette probability calculations, CRM data sync, Gemini API failures

**Form Validation:**
- **Weak Validation**: `Roulette.tsx:65` only checks length, no format validation
  - **Missing**: Email format, phone number format (international), sanitization

### 🎨 UX & Accessibility

**Accessibility Issues:**
- **No ARIA Labels**: Interactive elements lack proper labels for screen readers
- **Keyboard Navigation**: Modal traps, focus management not implemented
- **Color Contrast**: Some text-gray combinations may fail WCAG standards

**Mobile Experience:**
- **Fixed Heights**: `CRMTool.tsx:696` hardcoded 800px height breaks on small screens
- **Touch Targets**: Some buttons <44px (iOS minimum)

### 📊 Analytics & Monitoring

**Missing Observability:**
- No error tracking (Sentry, LogRocket)
- No analytics (lead conversion funnel, tool usage)
- No performance monitoring (Web Vitals)

**Monitoring Gaps:**
- Gemini API quota/rate limit tracking
- Supabase query performance
- Client-side errors in production

### 🔄 Data Flow & Integration

**Incomplete Supabase Integration:**
- `CRMTool.tsx` has Supabase fetch logic but doesn't write leads
- `Roulette.tsx` uses localStorage instead of Supabase
- **Solution**: Consistent data layer with Supabase as source of truth

**Anti-Fraud Mechanism:**
- Device-ID validation mentioned (`Roulette.tsx:45`, `ToolsSection.tsx:14`) but not implemented
- **Solution**: Implement browser fingerprinting (FingerprintJS) or server-side IP tracking

### 🚀 Deployment & DevOps

**Build Configuration:**
- No environment-specific builds (dev/staging/prod)
- No CI/CD pipeline detected
- Missing `.gitignore` for `.env` files (security risk)

**Performance Budget:**
- No bundle size limits
- No image optimization pipeline
- Missing `robots.txt`, `sitemap.xml` for SEO

### 📝 Documentation

**Code Documentation:**
- No JSDoc comments for complex functions
- Magic numbers without explanation (e.g., `Roulette.tsx:115` - why 0.8?)
- Component props not documented

**API Integration Docs:**
- N8N webhook payload contract not documented
- Gemini model capabilities/limits not documented

## Quick Wins (Low Effort, High Impact)

1. **Move `.env` to `.gitignore`** (5 min) - Prevent API key leaks
2. **Add Error Boundaries** (30 min) - Graceful failure handling
3. **Implement Toast Notifications** (1 hour) - Better UX for errors/success
4. **Add Loading States** (1 hour) - Skeleton screens for async operations
5. **Memoize CRM Filters** (15 min) - Instant performance boost
6. **Add Tailwind Config File** (30 min) - Custom theme, IntelliSense support
7. **Lazy Load Tool Components** (1 hour) - Reduce initial bundle size
8. **Add Meta Tags** (`index.html`) - SEO, social sharing previews
