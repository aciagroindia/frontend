"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./ConfirmationModal.module.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} style={{ maxWidth: '450px' }}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.modalCloseButton}><X size={20} /></button>
        </div>
        <div className={styles.modalForm} style={{ paddingBottom: '1rem' }}>
          <p style={{ margin: 0, lineHeight: 1.5, color: '#495057' }}>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose} className={styles.secondaryButton}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={`${styles.primaryButton} ${styles.danger}`}>
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;