import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  RefreshControl,
  Dimensions
} from 'react-native';
import { ToastAndroid } from 'react-native';
import { getProducts, deleteProduct } from './StorageProduct';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get screen width and height
const { width, height } = Dimensions.get('window');

const HomePage = ({ navigation }) => {
  // State variables to store products, search query, loading state, and refreshing state
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Function to fetch products from storage
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const storedProducts = await getProducts();
      setProducts(storedProducts);
    } catch (error) {
      ToastAndroid.show('Error fetching products', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search query input
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterProducts(query);
  };

  // Function to filter products based on search query
  const filterProducts = (query) => {
    if (!query) {
      fetchProducts();
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
    }
  };

  // Function to handle product deletion
  const handleDelete = (id) => {
    deleteProduct(id)
      .then(() => fetchProducts())
      .catch(() =>
        ToastAndroid.show('Error deleting product', ToastAndroid.SHORT)
      );
  };

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProducts();
    } finally {
      setRefreshing(false);
    }
  };

   // UseEffect to check login status
   useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (loggedIn !== 'true') {
        navigation.navigate('Login2');
      }
    };
    checkLoginStatus();
  }, [navigation]); 

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.navigate('Login2');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Products"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (

        // Show loading indicator if loading state is true
        <ActivityIndicator size="large" />
      ) : products.length === 0 ? (
        <Text style={styles.noProductText}>No Product Found</Text>
      ) : (
        
        // Render product list
        <FlatList
          key={2}
          data={products}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDelete(item.id)}
                >
                  <Icon name="delete" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.productDetailsContainer}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {/* Floating buttons */}
      <View style={styles.floatingButtonsContainer}>
        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="exit-to-app" size={24} color="white" />
        </TouchableOpacity>

        {/* Add Product Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('AddProductPage')}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
    color: 'black',
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: width * 0.04,
  },
  noProductText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#777',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    fontSize: 18,
  },
  productCard: {
    flex: 1,
    margin: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: width / 2 - 24,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: height * 0.2,
    borderRadius: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  deleteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 15,
  },
  productDetailsContainer: {
    padding: 10,
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: width * 0.045,
    color: '#555',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 5,
  },
  floatingButton: {
    backgroundColor: '#2196F3',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default HomePage;
