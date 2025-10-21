'use client';

interface AddVoteCardProps {
  onClick: () => void;
}

export function AddVoteCard({ onClick }: AddVoteCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-600 hover:border-sky-500 hover:bg-slate-800/50 transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-slate-600 group-hover:text-sky-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
}