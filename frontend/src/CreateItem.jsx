import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import useSnackbar from './hooks/useSnackBar';

const CreateItem = () => {
  const [item, setItem] = useState({
    name: '',
    category: 'Misc',
    upc: '',
    quantity: 0,
    costPrice: 0,
    salePrice: 0,
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const { open, message, showSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    validateForm();
  }, [item]);

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};


    if (!item.name) {
      formIsValid = false;
      newErrors['name'] = 'Name is required';
    }

    if (!item.category) {
      formIsValid = false;
      newErrors['category'] = 'Category is required';
    }

    if (isNaN(item.quantity) || item.quantity < 0) {
      formIsValid = false;
      newErrors['quantity'] = 'Quantity must be a non-negative number';
    }

    if (isNaN(item.costPrice) || item.costPrice < 0) {
      formIsValid = false;
      newErrors['costPrice'] = 'Cost Price must be a non-negative number';
    }

    if (isNaN(item.salePrice) || item.salePrice < 0) {
      formIsValid = false;
      newErrors['salePrice'] = 'Sale Price must be a non-negative number';
    }

    if (!item.location) {
      formIsValid = false;
      newErrors['location'] = 'Location is required';
    }

    setErrors(newErrors);
    setIsFormValid(formIsValid);



  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


    if (isFormValid) {
      console.log('Form is valid', item);
      axios.post('http://localhost:3030/api/item', item)
        .then(response => {
          console.log(response.data);
          showSnackbar('Item created successfully!');
        })
        .catch(error => {
          console.log('An error occurred:', error);
          showSnackbar('Failed to create item.');
        });
    } else {
      console.log('Form is invalid', errors);
    }



  };

  return (
    <>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          id="name"
          label="Name"
          name="name"
          value={item.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name || ''}
          autoComplete="name"
        />
        <FormControl fullWidth margin="normal" error={!!errors.category}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={item.category}
            onChange={handleChange}
            label="Category"
          >
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Games">Games</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Misc">Misc</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
          </Select>
          {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          id="upc"
          label="UPC"
          name="upc"
          type="number"
          value={item.upc}
          onChange={handleChange}
          error={!!errors.upc}
          helperText={errors.upc || ''}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          fullWidth
          id="quantity"
          label="Quantity"
          name="quantity"
          type="number"
          value={item.quantity}
          onChange={handleChange}
          error={!!errors.quantity}
          helperText={errors.quantity || ''}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          fullWidth
          id="costPrice"
          label="Cost Price"
          name="costPrice"
          type="number"
          value={item.costPrice}
          onChange={handleChange}
          error={!!errors.costPrice}
          helperText={errors.costPrice || ''}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          fullWidth
          id="salePrice"
          label="Sale Price"
          name="salePrice"
          type="number"
          value={item.salePrice}
          onChange={handleChange}
          error={!!errors.salePrice}
          helperText={errors.salePrice || ''}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          fullWidth
          id="location"
          label="Location"
          name="location"
          value={item.location}
          onChange={handleChange}
          error={!!errors.location}
          helperText={errors.location || ''}
          autoComplete="off"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button type="submit" variant="contained" sx={{ mr: 1 }} disabled={!isFormValid}>
            Save
          </Button>
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateItem;













// import React, { useState } from 'react';
// import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box } from '@mui/material';
// import axios from 'axios';

// const CreateItem = () => {
//   const [item, setItem] = useState({
//     name: '',
//     category: 'Misc',
//     upc: '',
//     quantity: 0,
//     costPrice: 0,
//     salePrice: 0,
//     location: '',
//   });
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     let formIsValid = true;
//     let newErrors = {};

//     if (!item.name) {
//       formIsValid = false;
//       newErrors['name'] = 'Name is required';
//     }

//     if (!item.category) {
//       formIsValid = false;
//       newErrors['category'] = 'Category is required';
//     }

//     // if (item.upc && isNaN(item.upc)) {
//     //   formIsValid = false;
//     //   newErrors['upc'] = 'UPC must be a number';
//     // }

//     if (isNaN(item.quantity) || item.quantity < 0) {
//       formIsValid = false;
//       newErrors['quantity'] = 'Quantity must be a non-negative number';
//     }

//     if (isNaN(item.costPrice) || item.costPrice < 0) {
//       formIsValid = false;
//       newErrors['costPrice'] = 'Cost Price must be a non-negative number';
//     }

//     if (isNaN(item.salePrice) || item.salePrice < 0) {
//       formIsValid = false;
//       newErrors['salePrice'] = 'Sale Price must be a non-negative number';
//     }

//     if (!item.location) {
//       formIsValid = false;
//       newErrors['location'] = 'Location is required';
//     }

//     setErrors(newErrors);
//     return formIsValid;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setItem({ ...item, [name]: value });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (validateForm()) {
//       console.log('Form is valid', item);
//       axios.post('http://localhost:3030/api/item', item)
//         .then(response => {
//           // Handle success
//           console.log(response.data); // Response from server
//           // You might want to redirect the user or show a success message
//         })
//         .catch(error => {
//           // Handle error
//           console.log('An error occurred:', error);
//           // You might want to show an error message to the user
//         });
//     } else {
//       console.log('Form is invalid', errors);
//     }
//   };

//   return (
//     <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
//       <TextField
//         margin="normal"
//         fullWidth
//         id="name"
//         label="Name"
//         name="name"
//         value={item.name}
//         onChange={handleChange}
//         error={!!errors.name}
//         helperText={errors.name || ''}
//         autoComplete="name"
//       />
//       <FormControl fullWidth margin="normal" error={!!errors.category}>
//         <InputLabel id="category-label">Category</InputLabel>
//         <Select
//           labelId="category-label"
//           id="category"
//           name="category"
//           value={item.category}
//           onChange={handleChange}
//           label="Category"
//         >
//           <MenuItem value="Electronics">Electronics</MenuItem>
//           <MenuItem value="Games">Games</MenuItem>
//           <MenuItem value="Clothing">Clothing</MenuItem>
//           <MenuItem value="Misc">Misc</MenuItem>
//           <MenuItem value="Food">Food</MenuItem>
//           <MenuItem value="Books">Books</MenuItem>
//         </Select>
//         {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
//       </FormControl>
//       <TextField
//         margin="normal"
//         fullWidth
//         id="upc"
//         label="UPC"
//         name="upc"
//         type="number"
//         value={item.upc}
//         onChange={handleChange}
//         error={!!errors.upc}
//         helperText={errors.upc || ''}
//         autoComplete="off"
//       />
//       <TextField
//         margin="normal"
//         fullWidth
//         id="quantity"
//         label="Quantity"
//         name="quantity"
//         type="number"
//         value={item.quantity}
//         onChange={handleChange}
//         error={!!errors.quantity}
//         helperText={errors.quantity || ''}
//         autoComplete="off"
//       />
//       <TextField
//         margin="normal"
//         fullWidth
//         id="costPrice"
//         label="Cost Price"
//         name="costPrice"
//         type="number"
//         value={item.costPrice}
//         onChange={handleChange}
//         error={!!errors.costPrice}
//         helperText={errors.costPrice || ''}
//         autoComplete="off"
//       />
//       <TextField
//         margin="normal"
//         fullWidth
//         id="salePrice"
//         label="Sale Price"
//         name="salePrice"
//         type="number"
//         value={item.salePrice}
//         onChange={handleChange}
//         error={!!errors.salePrice}
//         helperText={errors.salePrice || ''}
//         autoComplete="off"
//       />
//       <TextField
//         margin="normal"
//         fullWidth
//         id="location"
//         label="Location"
//         name="location"
//         value={item.location}
//         onChange={handleChange}
//         error={!!errors.location}
//         helperText={errors.location || ''}
//         autoComplete="off"
//       />
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//         <Button type="submit" variant="contained" sx={{ mr: 1 }} disabled={!validateForm}>
//           Save
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CreateItem;


