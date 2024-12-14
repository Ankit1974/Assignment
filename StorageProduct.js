import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get all products from AsyncStorage
export const getProducts = async () => {
  const products = await AsyncStorage.getItem('products');
  return products ? JSON.parse(products) : [];
};

// Function to save a new product to AsyncStorage
export const saveProduct = async (product) => {
  const products = await getProducts();
  products.push(product);
  await AsyncStorage.setItem('products', JSON.stringify(products));
};

// Function to delete a product from AsyncStorage by its id
export const deleteProduct = async (id) => {
  let products = await getProducts();
  products = products.filter(product => product.id !== id);
  await AsyncStorage.setItem('products', JSON.stringify(products));
};

// Function to check if a product with the same name already exists
export const isProductDuplicate = async (name) => {
  const products = await getProducts();
  return products.some(product => product.name === name);
};
