"use client";

import { FormEvent } from "react";

interface DeleteButtonProps {
  onDelete: () => Promise<void>;
}

export default function DeleteButton({ onDelete }: DeleteButtonProps) {
  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (confirmed) {
      await onDelete();
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="inline-flex justify-center items-center w-full sm:w-auto bg-white dark:bg-neutral-800 text-red-500 border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete Post
      </button>
    </form>
  );
}
