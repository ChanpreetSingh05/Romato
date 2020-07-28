export interface RestaurantModel {
  id: string;
  email: string;
  contact: number;
  name: string;
  cuisines: string;
  house_no: string;
  st_name: string;
  city: string;
  province: string;
  postal_code: string;
  cost: string;
  imagePath: string;
  cover: string;
  status: boolean;
  active_stts: string;
  additional: Array<string>;
}
