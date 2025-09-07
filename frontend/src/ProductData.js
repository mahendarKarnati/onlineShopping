import React, { useEffect, useState } from 'react'
import './d.css'
import { useAuth } from './AuthContext'
import api from './axiosConfig';
function ProductData() {
  const[products,setProducts]=useState([]);

  const {userId,role}=useAuth();
  useEffect(()=>{
    const fetchingProducts= async ()=>{
      try{
        if(role!=='ROLE_ADMIN'){
      const response=await api.get(`/api/products/supplierProducts/${userId}`)
      // setProducts(response.data)
     const gettingData= response.data.map((i)=>({
          id:i.id,
          name:i.name,
          price:i.price,
          description:i.description,
          stock:i.stock,
          main:i.main,
          showcase:i.showcase,
          pallu:i.pallu,
          blouse:i.blouse,
          border:i.border
      }))
      setProducts(gettingData)
    }
    else{
      const response=await api.get('/api/products/getAllProducts')
     const gettingData= response.data.map((i)=>({
          id:i.id,
          name:i.name,
          price:i.price,
          description:i.description,
          stock:i.stock,
          main:i.main,
          showcase:i.showcase,
          pallu:i.pallu,
          blouse:i.blouse,
          border:i.border,
          supplierId:i.suplierId

      }))
      setProducts(gettingData)

    }
      }
      catch(e){
        console.log('error from backend ',e)
      }
    }
    fetchingProducts();
  },[userId,role])
  // products.map((i)=>(
  //   console.log(i)
  // ))
  // console.log('all product data',products)
    const handlingDeletion=async (id) =>{
      if(window.confirm('are you sure want to delete this product')){
        try{
        const requst= await api.delete(`api/products/delete/${id}`)
        // console.log("request sending: ",requst)
        }
        catch(e){
          console.log('error: ',e)
        }
      }
    }
    const handlingUpdate=(id)=>{
      window.location.href=`/UpdateProduct/${id}`;
    }
      // console.log('response data',response.data)
      // console.log('products are: ',products)

  return (
    <div className="p-3">
  <h1 className="text-center text-primary">your products</h1>
  <div className="table-responsive">
    <table className="table table-bordered align-middle">
      <thead className="table-light text-nowrap">
        <tr>
          <th>product id</th>
          {role === 'ROLE_ADMIN' && <th>supplierId</th>}
          <th>product name</th>
          <th>product price</th>
          <th>description</th>
          <th>stock</th>
          <th>showcase</th>
          <th>main</th>
          <th>pallu</th>
          <th>blouse</th>
          <th>border</th>
          <th colSpan={2}>actions</th>
        </tr>
      </thead>

      {products.length <= 0 ? (
        <tbody><tr><td colSpan="13" className="text-center">No products</td></tr></tbody>
      ) : (
        <tbody>
          {products.map((p, index) => (
            <tr key={index}>
              <td>{p.id}</td>
              {role === 'ROLE_ADMIN' && <td>{p.supplierId}</td>}
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.description}</td>
              <td>{p.stock}</td>
              <td><img src={p.showcase} alt="showcase" className="img-fluid" style={{ maxHeight: '50px' }} /></td>
              <td><img src={p.main} alt="main" className="img-fluid" style={{ maxHeight: '50px' }} /></td>
              <td><img src={p.pallu} alt="pallu" className="img-fluid" style={{ maxHeight: '50px' }} /></td>
              <td><img src={p.blouse} alt="blouse" className="img-fluid" style={{ maxHeight: '50px' }} /></td>
              <td><img src={p.border} alt="border" className="img-fluid" style={{ maxHeight: '50px' }} /></td>
              <td>
                <button className="btn btn-warning btn-sm rounded-3" onClick={() => handlingUpdate(p.id)}>edit</button>
              </td>
              <td>
                <button className="btn btn-danger btn-sm rounded-3" onClick={() => handlingDeletion(p.id)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  </div>
</div>

  )
}

export default ProductData
