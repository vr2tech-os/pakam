import React, { useState } from 'react';

import Cart from '../Cart/Cart';
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay';


const ShopPage = () => {
  const [showCart, setShowCart] = useState(false);

  const handleBuyNow = () => {
    setShowCart(true);
  };

  return (
    <div>
      {!showCart ? (
        <ProductDisplay onBuyNow={handleBuyNow} />
      ) : (
       <Cart/>
      )}
    </div>
  );
};

export default ShopPage;
