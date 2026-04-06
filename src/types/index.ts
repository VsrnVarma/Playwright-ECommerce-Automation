export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface OrderDetails {
  cardName: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface ApiResponse {
  responseCode: number;
  message?: string;
  [key: string]: unknown;
}

export interface ApiProductsResponse {
  responseCode: number;
  products: Array<{
    id: number;
    name: string;
    price: string;
    brand: string;
    category: {
      usertype: { usertype: string };
      category: string;
    };
  }>;
}

export interface ApiBrandsResponse {
  responseCode: number;
  brands: Array<{
    id: number;
    brand: string;
  }>;
}

export interface ApiUserResponse {
  responseCode: number;
  user?: {
    id: number;
    name: string;
    email: string;
    title: string;
    birth_day: string;
    birth_month: string;
    birth_year: string;
    first_name: string;
    last_name: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
  };
} 