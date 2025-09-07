import React, { useState, useEffect } from 'react';
import './Popup.css';

function BookingUpdatePopup({ show, onClose, onSubmit, booking }) {
  const [formData, setFormData] = useState({
    deliveredDate: '',
    bookingStatus: '',
    status: ''
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        deliveredDate: booking.deliveryDate || '',
        bookingStatus: booking.bookingStatus || '',
        status: booking.status || ''
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(booking.bookingId, formData);
  };

  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h4>Update Booking #{booking.bookingId}</h4>
        <form onSubmit={handleSubmit}>
          <label>Delivered Date:</label>
          <input
            type="date"
            name="deliveredDate"
            value={formData.deliveredDate}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <label>Booking Status:</label>
          <select
            name="bookingStatus"
            value={formData.bookingStatus}
            onChange={handleChange}
            className="form-control mb-2"
          >
            <option value="">--Select--</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>

          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-control mb-2"
          >
            <option value="">--Select--</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">Save</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingUpdatePopup;
