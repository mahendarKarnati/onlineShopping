import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './axiosConfig';

import BookingForm from './BookingForm';  // The form I gave earlier
import { useAuth } from './AuthContext';


function BookingPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const{role}=useAuth();
    const back=useNavigate();

      useEffect(()=>{
    const nonUser= async ()=>{
        if(role!=='ROLE_USER'){
    back(-1)

    alert("Hey you are not user. you don't have permission to book")
}
    }
    nonUser();

  },[role,back])
  
    useEffect(() => {
        api.get(`/api/products/get/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.log(err));
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <h2 className="text-center my-4 text-light">Booking for: {product.name}</h2>
            <BookingForm product={product} />
      <br></br>

        </div>
    );
}

export default BookingPage;




