import type { MetadataRoute } from 'next';
import axiosInstance from '@/utils/axiosInstance';

export const revalidate = 3600; // Automatically revalidate sitemap cache every hour

const BASE_URL = 'https://aciagro.com';

const STANDARD_POLICY_SLUGS = [
  'privacy-policy',
  'cancellation-policy',
  'shipping-policy',
  'terms-of-service',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Public Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/bulk-order`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blogs/articles`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 2. Fetch Active Products (Backend /api/products returns all active products unpaginated)
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await axiosInstance.get('/products?status=Active');
    const products = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    if (Array.isArray(products)) {
      productPages = products
        .filter((p: any) => p && p.slug && p.status === 'Active')
        .map((p: any) => ({
          url: `${BASE_URL}/products/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
    }
  } catch (err) {
    console.warn('Sitemap: Failed to fetch products dynamically', err);
  }

  // 3. Fetch Active Categories / Collections (Backend /api/categories returns all categories)
  let collectionPages: MetadataRoute.Sitemap = [];
  try {
    const res = await axiosInstance.get('/categories');
    const categories = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    if (Array.isArray(categories)) {
      collectionPages = categories
        .filter((c: any) => c && c.slug && c.status === 'Active')
        .map((c: any) => ({
          url: `${BASE_URL}/collections/${c.slug}`,
          lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
    }
  } catch (err) {
    console.warn('Sitemap: Failed to fetch categories dynamically', err);
  }

  // 4. Fetch ALL Published Blog Articles with Pagination
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    let page = 1;
    let totalPages = 1;
    const allArticles: any[] = [];

    while (page <= totalPages) {
      const res = await axiosInstance.get(`/articles?page=${page}&limit=50`);
      const data = res.data;
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        allArticles.push(...data.data);
        if (data.pagination && typeof data.pagination.pages === 'number') {
          totalPages = data.pagination.pages;
        } else {
          break;
        }
        page++;
      } else if (Array.isArray(data) && data.length > 0) {
        allArticles.push(...data);
        break;
      } else {
        break;
      }
    }

    articlePages = allArticles
      .filter((a: any) => a && a.slug && a.status === 'Published')
      .map((a: any) => ({
        url: `${BASE_URL}/blogs/articles/${a.slug}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
  } catch (err) {
    console.warn('Sitemap: Failed to fetch articles dynamically', err);
  }

  // 5. Fetch Public Policy Pages (matching public policies)
  let policyPages: MetadataRoute.Sitemap = [];
  try {
    const res = await axiosInstance.get('/policies');
    const policies = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    if (Array.isArray(policies) && policies.length > 0) {
      policyPages = policies
        .filter((p: any) => p && p.slug && STANDARD_POLICY_SLUGS.includes(p.slug))
        .map((p: any) => ({
          url: `${BASE_URL}/policies/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        }));
    }
  } catch (err) {
    console.warn('Sitemap: Failed to fetch policies dynamically', err);
  }

  if (policyPages.length === 0) {
    policyPages = STANDARD_POLICY_SLUGS.map((slug) => ({
      url: `${BASE_URL}/policies/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
  }

  const allEntries: MetadataRoute.Sitemap = [
    ...staticPages,
    ...productPages,
    ...collectionPages,
    ...articlePages,
    ...policyPages,
  ];

  // Deduplicate by URL safely to ensure no duplicate entries exist
  const uniqueEntriesMap = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of allEntries) {
    if (entry && entry.url && !uniqueEntriesMap.has(entry.url)) {
      uniqueEntriesMap.set(entry.url, entry);
    }
  }

  return Array.from(uniqueEntriesMap.values());
}
