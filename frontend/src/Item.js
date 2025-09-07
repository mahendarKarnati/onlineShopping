import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // ✅ fixed navigate import
import api from './axiosConfig';
import './Item.css';
import { useAuth } from './AuthContext';

function Item() {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity,setQuantiy] =useState(1);
  const [popUp, setPopUp]=useState(false);
  const [picture,setPicture]=useState();
  const [user, setUser] = useState(null); // ✅ Add user state
  const navigate = useNavigate(); // ✅ Use react-router-dom navigate
  const { id } = useParams();
  const productId = Number(id);
const {userId}=useAuth();
// console.log('logged user is: ',userId)
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetching = async () => {
      try {
        const response = await api.get(`/api/products/get/${productId}`);
        const fetchedData = await api.get(`/api/products/get`);

        const allData = fetchedData.data;
        setProduct(response.data);

        const obj = allData.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          showcase: i.showcase,
          blouse: i.blouse,
          pallu: i.pallu,
          border: i.border,
          main: i.main,
          description: i.description,
        }));
        setProducts(obj);
      } catch (err) {
        console.log("error from api : ", err);
      }
    };

    fetching();
    // console.log('single product ',product)
    // console.log("all products ",products)

    // ✅ Load user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
// console.log("user id is : ",user)

  }, [productId]);

  const handleOrder = (e) => {
    e.preventDefault(); // Stop link from navigating before check
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/book/${product.id}`);
    }
  };
  // console.log('sigle product names: ',product)

  if (!product)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
     function carting(e){
      e.preventDefault();
      if(userId){
      const data={
        quantity:quantity,
        subTotal:quantity*product.price,
        productId:productId,
        userId:userId
      }
      try{
       api.post("/api/add-to-cart",data)
      alert("added to cart successfully")
      }
      catch(e){
        console.log("error is: ",e)
        alert("Fail to add")
      }}
      else{
        alert('please login first')
        navigate('/login')
      }
    }
    function popupImage(image){
      
        setPicture(image)
        setPopUp(true)
    }
  return (
    <>
      {
              (popUp)?(
                <div className='d-flex flex-column w-100 border text-primary z-1 px-2 align-items-center justify-content-center' style={{backgroundColor:'rgba(0,0,0,0.5',height:'100vh',position:'relative'}}>
                  <button className=' text-center text-light fw-bold rounded' style={{width:'45px',height:'45px',font:'20px',top:'0px',right:'0',position:'absolute',backgroundColor:'red'}} onClick={()=>setPopUp(false)}>X</button>
                  <img src={picture} height={'100%'} style={{minWidth:'460px',maxWidth:'500px'}} alt={picture}></img>

                </div>
              ):(<>
      <div className="images">
      <div id="carouselExampleIndicators" className="carousel slide">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>

  </div>
  <div className="carousel-inner" >
    <div id='box' className="carousel-item active border" onClick={()=>popupImage(product.main)}>
      <img src={product.main} class="d-block" alt="main"/>
    </div>
    <div className="carousel-item" onClick={()=>popupImage(product.blouse)}>
      <img src={product.blouse} class="d-block" alt="blouse"/>
    </div>
    <div className="carousel-item" onClick={()=>popupImage(product.border)}>
      <img src={product.border} class="d-block" alt="border"/>
    </div>
    
    <div className="carousel-item" onClick={()=>popupImage(product.showcase)}>
      <img src={product.showcase} class="d-block" alt="showcase"/>
    </div>
    <div className="carousel-item" onClick={()=>popupImage(product.pallu)}>
      <img src={product.pallu} class="d-block" alt="pallu"/>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
  
</div>







        <div className="d-flex flex-column align-items-center justify-content-center w-50 text-l text-light">
          <h1>{product.name}</h1>
          <h2>₹{product.price}</h2>
          <p>{product.description}</p>
          <div className='d-flex gap-2'>
            <button className="btn btn-warning" onClick={carting}>add cart</button>
            <button className="btn btn-primary" onClick={handleOrder}>Order Now</button><br></br>
          </div>
        </div>
      </div>

      <br />
      <div className='p-3'>
      <h2 className="text-start text-light mb-4">Similar products</h2>
            <div className="row">
              {products.map((prod, index) => (
                <div className="col mb-4" key={index}>
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
              ))}
            </div>
            </div>
            </>)}
    </>
  );
}

export default Item;
