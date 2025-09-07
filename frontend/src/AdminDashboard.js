import React, { useEffect, useState } from 'react';
import api from './axiosConfig';
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import './d.css';

function AdminDashboard() {

  const token = localStorage.getItem('token');
  const { logout,role } = useAuth();
  const navigate = useNavigate(); 
  const[users,setUsers]=useState([]);
  const[suppliers,setSuppliers]=useState([]);
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [pendingData,setPendingData]=useState({});


  // // Get user ID from localStorage
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     try {
  //       const parsedUser = JSON.parse(storedUser);
  //       if (parsedUser?.id) {
  //         setUId(parsedUser.id);
  //         console.log('uid is:', parsedUser.id);
  //         console.log('stored : ',storedUser)
  //       }
  //     } catch (e) {
  //       console.error("Failed to parse user from localStorage", e);
  //     }
  //   }
  // }, []);

  // Fetch user profile
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
  useEffect(()=>{
   
    fetchPendingData();
},[]);
 const fetchPendingData= async ()=>{
    try{
    const pendingRequest= await api.get('/admin/pendingRequests');
  
    const pending=(pendingRequest.data).map((i)=>({
      id:i.id,
      name:i.name,
      email:i.email,
      mobile:i.mobile,
      username:i.username
    }
    ));
    setPendingData(pending)
    }
    catch(e){
      console.log("error ",e)
    }
  }


console.log("fetched pending data: ",pendingData)

const accept= async (id)=>{
  if(window.confirm("are you sure want to accept request")){
  try{
const request= await api.put(`/admin/accept/${id}`)
fetchPendingData();
console.log('accept request: ',request.data)
  }
  catch(e){
    console.log("error: ",e)
  }}
}

const reject= async (id)=>{
  if(window.confirm("are you sure want to accept request")){
  try{
const request= await api.delete(`/admin/reject/${id}`)
fetchPendingData();
console.log('reject request: ',request.data)
  }
  catch(e){
    console.log("error: ",e)
  }
}
}
  // Fetch bookings when user.id is available
  useEffect(() => {
    
      const usersData= async ()=>{
        try{
            if(role==='ROLE_ADMIN'){
        const response=await api.get('/admin/users');
       const gettingUsers=response.data
          const singleUser=gettingUsers.map((i)=>({
            id:i.id,
            name:i.name,
            email:i.email,
            // phone:i.phone,
            username:i.username
          }))
          setUsers(singleUser);
        }
    }
        catch(e){
          console.log("error",e)
        }
    }
      usersData();
      const suppliersData= async ()=>{
        try{
        const response=await api.get('/admin/suppliers');
       const gettingSuppliers=response.data
          const singleSupplier=gettingSuppliers.map((i)=>({
            id:i.id,
            name:i.name,
            email:i.email,
            // phone:i.phone,
            username:i.username
          }))
          setSuppliers(singleSupplier)
        }
        catch(e){
          console.log("error",e)
        }
      }
      suppliersData();
  },[role]);

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
console.log("user data is :  ",users)
console.log("suppliers data is :  ",suppliers)

  return (
    <div className="container mt-4">
  <h2 className="text-center">User Dashboard</h2>

  {/* Profile Section */}
  <div className="card mb-4">
    <div className="card-body">
      {editing ? (
        <>
          <input
            className="form-control mb-2"
            value={editForm.name || ''}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Name"
          />
          <input
            className="form-control mb-2"
            value={editForm.email || ''}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            placeholder="Email"
          />
          <input
            className="form-control mb-2"
            value={editForm.mobile || ''}
            onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
            placeholder="Mobile"
          />
          <input
            className="form-control mb-2"
            value={editForm.username || ''}
            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            placeholder="Username"
          />
          <button onClick={handleUpdate} className="btn btn-success w-100">Save</button>
        </>
      ) : (
        <>
          <h5>Name: {user.name}</h5>
          <h6>Mobile Number: {user.mobile}</h6>
          <h6>Email: {user.email}</h6>
          <h6>Username: {user.username}</h6>

          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button onClick={() => setEditing(true)} className="btn btn-warning me-md-2 mb-2">Edit</button>
            {/* <button onClick={() => window.location.href = '/addProduct'} className="btn btn-success me-md-2 mb-2">Add New Product</button> */}
            <button onClick={() => window.location.href = '/productDashboard'} className="btn btn-primary mb-2">Product Data</button>
          </div>
        </>
      )}
    </div>
  </div>
  <div className='card mb-4'>
    <div className='card-body table-responsive'>
      <h1>pending requests</h1>
      <table className='table table-borded table-hover'>
        <thead>
          <tr><th>S.No</th><th>name</th><th>email id</th><th>username</th><th>mobile No</th><th>action</th></tr>
          {(pendingData.length>0)?(
            pendingData.map((i,index)=>(
          <tr key={index}><td>{index+1}</td><td>{i.name}</td><td>{i.email}</td><td>{i.username}</td><td>{i.mobile}</td>
          <td><button className='btn btn-success' onClick={()=>accept(i.id)}>accept</button></td>
          <td><button className='btn btn-danger' onClick={()=>reject(i.id)}>reject</button></td>
          </tr>

            ))
          ):
          <tr><td colSpan={6}><p>no pending request data </p></td></tr>}
        </thead>
      </table>
    </div>
  </div>

  {/* Bookings Table */}
  <div className="card mb-4">
    <div className="card-body table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr className="table-primary"><th colSpan={5} className="text-center">Users Data</th></tr>
          <tr className="table-success"><th>S.No</th><th>User ID</th><th>Name</th><th>Email</th><th>Username</th></tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((i, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.email}</td>
                <td>{i.username}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={5} className="text-center">No data found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Supplier Table */}
  <div className="card mb-4">
    <div className="card-body table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table">
          <tr><th colSpan={5} className="text-center table-primary">Supplier Data</th></tr>
          <tr className='table-success'><th>S.No</th><th>User ID</th><th>Name</th><th>Email</th><th>Username</th></tr>
        </thead>
        <tbody>
          {suppliers.length > 0 ? (
            suppliers.map((i, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.email}</td>
                <td>{i.username}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={5} className="text-center">No data found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  <div className="text-center">
    <button className="btn btn-danger mt-3 w-100 w-md-auto" onClick={handleLogout}>Logout</button>
  </div>
  <br></br>

</div>

  );
}

export default AdminDashboard;

