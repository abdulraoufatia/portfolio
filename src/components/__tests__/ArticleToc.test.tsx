import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ArticleToc from '../ArticleToc';

describe('ArticleToc', () => {
  const mockContent = `
# Heading 1
Some content
## Heading 2
More content
### Heading 3
Even more content
  `;

  it('renders table of contents with correct headings', () => {
    render(<ArticleToc content={mockContent} />);
    
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
    expect(screen.getByText('Heading 3')).toBeInTheDocument();
  });

  it('does not render when content has no headings', () => {
    render(<ArticleToc content="Just some text without headings" />);
    expect(screen.queryByText('Table of Contents')).not.toBeInTheDocument();
  });

  it('applies correct indentation based on heading level', () => {
    render(<ArticleToc content={mockContent} />);
    
    const headings = screen.getAllByRole('link');
    expect(headings[0]).toHaveClass('ml-0');
    expect(headings[1]).toHaveClass('ml-3');
    expect(headings[2]).toHaveClass('ml-6');
  });

  it('scrolls to heading when link is clicked', () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(<ArticleToc content={mockContent} />);
    
    const firstHeadingLink = screen.getByText('Heading 1');
    fireEvent.click(firstHeadingLink);
    
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('updates active heading on scroll', () => {
    const { rerender } = render(<ArticleToc content={mockContent} />);
    
    // Mock scroll position
    Object.defineProperty(window, 'scrollY', { value: 100 });
    
    // Trigger scroll event
    fireEvent.scroll(window);
    
    rerender(<ArticleToc content={mockContent} />);
    
    // First heading should be active
    expect(screen.getByText('Heading 1').parentElement).toHaveClass('text-primary');
  });
});