"use client";

import styles from "./page.module.css";
import MobileNumberInput from "../../MobileNumberInput/MobileNumberInput";
import { useState, type FormEvent } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function OrderForm() {
  const [firstName, setFirstName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productRequired, setProductRequired] = useState("");
  const [quantity, setQuantity] = useState("");
  const [packagingSize, setPackagingSize] = useState("");
  const [packagingType, setPackagingType] = useState("");
  const [manufacturingRequirement, setManufacturingRequirement] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !companyName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !productRequired ||
      !quantity ||
      !packagingSize ||
      !packagingType ||
      !manufacturingRequirement
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await axiosInstance.post("/bulk-orders", {
        firstName: firstName.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        phone,
        productRequired,
        quantity,
        packagingSize,
        packagingType,
        manufacturingRequirement,
        message: message.trim(),
      });

      if (res.data.success) {
        toast.success("B2B enquiry submitted! Our team will contact you soon.");

        setFirstName("");
        setCompanyName("");
        setEmail("");
        setPhone("");
        setProductRequired("");
        setQuantity("");
        setPackagingSize("");
        setPackagingType("");
        setManufacturingRequirement("");
        setMessage("");
      } else {
        toast.error(res.data.message || "Unable to submit enquiry.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h3 className={styles.title}>
          Partner With ACI Agro Solutions
        </h3>

        <p className={styles.text}>
          Looking for bulk supply, private label or contract manufacturing?
          Share your requirements and our team will get back to you.
        </p>

        <input
          type="text"
          placeholder="Contact Person Name *"
          className={styles.input}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Company / Brand Name *"
          className={styles.input}
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Business Email *"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <MobileNumberInput
          value={phone}
          onChange={(val: string) => setPhone(val)}
        />

        <select
          className={styles.input}
          value={productRequired}
          onChange={(e) => setProductRequired(e.target.value)}
          required
        >
          <option value="">Select Product Required *</option>
          <option value="Noni Juice">Noni Juice</option>
          <option value="Sea Buckthorn Juice">Sea Buckthorn Juice</option>
          <option value="Moringa Juice">Moringa Juice</option>
          <option value="Herbal Juice">Herbal Juice</option>
          <option value="Custom Formulation">Custom Formulation</option>
          <option value="Other">Other</option>
        </select>

        <select
          className={styles.input}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        >
          <option value="">Select Quantity Required *</option>
          <option value="1000-2000 bottles">1,000–2,000 Bottles</option>
          <option value="2000-5000 bottles">2,000–5,000 Bottles</option>
          <option value="5000-10000 bottles">5,000–10,000 Bottles</option>
          <option value="10000+ bottles">10,000+ Bottles</option>
          <option value="Other">Other Quantity</option>
        </select>

        <select
          className={styles.input}
          value={packagingSize}
          onChange={(e) => setPackagingSize(e.target.value)}
          required
        >
          <option value="">Select Packaging Size *</option>
          <option value="200ml">200 ml</option>
          <option value="400ml">400 ml</option>
          <option value="500ml">500 ml</option>
          <option value="1L">1 Litre</option>
          <option value="Custom Size">Custom Size</option>
        </select>

        <select
          className={styles.input}
          value={packagingType}
          onChange={(e) => setPackagingType(e.target.value)}
          required
        >
          <option value="">Select Packaging Type *</option>
          <option value="PET Bottle">PET Bottle</option>
          <option value="Glass Bottle">Glass Bottle</option>
          <option value="Custom Packaging">Custom Packaging</option>
          <option value="Open to Suggestions">Open to Suggestions</option>
        </select>

        <select
          className={styles.input}
          value={manufacturingRequirement}
          onChange={(e) => setManufacturingRequirement(e.target.value)}
          required
        >
          <option value="">Select Manufacturing Requirement *</option>
          <option value="Contract Manufacturing">Contract Manufacturing</option>
          <option value="Private Label Manufacturing">Private Label Manufacturing</option>
          <option value="Bulk Juice Supply">Bulk Juice Supply</option>
          <option value="Custom Formulation">Custom Formulation</option>
        </select>

        <textarea
          name="message"
          placeholder="Additional Details (Optional)"
          className={styles.input}
          style={{ height: "120px", resize: "none" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit B2B Enquiry"}
        </button>

        <p className={styles.text}>
          By submitting this form, you agree to be contacted by ACI Agro
          Solutions regarding your business enquiry. Please read our Privacy
          Policy for more information.
        </p>
      </form>

      <section className={styles.whyChooseUs}>
        <div className={styles.whyChooseWrapper}>
          <h2 className={styles.whyChooseTitle}>
            WHY PARTNER WITH ACI?
          </h2>
          <ul>
            <li className={styles.listItem}>
              <span>Bulk Manufacturing: </span>
              Solutions for business and bulk supply requirements.
            </li>
            <li className={styles.listItem}>
              <span>Product Range: </span>
              Multiple herbal juice options for your brand.
            </li>
            <li className={styles.listItem}>
              <span>Flexible Quantities: </span>
              Discuss order quantities according to your requirements.
            </li>
          </ul>
        </div>

        <div className={styles.whyChooseWrapper}>
          <h2 className={styles.whyChooseTitle}>
            OUR MANUFACTURING SUPPORT
          </h2>
          <ul>
            <li className={styles.listItem}>
              <span>Private Label: </span>
              Product branding and packaging options.
            </li>
            <li className={styles.listItem}>
              <span>Packaging Choices: </span>
              Discuss bottle sizes and packaging formats.
            </li>
            <li className={styles.listItem}>
              <span>Custom Requirements: </span>
              Share your product and formulation requirements with our team.
            </li>
          </ul>
        </div>
      </section>
    </section>
  );
}
