import logo from "@/assets/piazza-logo.png";

export const Logo = ({ className = "h-12", iconOnly = false }: { className?: string; iconOnly?: boolean }) =>
  iconOnly ? (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <LogoIcon className="h-full w-auto" />
    </span>
  ) : (
    <img src={logo} alt="Piazza Aldeota" className={`${className} w-auto object-contain rounded-2xl`} />
  );

export const LogoIcon = ({ className = "h-10 w-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M50 5 C20 5 8 25 8 55 C8 90 30 110 50 115 C70 110 92 90 92 55 C92 25 80 5 50 5 Z" fill="hsl(var(--primary))"/>
    <g fill="hsl(var(--cream))">
      <rect x="48" y="30" width="4" height="80" rx="1"/>
      {[...Array(7)].map((_, i) => {
        const y = 36 + i * 10;
        const w = 8 + i * 3;
        return (
          <g key={i}>
            <ellipse cx={50 - w} cy={y} rx={w * 0.7} ry="3.5" transform={`rotate(-20 ${50 - w} ${y})`} />
            <ellipse cx={50 + w} cy={y} rx={w * 0.7} ry="3.5" transform={`rotate(20 ${50 + w} ${y})`} />
          </g>
        );
      })}
      <ellipse cx="50" cy="28" rx="6" ry="8" />
    </g>
  </svg>
);
