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
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <section
        ref={sheetRef}
        className="sheet-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Quick route switcher"
      >
        <header className="sheet-header">
          <h2 className="sheet-title">Quick Actions</h2>
          <button
            type="button"
            onClick={onClose}
            className="sheet-close"
            aria-label="Close route switcher"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </header>

        <div className="sheet-list">
          {items.map((item) => {
            const Icon = icons[item.path as keyof typeof icons];

            return (
              <button
                key={item.path}
                type="button"
                className="sheet-list-item"
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
              >
                <span className="sheet-icon-wrap">
                  {Icon ? (
                    <Icon
                      size={18}
                      strokeWidth={2.3}
                      className="text-teal-700"
                    />
                  ) : null}
                </span>
                <span className="sheet-copy">
                  <span className="sheet-item-title">{item.label}</span>
                  <span className="sheet-item-desc">{item.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
