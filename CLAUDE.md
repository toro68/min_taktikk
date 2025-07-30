# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

```bash
npm start                  # Start development server (React app on localhost:3000)
npm run build             # Build for production
npm run deploy            # Deploy to GitHub Pages (predeploy builds automatically)
```

### Testing

```bash
npm test                  # Run Jest tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate test coverage report
```

### MCP (Model Context Protocol) Server

```bash
npm run mcp:install       # Setup MCP server (runs setup-mcp.sh)
npm run mcp:start         # Start MCP server
npm run mcp:dev           # Start MCP server with debugging
```

## Architecture Overview

This is **Football Animator** (Min Taktikk) - an interactive React application for creating tactical football animations and diagrams.

### Core Technologies

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components with Shadcn/ui
- **Lucide React** icons (ALWAYS use Lucide icons, never emojis)
- **SVG** for graphics rendering
- **Canvas API** for exports
- **Jest + React Testing Library** for testing

### Application Structure

**Main Entry Points:**

- `src/App.tsx` - Root component with theme providers and configuration loading
- `src/football-animator.tsx` - Main application component orchestrating all functionality
- `src/index.tsx` - React DOM entry point

**Core Architecture Pattern:**

The app uses a **hook-based architecture** with `useFootballAnimatorLogic()` as the central orchestrator that combines:

- Animation state management (`useAnimationLogic`)
- Tool management (`useToolLogic`)
- User interactions (`useInteractionLogic`)
- Element operations (`useElementActions`)
- Frame management (`useFrameActions`)
- Import/export functionality (`useEnhancedExportImport`)

**Key Directories:**

- `src/components/` - React components organized by feature
  - `core/` - Core components (TacticsBoard, ErrorBoundary, SVGMarkers)
  - `elements/` - Renderable elements (Player, Ball, Line, etc.)
  - `layout/` - Layout components (MainLayout, AnimationSection)
  - `toolbar/` - Configurable toolbars
  - `properties/` - Element property panels
  - `ui/` - Reusable UI primitives (based on Radix UI)
- `src/hooks/` - Custom React hooks for state and logic
- `src/lib/` - Utility functions and helpers
- `src/types.ts` & `src/@types/elements.ts` - TypeScript type definitions
- `src/constants/` - Configuration constants
- `src/providers/` - React context providers

### Configuration System

The app uses a comprehensive configuration system via `.aigenrc` file:

- **Toolbar configuration** - Customizable buttons, layouts, and groupings
- **Line styles** - Colors, curve ranges, markers, professional style categories
- **Pitch types** - Multiple field layouts (football, handball, blank)
- **UI theming** - Colors and animations
- **Feature flags** - Enable/disable specific functionality

Configuration is loaded at runtime through `useAppConfig()` hook.

### Element and Animation System

**Elements:** Players, opponents, ball, cones, lines, text, and areas

**Animation:** Keyframe-based system with interpolation between frames

**Rendering:** SVG-based with real-time updates and export capabilities

### Testing Configuration

Tests use Jest with jsdom environment. Configuration in `jest.config.js`:

- TypeScript support via ts-jest
- Test files in `tests/` directory
- CSS modules mocked with identity-obj-proxy
- Coverage collection from `src/` excluding index and types

### Export Capabilities

The app supports multiple export formats:

- **PNG** - High-resolution static images
- **GIF** - Animated sequences
- **MP4** - Video export (via film functionality)
- **JSON** - Save/load animation data

### Development Notes

- The codebase is in Norwegian (comments, variable names, UI text)
- Uses strict TypeScript with comprehensive type definitions
- Custom SVG utilities for coordinate calculations and rendering
- Extensive error handling and debugging utilities
- Keyboard shortcuts: Space (play/pause), R (rewind)
- Touch/mobile support for interactions

### Key Design Patterns

1. **Composite Hook Pattern** - `useFootballAnimatorLogic` combines multiple specialized hooks
2. **Provider Pattern** - Theme and Toast providers for global state
3. **Render Props** - Flexible component composition
4. **Event-driven Updates** - Mouse/touch events trigger state changes with SVG coordinate mapping
5. **Configurable Components** - Toolbars and UI elements driven by `.aigenrc` configuration
