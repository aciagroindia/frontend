import axiosInstance from "@/utils/axiosInstance";

export interface Discount {
  id: string;
  name: string;
  type: "Percentage" | "Shipping" | "Fixed Amount" | "BOGO";
  value: string;
  products: number | any[];
}

export const fetchDiscounts = async (): Promise<Discount[]> => {
  const response = await axiosInstance.get("/admin/discounts");
  return response.data.data.map((discount: any) => ({
    ...discount,
    id: discount._id,
    products: Array.isArray(discount.products) ? discount.products.length : 0
  }));
};

export const createDiscount = async (discountData: Omit<Discount, 'id'>): Promise<Discount> => {
  const response = await axiosInstance.post("/admin/discounts", {
    ...discountData,
    value: parseFloat(discountData.value.toString().replace(/[^0-9.]/g, '')),
    products: [] // For now, empty array as selection is not implemented in the current UI
  });
  const newDiscount = response.data.data;
  return {
    ...newDiscount,
    id: newDiscount._id,
    products: 0
  };
};

export const updateDiscount = async (id: string, discountData: Partial<Omit<Discount, 'id'>>): Promise<Discount> => {
  // Extract numeric value if type is Percentage or Fixed Amount
  const cleanedData: any = { ...discountData };
  if (discountData.value) {
    cleanedData.value = parseFloat(discountData.value.toString().replace(/[^0-9.]/g, ''));
  }
  
  const response = await axiosInstance.put(`/admin/discounts/${id}`, cleanedData);
  const updated = response.data.data;
  return {
    ...updated,
    id: updated._id,
    products: Array.isArray(updated.products) ? updated.products.length : 0
  };
};

export const deleteDiscount = async (id: string): Promise<{ id: string }> => {
  await axiosInstance.delete(`/admin/discounts/${id}`);
  return { id };
};