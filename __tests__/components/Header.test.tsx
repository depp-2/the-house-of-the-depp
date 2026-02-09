import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '@/components/Header';
import { ThemeProvider } from '@/lib/theme';

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header Component', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('renders logo link', () => {
    renderWithTheme(<Header />);
    const logo = screen.getByLabelText(/home/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveTextContent('depp');
  });

  it('renders navigation links', () => {
    renderWithTheme(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    renderWithTheme(<Header />);
    // Check for theme buttons by their aria-labels
    expect(screen.getByLabelText(/light theme/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dark theme/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/system theme/i)).toBeInTheDocument();
  });

  it('has correct navigation structure', () => {
    const { container } = renderWithTheme(<Header />);
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav?.tagName).toBe('NAV');
  });
});
