"use client";

import styles from "./page.module.css";
import MobileNumberInput from "../../MobileNumberInput/MobileNumberInput";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function OrderForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !phone || !message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/inquiries", {
        name: firstName,
        email,
        mobile: phone,
        message,
      });
      if (res.data.success) {
        toast.success("Inquiry submitted! We'll contact you soon.");
        setFirstName("");
        setEmail("");
        setPhone("");
        setMessage("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h3 className={styles.title}>
          Looking for bulk orders at ACI?
        </h3>
        <p className={styles.text}>
          filled our the form below & our team will get back to you within 12
          hours
        </p>
        <input 
          type="text" 
          placeholder="First name" 
          className={styles.input} 
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input 
          type="email" 
          placeholder="Email" 
          className={styles.input} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <MobileNumberInput
          value={phone}
          onChange={(val: string) => setPhone(val)}
        />
        <textarea
          name="message"
          placeholder="Message"
          className={styles.input}
          style={{ height: "120px", resize: "none" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className={styles.button}>Submit</button>
        <p className={styles.text}>By signing up, you agree to receive marketing messages at the phone number or email provided. Msg and data rates may apply. View our privacy policy and terms of service for more info.</p>
      </form>

      <section className={styles.whyChooseUs}>
        <div className={styles.whyChooseWrapper}>
            <h2 className={styles.whyChooseTitle}>WHY CHOOSE ACI FOR BULK ORDERS?</h2>
            <ul>
                <li className={styles.listItem}><span> Trusted Brand: </span> Authentic Ayurvedic remedies backed by research.</li>
                <li className={styles.listItem}><span>Customizable Options: </span> Products tailored to your needs.</li>
                <li className={styles.listItem}><span>Affordable Pricing: </span> Competitive rates for premium quality.</li>
            </ul>
        </div>

        <div className={styles.whyChooseWrapper}>
            <h2 className={styles.whyChooseTitle}>WHY CHOOSE ACI FOR BULK ORDERS?</h2>
            <ul>
                <li className={styles.listItem}><span> Trusted Brand: </span> Authentic Ayurvedic remedies backed by research.</li>
                <li className={styles.listItem}><span>Customizable Options: </span> Products tailored to your needs.</li>
                <li className={styles.listItem}><span>Affordable Pricing: </span> Competitive rates for premium quality.</li>
            </ul>
        </div>
      </section>
    </section>
  );
}
