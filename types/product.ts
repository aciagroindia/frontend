export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  slug: string;
  // optional rating out of five
  rating?: number;
}