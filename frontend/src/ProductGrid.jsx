import React, { useState, useEffect, useCallback } from 'react';
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
  Box,
  IconButton, // Import IconButton from MUI for sort button
  CircularProgress // Import CircularProgress for loading indicator
} from '@mui/material';
import SearchBar from './SearchBar'; // Import SearchBar component
import PreviewItem from './previewItem'; // Import PreviewItem component for modal
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Import ArrowUpward icon for ascending sort
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Import ArrowDownward icon for descending sort

const ProductList = () => {
  const [products, setProducts] = useState([]); // State to store fetched products
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [searchTerm, setSearchTerm] = useState(''); // State to handle search term
  const [filteredProducts, setFilteredProducts] = useState([]); // State to store filtered products
  const [selectedProduct, setSelectedProduct] = useState(null); // State to store selected product for preview
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [sortOrder, setSortOrder] = useState('desc'); // State to control sort order

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/item`);
      const productsWithImages = await Promise.all(response.data.map(async (item) => {
        const imageResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/image/id/${item._id}`, { responseType: 'blob' });
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
  }, []); 

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const handleProductClick = (product) => {
    // Find the product by its ID and set it as the selected product
    setSelectedProduct(product);
    setIsModalOpen(true); // Open the modal to show the selected product
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Function to toggle sort order and sort products by quantity
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      return newSortOrder === 'desc' ? b.quantity - a.quantity : a.quantity - b.quantity;
    });
    setFilteredProducts(sortedProducts);
  };

  if (loading) {
    return <CircularProgress color="secondary" style={{ color: 'purple' }} />;
  }

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
              <TableCell align="center">
                <Typography style={{ fontSize: '20px', fontWeight: 'bold', color: "#000", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Quantity
                  <IconButton onClick={toggleSortOrder} size="small">
                    {sortOrder === 'desc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                  </IconButton>
                </Typography>
              </TableCell>
              <TableCell align="center"><Typography style={{ fontSize: '20px', fontWeight: 'bold', color: "#000" }}>Category</Typography></TableCell>
              <TableCell align="center"><Typography style={{ fontSize: '20px', fontWeight: 'bold', color: "#000" }}>Sell Price</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow
                  key={product._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                  onClick={() => handleProductClick(product)}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No products found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer >
      {selectedProduct && (
        <PreviewItem
          open={isModalOpen}
          handleClose={handleCloseModal}
          item={selectedProduct}
        />
      )}
    </>
  );
};

export default ProductList;
