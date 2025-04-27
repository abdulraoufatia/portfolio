import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  itemType: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmationDialog({
  isOpen,
  itemType,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  // Prevent scroll when dialog is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center">
            <motion.div
              role="alertdialog"
              aria-labelledby="dialog-title"
              aria-describedby="dialog-description"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative w-full max-w-md bg-card p-6 rounded-lg shadow-lg",
                "border border-border",
                "transform transition-all"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onCancel}
                className={cn(
                  "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
                  "transition-opacity hover:opacity-100",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:pointer-events-none",
                  "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                )}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>

              {/* Content */}
              <div className="flex gap-4">
                <div className="text-destructive shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <h2 
                    id="dialog-title"
                    className="font-semibold text-lg leading-none tracking-tight"
                  >
                    Delete {itemType}
                  </h2>
                  <p
                    id="dialog-description"
                    className="text-sm text-muted-foreground"
                  >
                    Are you sure you want to delete this {itemType.toLowerCase()}? This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
                    "hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",
                    "border border-input bg-transparent"
                  )}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-4 py-2"
                  )}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}