const bars = [
  [20, 100, 130],
  [50, 70, 110],
  [80, 40, 90],
  [110, 60, 120],
  [140, 30, 70],
  [170, 80, 140],
  [200, 50, 100],
  [230, 20, 60],
  [260, 45, 95],
  [290, 15, 55],
  [320, 35, 85],
  [350, 10, 50],
];

const ChartIllustration = () => {
  return (
    <svg
      className="w-full h-40"
      viewBox="0 0 400 160"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {bars.map(([x, top, bottom], index) => (
        <rect
          key={x}
          x={x}
          y={top}
          width="14"
          height={bottom - top}
          rx="2"
          fill={index % 3 === 0 ? '#53D388' : '#475569'}
          opacity="0.85"
        />
      ))}

      <path
        d="M0 120 L40 90 L80 100 L120 60 L160 75 L200 40 L240 55 L280 25 L320 45 L360 15 L400 30"
        stroke="#53D388"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChartIllustration;