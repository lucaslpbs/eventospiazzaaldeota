import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export const Modal = ({ open, onClose, children, dark = true }: {
  open: boolean; onClose: () => void; children: React.ReactNode; dark?: boolean;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
        >
          <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm" onClick={onClose} />
          <div className="relative min-h-full flex items-start sm:items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative w-full max-w-4xl my-auto rounded-3xl border border-accent/30 shadow-teal overflow-hidden ${
              dark ? "bg-charcoal text-cream" : "bg-background text-foreground"
            }`}
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 rounded-full p-2 bg-accent/20 hover:bg-accent text-accent hover:text-charcoal transition-colors">
              <X size={20} />
            </button>
            {children}
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
