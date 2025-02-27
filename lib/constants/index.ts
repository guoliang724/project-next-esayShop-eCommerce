export const APP_NAME = process.env.NEXT_PUBLIC_NAME || "eSayShop";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "eSayShop";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "admin@example.com",
  password: "123456",
};

export const shippingAddressDefaultValues = {
  fullName: "Jone Doe",
  streetAddress: "123 Main st",
  city: "Anytown",
  postalCode: "1234",
  country: "USA",
};
