import React from 'react';

export function OppHubLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer "O" mark */}
      <path
        d="M12 21c5.522 0 10-4.478 10-10S17.522 1 12 1 2 5.478 2 11s4.478 10 10 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Inner sharp spark */}
      <path
        d="M12 6.5 13.8 10.4 17.8 12l-4 1.6L12 17.5 10.2 13.6l-4-1.6 4-1.6L12 6.5Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  );
}

