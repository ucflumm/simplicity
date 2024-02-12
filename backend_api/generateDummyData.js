const axios = require('axios');

// Function to generate dummy data objects
const generateDummyData = (count) => {
  const dummyData = [];
  for (let i = 0; i < count; i++) {
    dummyData.push({
      name: `Item ${i + 1}`,
      category: "Toys",
      quantity: Math.floor(Math.random() * 100), // Generate random quantity
      costPrice: parseFloat((Math.random() * 10).toFixed(2)), // Generate random cost price
      salePrice: parseFloat((Math.random() * 20).toFixed(2)) // Generate random sale price
    });
  }
  return dummyData;
};

// Function to send POST request to create item
const createItem = async (itemData) => {
  try {
    const response = await axios.post('http://localhost:3030/api/item', itemData);
    console.log('Item created:', response.data);
  } catch (error) {
    console.error('Error creating item:', error.message);
  }
};

// Main function to generate dummy data and create items
const main = async () => {
  // Generate dummy data
  const dummyData = generateDummyData(5); // Generate 5 dummy data objects

  // Send POST request for each dummy data object
  for (const itemData of dummyData) {
    await createItem(itemData);
  }
};

// Execute main function
main();
