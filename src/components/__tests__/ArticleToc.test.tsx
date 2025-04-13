import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});