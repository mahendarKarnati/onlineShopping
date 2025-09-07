package com.mahendar.onlineShopping.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mahendar.onlineShopping.model.Product;
import com.mahendar.onlineShopping.repo.ProductRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/products")
public class ProductController {

//    private final CorsFilter corsFilter;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private ProductRepository productRepository;

//    ProductController(CorsFilter corsFilter) {
//        this.corsFilter = corsFilter;
//    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('SUPPLIER')")
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("mrp") double mrp,
            @RequestParam("stock") int stock,
            @RequestParam("suplierId") Long suplierId,
            @RequestParam("description") String description,
            @RequestParam(value = "main", required = false) MultipartFile main
            ,
            @RequestParam(value = "pallu", required = false) MultipartFile pallu,
            @RequestParam(value = "showcase", required = false) MultipartFile showcase,
            @RequestParam(value = "blouse", required = false) MultipartFile blouse,
            @RequestParam(value = "border", required = false) MultipartFile border
            ) throws IOException {
    	MultipartFile[] files = {main, pallu, showcase, blouse, border};
        long fileCount = Arrays.stream(files)
                .filter(f -> f != null && !f.isEmpty())
                .count();
        if (fileCount > 5) {
            return ResponseEntity.badRequest().body("Too many files uploaded. Maximum allowed is 5.");
        }
//    	System.out.println("all images"+mainUrl+palluUrl+blouseUrl+borderUrl+showcaseUrl);
    	System.out.println("main size: " + main.getSize());
    	System.out.println("pallu size: " + pallu.getSize());
    	System.out.println("blouse size: " + blouse.getSize());
    	System.out.println("border size: " + border.getSize());
    	System.out.println("showcase size: " + showcase.getSize());

    	long totalSize = 0;
    	if (main != null) totalSize += main.getSize();
    	if (pallu != null) totalSize += pallu.getSize();
    	if (blouse != null) totalSize += blouse.getSize();
    	if (border != null) totalSize += border.getSize();
    	if (showcase != null) totalSize += showcase.getSize();

    	System.out.println("Total upload size (MB): " + (totalSize / (1024 * 1024)));

    	System.out.println(main);
        // Upload all images separately to Cloudinary
        String mainUrl = uploadToCloudinary(main);
        String palluUrl = uploadToCloudinary(pallu);
        String blouseUrl = uploadToCloudinary(blouse);
        String borderUrl = uploadToCloudinary(border);
        String showcaseUrl = uploadToCloudinary(showcase);
        
//        System.out.println("all images"+mainUrl+palluUrl+blouseUrl+borderUrl+showcaseUrl);
        // Save product (include all URLs in entity)
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setMrp(mrp);
        p.setDiscount((int)((1 - (price / mrp)) * 100));

        
        p.setStock(stock);
        p.setDescription(description);
        p.setMain(mainUrl);
        p.setPallu(palluUrl);
        p.setBlouse(blouseUrl);
        p.setBorder(borderUrl);
        p.setShowcase(showcaseUrl);
        p.setSuplierId(suplierId);
        System.out.println("id:  "+suplierId+"  "+p.getSuplierId());
        productRepository.save(p);
        return ResponseEntity.ok("Product saved!");
    }

    
//    @PostMapping("/add")
//    @PreAuthorize("hasRole('SUPPLIER')")
//    public ResponseEntity<?> addProduct(
//            @RequestParam("name") String name,
//            @RequestParam("price") double price,
//            @RequestParam("mrp") double mrp,
//            @RequestParam("stock") int stock,
//            @RequestParam("suplierId") Long suplierId,
//            @RequestParam("description") String description,
//            @RequestParam(value = "main", required = false) MultipartFile main
////            @RequestParam(value = "pallu", required = false) MultipartFile pallu,
////            @RequestParam(value = "showcase", required = false) MultipartFile showcase,
////            @RequestParam(value = "blouse", required = false) MultipartFile blouse,
////            @RequestParam(value = "border", required = false) MultipartFile border
//    ) throws IOException {
//
//        // Validate file count (max 5 files allowed)
//        MultipartFile[] files = new MultipartFile[]{main};
//        long fileCount = Arrays.stream(files)
//                .filter(f -> f != null && !f.isEmpty())
//                .count();
//
//        if (fileCount > 5) {
//            return ResponseEntity.badRequest().body("You can only upload up to 5 images.");
//        }
//
//        // Upload images to Cloudinary only if not null
//        String mainUrl = (main != null && !main.isEmpty()) ? uploadToCloudinary(main) : null;
////        String palluUrl = (pallu != null && !pallu.isEmpty()) ? uploadToCloudinary(pallu) : null;
////        String blouseUrl = (blouse != null && !blouse.isEmpty()) ? uploadToCloudinary(blouse) : null;
////        String borderUrl = (border != null && !border.isEmpty()) ? uploadToCloudinary(border) : null;
////        String showcaseUrl = (showcase != null && !showcase.isEmpty()) ? uploadToCloudinary(showcase) : null;
//
//        // Create and save product
//        Product p = new Product();
//        p.setName(name);
//        p.setPrice(price);
//        p.setMrp(mrp);
//        p.setDiscount((int) ((1 - (price / mrp)) * 100));
//        p.setStock(stock);
//        p.setDescription(description);
//        p.setMain(mainUrl);
////        p.setPallu(palluUrl);
////        p.setBlouse(blouseUrl);
////        p.setBorder(borderUrl);
////        p.setShowcase(showcaseUrl);
//        p.setSuplierId(suplierId); // ✅ Set supplier ID
//
//        productRepository.save(p);
//
//        return ResponseEntity.ok("✅ Product saved successfully!");
//    }

    
    
    private String uploadToCloudinary(MultipartFile file) throws IOException {
        Map result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
            "folder", "ecommerce/productsData",
            "quality", "100"
        ));
        return result.get("secure_url").toString();
    }
    
    //update product    
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('SUPPLIER')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("mrp") double mrp,
            
            @RequestParam("stock") int stock,
            @RequestParam("suplierId") Long suplierId,
            @RequestParam("description") String description,
            @RequestParam(value = "main", required = false) MultipartFile main,
            @RequestParam(value = "pallu", required = false) MultipartFile pallu,
            @RequestParam(value = "showcase", required = false) MultipartFile showcase,
            @RequestParam(value = "blouse", required = false) MultipartFile blouse,
            @RequestParam(value = "border", required = false) MultipartFile border
) throws IOException {
    	
    	
    	// Save product (include all URLs in entity)
       Product p = productRepository.findById(id)
    		   .orElseThrow(() -> new RuntimeException("product not found"));
       if(p.getSuplierId()==suplierId) {
        p.setName(name);
        p.setPrice(price);
        p.setMrp(mrp);
        p.setDiscount((int)(price/mrp*100));
        p.setStock(stock);
        p.setDescription(description);
    	

        // Upload all images separately to Cloudinary
    	if(main!=null) {
        String mainUrl = uploadToCloudinary(main);
        p.setMain(mainUrl);
    	}
        if(pallu!=null) {
        String palluUrl = uploadToCloudinary(pallu);
        p.setPallu(palluUrl);
        }
        if(blouse!=null) {
        String blouseUrl = uploadToCloudinary(blouse);
        p.setBlouse(blouseUrl);
        }
        if(border!=null) {
        String borderUrl = uploadToCloudinary(border);
        p.setBorder(borderUrl);
        }
        if(showcase!=null) {
        String showcaseUrl = uploadToCloudinary(showcase);
        p.setShowcase(showcaseUrl);
        }

        
        System.out.println("id:  "+suplierId+"  "+p.getSuplierId());
        productRepository.save(p);
       }
       else {
    	   return ResponseEntity.ok("you are unauthorized supplier");
       }
        return ResponseEntity.ok("Product saved!");
    }
       

    @GetMapping("/get")
    public List<Product> getProducts(){
//    	return productRepository.findAllAvailableProducts();
    	System.out.println(productRepository.findAllAvailableProducts());
    	return productRepository.findAllAvailableProducts();
    }
    @GetMapping("/getAllProducts")
    public List<Product> allProducts(){
    	return productRepository.findAll();
    }
    @GetMapping("/get/{id}")
    public Optional<Product> getProductDetails(@PathVariable Long id){
    	return productRepository.findById(id);
    }
    @GetMapping("/supplierProducts/{id}")
    @PreAuthorize("hasRole('SUPPLIER')")
    public List<Product> getSupplierProducts(@PathVariable Long id){
    	return productRepository.findBySuplierId(id);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id){
    	productRepository.deleteById(id);
		return ResponseEntity.ok("delete product successfully");
    }
    
}
