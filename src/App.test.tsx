import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Tempo Keeper')).toBeInTheDocument();
  });

  it('renders the start button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('renders the training instructions', () => {
    render(<App />);
    expect(screen.getByText('How to Use')).toBeInTheDocument();
  });
});
