import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from './axiosConfig';
import { useAuth } from './AuthContext';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const selectedItems = location.state?.selectedItems || [];

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [hno, setHno] = useState('');
  const [colony, setColony] = useState('');
  const [village, setVillage] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!customerName || !customerPhone || !hno || !colony || !village || !city || !landmark || !pincode) {
      alert('Please fill in all fields');
      return;
    }

    const customerAddress = `H.No: ${hno}, Colony: ${colony}, Village: ${village}, City: ${city}, Landmark: ${landmark}, Pincode: ${pincode}`;

    try {
      setLoading(true);
      for (let item of selectedItems) {
        const bookingData = {
          customerName,
          userId,
          suplierId: item.suplierId, // adjust field names based on backend
          customerAddress,
          customerPhone,
          quantity: item.quantity,
          totalPrice: item.total,
          productId: item.productId,
          productName: item.itemName,
          productPrice: item.price
        };

        await api.post('/api/bookings/create', bookingData);
      }
      setLoading(false);
      alert('Booking confirmed!');
      navigate('/product');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed, please try again.');
      setLoading(false);
    }
  };

  if (selectedItems.length === 0) {
    return <div>No items selected. Go back to cart.</div>;
  }

  return (
    <div className="container mt-4 d-flex flex-column align-items-center text-light">
      <h2>Checkout</h2>
      <h4>Selected Items</h4>
      <ul className="list-group mb-3 w-75 text-end">
        {selectedItems.map(item => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            {item.itemName} (x{item.quantity})
            <span>₹{item.total}</span>
          </li>
        ))}
      </ul>

<div className="container p-5">
  <h4 className="mb-3">Delivery Details</h4>

  <div className="row g-2">
    <div className="col-md-6">
      <input
        className="form-control"
        placeholder="Name"
        value={customerName}
        onChange={e => setCustomerName(e.target.value)}
      />
    </div>
    <div className="col-md-6">
      <input
        className="form-control"
        placeholder="Phone"
        value={customerPhone}
        onChange={e => setCustomerPhone(e.target.value)}
      />
    </div>
    <div className="col-md-4">
      <input
        className="form-control"
        placeholder="H.No"
        value={hno}
        onChange={e => setHno(e.target.value)}
      />
    </div>
    <div className="col-md-8">
      <input
        className="form-control"
        placeholder="Colony / Street"
        value={colony}
        onChange={e => setColony(e.target.value)}
      />
    </div>
    <div className="col-md-6">
      <input
        className="form-control"
        placeholder="Village / Town"
        value={village}
        onChange={e => setVillage(e.target.value)}
      />
    </div>
    <div className="col-md-6">
      <input
        className="form-control"
        placeholder="City / District"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
    </div>
    <div className="col-md-6">
      <input
        className="form-control"
        placeholder="Landmark"
        value={landmark}
        onChange={e => setLandmark(e.target.value)}
      />
    </div>
    <div className="col-md-6">
      <input
        className="form-control"
        placeholder="Pincode"
        value={pincode}
        onChange={e => setPincode(e.target.value)}
      />
    </div>
  </div>

  <div className="text-center mt-3">
    <button
      className="btn btn-warning"
      onClick={handleBooking}
      disabled={loading}
    >
      {loading ? 'Booking...' : 'Confirm Booking'}
    </button>
  </div>
</div>

      <br></br>
      <br></br>
    </div>
  );
}

export default Checkout;
