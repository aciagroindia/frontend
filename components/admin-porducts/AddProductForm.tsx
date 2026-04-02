"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useCategories } from "../../context/CategoryContext";
import { Product } from "../../context/ProductContext";
import styles from "./AddProductForm.module.css";

// Proper Interfaces
interface FaqItem { id: number; question: string; answer: string; }
interface PackageItem { id: number; name: string; details: string; price: string; regularPrice: string; discount: string; badge: string; }

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  status: "Active" | "Inactive";
  category: string;
  unit: string;
  faqs: FaqItem[];
  packages: PackageItem[];
  image?: File | null; // Nayi Main Image file
  images?: File[];     // Nayi Gallery Image files
}

interface Props {
  initialData?: Product | null;
  onSubmit: (data: FormData) => Promise<boolean>;
  buttonText?: string;
  isSubmitting: boolean;
}

export default function ProductForm({ initialData, onSubmit, buttonText = "Submit", isSubmitting }: Props) {
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: "", description: "", price: "", stock: "", status: "Active",
    category: "", unit: "", faqs: [], packages: [], image: null, images: [],
  });

  // State for visual previews and tracking
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<string[]>([]); // DB Gallery (Minus Main)
  const [newGalleryPreview, setNewGalleryPreview] = useState<string[]>([]); // Local Gallery
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: String(initialData.price || ""),
        stock: String(initialData.stock || ""),
        status: initialData.status || "Active",
        category: initialData.category?._id || "",
        unit: initialData.unit || "",
        faqs: initialData.faqs?.map((faq, index) => ({
          ...faq,
          id: Math.random() + index, // Add a unique ID for the form state
        })) || [],
        packages: initialData.packages?.map(p => ({
          ...p,
          id: Math.random(),
          price: String(p.price),
          regularPrice: String(p.regularPrice || ""),
          discount: String(p.discount || ""),
          details: p.details || "",
          badge: p.badge || ""
        })) || [],
        image: null,
        images: [],
      });

      // FIX 1: Duplication hatane ke liye filter use kiya hai
      // Agar images array mein main image hai, toh use gallery se hata do
      const mainImg = initialData.image || null;
      const gallery = (initialData.images || []).filter(img => img !== mainImg);

      setMainImagePreview(mainImg);
      setExistingGallery(gallery);
      setNewGalleryPreview([]);
      setImagesToDelete([]);
    } else {
      // Reset logic for Add mode...
      setFormData({ name: "", description: "", price: "", stock: "", status: "Active", category: "", unit: "", faqs: [], packages: [], image: null, images: [] });
      setMainImagePreview(null);
      setExistingGallery([]);
      setNewGalleryPreview([]);
      setImagesToDelete([]);
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    
    // Create temporary variables to manage state before setting it
    let newMainFile = formData.image;
    let newGalleryFiles = [...(formData.images || [])];
    let newMainPreviewUrl = mainImagePreview;

    // BEHAVIOR: A new file only becomes the main image if the main image slot is currently empty.
    // This happens only when all previous images have been removed.
    if (!newMainPreviewUrl && selectedFiles.length > 0) {
      const firstFile = selectedFiles.shift()!; // Take the first file for the main slot
      newMainFile = firstFile;
      newMainPreviewUrl = URL.createObjectURL(firstFile);
    }

    // BEHAVIOR: All other selected files are always appended to the new gallery.
    newGalleryFiles.push(...selectedFiles);

    // Validate total number of images
    const totalCount = (newMainPreviewUrl ? 1 : 0) + existingGallery.length + newGalleryFiles.length;
    if (totalCount > 8) {
      alert("A maximum of 8 images (1 main + 7 gallery) are allowed.");
      return; // Abort changes if limit is exceeded
    }

    // If validation passes, update the component's state
    setFormData(prev => ({ ...prev, image: newMainFile, images: newGalleryFiles }));
    setMainImagePreview(newMainPreviewUrl);
    setNewGalleryPreview(newGalleryFiles.map(f => URL.createObjectURL(f)));
  };

  const handleRemoveMainImage = () => {
    // If the image being removed is an existing one from the DB, mark it for deletion.
    const originalDbImages = [initialData?.image, ...(initialData?.images || [])].filter(Boolean);
    if (mainImagePreview && originalDbImages.includes(mainImagePreview)) {
        setImagesToDelete(prev => [...prev, mainImagePreview!]);
    }

    // BEHAVIOR: Promote the next available image from the gallery to be the new main image.
    if (existingGallery.length > 0) {
        const [newMainUrl, ...restOfExisting] = existingGallery;
        setMainImagePreview(newMainUrl);
        setExistingGallery(restOfExisting);
        setFormData(prev => ({ ...prev, image: null })); // It's an existing image, not a new file.
    } else if (formData.images && formData.images.length > 0) {
        const [newMainFile, ...restOfNew] = formData.images;
        setMainImagePreview(URL.createObjectURL(newMainFile));
        setFormData(prev => ({ ...prev, image: newMainFile, images: restOfNew }));
        setNewGalleryPreview(restOfNew.map(f => URL.createObjectURL(f)));
    } else {
        // No images left in any gallery, so clear the main image.
        setMainImagePreview(null);
        setFormData(prev => ({ ...prev, image: null }));
    }
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingGallery(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    const updatedFiles = formData.images?.filter((_, index) => index !== indexToRemove) || [];
    setFormData(prev => ({ ...prev, images: updatedFiles }));
    setNewGalleryPreview(updatedFiles.map(f => URL.createObjectURL(f)));
  };

  // FAQ and Package handlers...
  const handleFaqChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFaqs = formData.faqs.map((faq, i) => i === index ? { ...faq, [name]: value } : faq);
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
  };

  const addFaq = () => setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { id: Date.now(), question: "", answer: "" }] }));
  const removeFaq = (index: number) => setFormData(prev => ({ ...prev, faqs: formData.faqs.filter((_, i) => i !== index) }));

  const handlePackageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = formData.packages.map((pkg, i) => i === index ? { ...pkg, [name]: value } : pkg);
    setFormData(prev => ({ ...prev, packages: updated }));
  };

  const addPackage = () => setFormData(prev => ({ ...prev, packages: [...prev.packages, { id: Date.now(), name: "", details: "", price: "", regularPrice: "", discount: "", badge: "" }] }));
  const removePackage = (index: number) => setFormData(prev => ({ ...prev, packages: formData.packages.filter((_, i) => i !== index) }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formPayload = new FormData();
    // Append standard fields
    ['name', 'description', 'price', 'stock', 'status', 'category', 'unit'].forEach(key => {
      formPayload.append(key, (formData as any)[key]);
    });

    if (initialData?._id) {
      formPayload.append("id", initialData._id);
    }

    formPayload.append('faqs', JSON.stringify(formData.faqs.map(({ question, answer }) => ({ question, answer }))));
    formPayload.append('packages', JSON.stringify(formData.packages.map(({ id, ...rest }) => ({
      ...rest,
      price: Number(rest.price),
      regularPrice: rest.regularPrice ? Number(rest.regularPrice) : undefined,
      discount: rest.discount ? Number(rest.discount) : undefined,
    }))));

    if (formData.image) formPayload.append('image', formData.image);
    if (formData.images) formData.images.forEach(file => formPayload.append('images', file));
    if (imagesToDelete.length > 0) formPayload.append('imagesToDelete', JSON.stringify(imagesToDelete));

    await onSubmit(formPayload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        {/* Text Inputs */}
        <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
        <input name="unit" placeholder="Unit" value={formData.unit} onChange={handleChange} />
        
        <select name="category" value={formData.category} onChange={handleChange} required disabled={categoriesLoading}>
          <option value="" disabled>Category</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
        
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        
        {/* IMAGE SECTION */}
        <div className={styles.inputGroup} style={{ gridColumn: '1 / -1', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <label>Images (1 Main Green Border + 7 Gallery)</label>
          <input type="file" multiple onChange={handleFileChange} className={styles.fileInput} accept="image/*" required={!mainImagePreview} />
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            {/* MAIN IMAGE */}
            {mainImagePreview && (
              <div className={styles.imagePreviewContainer} style={{ position: 'relative', width: '50px', height: '50px' }}>
                <img src={mainImagePreview} alt="Main" className={styles.previewImage} style={{ width: '100%', height: '100%', objectFit: 'cover', border: '2px solid #198754', borderRadius: '6px' }} />
                <button type="button" onClick={handleRemoveMainImage} className={styles.removeImageBtn}>&times;</button>
              </div>
            )}
            
            {/* EXISTING DB GALLERY */}
            {existingGallery.map((imgUrl, index) => (
              <div key={`existing-${index}`} className={styles.imagePreviewContainer} style={{ position: 'relative', width: '50px', height: '50px' }}>
                <img src={imgUrl} alt="Existing" className={styles.previewImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                <button type="button" onClick={() => handleRemoveExistingImage(imgUrl)} className={styles.removeImageBtn}>&times;</button>
              </div>
            ))}

            {/* NEW UPLOADED GALLERY (Always at the end) */}
            {newGalleryPreview.map((imgUrl, index) => (
              <div key={`new-${index}`} className={styles.imagePreviewContainer} style={{ position: 'relative', width: '50px', height: '50px' }}>
                <img src={imgUrl} alt="New" className={styles.previewImage} style={{ width: '100%', height: '100%', objectFit: 'cover', border: '2px dashed #198754', borderRadius: '6px' }} />
                <button type="button" onClick={() => handleRemoveNewImage(index)} className={styles.removeImageBtn}>&times;</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.inputGroup}>
        <textarea className={styles.descriptionInput} name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      </div>
      
      {/* FAQ & Packages logic remains same as per your UI */}
      {/* FAQ Section */}
      <div className={styles.faqSection}>
        <h4>Frequently Asked Questions</h4>
        {formData.faqs.map((faq: FaqItem, index: number) => (
          <div key={faq.id} className={styles.faqItem}>
            <input name="question" placeholder={`Question #${index + 1}`} value={faq.question} onChange={(e) => handleFaqChange(index, e)} className={styles.faqQuestionInput} required />
            <textarea name="answer" placeholder={`Answer for question #${index + 1}`} value={faq.answer} onChange={(e) => handleFaqChange(index, e)} className={styles.faqAnswerInput} required />
            <button type="button" onClick={() => removeFaq(index)} className={styles.removeFaqBtn}>&times;</button>
          </div>
        ))}
        <button type="button" onClick={addFaq} className={styles.addFaqBtn}>+ Add FAQ</button>
      </div>

      {/* Packages Section */}
      <div className={styles.packageSection}>
        <h4>Product Packages (Variants)</h4>
        {formData.packages.map((pkg: PackageItem, index: number) => (
          <div key={pkg.id} className={styles.packageItem}>
            <div className={styles.packageItemRow}>
              <input name="name" placeholder="Package Name" value={pkg.name} onChange={(e) => handlePackageChange(index, e)} required />
              <input name="details" placeholder="Details" value={pkg.details} onChange={(e) => handlePackageChange(index, e)} />
              <input name="price" type="number" placeholder="Price" value={pkg.price} onChange={(e) => handlePackageChange(index, e)} required />
            </div>
            <div className={styles.packageItemRow}>
              <input name="regularPrice" type="number" placeholder="Regular Price" value={pkg.regularPrice} onChange={(e) => handlePackageChange(index, e)} />
              <input name="discount" type="number" placeholder="Discount %" value={pkg.discount} onChange={(e) => handlePackageChange(index, e)} />
              <input name="badge" placeholder="Badge" value={pkg.badge} onChange={(e) => handlePackageChange(index, e)} />
            </div>
            <button type="button" onClick={() => removePackage(index)} className={styles.removePackageBtn}>&times;</button>
          </div>
        ))}
        <button type="button" onClick={addPackage} className={styles.addPackageBtn}><span>+ Add New Package Variant</span></button>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>{isSubmitting ? "Saving..." : buttonText}</button>
    </form>
  );
}