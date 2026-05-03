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
  pricing: Record<string, { price?: string; link?: string }>;
};

/* ================= COMPONENT ================= */

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [fieldInput, setFieldInput] = useState("");

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

  /* ================= LOAD LOGIC ================= */

  const loadCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));
    const fetched = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Category, "id">),
    }));
    setCategories(fetched);
  };

  const loadProducts = async (catName: string) => {
    const q = query(collection(db, "products"), where("category", "==", catName));
    const snap = await getDocs(q);
    setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) })));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= CATEGORY ACTIONS ================= */

  const saveCategory = async () => {
    if (!newCategory || fields.length === 0) return alert("Category needs a name and at least one field.");
    const payload = { name: newCategory, fields };

    if (editingCategoryId) {
      await updateDoc(doc(db, "categories", editingCategoryId), payload);
    } else {
      await addDoc(collection(db, "categories"), payload);
    }
    resetCategoryForm();
    loadCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This won't delete products, but will break their category link.")) return;
    await deleteDoc(doc(db, "categories", id));
    if (selectedCat?.id === id) {
      setSelectedCat(null);
      setProducts([]);
    }
    loadCategories();
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setNewCategory(cat.name);
    setFields(cat.fields);
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setNewCategory("");
    setFields([]);
    setFieldInput("");
  };

  const addField = () => {
    if (!fieldInput.trim()) return;
    if (fields.includes(fieldInput.trim())) return alert("Field already exists");
    setFields([...fields, fieldInput.trim()]);
    setFieldInput("");
  };

  const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i));

  /* ================= PRODUCT ACTIONS ================= */

  const saveProduct = async () => {
    if (!selectedCat) return;
    if (!productData.name) return alert("Product name is required.");

    const payload = {
      ...productData,
      category: selectedCat.name,
      pricing,
    };

    if (editingProductId) {
      await updateDoc(doc(db, "products", editingProductId), payload);
    } else {
      await addDoc(collection(db, "products"), payload);
    }

    resetProductForm();
    loadProducts(selectedCat.name);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    if (selectedCat) loadProducts(selectedCat.name);
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductData({
      name: p.name,
      description: p.description,
      image: p.image,
      specs: p.specs || {},
    });
    setPricing(p.pricing);
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductData({ name: "", description: "", image: "", specs: {} });
    setPricing({
      amazon: { price: "", link: "" },
      flipkart: { price: "", link: "" },
      meesho: { price: "", link: "" },
      myntra: { price: "", link: "" },
    });
  };

  /* ================= UI RENDER ================= */

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center border-b border-gray-800 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Inventory <span className="text-blue-500">Admin</span>
        </h1>
        <div className="text-sm text-gray-400">Firebase Cloud Firestore</div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CATEGORIES */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-[#111] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">
              {editingCategoryId ? "Edit Category" : "New Category"}
            </h2>
            <div className="space-y-4">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g., Laptops"
              />
              
              <div className="flex gap-2">
                <input
                  value={fieldInput}
                  onChange={(e) => setFieldInput(e.target.value)}
                  className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm"
                  placeholder="Add spec field (e.g., RAM)"
                  onKeyDown={(e) => e.key === "Enter" && addField()}
                />
                <button onClick={addField} className="bg-blue-600 hover:bg-blue-500 px-4 rounded-lg font-bold transition-colors">
                  +
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {fields.map((f, i) => (
                  <span key={i} className="bg-gray-800 text-xs py-1.5 px-3 rounded-full border border-gray-700 flex items-center">
                    {f}
                    <button onClick={() => removeField(i)} className="ml-2 text-red-500 hover:text-red-400">✕</button>
                  </span>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <button onClick={saveCategory} className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold transition-all">
                  {editingCategoryId ? "Update Category" : "Create Category"}
                </button>
                {editingCategoryId && (
                  <button onClick={resetCategoryForm} className="bg-gray-700 px-4 py-3 rounded-lg">Cancel</button>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-gray-400 text-sm font-uppercase tracking-widest px-2">AVAILABLE CATEGORIES</h3>
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedCat?.id === cat.id ? "bg-blue-900/20 border-blue-500" : "bg-[#111] border-gray-800 hover:border-gray-600"
                }`}
                onClick={() => { setSelectedCat(cat); loadProducts(cat.name); }}
              >
                <span className="font-medium">{cat.name}</span>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); startEditCategory(cat); }} className="text-gray-400 hover:text-blue-400">✎</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT COLUMN: PRODUCTS */}
        <div className="lg:col-span-8">
          {!selectedCat ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl text-gray-500">
              <p>Select a category to manage products</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* PRODUCT FORM */}
              <section className="bg-[#111] border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold mb-6 text-green-400">
                  {editingProductId ? `Editing ${productData.name}` : `Add New ${selectedCat.name}`}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-4">
                    <label className="text-xs text-gray-500 font-bold uppercase">Basic Details</label>
                    <input
                      placeholder="Product Name"
                      value={productData.name}
                      onChange={(e) => setProductData({...productData, name: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3"
                    />
                    <textarea
                      placeholder="Description"
                      value={productData.description}
                      onChange={(e) => setProductData({...productData, description: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 h-24"
                    />
                    <input
                      placeholder="Image URL"
                      value={productData.image}
                      onChange={(e) => setProductData({...productData, image: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs text-gray-500 font-bold uppercase">Pricing & Links</label>
                    {Object.keys(pricing).map((site) => (
                      <div key={site} className="flex gap-2">
                        <span className="w-20 text-xs self-center capitalize text-gray-400">{site}</span>
                        <input
                          placeholder="Price"
                          value={pricing[site as keyof Product["pricing"]]?.price}
                          onChange={(e) => setPricing({...pricing, [site]: {...pricing[site as keyof Product["pricing"]], price: e.target.value}})}
                          className="w-24 bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-sm"
                        />
                        <input
                          placeholder="URL"
                          value={pricing[site as keyof Product["pricing"]]?.link}
                          onChange={(e) => setPricing({...pricing, [site]: {...pricing[site as keyof Product["pricing"]], link: e.target.value}})}
                          className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC SPECS SECTION */}
                <div className="border-t border-gray-800 pt-6 mb-6">
                  <label className="text-xs text-gray-500 font-bold uppercase block mb-4">Specifications ({selectedCat.name})</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCat.fields.map((field) => (
                      <div key={field} className="flex flex-col gap-1">
                        <span className="text-sm text-gray-400">{field}</span>
                        <input
                          value={productData.specs[field] || ""}
                          onChange={(e) => setProductData({
                            ...productData,
                            specs: { ...productData.specs, [field]: e.target.value }
                          })}
                          className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-2 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={saveProduct} className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-bold flex-1 transition-all">
                    {editingProductId ? "Update Product" : "Save Product"}
                  </button>
                  <button onClick={resetProductForm} className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-all">
                    Reset
                  </button>
                </div>
              </section>

              {/* PRODUCT LIST */}
              <div className="grid grid-cols-1 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-[#111] border border-gray-800 p-5 rounded-2xl flex items-center gap-6 group hover:border-gray-600 transition-all">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{p.name}</h4>
                      <p className="text-gray-500 text-sm line-clamp-1">{p.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditProduct(p)} className="bg-gray-800 hover:bg-blue-900/40 hover:text-blue-400 p-2.5 rounded-lg transition-all">Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="bg-gray-800 hover:bg-red-900/40 hover:text-red-500 p-2.5 rounded-lg transition-all">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
