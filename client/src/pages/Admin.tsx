import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  isFeatured: boolean;
}

// Update our Site Image interface to expect the new backend safety net structure
interface SiteImageState {
  live: string | null;
  backup: string | null;
}

const IMAGE_LOCATIONS = [
  { id: 'home-hero', label: 'Main Homepage Hero (1920x1080)' },
  { id: 'shop-all', label: 'Shop All Banner (1920x1080)' },
  { id: 'bracelets-banner', label: 'Bracelets Collection Banner (1920x1080)' },
  { id: 'bracelets-card', label: 'Bracelets Collection Card (1080x1350)' },
  { id: 'raw-stones-banner', label: 'Raw Stones Banner (1920x1080)' },
  { id: 'raw-stones-card', label: 'Raw Stones Card (1080x1350)' },
  { id: 'crystal-trees-banner', label: 'Crystal Trees Banner (1920x1080)' },
  { id: 'crystal-trees-card', label: 'Crystal Trees Card (1080x1350)' },
  { id: 'recommended-banner', label: 'Recommended / Favorites Banner (1920x1080)' },
  { id: 'recommended-card', label: 'Recommended / Favorites Card (1080x1350)' }
];

export default function Admin() {
  // --- IMAGERY MANAGER STATES ---
  const [imageLocation, setImageLocation] = useState(IMAGE_LOCATIONS[0].id);
  const [siteFile, setSiteFile] = useState<File | null>(null);
  const [sitePreview, setSitePreview] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageMessage, setImageMessage] = useState("");
  const [currentSiteImages, setCurrentSiteImages] = useState<Record<string, SiteImageState>>({}); 

  // --- PRODUCT STATES ---
  const [productData, setProductData] = useState({
    name: '', description: '', price: '', category: 'Crystals', stock: 1, isFeatured: false
  });
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [isProductUploading, setIsProductUploading] = useState(false);
  const [productMessage, setProductMessage] = useState("");
  const [inventory, setInventory] = useState<Product[]>([]);

  // --- DATA FETCHING ---
  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    }
  };

  const fetchSiteImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/site-images');
      const data = await response.json();
      setCurrentSiteImages(data);
    } catch (error) {
      console.error("Failed to fetch site images", error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchSiteImages(); 
  }, []);

  // --- IMAGERY HANDLERS ---
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageLocation(e.target.value);
    setSiteFile(null);
    setSitePreview(null);
    const input = document.getElementById('siteImageInput') as HTMLInputElement;
    if (input) input.value = '';
    setImageMessage("");
  };

  const handleSiteFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSiteFile(file);
    if (file) setSitePreview(URL.createObjectURL(file));
    else setSitePreview(null);
  };

  const handleSiteImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteFile) return setImageMessage("Please select an image first.");
    setIsImageUploading(true);
    setImageMessage("");

    const formData = new FormData();
    formData.append('location', imageLocation);
    formData.append('image', siteFile);

    try {
      const response = await fetch('http://localhost:5000/api/admin/site-images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setImageMessage("✅ Site image updated successfully!");
        setSiteFile(null); 
        setSitePreview(null); 
        (document.getElementById('siteImageInput') as HTMLInputElement).value = '';
        fetchSiteImages(); 
      } else {
        setImageMessage("❌ Upload failed.");
      }
    } catch (error) {
      setImageMessage("❌ Server error.");
    } finally {
      setIsImageUploading(false);
    }
  };

  // --- NEW: THE UNDO BUTTON HANDLER ---
  const handleUndoImage = async () => {
    if (!window.confirm("Are you sure you want to delete this image and restore the previous one?")) return;
    
    setImageMessage("Restoring previous image...");
    try {
      const response = await fetch('http://localhost:5000/api/admin/site-images/undo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: imageLocation })
      });

      if (response.ok) {
        setImageMessage("✅ Previous image restored!");
        fetchSiteImages(); // Instantly update the UI
      } else {
        const data = await response.json();
        setImageMessage(data.message || "❌ Failed to undo.");
      }
    } catch (error) {
      setImageMessage("❌ Server error during undo.");
    }
  };

  // --- PRODUCT HANDLERS ---
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setProductData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProductFile(file);
    if (file) setProductPreview(URL.createObjectURL(file));
    else setProductPreview(null);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFile) return setProductMessage("Please select a product image.");
    setIsProductUploading(true);
    setProductMessage("");

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('category', productData.category);
    formData.append('stock', productData.stock.toString());
    formData.append('isFeatured', productData.isFeatured.toString());
    formData.append('productImage', productFile); 

    try {
      const response = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProductMessage("✅ Product added to inventory!");
        setProductData({ name: '', description: '', price: '', category: 'Crystals', stock: 1, isFeatured: false });
        setProductFile(null);
        setProductPreview(null);
        (document.getElementById('productImageInput') as HTMLInputElement).value = '';
        fetchInventory();
      } else {
        setProductMessage(data.message || "❌ Failed to add product.");
      }
    } catch (error) {
      setProductMessage("❌ Server error.");
    } finally {
      setIsProductUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInventory();
      } else {
        alert("❌ Failed to delete product.");
      }
    } catch (error) {
      alert("❌ Server error while deleting.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto mt-20 p-8">
      <h1 className="text-3xl font-serif text-foreground mb-8">Store Dashboard</h1>
      
      {/* SECTION 1: WIDE SITE IMAGERY MANAGER */}
      <div className="bg-card p-8 rounded-lg shadow-sm border border-border mb-12">
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-1">Site Imagery Manager</h2>
          <p className="text-sm text-muted-foreground">Select a section of the website to view or replace its current image.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Column 1: Controls */}
          <div className="flex flex-col justify-between">
            <form onSubmit={handleSiteImageUpload} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Select Website Area</label>
                <select 
                  value={imageLocation} 
                  onChange={handleLocationChange} 
                  className="p-3 border border-border rounded bg-white text-sm"
                >
                  {IMAGE_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Upload Replacement</label>
                <input 
                  id="siteImageInput"
                  type="file" 
                  accept="image/*" 
                  onChange={handleSiteFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-foreground hover:file:bg-gray-200 cursor-pointer text-sm border border-border rounded p-2"
                />
              </div>

              <div>
                <button 
                  type="submit" 
                  disabled={!siteFile || isImageUploading}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded disabled:opacity-50 hover:bg-red-700 transition font-medium"
                >
                  {isImageUploading ? "Uploading to Cloudinary..." : "Update Selected Image"}
                </button>
                {imageMessage && <p className="mt-3 font-bold text-red-600 text-sm">{imageMessage}</p>}
              </div>
            </form>
          </div>

          {/* Column 2: Currently on Website (NOW WITH UNDO BUTTON!) */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2 text-muted-foreground">Currently Live on Website</label>
            <div className="flex-grow border border-border rounded bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative min-h-[200px] p-4">
              {currentSiteImages[imageLocation]?.live ? (
                <>
                  <img 
                    src={currentSiteImages[imageLocation].live} 
                    alt="Current Live Image" 
                    className="max-h-56 object-contain mb-4"
                  />
                  {/* Saftey Net Button - Only shows if a backup exists */}
                  {currentSiteImages[imageLocation]?.backup && (
                    <button 
                      onClick={handleUndoImage}
                      className="text-xs bg-red-100 text-red-700 hover:bg-red-200 py-2 px-4 rounded font-bold transition-colors border border-red-200 w-full"
                    >
                      Undo & Restore Previous Image
                    </button>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">No image set. Showing default.</span>
              )}
            </div>
          </div>

          {/* Column 3: New Preview */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2 text-primary">New Upload Preview</label>
            <div className="flex-grow border-2 border-dashed border-border rounded bg-white flex items-center justify-center overflow-hidden relative min-h-[200px]">
              {sitePreview ? (
                <img 
                  src={sitePreview} 
                  alt="New Upload Preview" 
                  className="max-h-64 object-contain"
                />
              ) : (
                <span className="text-sm text-muted-foreground">Select a file to preview</span>
              )}
            </div>
          </div>

        </div>
      </div>

      <hr className="border-border mb-12" />

      {/* SECTION 2: ADD NEW PRODUCT FORM */}
      <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border mb-16">
        <h2 className="text-xl font-medium mb-6">Add New Product to Inventory</h2>
        <form onSubmit={handleProductSubmit} className="flex flex-col gap-5 text-sm">
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
              <label className="font-medium">Product Name</label>
              <input type="text" name="name" value={productData.name} onChange={handleProductChange} required className="p-2.5 border border-border rounded" placeholder="e.g. Raw Amethyst" />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
              <label className="font-medium">Category</label>
              <select name="category" value={productData.category} onChange={handleProductChange} className="p-2.5 border border-border rounded bg-white">
                <option value="Crystals">Crystals</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-medium">Price (₹)</label>
              <input type="number" name="price" value={productData.price} onChange={handleProductChange} required min="0" className="p-2.5 border border-border rounded" placeholder="0.00" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-medium">Initial Stock</label>
              <input type="number" name="stock" value={productData.stock} onChange={handleProductChange} required min="0" className="p-2.5 border border-border rounded" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-medium">Description</label>
            <textarea name="description" value={productData.description} onChange={handleProductChange} required rows={2} className="p-2.5 border border-border rounded" placeholder="Describe the item..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-1.5">
              <label className="font-medium">Product Image (1080x1350 recommended)</label>
              <input id="productImageInput" type="file" accept="image/*" onChange={handleProductFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-foreground cursor-pointer w-full border border-border p-2" />
              
              <div className="flex items-center gap-2 mt-4 border-t border-border pt-4">
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={productData.isFeatured} onChange={handleProductChange} className="w-4 h-4 cursor-pointer" />
                <label htmlFor="isFeatured" className="font-medium cursor-pointer">Feature on Homepage</label>
              </div>
            </div>

            {/* Instant Image Preview for Product */}
            <div className="flex flex-col">
              <label className="font-medium mb-1.5 text-muted-foreground">Image Preview</label>
              <div className="border border-border rounded bg-gray-50 flex justify-center items-center overflow-hidden min-h-[150px]">
                {productPreview ? (
                  <img src={productPreview} alt="Product Preview" className="max-h-40 object-contain p-2" />
                ) : (
                  <span className="text-xs text-muted-foreground">No image selected</span>
                )}
              </div>
            </div>
          </div>

          <button type="submit" disabled={isProductUploading} className="bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition font-medium disabled:opacity-50 mt-4 md:w-1/2">
            {isProductUploading ? "Uploading to Database..." : "Save Product"}
          </button>
          {productMessage && <p className="font-bold text-red-600">{productMessage}</p>}
        </form>
      </div>

      <hr className="border-border mb-12" />

      {/* SECTION 3: FULL WIDTH INVENTORY GRID */}
      <div>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-serif text-foreground mb-2">Current Inventory</h2>
            <p className="text-muted-foreground">Manage and preview existing items.</p>
          </div>
          <span className="text-sm tracking-widest uppercase text-muted-foreground font-medium">{inventory.length} Pieces</span>
        </div>

        {inventory.length === 0 ? (
          <div className="text-center py-32 text-muted-foreground border border-dashed border-border rounded-lg bg-card/50">
            No products found. Add your first piece of jewelry or crystal above.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {inventory.map((item) => (
              <div key={item._id} className="group relative flex flex-col">
                {/* Product Image Card */}
                <div className="relative aspect-[4/5] bg-muted mb-4 overflow-hidden rounded-sm">
                  {item.isFeatured && (
                    <span className="absolute top-3 left-3 bg-white/90 text-foreground text-[10px] font-bold px-3 py-1.5 tracking-widest uppercase z-10 shadow-sm">
                      Featured
                    </span>
                  )}
                  {item.stock === 0 && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 tracking-widest uppercase z-10 shadow-sm">
                      Sold Out
                    </span>
                  )}
                  
                  {item.images && item.images[0] && (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  )}

                  {/* Hover Delete Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="bg-white text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold transition-colors"
                    >
                      Delete Item
                    </button>
                  </div>
                </div>

                {/* Typography */}
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1.5">
                  {item.category}
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1 pr-4 leading-tight">
                  {item.name}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">₹{item.price}</span>
                  <span className="text-xs text-muted-foreground border-b border-muted-foreground/30 pb-0.5">Stock: {item.stock}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}