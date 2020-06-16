export interface RestaurantModel {
  id: string;
  contact: number;
  name: string;
  cuisines: string;
  house_no: string;
  st_name: string;
  city: string;
  province: string;
  postal_code: string;
  cost: string;
  breakfast: boolean;
  takeout: boolean;
  alcohol: boolean;
  parking: boolean;
  indoor_seating: boolean;
  outdoor_seating: boolean;
  kids: boolean;
  wifi: boolean;
  imagePath: string;
}
