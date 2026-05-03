import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    document.documentElement.classList.add("has-custom-cursor");
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [role=button], input, textarea, label"));
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999] rounded-full mix-blend-difference transition-[width,height] duration-200"
      style={{
        left: pos.x,
        top: pos.y,
        width: hover ? 36 : 16,
        height: hover ? 36 : 16,
        transform: "translate(-50%, -50%)",
        background: "hsl(167 39% 60%)",
      }}
    />
  );
};
