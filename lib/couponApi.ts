import axiosInstance from "@/utils/axiosInstance";

export interface Coupon {
  id: string;
  code: string;
  discount: string;
  usageLimit: string;
  expiryDate: string;
}

export async function fetchCoupons(): Promise<Coupon[]> {
  const response = await axiosInstance.get("/admin/coupons");
  return response.data.data.map((coupon: any) => ({
    ...coupon,
    id: coupon._id,
    expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : "N/A"
  }));
}

export async function createCoupon(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
  const response = await axiosInstance.post("/admin/coupons", coupon);
  const newCoupon = response.data.data;
  return {
    ...newCoupon,
    id: newCoupon._id,
    expiryDate: newCoupon.expiryDate ? new Date(newCoupon.expiryDate).toISOString().split('T')[0] : "N/A"
  };
}

export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
  const response = await axiosInstance.put(`/admin/coupons/${id}`, updates);
  const updatedCoupon = response.data.data;
  return {
    ...updatedCoupon,
    id: updatedCoupon._id,
    expiryDate: updatedCoupon.expiryDate ? new Date(updatedCoupon.expiryDate).toISOString().split('T')[0] : "N/A"
  };
}

export async function deleteCoupon(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/coupons/${id}`);
}
