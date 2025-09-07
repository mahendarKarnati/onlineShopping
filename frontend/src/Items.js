import React, { useEffect, useState} from 'react';
import api from './axiosConfig';
import './items.css';
import { Link,useNavigate  } from 'react-router-dom';

function Items() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await api.get('/api/products/get');
  const fetchedData=response.data
  const obj = fetchedData.map((i) => ({
  name: i.name,
  price: i.price,
  main: i.main,
  blouse: i.blouse,
  pallu: i.pallu,
  showcase: i.showcase,
  border: i.border,
  description: i.description,
  id: i.id
}));
// console.log("obj is: ",obj)
setProducts(obj);


      } catch (err) {
        console.log(err)
      }
    };
    fetching();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{color:'chartreuse'}}>🛒 Product List</h2>
      <div className="row">
        {
          (products.length>0)?(
        products.map((prod, index) => (
          <div className="col mb-4 d-flex justify-content-around w-100" key={index}>
            <div
              className="product d-flex flex-column align-items-center justify-content-center p-2 border border-1 rounded-3 shadow-sm " onClick={() => navigate(`/product/${prod.id}`)}
            >
              <div className="imgBox d-flex align-items-center justify-content-center">
                <img src={prod.showcase} alt="product" width="100%" height="100%" style={{ objectFit: 'contain' }} />
              </div>
              {/* <span className="name fw-bold mt-2">{prod.name}</span> */}
              <div className="action d-flex flex-column gap-2 justify-content-center w-100 mt-2 px-1">
              <span className="price fw-bold">₹ {prod.price}</span>
                <Link to={`/product/${prod.id}`}>
                <button className="btn btn-primary" >Buy Now</button>
                </Link>
              </div>
            </div>
          </div>
        ))
        ):(<p className='pt-5 text-light'> items not available</p>)
        }
      </div>
    </div>
  );
}
export default Items;
