import React, { useEffect, useState, useMemo } from 'react';
import api from './axiosConfig';
import { useAuth } from './AuthContext';
  import { useNavigate } from 'react-router-dom';


function Cart() {
  const { userId } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [choosedItems, setChoosedItems] = useState([]);
  useEffect(() => {
    const fetchCart = async () => {
      if(userId){
      try {
        const response = await api.get(`/api/get-cart/${userId}`);
        const gotData = response.data;
        const data = gotData.map(i => ({
          id: i.id,
          quantity: i.quantity,
          productQuantity:i.product.quantity,
          total: i.subTotal,
          suplierId:i.product.suplierId,
          price:i.product.price,
          productId:i.product.id,
          itemName: i.product.name,
          description: i.product.description,
          image: i.product.main
        }));

        setCartItems(data);

      } catch (err) {
        console.error('Error fetching cart:', err);
        return <p>empty cart</p>
      }
    }
    else{
      navigate('/login')
    }

    };

    if (userId) fetchCart();
  }, [userId]);

  // Increment quantity
  const quantityIncrement = async (id) => {
    try {
      await api.put(`/api/increment/${id}`);
      // refresh cart
      const response = await api.get(`/api/get-cart/${userId}`);
      const gotData = response.data;
      const data = gotData.map(i => ({
        id: i.id,
        quantity: i.quantity,
        total: i.subTotal,
        price:i.product.price,
        productQuantity:i.product.quantity,
        suplierId:i.product.suplierId,
        itemName: i.product.name,
        description: i.product.description,
        image: i.product.main
      }));
      setCartItems(data);
    } catch (err) {
      console.error('Error incrementing quantity:', err);
    }
  };

  // Decrement quantity
  const quantityDecrement = async (id) => {
    try {
      await api.put(`/api/decrement/${id}`);
      // refresh cart
      const response = await api.get(`/api/get-cart/${userId}`);
      const gotData = response.data;
      
      const data = gotData.map(i => ({
        id: i.id,
        quantity: i.quantity,
        total: i.subTotal,
        productQuantity:i.product.quantity,
        suplierId:i.product.suplierId,
        itemName: i.product.name,
        description: i.product.description,
        price:i.product.price,
        image: i.product.main
      }));
      setCartItems(data);
    } catch (err) {
      console.error('Error decrementing quantity:', err);
    }

  };

  // Toggle selection
  const toggleSelectedItem = (id) => {
    setChoosedItems(prev => (
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    ));
  };

  // 💰 Calculate grand total of selected items
  const grandTotal = useMemo(() => {
    return cartItems
      .filter(item => choosedItems.includes(item.id))
      .reduce((acc, item) => acc + item.total, 0);
  }, [cartItems, choosedItems]);

const navigate = useNavigate();

const handleBuySelected = () => {
  if (choosedItems.length === 0) {
    alert('Please select at least one item');
    return;
  }
  // Filter only selected items
  const selectedItems = cartItems.filter(item => choosedItems.includes(item.id));

  // navigate with state
  navigate('/checkout', { state: { selectedItems } });
};

  return (
    <div className='p-2 d-flex flex-column align-items-center justify-content-center text-light' ><br></br>
    <h1 className='text-center' style={{color:'lightpink'}}>Cart</h1>
     { (cartItems.length>0)?(<>
    <div className='d-flex flex-column flex-md-row-reverse gap-1'>
      
      
        <div className=' border d-flex flex-column align-items-center justify-content-center mt-md-5' style={{height:'300px', backgroundColor:'rgba(0, 0, 0, 0.36)'}}>
          {(choosedItems.length > 0)?(
            <>
      <p><strong>Grand Total (Selected): Rs.{grandTotal}</strong></p> 
      <button className='btn btn-warning' onClick={()=>handleBuySelected()}>Buy Selected</button>
      </>
      ):<>
      <p className='text-danger'><strong>no item selected to buy</strong></p> 
      <p className='text-danger'>please select items to buy</p>
      {/* <button className='btn btn-warning'>Buy Selected</button> */}
      </>}

      </div>
      <div className='d-flex flex-column align_items-center justify-content-center'>
      
      {cartItems.map((i, index) => (
        <div key={index} className='d-flex align-items-center justify-content-between p-2 border rounded flex-md-wrap gap-1' style={{backgroundColor:'rgba(0, 0, 0, 0.36)'}}>
          <input
            type='checkbox'
            checked={choosedItems.includes(i.id)}
            onChange={() => toggleSelectedItem(i.id)}
            style={{width:'30px',height:'30px'}}
          />
          <img src={i.image} height={'150px'} width={'150px'} className='rounded border' alt={i.itemName} />
          <div className='w-50'>
            <p>{i.itemName}</p>
            <p>{i.description}</p>
            <div className='d-flex gap-2 align-items-center border rounded-pill justify-content-center fw-bold' style={{width:'120px'}}>
              <button className='btn text-light fw-bold' onClick={() => quantityDecrement(i.id)}>-</button>
              <span style={{ width: '40px', textAlign: 'center'}}>{i.quantity}</span>
              {(i.quantity<i.productQuantity)?(
              <button className='btn text-light fw-bold' onClick={() => quantityIncrement(i.id)}>+</button>
              ):(<button className='btn text-light fw-bold' disabled onClick={() => quantityIncrement(i.id)}>+</button>)}
            </div>
          </div>
          <strong>₹{i.price}</strong>
        </div>
      ))}
      
      </div>
      </div>
      </>):(
        <div style={{position:'absolute',top:'50%',left:'50%',translate:'-50% -50%'}}>
          <p>empty cart</p>
          </div>)}
    </div>
  );
}

export default Cart;
