import React, { useState, useEffect } from 'react';
import './ProductGrid.css';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';
import SearchBar from './SearchBar'; // Import SearchBar component

const ProductList = () => {
  const [products, setProducts] = useState([]); // State to store fetched products
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [searchTerm, setSearchTerm] = useState(''); // State to handle search term
  const [filteredProducts, setFilteredProducts] = useState([]); // State to store filtered products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3030/api/item');
        const productsWithImages = await Promise.all(response.data.map(async (item) => {
          const imageResponse = await axios.get(`http://localhost:3030/api/image/id/${item._id}`, { responseType: 'blob' });
          const imageUrl = URL.createObjectURL(imageResponse.data);
          return { ...item, imageUrl };
        }));
        setProducts(productsWithImages);
        setFilteredProducts(productsWithImages); // Initialize filteredProducts with all products
      } catch (error) {
        console.error('There was an error fetching the products:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetch
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      if (!searchTerm) {
        setFilteredProducts(products); // If no search term, show all products
      } else {
        const filtered = products.filter(product => 
          `${product['name']}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
          `${product['upc']}`.includes(searchTerm)
        );
        setFilteredProducts(filtered);
      }
    };

    filterProducts();
  }, [searchTerm, products]);

  const handleProductClick = (productId) => {
    // Logic for handling product click
    console.log('Product clicked:', productId);
  };

  return (
    <>
      <SearchBar setSearchTerm={setSearchTerm} />
      <TableContainer component={Paper} sx={{ margin: 'auto' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center"><Typography style={{ fontSize: '20px', fontWeight: 'bold', color: "#000" }}>Image</Typography></TableCell>
              <TableCell align="center"><Typography style={{ fontSize: '20px', fontWeight: 'bold', color: "#000" }}>Name</Typography></TableCell>
              <TableCell align="center"><Typography style={{ fontSize: '20px', fontWeight: 'bold', color: "#000" }}>UPC</Typography></TableCell>
              <TableCell align="center"><Typography style={{ fontSize: '20px', fontWeight: 'bold', color: "#000" }}>Quantity</Typography></TableCell>
              <TableCell align="center"><Typography style={{ fontSize: '20px', fontWeight: 'bold', color: "#000" }}>Category</Typography></TableCell>
              <TableCell align="center"><Typography style={{ fontSize: '20px', fontWeight: 'bold', color: "#000" }}>Sell Price</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow
                key={product._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                onClick={() => handleProductClick(product._id)}
              >
                <TableCell component="th" scope="product" align="center">
                  <Box
                    component="img"
                    src={product.imageUrl}
                    alt={product.name}
                    sx={{ width: 50, height: 50, borderRadius: '5%' }}
                  />
                </TableCell>
                <TableCell align="center"><Typography className="itemValue">{product.name}</Typography></TableCell>
                <TableCell align="center"><Typography className="itemValue">{product.upc}</Typography></TableCell>
                <TableCell align="center"><Typography className="itemValue">{product.quantity}</Typography></TableCell>
                <TableCell align="center"><Typography className="itemValue">{product.category}</Typography></TableCell>
                <TableCell align="center"><Typography className="itemValue">${product.salePrice}</Typography></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer >
    </>
  );
};

export default ProductList;

