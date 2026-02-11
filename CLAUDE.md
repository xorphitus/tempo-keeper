# Tempo Keeper

## Project Overview

Tempo Keeper is a metronome web application designed to improve tempo-keeping abilities for musicians. Unlike conventional metronomes that play continuously, this application features a unique training mode where the metronome plays sound for only 1 measure out of every N measures.

## Key Features

### Selective Measure Playback

The core feature allows users to configure the metronome to play sound on only specific measures:
- When N=4, the metronome plays only on measures where measure_number ≡ 1 (mod 4)
- All other measures are muted
- This forces trainees to maintain tempo internally during silent measures

### Training Methodology

Musicians must:
1. Keep tempo internally during muted measures
2. Verify their internal timing when the metronome unmutes
3. Adjust if their beat sense has drifted from the metronome

This training approach helps develop:
- Internal tempo consistency
- Beat independence from external cues
- Time-keeping confidence

### Time Signature Control

The application supports configurable time signatures, allowing practice with various musical meters.

## Technical Architecture

### Technology Stack

- **Language**: TypeScript
- **Framework**: React
- **Architecture**: Single Page Application (SPA)
- **Deployment**: Frontend only (no backend required)

### Project Structure

This is a client-side only application, meaning all logic runs in the browser without server-side processing.

## Development Workflow

Must follow these steps sequentially for any non-trivial implementation:

### 1. Spec

Use `spec-plugin:spec` subagent to clarify requirements and produce a specification before writing any code.

### 2. Coding

Use `typescript-plugin:coding` subagent to implement the feature following TDD Red-Green-Refactor cycle with strict type safety.

### 3. Review & Testing

Run all three of the following subagents to validate the implementation:

- `typescript-plugin:code-review` — Review for readability, maintainability, and TypeScript idioms
- `typescript-plugin:testing` — Run tests, analyze coverage, and identify gaps
- `typescript-plugin:security` — Audit for vulnerabilities and insecure patterns

### 4. E2E Verification

Use `typescript-plugin:e2e` subagent to verify end-to-end behavior. If E2E tests fail, loop back to step 2 (Coding) to fix the implementation and repeat from there.
