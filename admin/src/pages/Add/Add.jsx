import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({url}) => {
  
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    ingredients: "",
    benefits: "",
    faq1q: "",
    faq1a: "",
    faq2q: "",
    faq2a: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('ingredients', data.ingredients);
    formData.append('benefits', data.benefits);
    formData.append('faq', JSON.stringify([
      { question: data.faq1q, answer: data.faq1a },
      { question: data.faq2q, answer: data.faq2a }
    ]));
    formData.append('image', image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "",
          ingredients: "",
          benefits: "",
          faq1q: "",
          faq1a: "",
          faq2q: "",
          faq2a: ""
        });
        setImage(null);
        toast.success(response.data.message || "Food item added successfully!");
      } else {
        toast.error("Failed to add food item.");
      }
    } catch (error) {
      console.error("Error uploading food:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="Preview"
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input type="text" name='name' value={data.name} onChange={onChangeHandler} required placeholder='e.g., Sunnundalu' />
        </div>

        <div className="add-product-description flex-col">
          <p>Description</p>
          <textarea name="description" rows="2" value={data.description} onChange={onChangeHandler} required placeholder='Short description' />
        </div>

        <div className="add-product-ingredients flex-col">
          <p>Ingredients</p>
          <textarea name="ingredients" rows="2" value={data.ingredients} onChange={onChangeHandler} required placeholder='E.g., Urad dal, jaggery...' />
        </div>

        <div className="add-product-benefits flex-col">
          <p>Benefits</p>
          <textarea name="benefits" rows="2" value={data.benefits} onChange={onChangeHandler} required placeholder='E.g., Boosts energy...' />
        </div>

        <div className="add-faq-section">
          <p>FAQ 1</p>
          <input name="faq1q" value={data.faq1q} onChange={onChangeHandler} required placeholder='Question 1' />
          <input name="faq1a" value={data.faq1a} onChange={onChangeHandler} required placeholder='Answer 1' />
          <p>FAQ 2</p>
          <input name="faq2q" value={data.faq2q} onChange={onChangeHandler} required placeholder='Question 2' />
          <input name="faq2a" value={data.faq2a} onChange={onChangeHandler} required placeholder='Answer 2' />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Category</p>
            <select name="category" value={data.category} onChange={onChangeHandler} required>
              <option value="">Select</option>
              <option value="Flour Sweets">Flour Sweets</option>
              <option value="Stuffed Sweets">Stuffed Sweets</option>
              <option value="Jaggery Sweets">Jaggery Sweets</option>
              <option value="Festive Sweets">Festive Sweets</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Price (₹)</p>
            <input type="number" name="price" value={data.price} onChange={onChangeHandler} required placeholder='750' />
          </div>
        </div>

        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
};

export default Add;
