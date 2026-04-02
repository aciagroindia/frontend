"use client";

import Image from "next/image";
import styles from "./BookAppointment.module.css";

export default function BookAppointment() {
  return (
    <section className={styles.section}>
      <div className={styles.poster}>
        <Image
          src="/certifiedIcons/appointmentPoster.png"
          alt="Book your appointment"
          fill
          className={styles.image}
          priority
        />
        <div className={styles.overlay}>
          <h2 className={styles.title}>Book Your Appointment</h2>
          <p className={styles.subtitle}>
            Get expert consultation & personalized health guidance.
          </p>
          <button
            className={styles.button}
            onClick={() => window.location.href = "/appointment"}
            aria-label="Book Now"
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
}
