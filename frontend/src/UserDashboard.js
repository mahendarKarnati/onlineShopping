import React, { useEffect, useState } from 'react';
import api from './axiosConfig';
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import './d.css';
import { jwtDecode } from "jwt-decode";

function UserDashboard() {
  const token = localStorage.getItem('token');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [time, setTime] = useState(Date.now());
  const [decode, setDecode] = useState(() => (token ? jwtDecode(token) : null));
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [bookings, setBookings] = useState([]);
  const [deliverAdds,setDeliverAdds]=useState({})
  const [popup,setPopup]=useState(false)

  function cls(status) {
    if (status === 'Completed') return 'bg-success text-light';
    if (status === 'Pending') return 'bg-warning';
    if (status === 'Cancelled') return 'bg-danger text-light';
    return '';
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000*60*30);
    return () => clearInterval(interval);
  }, []);

  // Decode token whenever token changes
  useEffect(() => {
    if (token) {
      try {
        setDecode(jwtDecode(token));
      } catch (err) {
        console.error('Failed to decode token', err);
        setDecode(null);
      }
    } else {
      setDecode(null);
    }
  }, [token]);

  // Check token expiration
  useEffect(() => {
    // if (decode?.exp && decode.exp <= Math.floor(time / 1000)) {
    if (decode.exp <= Math.floor(time / 1000)) {
      logout();
      navigate('/login');
    }
  }, [time, decode, logout, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.error('Not authenticated', err);
        navigate('/login');
      }
    };

    if (token && decode && decode.exp > Math.floor(time / 1000)) {
      fetchProfile();
    }
  }, [token, decode, time, navigate]);

  // Sync edit form when user is updated
  useEffect(() => {
    if (user) {
      setEditForm(user);
    }
  }, [user]);

  // Fetch bookings when user.id is available
  useEffect(() => {
    const bookingHistory = async () => {
      try {
        if (user.id) {
          const response = await api.get(`/api/bookings/${user.id}`);
          // console.log('raw booking data: ',response.data)
          const data = response.data.map((i) => ({
            id: i.id,
            name: i.customerName,
            phone: i.customerPhone,
            price: i.productPrice,
            address:i.customerAddress,
            quantity: i.quantity,
            totalPrice: i.totalPrice,
            bookingStatus: i.bookingStatus,
            deviveredDate: i.deviveredDate,
            status: i.status,
            productName: i.productName,
            bookingDate: i.bookingDate,
          }));
          setBookings(data);
        }
      } catch (e) {
        console.error('Failed to fetch bookings', e);
      }
    };

    bookingHistory();
  }, [user.id]);
    // console.log('booking list: ',bookings)
   function address( adds){
    if(!adds){
      console.log("address not found")
      return [];
    }
    else{
      let final=[];
      let a=adds.split(", ")
      for(let i=0;i<a.length;i++){
      let b=a[i].split(': ')
      // setDeliverAdds(b);
      final.push(b)

      }
      setDeliverAdds(final)
      // console.log("addresss is ",deliverAdds)
      // deliverAdds.map((i)=>(
      //   console.log('single address value',i)
      // ))
    }
    setPopup(true)
   }

  const fetchUser = async () => {
    try {
      // const res = await api.get('/api/user/profile', { withCredentials: true });
      // setUser(res.data);
      const res = await api.get('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,   // <-- add this
      },
      withCredentials: true,
    });
    setUser(res.data);
    } catch (err) {
      console.error('❌ Failed to load user', err);
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      console.log('Before update token:', localStorage.getItem('token'));
      await api.put('/api/user/update', editForm, {
      headers: {
        Authorization: `Bearer ${token}`,   // <-- include token
      },
      withCredentials: true,
    });
    // console.log('After update token:', localStorage.getItem('token'));
    // console.log('decode details: ',decode)
      alert('✅ Profile updated!');
      // window.location.reload();
      setEditing(false);
      fetchUser();
    } catch (err) {
      console.error('❌ Update failed', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-light">User Dashboard</h2>

      {/* Profile Section */}
      <div className="card mb-4">
        <div className="card-body">
          {editing ? (
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  value={editForm.name || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Name"
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  value={editForm.mobile || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mobile: e.target.value })
                  }
                  placeholder="Mobile"
                  max={10}
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  value={editForm.email || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  placeholder="Email"
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  value={editForm.username || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                    
                  }
                  placeholder="Username"
                  disabled
                />
              </div>
              <div className="col-12">
                <button onClick={handleUpdate} className="btn btn-success">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="row g-3">
                <div className="col-md-6">
                  <h5>Name: {user.name}</h5>
                </div>
                <div className="col-md-6">
                  <h6>Mobile Number: {user.mobile}</h6>
                </div>
                <div className="col-md-6">
                  <h6>Email: {user.email}</h6>
                </div>
                <div className="col-md-6">
                  <h6>Username: {user.username}</h6>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="btn btn-primary mt-3"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      
      <div className="card"  style={{position:'relative'}}>
        {
          (popup)?(
               <div className='table  border-5 bg-light'style={{zIndex:1,position:'absolute'}}>
                <div className='text-end p-2'>
                    <button onClick={()=>setPopup(false)} className='btn btn-danger'>X</button>
                </div>
        <table className='table table-strip'>
          <thead className='table table-head'>
            <th colSpan={2} className='text-success' >delivery  address</th>
          </thead>
       <tbody>
       {
        Array.isArray(deliverAdds) && deliverAdds.map((i,index)=>(
        <tr key={index} className='text-start'>
        <td><strong>{i[0]}</strong></td><td>{i[1]}</td>
        </tr>
        ))
       }
        </tbody>
       </table>
      </div>
      ):''
        }
        <div className="card-body">
          <h4 className="text-primary">My Bookings</h4>
          {bookings.length === 0 ? (
            <p>No bookings available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Address</th>
                    <th>Booking Date</th>
                    <th>Booking Status</th>
                    <th>Delivered Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.name}</td>
                      <td>{b.phone}</td>
                      <td>{b.productName}</td>
                      <td>{b.price}</td>
                      <td>{b.quantity}</td>
                      <td>{b.totalPrice}</td>
                      <td><a style={{cursor:'pointer',color:'blue'}} onClick={()=>address(b.address)}>click here</a></td>
                      <td>{b.bookingDate}</td>
                      <td>{b.bookingStatus}</td>
                      <td>{b.deviveredDate}</td>
                      <td className={cls(b.status)}>{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <br />

    </div>
  );
}

export default UserDashboard;
