import React, { useEffect, useState } from 'react';
import api from './axiosConfig';
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import './d.css';
import BookingUpdatePopup from './BookingUpdatePopup';

function UserDashboard() {
  const [showPopup, setShowPopup] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);

  const token = localStorage.getItem('token');
  const { logout,role } = useAuth();
  const navigate = useNavigate(); 
  // const[users,setUsers]=useState({});
  // const[suppliers,setSuppliers]=useState({});
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [bookings, setBookings] = useState([]);
const openPopup = (booking) => {
  setSelectedBooking(booking);
  setShowPopup(true);
};


const handleBookingUpdate = async (bookingId, formData) => {
  try {
    const response = await api.put(`/api/bookings/supplier/updates/${bookingId}`, formData, {
      withCredentials: true
    });
    console.log('update response: ',response.data)
    alert('✅ Booking updated');
    setShowPopup(false);
    // Refresh bookings
    const res = await api.get(`/api/bookings/supplier/${user.id}`);
    setBookings(res.data.map((i) => ({
      bookingId:i.id,
      customerId: i.userId,
      productId:i.productId,
      productName:i.productName,
      price: i.productPrice,
      customerName: i.customerName,
      address:i.customerAddress,
      landmark:i.landmark,
      phone: i.customerPhone,
      quantity: i.quantity,
      totalPrice: i.totalPrice,
      orderDate:i.bookingDate,
      deliveryDate:i.deliveredDate,
      status:i.status,
      bookingStatus:i.bookingStatus
    })));
  } catch (err) {
    console.error("❌ Booking update failed", err);
    alert("Failed to update booking");
  }
};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        console.log("dashboard response:", response.data);
        setUser(response.data);
      } catch (err) {
        console.error("Not authenticated", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // Sync edit form when user is updated
  useEffect(() => {
    if (user) {
      setEditForm(user);
    }
  }, [user]);

  // Fetch bookings when user.id is available
  useEffect(() => {
    const bookedList = async () => {
      try {
        if (user.id) {
          const response = await api.get(`/api/bookings/supplier/${user.id}`);
          const data = response.data;
          console.log('raw data is: ',data)
          const singleData = data.map((i) => ({
            bookingId:i.id,
            customerId: i.userId,
            productId:i.productId,
            productName:i.productName,
            price: i.productPrice,
            customerName: i.customerName,
            address:i.customerAddress,
            landmark:i.landmark,
            phone: i.customerPhone,
            quantity: i.quantity,
            totalPrice: i.totalPrice,
            orderDate:i.bookingDate,
            deliveryDate:i.deliveredDate,
            status:i.status,
            bookingStatus:i.bookingStatus
          }));
          setBookings(singleData);
          console.log("Booking data:", singleData);
        }
      } catch (e) {
        console.error("Failed to fetch bookings", e);
      }
    };

    bookedList();
  }, [user.id,role]);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/user/profile", {
        withCredentials: true
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to load user", err);
      if (err.response && err.response.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await api.put("/api/user/update", editForm, {
        withCredentials: true
      });
      console.log("Profile updated:", response.data);
      alert("✅ Profile updated!");
      setEditing(false);
      fetchUser();
    } catch (err) {
      console.error("❌ Update failed", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
console.log("booking data is :  ",bookings)
  return (
    <div className="container mt-4"><br></br>
  <h2 className="mb-4 text-center text-light">User Dashboard</h2>

  {/* Profile Section */}
  <div className="card mb-4">
    <div className="card-body">
      {editing ? (
        <div className="row g-3">
          <div className="col-md-6">
            <input
              className="form-control"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder='Name'
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              placeholder='Email'
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              value={editForm.mobile || ''}
              onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              placeholder='Mobile'
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              value={editForm.username || ''}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              placeholder='Username'
            />
          </div>
          <div className="col-12">
            <button onClick={handleUpdate} className="btn btn-success w-100">Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-3">
            <div className="col-md-6"><h5>Name: {user.name}</h5></div>
            <div className="col-md-6"><h6>Mobile Number: {user.mobile}</h6></div>
            <div className="col-md-6"><h6>Email: {user.email}</h6></div>
            <div className="col-md-6"><h6>Username: {user.username}</h6></div>
          </div>
          <div className="d-flex flex-column flex-md-row gap-2 mt-3 w-100 align-items-center justify-content-center">
            <button onClick={() => setEditing(true)} className="btn btn-primary w-50 w-md-auto">Edit</button>
            <button onClick={() => window.location.href='/addProduct'} className="btn btn-success w-50 w-md-auto">Add New Product</button>
            <button onClick={() => window.location.href='/productDashboard'} className="btn btn-success w-50 w-md-auto">Product Data</button>
          </div>
        </>
      )}
    </div>
  </div>

  {/* Bookings Section */}
  <div className="card mb-4">
    <div className="card-body">
      <h4 className="mb-3">My Bookings</h4>
      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <div className="accordion" id="accordionExample">
          {bookings.map((b, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="true"
                  aria-controls={`collapse${index}`}
                >
                  <strong>Booking ID {b.bookingId} | Status: {b.status}</strong>
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="table-responsive">
                    <table className='table table-bordered'>
                      <tbody>
                        <tr><th>Booking ID</th><td>{b.bookingId}</td></tr>
                        <tr><th>Customer ID</th><td>{b.customerId}</td></tr>
                        <tr><th>Customer Name</th><td>{b.customerName}</td></tr>
                        <tr><th>Address</th><td>{b.address}</td></tr>
                        <tr><th>Landmark</th><td>{b.landmark}</td></tr>
                        <tr><th>Mobile No</th><td>{b.phone}</td></tr>
                        <tr><th>Product ID</th><td>{b.productId}</td></tr>
                        <tr><th>Product Name</th><td>{b.productName}</td></tr>
                        <tr><th>Product Price</th><td>{b.price}</td></tr>
                        <tr><th>Quantity</th><td>{b.quantity}</td></tr>
                        <tr><th>Total Price</th><td>{b.totalPrice}</td></tr>
                        <tr><th>Order Date</th><td>{b.orderDate}</td></tr>
                        <tr><th>Delivered Date</th><td>{b.deliveryDate}</td></tr>
                        <tr><th>Booking Status</th><td>{b.bookingStatus}</td></tr>
                        <tr><th>Status</th><td>{b.status}</td></tr>
                        <tr>
                          <td colSpan={2}>
                            <button className='btn btn-warning btn-sm w-100 rounded-pill mt-2' onClick={() => openPopup(b)}>Update</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  <button className="btn btn-danger mt-3 w-25" onClick={handleLogout}>Logout</button><br></br><br></br>

  {/* Booking Popup */}
  <BookingUpdatePopup
    show={showPopup}
    booking={selectedBooking}
    onClose={() => setShowPopup(false)}
    onSubmit={handleBookingUpdate}
  />
</div>

  );
}
export default UserDashboard;