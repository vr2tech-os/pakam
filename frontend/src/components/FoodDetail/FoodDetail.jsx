import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import './FoodDetail.css';
import { StoreContext } from '../../context/StoreContext';

const FoodDetail = () => {
  const { _id } = useParams();
  const { food_list, addToCart, baseURL } = useContext(StoreContext); // ✅ use baseURL
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(3);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [selectedItems, setSelectedItems] = useState([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setAdded(false);
  }, [_id]);

  if (!food_list || food_list.length === 0) {
    return <div className="food-detail-page">Loading...</div>;
  }

  const item = food_list.find(food => food._id === _id);
  if (!item) return <div className="food-detail-page">Item not found.</div>;

  const handleAddToCart = () => {
    if (quantity >= 3) {
      addToCart(_id, quantity);
      setAdded(true);
    } else {
      alert('Minimum 3 kg required to add to cart.');
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const suggestedItems = food_list.filter(food => food._id !== _id).slice(0, 3);

  return (
    <div className="food-detail-page">
      {/* Row 1: Image + Order Details */}
      <div className="food-detail-container">
        <div className="food-detail-image-section">
          <img src={`${baseURL}/images/${item.image}`} alt={item.name} className="food-detail-image" />
        </div>

        <div className="food-detail-content">
          <h2 className="food-name">{item.name}</h2>
          <p className="food-description">{item.description}</p>
          <div className="food-item-name-rating">
            <img src={assets.rating_starts} alt="Rating" />
          </div>
          <p className="food-price">₹{item.price} <span>/ kg</span></p>

          <div className="quantity-controls">
            <button onClick={() => setQuantity(prev => Math.max(prev - 1, 3))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
          </div>

          <p className="min-order-note">Note: Minimum order value starts from 3 kgs</p>

          <div className="button-group">
            <button
              className={`add-button ${added ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? 'Added' : 'Add to Cart'}
            </button>

            <button
              className={`add-button proceed-button ${!added ? 'disabled' : ''}`}
              onClick={() => navigate('/cart')}
              disabled={!added}
            >
              Proceed to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Tabs (Desktop) */}
      <div className="info-table desktop-only">
        <div className="info-cell">
          <div className="info-tabs">
            {['ingredients', 'benefits', 'faq'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? 'active-tab' : ''}
              >
                {tab === 'ingredients' && 'Ingredients Used'}
                {tab === 'benefits' && 'Health Benefits'}
                {tab === 'faq' && 'FAQ'}
              </button>
            ))}
          </div>

          <div className="info-content">
            {activeTab === 'ingredients' && (
              <>
                <strong>Ingredients Used:</strong>
                <p>{item.ingredients}</p>
              </>
            )}
            {activeTab === 'benefits' && (
              <>
                <strong>Health Benefits:</strong>
                <p>{item.benefits}</p>
              </>
            )}
            {activeTab === 'faq' && (
              <>
                <strong>FAQ:</strong>
                {item.faq?.map((qa, index) => (
                  <p key={index}>
                    <strong>Q:</strong> {qa.question}<br />
                    <strong>A:</strong> {qa.answer}
                  </p>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Tabs (Mobile) */}
      <div className="info-table mobile-only">
        <div className="info-cell"><strong>Ingredients Used:</strong><p>{item.ingredients}</p></div>
        <div className="info-cell"><strong>Health Benefits:</strong><p>{item.benefits}</p></div>
        <div className="info-cell">
          <strong>FAQ:</strong>
          {item.faq?.map((qa, index) => (
            <p key={index}>
              <strong>Q:</strong> {qa.question}<br />
              <strong>A:</strong> {qa.answer}
            </p>
          ))}
        </div>
      </div>

      {/* Row 3: Suggested Items */}
      <div className="suggested-items-section">
        <h3>Suggested Items</h3>
        <div className="suggested-items-grid">
          {suggestedItems.map((suggested) => (
            <div
              key={suggested._id}
              className={`suggested-card ${selectedItems.includes(suggested._id) ? 'selected' : ''}`}
              onClick={() => navigate(`/product/${suggested._id}`)}
            >
              <div style={{ position: 'relative' }}>
                <img src={`${baseURL}/images/${suggested.image}`} alt={suggested.name} />
                <div
                  className="add-button-circle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectItem(suggested._id);
                  }}
                >
                  {selectedItems.includes(suggested._id) ? '✓' : 'Add'}
                </div>
              </div>
              <div className="suggested-card-content">
                <h4>{suggested.name}</h4>
                <p>{suggested.description}</p>
                <div className="suggested-card-price">
                  ₹{suggested.price} <span className="suggested-card-kg">/ Per Kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedItems.length > 0 && (
          <button
            className="add-button"
            style={{ marginTop: '24px' }}
            onClick={() => {
              selectedItems.forEach(id => {
                addToCart(id, 3);
              });
              navigate('/cart');
            }}
          >
            Add Selected Items to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodDetail;
