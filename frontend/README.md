# Simplicity - Inventory Management Simplified

## About Simplicity

Simplicity is a robust, yet easy-to-use inventory management system tailored specifically for small to medium-sized businesses, as well as burgeoning home businesses preparing to take their first step into the world of inventory. Our platform offers a straightforward interface, intuitive controls, and detailed analytics to empower businesses to maintain optimum levels of inventory, reduce costs, and avoid the pitfalls of overstocking or stockouts.

With a focus on user experience, Simplicity seamlessly integrates with your existing workflows, making the transition to digital inventory management a breeze. From tracking products and orders to managing suppliers and stock levels, Simplicity is the one-stop solution for all your inventory needs.

## Key Features

- **User-Friendly Interface**: Designed with simplicity in mind, our dashboard provides quick access to all key functions.
- **Analytics & Reporting**: Get insights into your inventory trends to make informed decisions.
- **Multi-Platform Access**: Whether you're at the office or on the go, keep your inventory at your fingertips.
- **Scalability**: As your business grows, Simplicity grows with you, handling increased demand with ease.

## Technologies Used

This project is built using modern web technologies and libraries that ensure fast, secure, and efficient operations.

This project was created by using REACT and Material UI.

```json
"dependencies": {
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.15.9",
    "@mui/material": "^5.15.10",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.6.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.1",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
},
"devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11"
}
```

## Quick Start Guide

### Requirements

- Docker
  Install Docker and Docker Compose:
  ```sh
  sudo apt install docker docker-compose
  sudo apt install docker-compose
  ```

### To Run

- Set up the project directory:
  ```sh
  mkdir simplicity
  cd simplicity
  ```

- Clone the repository:
  ```sh
  git clone [https://github.com/ucflumm/simplicity.git]
  ```

- Run Docker Compose:
  ```sh
  docker compose up
  ```

### Container Rebuild

- In case of updates breaking the container:
  ```sh
  docker-compose up --build --force-recreate --no-deps backend
  docker-compose up --build --force-recreate --no-deps frontend
  ```

### Ports and Services

- **API**: Backend API runs on port `3030`.
- **Frontend**: React app runs on port `3000`.
- **MongoDB**:
  - Runs on port `27017`.
  - Mounted to `./mongodb` for persistent storage.
  - Contains some dummy data for testing purposes.

> **Note**: Dummy data should not be pulled in production deployments.

## Contributing

We welcome contributions from the community. Whether you're fixing bugs, adding new features, or improving documentation, please follow our contribution guidelines.





## Acknowledgements

We want to thank everyone who has contributed to the development of Simplicity, including all our dependents and supporters who have made this journey possible.

---

For more details on how to interact with React, refer to the [official React documentation](https://reactjs.org/docs/getting-started.html).


