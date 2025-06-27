import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({url}) => {
  
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Failed to load food list.");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    if (response.data.success) {
      toast.success(response.data.message || "Food item removed successfully!");
      fetchList();
    } else {
      toast.error("Failed to remove food item.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Food Items</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Ingredients</b>
          <b>Benefits</b>
          <b>FAQ</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p>{item.ingredients}</p>
            <p>{item.benefits}</p>
            <p>
              {item.faq?.map((f, i) => (
                <span key={i}><b>Q:</b> {f.question}<br /><b>A:</b> {f.answer}<br /></span>
              ))}
            </p>
            <p onClick={() => removeFood(item._id)} className='cursor'>❌</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
