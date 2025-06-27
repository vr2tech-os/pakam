import React from 'react';
import './ProductDisplay.css';

const ProductDisplay = ({ onBuyNow }) => {
  return (
    <div className="product-container">
      <div className="product-left">
        <img className="main-image" src="/images/ps5.png" alt="PlayStation 5" />
        <div className="thumbnail-container">
          <img className="thumbnail" src="/images/ps5.png" alt="Thumbnail" />
        </div>
      </div>

      <div className="product-right">
        <h2 className="product-title">PlayStation 5</h2>
        <div className="rating">
          <span className="stars">★★★★★</span>
          <span className="rating-number">(4.5)</span>
        </div>
        <p className="product-description">
          The PlayStation 5 takes gaming to the next level with ultra-HD graphics, a powerful 825GB SSD,
          and ray tracing technology for realistic visuals. Whether you're into high-action games or
          immersive storytelling, the PS5 delivers fast loading times, seamless gameplay, and stunning visuals.
          It’s a must-have for any serious gamer looking for the ultimate gaming experience.
        </p>

        <div className="product-pricing">
          <span className="price">$499.99</span>
          <span className="original-price">$599.99</span>
        </div>

        <div className="product-details">
          <div><strong>Brand</strong><span>Generic</span></div>
          <div><strong>Color</strong><span>Multi</span></div>
          <div><strong>Category</strong><span>Accessories</span></div>
        </div>

        <div className="product-actions">
          <button className="btn add-cart">Add to Cart</button>
          <button className="btn buy-now" onClick={onBuyNow}>Buy now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
