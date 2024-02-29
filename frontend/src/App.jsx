import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Sidenav from './SideNav'; // Import the Sidenav component
import Header from './Header'; // Import the Header component
import ProductGrid from './ProductGrid';
import WhiteContainer from './WhiteContainer';
import CreateItem from './CreateItem';
import SearchBar from './SearchBar';
import Adjustments from './Adjustments';
// Import other components you might navigate to

// Import your route components
// import ItemLibraryComponent from './ItemLibraryComponent';




const App = () => {
  // const handleSearch = (searchTerm) => {
  //   // add search logc here
  //   console.log('Searching for:', searchTerm);
  // };
  return (
    <Router>
      <div className="App">
        <Sidenav />
        <Header />
        <Routes>
          <Route path="/" element={
            <WhiteContainer>
              <ProductGrid />
            </WhiteContainer>
          } />
          <Route path="/item-library" element={
            <WhiteContainer>
              <ProductGrid />
            </WhiteContainer>
          } />
          <Route path="/create-item" element={
            <WhiteContainer>
              <CreateItem />
            </WhiteContainer>
          } />
          <Route path="/adjustments" element={
            <WhiteContainer>
              <Adjustments />
            </WhiteContainer>
          } />
          {/* <Route path="/item-library" element={
            <WhiteContainer>
              <ItemLibraryComponent />
            </WhiteContainer>
          } />
          
           
          {/* Rest of your app */}
          {/* Define more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
