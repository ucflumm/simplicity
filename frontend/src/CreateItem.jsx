import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box } from '@mui/material';
import axios from 'axios';

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

    // if (item.upc && isNaN(item.upc)) {
    //   formIsValid = false;
    //   newErrors['upc'] = 'UPC must be a number';
    // }

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
    return formIsValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      console.log('Form is valid', item);
      axios.post('http://localhost:3030/api/item', item)
        .then(response => {
          // Handle success
          console.log(response.data); // Response from server
          // You might want to redirect the user or show a success message
        })
        .catch(error => {
          // Handle error
          console.log('An error occurred:', error);
          // You might want to show an error message to the user
        });
    } else {
      console.log('Form is invalid', errors);
    }
  };

  return (
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
        <Button type="submit" variant="contained" sx={{ mr: 1 }} disabled={!validateForm}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default CreateItem;


// import React, { useState } from 'react';

// const CreateItem = () => {
//   // State for each form field
//   const [item, setItem] = useState({
//     name: '',
//     upc: '',
//     quantity: '',
//     category: '',
//     sellPrice: '',
//     costPrice: '',
//     location: 'Unknown', // Default value
//     description: ''
//   });
//   const [errors, setErrors] = useState({});

//   // Handle changes in form inputs
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setItem({ ...item, [name]: value });
//   };

//   // Frontend validation logic
//   const validateForm = () => {
//     let formIsValid = true;
//     let errors = {};

//     // Name validation
//     if (!item.name) {
//       formIsValid = false;
//       errors['name'] = 'Name cannot be empty!';
//     }

//     // UPC validation (assuming it's a number and optional)
//     if (item.upc && isNaN(item.upc)) {
//       formIsValid = false;
//       errors['upc'] = 'UPC must be a number!';
//     }

//     // Quantity validation
//     if (isNaN(item.quantity) || item.quantity < 0) {
//       formIsValid = false;
//       errors['quantity'] = 'Quantity must be equal or greater than zero!';
//     }

//     // Sell Price validation
//     if (isNaN(item.sellPrice) || item.sellPrice < 0) {
//       formIsValid = false;
//       errors['sellPrice'] = 'Sell Price must be equal or greater than zero!';
//     }

//     // Cost Price validation
//     if (isNaN(item.costPrice) || item.costPrice < 0) {
//       formIsValid = false;
//       errors['costPrice'] = 'Cost Price must be equal or greater than zero!';
//     }

//     // Category validation (assuming it's required)
//     if (!item.category) {
//       formIsValid = false;
//       errors['category'] = 'Category cannot be empty!';
//     }

//     setErrors(errors);
//     return formIsValid;
//   };

//   // Handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       return; // Validation failed
//     }

//     try {
//       const response = await fetch('http://localhost:3030/api/item', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(item),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       const data = await response.json();
//       console.log('Item created:', data);
//       // Reset form or redirect user
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert(error.message); // Show error to user
//     }
//   };

//   return (
//     <div className="create-item">
//       <h2>Create Item</h2>
//       <form onSubmit={handleSubmit} noValidate>
//         <div className="form-group">
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={item.name}
//             onChange={handleChange}
//             className={`form-control ${errors.name ? 'is-invalid' : ''}`}
//           />
//           {errors.name && <div className="invalid-feedback">{errors.name}</div>}
//           {/* <input type="text" name="name" value={item.name} onChange={handleChange} />
//           {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>} */}
//         </div>
//         {/* Repeat the above pattern for other input fields, e.g., UPC, quantity, etc. */}
//         <div className="form-group">
//           <label htmlFor="upc">UPC:</label>
//           <input
//             type="text"
//             id="upc"
//             name="upc"
//             value={item.upc}
//             onChange={handleChange}
//             className={`form-control ${errors.upc ? 'is-invalid' : ''}`}
//           />
//           {errors.upc && <div className="invalid-feedback">{errors.upc}</div>}
//         </div>
//         {/* ... */}
//         <div className="form-actions">
//           <button type="submit" className="btn btn-primary">Save</button>
//           <button type="button" className="btn btn-secondary" onClick={() => {/* handle cancel logic */ }}>Cancel</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateItem;


