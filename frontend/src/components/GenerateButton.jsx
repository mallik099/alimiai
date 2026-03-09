export default function GenerateButton({ loading, onClick, disabled = false, label = "Generate Brand Names" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="btn-primary w-full sm:w-auto"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Generating...
        </span>
      ) : (
        label
      )}
    </button>
  );
}
