import axiosInstance from "@/utils/axiosInstance";

export interface Coupon {
  id: string;
  code: string;
  discountType: "Percentage" | "FixedAmount";
  discountValue: number;
  discount?: string;
  minOrderAmount?: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number;
  userUsageLimit?: number;
  usageCount?: number;
  expiryDate?: string;
  isActive?: boolean;
}

export async function fetchCoupons(): Promise<Coupon[]> {
  const response = await axiosInstance.get("/admin/coupons");
  return response.data.data.map((coupon: any) => ({
    ...coupon,
    id: coupon._id,
    discountType: coupon.discountType || (coupon.discount?.includes('%') ? 'Percentage' : 'FixedAmount'),
    discountValue: coupon.discountValue || parseFloat(coupon.discount?.replace(/[^0-9.]/g, '') || '0'),
    minOrderAmount: coupon.minOrderAmount || 0,
    maxDiscountAmount: coupon.maxDiscountAmount || null,
    usageLimit: coupon.usageLimit || 100,
    userUsageLimit: coupon.userUsageLimit || 1,
    usageCount: coupon.usageCount || 0,
    isActive: coupon.isActive !== false,
    expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : ""
  }));
}

export async function createCoupon(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
  const payload = {
    ...coupon,
    code: coupon.code.trim().toUpperCase(),
    discountType: coupon.discountType || "Percentage",
    discountValue: Number(coupon.discountValue) || 0,
    minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0,
    maxDiscountAmount: coupon.maxDiscountAmount ? Number(coupon.maxDiscountAmount) : null,
    usageLimit: coupon.usageLimit ? Number(coupon.usageLimit) : 100,
    userUsageLimit: coupon.userUsageLimit ? Number(coupon.userUsageLimit) : 1,
    isActive: coupon.isActive !== false,
    expiryDate: coupon.expiryDate || null,
  };
  const response = await axiosInstance.post("/admin/coupons", payload);
  const newCoupon = response.data.data;
  return {
    ...newCoupon,
    id: newCoupon._id,
    expiryDate: newCoupon.expiryDate ? new Date(newCoupon.expiryDate).toISOString().split('T')[0] : ""
  };
}

export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
  const payload: any = { ...updates };
  if (updates.code) payload.code = updates.code.trim().toUpperCase();
  if (updates.discountValue !== undefined) payload.discountValue = Number(updates.discountValue);
  if (updates.minOrderAmount !== undefined) payload.minOrderAmount = Number(updates.minOrderAmount);
  if (updates.maxDiscountAmount !== undefined) payload.maxDiscountAmount = updates.maxDiscountAmount ? Number(updates.maxDiscountAmount) : null;
  if (updates.usageLimit !== undefined) payload.usageLimit = Number(updates.usageLimit);
  if (updates.userUsageLimit !== undefined) payload.userUsageLimit = Number(updates.userUsageLimit);
  if (updates.expiryDate !== undefined) payload.expiryDate = updates.expiryDate || null;

  const response = await axiosInstance.put(`/admin/coupons/${id}`, payload);
  const updatedCoupon = response.data.data;
  return {
    ...updatedCoupon,
    id: updatedCoupon._id,
    expiryDate: updatedCoupon.expiryDate ? new Date(updatedCoupon.expiryDate).toISOString().split('T')[0] : ""
  };
}

export async function deleteCoupon(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/coupons/${id}`);
}

export async function fetchAvailableCoupons(): Promise<any[]> {
  const response = await axiosInstance.get("/coupons/available");
  return response.data.data;
}

export async function applyCouponCode(code: string, items: any[]): Promise<any> {
  const response = await axiosInstance.post("/coupons/apply", {
    code: code.trim().toUpperCase(),
    items,
  });
  return response.data;
}
