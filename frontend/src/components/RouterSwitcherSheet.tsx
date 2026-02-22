import { Bot, ClipboardPenLine, Mic, ScanText, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SECONDARY_ROUTES } from "../routes";

type RouteSwitcherSheetProps = {
  open: boolean;
  onClose: () => void;
};

const icons = {
  "/assistant": Bot,
  "/voice-log": Mic,
  "/scanner": ScanText,
  "/discharge-summary": ClipboardPenLine,
} as const;

export default function RouteSwitcherSheet({
  open,
  onClose,
}: RouteSwitcherSheetProps) {
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], [tabindex]:not([tabindex='-1'])",
    );

    focusable?.[0]?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        "button, [href], [tabindex]:not([tabindex='-1'])",
      );

      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  const items = useMemo(() => SECONDARY_ROUTES, []);

  if (!open) {
    return null;
  }

  return (
    <div className="sheet-backdrop" style={{ backdropFilter: "blur(4px)" }} onClick={onClose} role="presentation">
      <section
        ref={sheetRef}
        className="sheet-panel glass-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Quick route switcher"
      >
        <header className="sheet-header border-b border-[var(--border-subtle)] pb-4 mb-4">
          <h2 className="text-[15px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Quick Actions</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white grid place-items-center shadow-sm border border-[var(--border-subtle)] transition-transform hover:scale-105"
            aria-label="Close route switcher"
          >
            <X size={16} strokeWidth={2.5} style={{ color: "var(--text-primary)" }} />
          </button>
        </header>

        <div className="sheet-list">
          {items.map((item) => {
            const Icon = icons[item.path as keyof typeof icons];

            return (
              <button
                key={item.path}
                type="button"
                className="sheet-list-item hover:scale-[1.01] transition-transform shadow-sm mb-2 rounded-2xl"
                style={{ backgroundColor: "var(--bg-glass)", border: "1px solid var(--border-glass)" }}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
              >
                <span className="sheet-icon-wrap shadow-sm border border-[var(--border-subtle)]" style={{ backgroundColor: "white", color: "var(--primary)" }}>
                  {Icon ? (
                    <Icon
                      size={18}
                      strokeWidth={2.3}
                    />
                  ) : null}
                </span>
                <span className="sheet-copy flex flex-col items-start text-left">
                  <span className="text-[15px] text-[var(--text-primary)] font-bold tracking-tight">{item.label}</span>
                  <span className="text-[13px] text-[var(--text-muted)] font-medium mt-0.5">{item.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
