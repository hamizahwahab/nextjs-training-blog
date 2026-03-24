"use client";

import { ReactNode } from "react";
import Button from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
}

export default function Dialog({ 
  open, onClose, title, children, 
  confirmLabel = "Confirm", onConfirm, variant = "danger" 
}: DialogProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          {title}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">{children}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            variant={variant} 
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
