export interface City {
  _id: string;
  name: string;
  code?: string;
  country: Country;
  timeZone: string;
  placeAllowed: boolean;
  y5PdfUrl?: string;
  localPerks?: string;
}

export interface Country {
  name: string;
  code: string;
  currency: string;
  _id: string;
}
