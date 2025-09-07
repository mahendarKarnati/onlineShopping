import React, { useState } from 'react';
import api from './axiosConfig';

function ForgetPassword() {
  const [form, setForm] = useState({ email: '', mobile: '' });
  const [hiddenForm, setHiddenForm] = useState(false);
  const [newPsw, setNewPsw] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await api.post('/api/auth/forget', form);
      alert("User verified. Now reset your password.");
      // console.log("Verification response:", request.data);
      setHiddenForm(true);
    } catch (e) {
      console.error('User not found:', e);
      alert("Verification failed");
      // console.log('form data ',form)
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/reset', { email: form.email, password: newPsw });
      // console.log("response is : ",response.data)
      alert("Password reset successfully");
      window.location.href='/login'
    } catch (e) {
      console.error('Reset error:', e);
      alert("Reset failed");
      // console.log('passw: ',newPsw)
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}><br></br>
      <h2 className='text-light p-2'>Forget Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          className="form-control mb-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type='number'
          placeholder='Mobile'
          className="form-control mb-2"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          required
        />
        <button type='submit' className="btn btn-primary w-100 fw-bold">Verify</button>
      </form>

      {hiddenForm && (
        <>
          <h4 className="mt-4 text-light">Reset Password</h4>
          <form onSubmit={handleReset}>
            <input
              type='password'
              placeholder='New Password'
              className="form-control mb-2"
              value={newPsw}
          onChange={(e) => setNewPsw(e.target.value)}
            //   onChange={...form,newPsw: e.target.value}}
              required
            />
            <button type='submit' className="btn btn-success w-100 fw-bold">Reset</button>
          </form>
        </>
      )}
      <br></br>

    </div>
  );
}

export default ForgetPassword;
