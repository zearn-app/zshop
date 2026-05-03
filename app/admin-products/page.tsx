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
  updateDoc,
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

  // Editing States
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

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
    const q = query(collection(db, "products"), where("category", "==", catName));
    const snap = await getDocs(q);
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    }));
    setProducts(list);
  };

  /* ================= ACTIONS ================= */

  const saveCategory = async () => {
    if (!newCategory || fields.length === 0) return alert("Add a name and fields");

    try {
      if (editingCategoryId) {
        await updateDoc(doc(db, "categories", editingCategoryId), { 
          name: newCategory, 
          fields: fields 
        });
        setEditingCategoryId(null);
        alert("Category updated successfully!");
      } else {
        await addDoc(collection(db, "categories"), { name: newCategory, fields });
        alert("Category created!");
      }

      setNewCategory("");
      setFields([]);
      loadCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setNewCategory(cat.name);
    setFields(cat.fields);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete category? This won't delete the products inside, but they will become unlinked.")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      loadCategories();
      if (selectedCat?.id === id) {
        setSelectedCat(null);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const addField = () => {
    if (!fieldInput) return;
    if (fields.includes(fieldInput)) return alert("Field already exists");
    setFields([...fields, fieldInput]);
    setFieldInput("");
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const saveProduct = async () => {
    if (!selectedCat) return;
    if (!productData.name) return alert("Product name is required");

    const payload = {
      ...productData,
      category: selectedCat.name,
      pricing,
    };

    try {
      if (editingProductId) {
        await updateDoc(doc(db, "products", editingProductId), payload);
        setEditingProductId(null);
        alert("Product updated!");
      } else {
        await addDoc(collection(db, "products"), payload);
        alert("Product added!");
      }

      // Reset Form
      setProductData({ name: "", description: "", image: "", specs: {} });
      setPricing({
        amazon: { price: "", link: "" },
        flipkart: { price: "", link: "" },
        meesho: { price: "", link: "" },
        myntra: { price: "", link: "" },
      });

      loadProducts(selectedCat.name);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductData({
      name: p.name,
      description: p.description,
      image: p.image,
      specs: p.specs || {},
    });
    // Ensure all platforms exist in pricing state during edit
    setPricing({
      amazon: p.pricing?.amazon || { price: "", link: "" },
      flipkart: p.pricing?.flipkart || { price: "", link: "" },
      meesho: p.pricing?.meesho || { price: "", link: "" },
      myntra: p.pricing?.myntra || { price: "", link: "" },
    });
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      if (selectedCat) loadProducts(selectedCat.name);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 text-white bg-black min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-8 border-b border-gray-800 pb-4">Admin Panel</h1>

      {/* 🧱 CREATE/EDIT CATEGORY CARD */}
      <div className="mb-10 bg-gray-900 p-6 rounded-xl border border-blue-900/30 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          {editingCategoryId ? "Edit Category" : "1. Create New Category"}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            placeholder="Category name (e.g. Mobiles)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500 flex-1"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              placeholder="Field (RAM, Storage...)"
              value={fieldInput}
              onChange={(e) => setFieldInput(e.target.value)}
              className="p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500 flex-1"
            />
            <button onClick={addField} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition">
              Add Field
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {fields.map((f, i) => (
            <span key={i} className="bg-gray-700 px-3 py-1 rounded-full text-sm text-yellow-400 border border-yellow-900/30 flex items-center gap-2">
              {f}
              <button onClick={() => removeField(i)} className="text-red-400 hover:text-red-200">✕</button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={saveCategory} className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded font-bold transition">
            {editingCategoryId ? "Update Category" : "Save Category"}
          </button>
          {editingCategoryId && (
            <button 
              onClick={() => {
                setEditingCategoryId(null); 
                setNewCategory(""); 
                setFields([]);
              }} 
              className="bg-gray-700 px-6 py-2 rounded font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* 📦 CATEGORY SELECTOR CARD */}
      <div className="mb-10 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">2. Select Category to Manage</h2>
        <div className="flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <div key={cat.id} className="group relative">
              <button
                onClick={() => {
                  setSelectedCat(cat);
                  setEditingProductId(null); // Clear product editing state when switching category
                  loadProducts(cat.name);
                }}
                className={`px-4 py-2 rounded-lg border transition ${
                  selectedCat?.id === cat.id 
                  ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/20" 
                  : "bg-gray-800 border-gray-700 hover:border-gray-500"
                }`}
              >
                {cat.name}
              </button>
              <div className="absolute -top-3 -right-2 hidden group-hover:flex gap-1 z-10">
                <button onClick={(e) => { e.stopPropagation(); startEditCategory(cat); }} className="bg-yellow-600 rounded-full w-6 h-6 text-xs flex items-center justify-center hover:scale-110">✎</button>
                <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }} className="bg-red-600 rounded-full w-6 h-6 text-xs flex items-center justify-center hover:scale-110">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🛍 PRODUCTS SECTION */}
      {selectedCat && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold mb-6 text-green-400 border-b border-gray-800 pb-2">
            Managing: {selectedCat.name}
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ➕ ADD/EDIT PRODUCT FORM CARD */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit sticky top-6">
              <h3 className="text-lg font-medium mb-4 text-blue-300">
                {editingProductId ? `Editing Product` : `Add New ${selectedCat.name}`}
              </h3>
              
              <div className="space-y-3">
                <input
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="p-2 bg-gray-800 rounded w-full border border-gray-700 focus:border-blue-500 outline-none"
                />
                <textarea
                  placeholder="Description"
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  className="p-2 bg-gray-800 rounded w-full border border-gray-700 h-20 focus:border-blue-500 outline-none"
                />
                <input
                  placeholder="Image URL"
                  value={productData.image}
                  onChange={(e) => setProductData({ ...productData, image: e.target.value })}
                  className="p-2 bg-gray-800 rounded w-full border border-gray-700 focus:border-blue-500 outline-none"
                />
              </div>

              <p className="text-sm font-bold text-gray-500 mt-6 mb-3 uppercase tracking-wider">Specifications</p>
              <div className="space-y-2">
                {selectedCat.fields.map((field) => (
                  <div key={field} className="flex items-center gap-2">
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
                      className="p-2 bg-gray-800 rounded flex-1 border border-gray-700 focus:border-blue-500 outline-none"
                    />
                  </div>
                ))}
              </div>

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
                      className="p-2 bg-gray-800 rounded text-sm border border-gray-700 focus:border-blue-500 outline-none"
                    />
                    <input
                      placeholder="URL"
                      value={pricing[site]?.link || ""}
                      onChange={(e) => setPricing({
                        ...pricing,
                        [site]: { ...pricing[site], link: e.target.value },
                      })}
                      className="p-2 bg-gray-800 rounded text-sm border border-gray-700 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={saveProduct}
                  className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold transition shadow-lg shadow-green-900/20"
                >
                  {editingProductId ? "Update Product" : "Upload Product"}
                </button>
                {editingProductId && (
                  <button 
                    onClick={() => {
                      setEditingProductId(null);
                      setProductData({ name: "", description: "", image: "", specs: {} });
                      setPricing({
                        amazon: { price: "", link: "" },
                        flipkart: { price: "", link: "" },
                        meesho: { price: "", link: "" },
                        myntra: { price: "", link: "" },
                      });
                    }}
                    className="bg-gray-700 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* 📋 PRODUCT LIST CARDS */}
            <div>
              <h3 className="text-lg font-medium mb-4">Existing Products ({products.length})</h3>
              <div className="grid gap-4">
                {products.length === 0 && <p className="text-gray-600 italic">No products found in this category.</p>}
                {products.map((p) => (
                  <div key={p.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-gray-500 transition">
                    <div className="flex items-center gap-4">
                      {p.image ? (
                        <img src={p.image} className="w-12 h-12 object-cover rounded bg-gray-900" alt="" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center text-xs text-gray-600">No img</div>
                      )}
                      <div>
                        <p className="font-bold text-lg">{p.name}</p>
                        <p className="text-xs text-gray-500">ID: {p.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => startEditProduct(p)}
                        className="text-yellow-500 hover:bg-yellow-500/10 px-3 py-1 rounded border border-yellow-900/30 transition text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteProduct(p.id)}
                        className="text-red-500 hover:bg-red-500/10 px-3 py-1 rounded border border-red-900/30 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
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
