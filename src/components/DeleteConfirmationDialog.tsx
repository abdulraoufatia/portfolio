import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  itemType: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationDialog({
  isOpen,
  itemType,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <AlertTriangle size={24} className="text-red-500 mr-3" />
            <h3 className="text-xl font-semibold">Confirm Deletion</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="mb-6">
          Are you sure you want to delete this {itemType}? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DeleteConfirmationDialog;