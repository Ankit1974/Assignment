import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import {saveProduct, isProductDuplicate} from './StorageProduct';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window'); // Screen dimensions


const AddProductPage = ({navigation}) => {
  // State variables to store product name, price, image, and loading state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to get saved products from AsyncStorage
const getSavedProducts = async () => {
  try {
    const products = await AsyncStorage.getItem('products');
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error retrieving products:', error);
    return [];
  }
};

  // Helper function to show Toast messages
  const showToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  // Function to handle adding a product
  const handleAddProduct = async () => {
    // Validate input fields
    if (!name || !price) {
      showToast('Name and Price are required');
      return;
    }
  
    if (isNaN(price) || Number(price) <= 0) {
      showToast('Price must be a positive number');
      return;
    }
  
    if (await isProductDuplicate(name)) {
      showToast('Product already exists');
      return;
    }
  
    if (!image) {
      showToast('Please select an image for the product');
      return;
    }
  
    // Set loading state to true
    setLoading(true);
    try {
      const newProduct = { name, price, image, id: Date.now() };  // Create a new product object
  
      //console.log('Saving new product:', newProduct); // Log the product to be saved
  
      await saveProduct(newProduct); // Save the product
  
      console.log('Product saved successfully'); // Log successful save
  
      // Check if the product is saved by retrieving it from local storage
      const savedProducts = await getSavedProducts(); // Retrieve saved products
      console.log('Saved products:', savedProducts); // Log the saved products
  
      setName('');
      setPrice('');
      setImage(null);
      navigation.goBack(); // Go back to previous screen
  
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error saving product');
    } finally {
      setLoading(false);
    }
  };
  


  // Function to handle image selection
  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        showToast('Image selection cancelled');
      } else if (response.errorCode) {
        showToast(`Error: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImage(selectedImage.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Input field for product name */}
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />

      {/* Input field for product price */}
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        placeholderTextColor="gray"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Button to select an image */}
      <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
        {image ? (
          <Image source={{uri: image}} style={styles.imagePreview} />
        ) : (
          <Icon name="photo-library" size={30} color="black" />
        )}
      </TouchableOpacity>

      {/* Show loading indicator or Add Product button */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  input: {
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.03,
    borderRadius: 4,
    color: 'black',
    fontSize: width * 0.04,
  },
  imageButton: {
    backgroundColor: 'white',
    padding: height * 0.05,
    borderRadius: 10,
    marginBottom: height * 0.01,
    alignItems: 'center',
    marginHorizontal: width * 0.1,
  },
  imagePreview: {
    width: width * 0.8,
    height: width * 0.5,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.03,
    marginHorizontal: 15,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
});

export default AddProductPage;
