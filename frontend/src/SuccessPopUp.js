import React from 'react';
import './SuccessPopUp.css'
function SuccessPopUp({ show,title,message }) {
    if(!show){
        return null;
    }
  return (
    <div className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
      <div id='popup' className='position-relative d-flex flex-column align-items-center justify-content-center border w-25 h-50 rounded-5 shadow bg-white'>
        <p className='success' style={{fontSize:'70px'}}>✓</p>
        <h3 style={{color:'black'}}>{title}</h3>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default SuccessPopUp;
