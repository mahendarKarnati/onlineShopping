import React, { useEffect, useState } from 'react';
import api from './axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext';
import { useParams } from 'react-router-dom';

function UpdateProduct() {
    const {username,userId,token} = useAuth();


    console.log('useauth user nmae is: ',username)
    console.log('token is: ',token)

    console.log('useauth user id is: ',userId)
    console.log('useauth user id type is: ',typeof(userId))

         const { id } = useParams();
  const productId = Number(id);

  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await api.get(`/api/products/get/${productId}`);

        setProduct(response.data);
        setPreviewUrls({
    main:response.data.main,
    showcase:response.data.showcase,
    blouse:response.data.blouse,
    border:response.data.border,
    pallu:response.data.pallu

})

      } catch (err) {
        console.log("error from api : ", err);
      }
    };

    fetching();
  }, [productId]);








  const [product, setProduct] = useState({
    name: '',
    price: '',
    mrp: '',
    stock: '',
    suplierId: userId,
    description: ''
  });

  const [images, setImages] = useState({
    main: null,
    pallu: null,
    blouse: null,
    border: null,

    showcase: null
  });

  const [previewUrls, setPreviewUrls] = useState({});
  const [loading, setLoading] = useState(false);


  function handleChange(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    const { name, files } = e.target;
    const file = files[0];
    setImages({ ...images, [name]: file });
    setPreviewUrls({ ...previewUrls, [name]: URL.createObjectURL(file) });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("mrp", product.mrp);

    formData.append("stock", product.stock);
    formData.append("suplierId", product.suplierId);
    formData.append("description", product.description);

if (images.main) formData.append("main", images.main);
if (images.pallu) formData.append("pallu", images.pallu);
if (images.blouse) formData.append("blouse", images.blouse);
if (images.border) formData.append("border", images.border);
if (images.showcase) formData.append("showcase", images.showcase);








    try {
      setLoading(true);
      const res = await api.put(`/api/products/update/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" ,
        "Authorization": `Bearer ${token}`

        }
      });

      alert("✅ Product added successfully!");
      window.location.href='/productDashboard';
      console.log(res.data);
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow p-4 rounded-4 border-0">
            <h2 className="text-center mb-4 text-primary">Add New Product</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  placeholder="Product Name"
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                  placeholder="Price (₹)"
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  name="mrp"
                  value={product.mrp}
                  onChange={handleChange}
                  required
                  placeholder="MRP (₹)"
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  required
                  placeholder="stock"
                  min={1}
                />
              </div>

              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={product.description}
                  onChange={handleChange}
                  required
                  placeholder="Description"
                ></textarea>
              </div>

              {/* Image inputs */}
              {["main", "pallu", "blouse", "border","showcase"].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label text-capitalize">{field} Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name={field}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {previewUrls[field] && (
                    <div className="text-center mt-2">
                      <img
                        src={previewUrls[field]}
                        alt={field}
                        className="img-fluid rounded"
                        width="200"
                      />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="text-center mb-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success btn-lg rounded-pill"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
