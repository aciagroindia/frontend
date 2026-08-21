import axiosInstance from "@/utils/axiosInstance";

export interface Discount {
  id: string;
  name: string;
  type: "Percentage" | "Shipping" | "Fixed Amount" | "BOGO";
  value: string | number;
  conditionType?: "ALL_ORDERS" | "FIRST_ORDER" | "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCTS";
  minOrderAmount?: number;
  maxDiscountAmount?: number | null;
  isActive?: boolean;
  products?: number | any[];
}

export const fetchDiscounts = async (): Promise<Discount[]> => {
  const response = await axiosInstance.get("/admin/discounts");
  return response.data.data.map((discount: any) => ({
    ...discount,
    id: discount._id,
    conditionType: discount.conditionType || "ALL_ORDERS",
    minOrderAmount: discount.minOrderAmount || 0,
    maxDiscountAmount: discount.maxDiscountAmount || null,
    isActive: discount.isActive !== false,
    products: Array.isArray(discount.products) ? discount.products.length : 0
  }));
};

export const createDiscount = async (discountData: Omit<Discount, 'id'>): Promise<Discount> => {
  const response = await axiosInstance.post("/admin/discounts", {
    ...discountData,
    value: parseFloat(discountData.value.toString().replace(/[^0-9.]/g, '')),
    minOrderAmount: discountData.minOrderAmount ? Number(discountData.minOrderAmount) : 0,
    maxDiscountAmount: discountData.maxDiscountAmount ? Number(discountData.maxDiscountAmount) : null,
    isActive: discountData.isActive !== false,
    conditionType: discountData.conditionType || "ALL_ORDERS",
    products: []
  });
  const newDiscount = response.data.data;
  return {
    ...newDiscount,
    id: newDiscount._id,
    conditionType: newDiscount.conditionType || "ALL_ORDERS",
    minOrderAmount: newDiscount.minOrderAmount || 0,
    maxDiscountAmount: newDiscount.maxDiscountAmount || null,
    isActive: newDiscount.isActive !== false,
    products: 0
  };
};

export const updateDiscount = async (id: string, discountData: Partial<Omit<Discount, 'id'>>): Promise<Discount> => {
  const cleanedData: any = { ...discountData };
  if (discountData.value !== undefined) {
    cleanedData.value = parseFloat(discountData.value.toString().replace(/[^0-9.]/g, ''));
  }
  if (discountData.minOrderAmount !== undefined) {
    cleanedData.minOrderAmount = Number(discountData.minOrderAmount) || 0;
  }
  if (discountData.maxDiscountAmount !== undefined) {
    cleanedData.maxDiscountAmount = discountData.maxDiscountAmount ? Number(discountData.maxDiscountAmount) : null;
  }
  
  const response = await axiosInstance.put(`/admin/discounts/${id}`, cleanedData);
  const updated = response.data.data;
  return {
    ...updated,
    id: updated._id,
    conditionType: updated.conditionType || "ALL_ORDERS",
    minOrderAmount: updated.minOrderAmount || 0,
    maxDiscountAmount: updated.maxDiscountAmount || null,
    isActive: updated.isActive !== false,
    products: Array.isArray(updated.products) ? updated.products.length : 0
  };
};

export const deleteDiscount = async (id: string): Promise<{ id: string }> => {
  await axiosInstance.delete(`/admin/discounts/${id}`);
  return { id };
};