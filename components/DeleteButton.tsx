"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";

interface DeleteButtonProps {
  onDelete: () => Promise<void>;
}

export default function DeleteButton({ onDelete }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="danger"
        disabled={isDeleting}
      >
        Delete Post
      </Button>
      
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title="Delete Post"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="danger"
      >
        Are you sure you want to delete this post? This action cannot be undone.
      </Dialog>
    </>
  );
}
