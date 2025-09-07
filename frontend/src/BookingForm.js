import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import api from './axiosConfig';
import { useAuth } from './AuthContext';
import SuccessPopUp from './SuccessPopUp';
import   './SuccessPopUp.css';


const telanganaDistricts = [
  "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
  "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
  "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial",
  "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
  "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
  "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
  "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"
];

function BookingForm({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [error, setError] = useState('');
  const[show, setShow]=useState(false)
  const[title, setTitle]=useState('')
  const[message, setMessage]=useState('')
    const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');


  const [hno, setHno] = useState('');
  const [colony, setColony] = useState('');
  const [village, setVillage] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
const {userId}=useAuth();
console.log('stock is: ',product.stock)


  useEffect(() => {
    setTotalPrice(quantity * product.price);
  }, [quantity, product.price]);

  const handleBooking = async () => {
    if (quantity > product.stock) {
      setError(`Only ${product.stock} item(s) available in stock.`);
      return;
    }

    if (!customerName || !customerPhone || !hno || !colony || !village || !city || !landmark || !pincode) {
      setError('Please fill all the customer details and address fields.');
      return;
    }

    // const customerAddress = `
    //   H.No: ${hno}, ${colony}, ${village}, ${city}, Landmark: ${landmark}, Pincode: ${pincode}
    // `;
    const customerAddress = `H.No: ${hno}, Colony: ${colony}, Village: ${village}, City: ${city}, Landmark: ${landmark}, Pincode: ${pincode}`;
    const bookingData = {
      customerName,
      userId:userId,
      suplierId:product.suplierId,
      customerAddress,
      customerPhone,
      quantity,
      totalPrice,
      productId: product.id,
      productName: product.name,
      productPrice: product.price
    };

    try {
      setLoading(true)
      await api.post('/api/bookings/create', bookingData);
      setLoading(false)
      setShow(true)
      setTitle('Confirm')
      setMessage('your booking was confirmed. you will get our item with in 7 days. thank you for booking')
      setInterval(() => {
      window.location.href = "/product";
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Booking Failed");
    }
  };
console.log('user id while booking: ',userId)
  return (
    <>
    {loading && (
                <div className="text-center mb-3 position-absolute bg-dark h-100 w-100 d-flex align-items-center justify-content-center opacity-50">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
    )}
    <div className="container rounded-4 shadow p-4 mt-3 d-flex flex-column align-content-around w-50 bg-warning text-primary " style={{minWidth:'450px'}}>
      <h3>Order: {product.name} saree</h3>
      <h5>Price per item: <span className='text-success'>₹ {product.price}</span></h5>
      <h5>Available Stock: <span className={product.stock > 1 ? 'text-success' : 'text-danger'}>{product.stock}</span></h5>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={customerName}
          placeholder='Customer Name'
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={customerPhone}
          placeholder='Mobile Number'
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />
      </div>

      <h5 className="mt-3">Address Details</h5>
<div className="row g-2"> {/* g-2 adds spacing between columns */}

  <div className="col-md-4 col-12">
    <input type="text" placeholder="H.No" className="form-control" value={hno} onChange={(e) => setHno(e.target.value)} />
  </div>

  <div className="col-md-8 col-12">
    <input type="text" placeholder="Colony / Street" className="form-control" value={colony} onChange={(e) => setColony(e.target.value)} />
  </div>

  <div className="col-md-6 col-12">
    <input type="text" placeholder="Village / Town" className="form-control" value={village} onChange={(e) => setVillage(e.target.value)} />
  </div>

  <div className="col-md-6 col-12">
    <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)} required>
      <option value="">Select City / District</option>
      {telanganaDistricts.map((dist) => (
        <option key={dist} value={dist}>{dist}</option>
      ))}
    </select>
  </div>

  <div className="col-md-6 col-12">
    <input type="text" placeholder="Landmark" className="form-control" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
  </div>

  <div className="col-md-6 col-12">
    <input type="text" placeholder="Pincode" className="form-control" value={pincode} onChange={(e) => setPincode(e.target.value)} />
  </div>

</div>
      <div className="mb-3">
        <label className="form-label">Select Quantity</label>
        <input
          type="number"
          min="1"
          max={product.stock}
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>

      <h5>Total Price: ₹{totalPrice}</h5>

      {error && <p className="text-danger">{error}</p>}

      <button className="btn btn-primary fw-bold" onClick={handleBooking}>
        Order Now
      </button>
    <SuccessPopUp show={show} title={title} message={message}></SuccessPopUp>

    </div>
    </>
  );
}

export default BookingForm;
