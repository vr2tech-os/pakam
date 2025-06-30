import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';



const FoodItem = ({ id, name, price, description, image, ingredients }) => {
  const { cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='food-item'>
      <div className="food-item-image-container">
        <img className='food-item-image' src={`${baseURL}/images/${image}`} alt={name} />

        {/* Replaced cart counter with "Select" button */}
        <div className="add" onClick={() => navigate(`/product/${id}`)}>
          <p>Add</p>
        </div>
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>

        <p className="food-item-desc">{description}</p>

        {ingredients && (
          <p className="food-item-ingredients">
            <strong>Ingredients:</strong> {ingredients}
          </p>
        )}

        <div className="food-item-price-container">
          <p className="food-item-price">₹{price}</p>
          <p className="food-item-kg">/ Per Kg</p>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
