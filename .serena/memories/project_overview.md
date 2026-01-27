# Tempo Keeper - Project Overview

## Purpose
Tempo Keeper is a metronome web application designed to improve tempo-keeping abilities for musicians. The core feature is selective measure playback where the metronome plays sound for only 1 measure out of every N measures (e.g., when N=4, it plays only on measures where measure_number ≡ 1 (mod 4)). This forces trainees to maintain tempo internally during silent measures.

## Tech Stack
- **Language**: JavaScript/JSX (React)
- **Framework**: React 18.2
- **Build Tool**: Vite 4.4
- **Testing**: Vitest with jsdom
- **Linting**: ESLint with React plugins
- **Formatting**: Prettier
- **Architecture**: Single Page Application (SPA), frontend only

## Key Features
- Selective measure playback (1 out of N measures)
- Configurable time signatures
- Training mode to develop internal tempo consistency
