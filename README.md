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

## requirements
**docker** ```sudo apt install docker```
**docker-compose** ``sudo apt install docker-compose```

to run
```
mkdir simplicity
cd simplicity
```
clone repo
``` git clone ```
run docker compose up
``` docker compose up ```

container rebuild (in case it breaks from updating)
```docker-compose up --build --force-recreate --no-deps backend```
```docker-compose up --build --force-recreate --no-deps frontend```

#### api is in backend_api port **3030**
#### frontend runs react on port **3000**
#### mongodb
  - runs on port **27017**
  - mounted to ./mongodb for persistent storage
  - included some dummy data but we really shouldn't be pulling that in deployment
