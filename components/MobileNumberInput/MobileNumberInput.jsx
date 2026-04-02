"use client";

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "./MobileNumberInput.module.css";

export default function MobileNumberInput({ value, onChange }) {
  return (
    <div className={styles.phoneWrapper}>
      <PhoneInput
        country="in"
        value={value}
        onChange={(phone) => onChange(phone)}
        countryCodeEditable={false}
        enableSearch={false}
        disableSearchIcon={true}
      />
    </div>
  );
}
