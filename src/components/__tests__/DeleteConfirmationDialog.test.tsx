import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

describe('DeleteConfirmationDialog', () => {
  const defaultProps = {
    isOpen: true,
    itemType: 'article',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders when isOpen is true', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText(/Delete article/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this article/i)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<DeleteConfirmationDialog {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('calls onConfirm when delete button is clicked', async () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Delete'));
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when backdrop is clicked', async () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('alertdialog').parentElement!);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when escape key is pressed', async () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isDeleting is true', () => {
    render(<DeleteConfirmationDialog {...defaultProps} isDeleting />);
    
    expect(screen.getByText('Deleting...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('prevents scrolling when dialog is open', async () => {
    const { unmount } = render(<DeleteConfirmationDialog {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('restores scrolling when dialog is closed', async () => {
    const { rerender } = render(<DeleteConfirmationDialog {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<DeleteConfirmationDialog {...defaultProps} isOpen={false} />);
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('has proper accessibility attributes', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
    
    const title = screen.getByText(/Delete article/i);
    expect(title.id).toBe(dialog.getAttribute('aria-labelledby'));
    
    const description = screen.getByText(/Are you sure you want to delete this article/i);
    expect(description.id).toBe(dialog.getAttribute('aria-describedby'));
  });
});