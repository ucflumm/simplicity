import React from 'react';
import { Modal, Box, Typography, Button, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

const PreviewItem = ({ open, handleClose, item }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, // Adjusted width to accommodate image and details side by side
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        display: 'flex', // Use flexbox to layout children side by side
        alignItems: 'center', // Align items vertically in the center
      }}>
        {/* Image container */}
        <Box sx={{
          width: '50%', // Half the width of the parent container
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Replace with actual image source */}
          <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Box>

        {/* Details container */}
        <Box sx={{
          width: '50%', // Half the width of the parent container
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          pl: 2, // Padding left to separate from the image
        }}>
          <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Name
          </Typography>
          <Typography variant="body2" component="h2">
            {item.name}
          </Typography>
          <Typography variant="subtitle1" component="h3" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
            UPC
          </Typography>
          <Typography variant="body2" component="h2">
            {item.upc}
          </Typography>
          <Typography variant="subtitle1" component="h3" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
            Quantity
          </Typography>
          <Typography variant="body2" component="h2">
            {item.quantity}
          </Typography>
          <Typography variant="subtitle1" component="h3" sx={{ mt: 2, mb: 2, fontWeight: 'bold'}}>
            Category
          </Typography>
          <Typography variant="body2" component="h2">
            {item.category}
          </Typography>
          <Typography variant="subtitle1" component="h3" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
            Sell Price
          </Typography>
          <Typography variant="body2" component="h2">
            ${item.salePrice}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button variant="contained" onClick={handleClose} sx={{ mt: 2, mr: 2 }}>Close</Button>
          <Link to="/adjustments" style={{ textDecoration: 'none', mt: 2 }}>
            <Button variant="contained" sx={{ mt: 2 }}>Edit</Button>
          </Link>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PreviewItem;

