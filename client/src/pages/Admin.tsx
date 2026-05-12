import { useState } from 'react';

export default function Admin() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMessage("Please select an image first.");

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append('heroImage', file);

    try {
      const response = await fetch('http://localhost:5000/api/admin/hero', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage("✅ Hero Banner updated successfully!");
        setFile(null); // Clear the input
      } else {
        setMessage("❌ Upload failed.");
      }
    } catch (error) {
      setMessage("❌ Server error.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-card rounded-lg shadow-sm border border-border">
      <h1 className="text-3xl font-serif text-foreground mb-6">Store Dashboard</h1>
      
      <div className="bg-background p-6 rounded border border-border">
        <h2 className="text-xl font-medium mb-4">Update Homepage Hero Image</h2>
        
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-terracotta-light cursor-pointer"
          />
          
          <button 
            type="submit" 
            disabled={!file || isUploading}
            className="bg-primary text-primary-foreground py-2 px-4 rounded disabled:opacity-50 hover:opacity-90 transition"
          >
            {isUploading ? "Uploading to Cloudinary..." : "Update Banner"}
          </button>
        </form>

        {message && <p className="mt-4 font-medium text-terracotta">{message}</p>}
      </div>
    </div>
  );
}