
import React, { useState } from 'react';
import api from './axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext';
function ProductForm() {
     const {userId,token} = useAuth();
     const [uploadPercentage, setUploadPercentage] = useState(0);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    mrp:'',
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
  const[error,setError]=useState('')
  

  function handleChange(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
    if(product.mrp <product.price){
      setError('price should lessthan mrp')
    }
    else{
      setError('');
    }
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

console.log("== Form Data Submission ==");
console.log("name", product.name);
console.log("price", product.price);
console.log("mrp", product.mrp);
console.log("stock", product.stock);
console.log("suplierId", product.suplierId);
console.log("description", product.description);
console.log("images:", images); // Log all file objects

Object.entries(images).forEach(([key, file]) => {
  console.log(`${key}: ${file?.name || 'null'}`);
});

let totalSize = 0;
Object.values(images).forEach(file => {
  if (file) totalSize += file.size;
});
console.log("Total upload size (bytes):", totalSize);
Object.entries(images).forEach(([key, file]) => {
  if (!file) {
    console.warn(`🚫 Missing image for key: ${key}`);
  } else {
    console.log(`✅ ${key}: ${file.name}, size: ${file.size} bytes`);
    formData.append(key, file);
  }
});



    try {
      setLoading(true);
      const res = await api.post("/api/products/add", formData, {
            headers: {
                 "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`
  } ,
  onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercentage(percentCompleted);
        }
      });

      alert("✅ Product added successfully!");
      console.log(res.data);

      // Reset form
      setProduct({ name: '', price: '', mrp:'', stock:'', description: '', suplierId: userId });
      setImages({ main: null, pallu: null, blouse: null, border: null, showcase: null });
      setPreviewUrls({});
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
                  name="mrp"
                  value={product.mrp}
                  onChange={handleChange}
                  required
                  placeholder="MRP (₹)"
                  title='MRP price means the price which is maximum'
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
                  title='this is selling price '
                />
                <p className='text-danger'>{error}</p>
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
                    required
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
              )          
              }
              {(loading && uploadPercentage > 0) && (
                  <div className="progress mb-3">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${uploadPercentage}%` }}
                      aria-valuenow={uploadPercentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {uploadPercentage}%
                    </div>
                  </div>
                )}

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success btn-lg rounded-pill"
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <br></br>
    </div>
  );
}

export default ProductForm;
