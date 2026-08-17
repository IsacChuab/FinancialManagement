const GridPattern = () => {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
      <defs>
        <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#94a3b8" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};

export default GridPattern;