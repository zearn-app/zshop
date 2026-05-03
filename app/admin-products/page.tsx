"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

/* ================= TYPES ================= */

type Category = {
  id: string;
  name: string;
  fields: string[];
};

type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  specs: Record<string, string>;
  pricing: Record<
    string,
    {
      price?: string;
      link?: string;
    }
  >;
};

/* ================= COMPONENT ================= */

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Category State
  const [newCategory, setNewCategory] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [fieldInput, setFieldInput] = useState("");

  // Product Form State
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    image: "",
    specs: {} as Record<string, string>,
  });

  const [pricing, setPricing] = useState<Product["pricing"]>({
    amazon: { price: "", link: "" },
    flipkart: { price: "", link: "" },
    meesho: { price: "", link: "" },
    myntra: { price: "", link: "" },
  });

  /* ================= LOAD DATA ================= */

  const loadCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Category, "id">),
    }));
    setCategories(list);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadProducts = async (catName: string) => {
    // Optimized: Only fetch products for the specific category
    const q = query(collection(db, "products"), where("category", "==", catName));
    const snap = await getDocs(q);
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    }));
    setProducts(list);
  };

  /* ================= ACTIONS ================= */

  const addCategory = async () => {
    if (!newCategory || fields.length === 0) return alert("Add a name and fields");
    await addDoc(collection(db, "categories"), { name: newCategory, fields });
    setNewCategory("");
    setFields([]);
    loadCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete category and all associated fields?")) return;
    await deleteDoc(doc(db, "categories", id));
    loadCategories();
    if (selectedCat?.id === id) setSelectedCat(null);
  };

  const addField = () => {
    if (!fieldInput) return;
    setFields([...fields, fieldInput]);
    setFieldInput("");
  };

  const addProduct = async () => {
    if (!selectedCat) return;
    if (!productData.name) return alert("Product name is required");

    await addDoc(collection(db, "products"), {
      ...productData,
      category: selectedCat.name,
      pricing,
    });

    alert("Product added successfully!");
    
    // Reset Form
    setProductData({ name: "", description: "", image: "", specs: {} });
    setPricing({
      amazon: { price: "", link: "" },
      flipkart: { price: "", link: "" },
      meesho: { price: "", link: "" },
      myntra: { price: "", link: "" },
    });

    loadProducts(selectedCat.name);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    if (selectedCat) loadProducts(selectedCat.name);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 text-white bg-black min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-8 border-b border-gray-800 pb-4">Admin Panel</h1>

      {/* 🧱 CREATE CATEGORY */}
      <div className="mb-10 bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">1. Create New Category</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            placeholder="Category name (e.g. Mobiles)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <input
            placeholder="Field (RAM, Storage...)"
            value={fieldInput}
            onChange={(e) => setFieldInput(e.target.value)}
            className="p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button onClick={addField} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition">
            Add Field
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {fields.map((f, i) => (
            <span key={i} className="bg-gray-700 px-3 py-1 rounded-full text-sm text-yellow-400 border border-yellow-900/30">
              {f}
            </span>
          ))}
        </div>

        <button onClick={addCategory} className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded font-bold transition">
          Save Category
        </button>
      </div>

      {/* 📦 CATEGORY LIST */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">2. Select Category</h2>
        <div className="flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <div key={cat.id} className="group relative">
              <button
                onClick={() => {
                  setSelectedCat(cat);
                  loadProducts(cat.name);
                }}
                className={`px-4 py-2 rounded-lg border transition ${
                  selectedCat?.id === cat.id 
                  ? "bg-blue-600 border-blue-400" 
                  : "bg-gray-800 border-gray-700 hover:border-gray-500"
                }`}
              >
                {cat.name}
              </button>
              <button 
                onClick={() => deleteCategory(cat.id)}
                className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🛍 PRODUCTS SECTION */}
      {selectedCat && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-2xl font-bold mb-6 text-green-400 border-b border-gray-800 pb-2">
            Managing: {selectedCat.name}
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ➕ ADD PRODUCT FORM */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit sticky top-6">
              <h3 className="text-lg font-medium mb-4">Add New {selectedCat.name}</h3>
              <input
                placeholder="Product Name"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                className="p-2 bg-gray-800 rounded w-full mb-3 border border-gray-700"
              />
              <textarea
                placeholder="Description"
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                className="p-2 bg-gray-800 rounded w-full mb-3 border border-gray-700 h-20"
              />
              <input
                placeholder="Image URL"
                value={productData.image}
                onChange={(e) => setProductData({ ...productData, image: e.target.value })}
                className="p-2 bg-gray-800 rounded w-full mb-6 border border-gray-700"
              />

              <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Specifications</p>
              {selectedCat.fields.map((field) => (
                <div key={field} className="flex items-center mb-2 gap-2">
                  <span className="text-sm text-gray-400 w-24 truncate">{field}:</span>
                  <input
                    placeholder={`Enter ${field}`}
                    value={productData.specs[field] || ""}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        specs: { ...productData.specs, [field]: e.target.value },
                      })
                    }
                    className="p-2 bg-gray-800 rounded flex-1 border border-gray-700"
                  />
                </div>
              ))}

              <p className="text-sm font-bold text-gray-500 mt-6 mb-3 uppercase tracking-wider">Marketplace Links</p>
              {["amazon", "flipkart", "meesho", "myntra"].map((site) => (
                <div key={site} className="mb-4 p-3 bg-black/30 rounded-lg">
                  <p className="text-xs font-bold text-yellow-500 uppercase mb-2">{site}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Price"
                      value={pricing[site]?.price || ""}
                      onChange={(e) => setPricing({
                        ...pricing,
                        [site]: { ...pricing[site], price: e.target.value },
                      })}
                      className="p-2 bg-gray-800 rounded text-sm border border-gray-700"
                    />
                    <input
                      placeholder="URL"
                      value={pricing[site]?.link || ""}
                      onChange={(e) => setPricing({
                        ...pricing,
                        [site]: { ...pricing[site], link: e.target.value },
                      })}
                      className="p-2 bg-gray-800 rounded text-sm border border-gray-700"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addProduct}
                className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold mt-4 transition shadow-lg shadow-green-900/20"
              >
                Upload Product
              </button>
            </div>

            {/* 📋 PRODUCT LIST */}
            <div>
              <h3 className="text-lg font-medium mb-4">Existing Products ({products.length})</h3>
              <div className="grid gap-4">
                {products.length === 0 && <p className="text-gray-600 italic">No products found in this category.</p>}
                {products.map((p) => (
                  <div key={p.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-start border border-gray-700">
                    <div>
                      <p className="font-bold text-lg">{p.name}</p>
                      <p className="text-sm text-gray-400 line-clamp-2">{p.description}</p>
                    </div>
                    <button 
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-500 hover:bg-red-500/10 p-2 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
