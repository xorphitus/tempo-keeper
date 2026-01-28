# Codebase Structure

```
tempo-keeper/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main app component
│   ├── App.test.tsx          # App tests
│   ├── App.css               # App styles
│   ├── index.css             # Global styles
│   ├── hooks/
│   │   └── useMetronome.ts   # Metronome domain logic hook
│   ├── components/
│   │   ├── MetronomeControls.tsx  # BPM, time signature, play controls
│   │   ├── BeatIndicator.tsx      # Visual beat display
│   │   └── ErrorBoundary.tsx      # Error boundary wrapper
│   └── test/
│       └── setup.js          # Test setup configuration
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # Node TypeScript config
├── vite.config.ts            # Vite configuration
├── eslint.config.js          # ESLint flat config
├── .prettierrc.json          # Prettier configuration
├── CLAUDE.md                 # Project documentation and requirements
└── README.md                 # Project readme

## Current Implementation Status
The metronome app is fully implemented with:
- Configurable BPM (40-240), time signature, and "play every N measures" training mode
- Web Audio API for precise timing with lookahead scheduling
- Visual beat indicator showing current measure and beat
- ErrorBoundary for graceful error handling
