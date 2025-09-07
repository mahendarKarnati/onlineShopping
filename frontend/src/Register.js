import React, { useState } from 'react';
import api from './axiosConfig';
import SuccessPopUp from './SuccessPopUp';
import   './SuccessPopUp.css';
const Register = () => {
  const [form, setForm] = useState({ name:'',email:'', username: '', password: '', role: 'ROLE_USER', mobile: '' });
  const[show, setShow]=useState(false)
  const[title, setTitle]=useState('')
  const[message, setMessage]=useState('')
    const [loading, setLoading] = useState(false);

console.log(form.role)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/auth/register", form);
      if(form.role==='ROLE_USER'){
      setShow(true)
      setTitle('success')
      setMessage('your account was successfully created')
      }
      else{
      setShow(true)
        setTitle('pending')
        setMessage('we recieved your request. we will confirm your role shorty.')
      }
      setInterval(() => {
      window.location.href='/login'
      }, 3000);
    } catch (err) {
      alert("Error registering");
      setLoading(false);

      // console.log('form data is: ',form)
    }
  };

  return (
<>

{loading && (
                <div className="text-center mb-3 position-absolute bg-dark h-100 w-100 d-flex align-items-center justify-content-center opacity-50">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
<form onSubmit={handleSubmit} className="container mt-5 p-5 rounded-4 shadow text-light formbg" style={{ maxWidth: "400px",bgColor:'red' }}>
      <h2 className="mb-4">Register</h2>
      <p>already have an account <a href='/login' style={{color:'lightskyblue'}}>login</a></p>
      <div className="form-group mb-3">
        <input
          type="text"
          name="name"
          autoComplete="name"
          className="form-control"
          placeholder="Name" onChange={e => setForm({...form, name: e.target.value})}
          required
        />
      </div>
       <div className="form-group mb-3">
        <input
          type="text"
          name="email"
          autoComplete="email"
          className="form-control"
          placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}

          required
        />
      </div>
      <div className="form-group mb-3">
        <input
          type="number"
          name="mobile"
          autoComplete="mobile"
          className="form-control"
          placeholder="Mobile Number" onChange={e => setForm({...form, mobile: parseInt(e.target.value)})}

          required
        />
      </div>
      <div className="form-group mb-3">
        <input
          type="text"
          name="username"
          autoComplete="username"
          className="form-control"
          placeholder="Username" onChange={e => setForm({...form, username: e.target.value})}

          required
        />
      </div>
     

      <div className="form-group mb-4">
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className="form-control"
          placeholder="Password" onChange={e => setForm({...form, password: e.target.value})}
          required
        />
      </div>
       <select name='role' className="form-select form-select mb-3" value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})}>
       <option value={'ROLE_USER'}>Register As User</option>
      <option value={'ROLE_PENDING_SUPPLIER'}>Register As Supplier</option>
     </select>
      <button type="submit" className="btn btn-primary w-100 fw-bold">Register</button>
    </form>
    <br></br>
<SuccessPopUp show={show} message={message} title={title}/>
    </>
  );
};

export default Register;
