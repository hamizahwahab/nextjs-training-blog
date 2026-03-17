"use client";

interface CommentProps {
  comment: {
    _id: string;
    author: string;
    content: string;
    createdAt: string | Date;
  };
  onDelete: () => void;
}

export default function Comment({ comment, onDelete }: CommentProps) {
  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    
    try {
      await fetch(`/api/comments/${comment._id}`, {
        method: "DELETE",
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-neutral-900 dark:text-white">
              {comment.author}
            </span>
            <span className="text-neutral-400 text-sm">
              {new Date(comment.createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300">
            {comment.content}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-neutral-400 hover:text-red-500 transition-colors p-1"
          aria-label="Delete comment"
        >
          <svg
            className="w-4 h-4"
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
        </button>
      </div>
    </div>
  );
}
