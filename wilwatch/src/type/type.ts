import { ImageSourcePropType } from "react-native";

export interface CategoriesType {
  name: string;
  image: ImageSourcePropType;
}

export interface FeaturedItemsType {
  name: string;
  description: string;
  image: ImageSourcePropType;
}
