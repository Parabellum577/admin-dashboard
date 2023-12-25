export interface ProductType {
  _id: string;
  name: string;
  place: Place,
  pricing: {
    public: {
      currency: string;
      price: number;
    }
  },
  description: string;
  link: string;
  type: string;
  qrCode: string;
}

export interface Place {
  _id: string;
  name: string;
  code: string;
  description: string;
  address: string;
  membersOnly: true
}

export enum ProductTypes {
  FOOD_AND_BEVERAGE = 'food_and_beverage',
  LUNCH = 'lunch',
  ADDITIONAL_PAYMENT = 'additional_payment',
  WORKSHOP = 'workshop'
}

export const productTypeOptions = [
  { value: ProductTypes.FOOD_AND_BEVERAGE, label: 'Food and Beverage' },
  { value: ProductTypes.LUNCH, label: 'Lunch' },
  { value: ProductTypes.ADDITIONAL_PAYMENT, label: 'Additional Payment' },
  { value: ProductTypes.WORKSHOP, label: 'WorkShop' },
];