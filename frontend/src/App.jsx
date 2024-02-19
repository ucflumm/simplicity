import './App.css';
import React from 'react';
import Sidenav from './SideNav'; // Import the Sidenav component
import Header from './Header'; // Import the Header component
import ProductGrid from './ProductGrid';
import WhiteContainer from './WhiteContainer';

const App = () => {
    // const handleSearch = (searchTerm) => {
    //   // add search logc here
    //   console.log('Searching for:', searchTerm);
    // };
    return (
        <div className="App">
            <Sidenav />
            <Header />
            <WhiteContainer>
                <ProductGrid />
            </WhiteContainer>
            {/* Rest of your app */}
        </div>
    );
}

export default App;
