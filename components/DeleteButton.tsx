"use client";

interface DeleteButtonProps {
  // We pass the Server Action as a prop
  onDelete: () => Promise<void>;
}

export default function DeleteButton({ onDelete }: DeleteButtonProps) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the form from submitting immediately

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (confirmed) {
      await onDelete(); // Call the Server Action if user clicks 'OK'
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button type="submit" style={styles.deleteBtn}>
        Delete Post
      </button>
    </form>
  );
}

const styles = {
  deleteBtn: { 
    padding: '10px 20px', 
    backgroundColor: '#fff', 
    color: '#ff4d4f', 
    border: '1px solid #ff4d4f', 
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  }
};