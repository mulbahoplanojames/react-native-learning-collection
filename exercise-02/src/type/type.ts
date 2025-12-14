export interface CategoryList {
  id: number;
  locationName: string;
  image: string;
  price: number;
  description: string;
  more: {
    category: string;
    country: string;
    rating: number;
    activities: string[];
  };
}
