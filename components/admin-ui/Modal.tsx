"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react"; // Consistent icons
import styles from "./Modal.module.css";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Modal ka title optional rakha hai
}

export default function Modal({ children, isOpen, onClose, title }: Props) {
  
  // 1. Keyboard support (ESC key) aur Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent background scroll
      
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* stopPropagation ensures modal doesn't close when clicking inside it */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {children}
        </div>

      </div>
    </div>
  );
}