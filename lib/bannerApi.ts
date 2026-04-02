import axiosInstance from "@/utils/axiosInstance";

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
  status: "Active" | "Inactive";
}

// 🔥 Common mapper (DRY principle)
const mapBanner = (banner: any): Banner => ({
  id: banner._id,
  title: banner.title,
  imageUrl: banner.imageUrl,
  order: Number(banner.order),
  status: banner.status,
});

// 🔥 GET BANNERS
export async function fetchBanners(admin = false): Promise<Banner[]> {
  try {
    const response = await axiosInstance.get(
      `/banners${admin ? "?admin=true" : ""}`
    );

    if (!Array.isArray(response.data)) return [];

    return response.data.map(mapBanner);
  } catch (error: any) {
    console.error("Fetch banners error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch banners"
    );
  }
}

// 🔥 CREATE BANNER
export async function createBanner(
  bannerData: Omit<Banner, "id" | "order"> & {
    order: string | number;
    imageUrl: File | string;
  }
): Promise<Banner> {
  try {
    const formData = new FormData();
    formData.append("title", bannerData.title);
    formData.append("order", String(bannerData.order));
    formData.append("status", bannerData.status);

    // ✅ Only append file if it's actually a File
    if (bannerData.imageUrl && typeof bannerData.imageUrl === "object") {
      formData.append("image", bannerData.imageUrl);
    }

    const response = await axiosInstance.post("/banners", formData);

    return mapBanner(response.data);
  } catch (error: any) {
    console.error("Create banner error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to create banner"
    );
  }
}

// 🔥 UPDATE BANNER
export async function updateBanner(
  id: string,
  bannerData: Partial<Omit<Banner, "id" | "order">> & {
    order?: string | number;
    imageUrl?: File | string;
  }
): Promise<Banner> {
  try {
    const formData = new FormData();

    if (bannerData.title) formData.append("title", bannerData.title);
    if (bannerData.order !== undefined)
      formData.append("order", String(bannerData.order));
    if (bannerData.status) formData.append("status", bannerData.status);

    if (bannerData.imageUrl && typeof bannerData.imageUrl === "object") {
      formData.append("image", bannerData.imageUrl);
    }

    const response = await axiosInstance.put(`/banners/${id}`, formData);

    return mapBanner(response.data);
  } catch (error: any) {
    console.error("Update banner error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to update banner"
    );
  }
}

// 🔥 DELETE BANNER
export async function deleteBanner(
  id: string
): Promise<{ id: string }> {
  try {
    await axiosInstance.delete(`/banners/${id}`);
    return { id };
  } catch (error: any) {
    console.error("Delete banner error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to delete banner"
    );
  }
}