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

type PricingItem = {
  enabled: boolean;
  price?: string;
  link?: string;
};

type PricingKey = "amazon" | "flipkart" | "meesho" | "myntra";

type Pricing = Record<PricingKey, PricingItem>;

type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  specs: Record<string, string>;
  pricing: Partial<Pricing>;
};

/* ================= DEFAULT ================= */

const defaultPricing: Pricing = {
  amazon: { enabled: false, price: "", link: "" },
  flipkart: { enabled: false, price: "", link: "" },
  meesho: { enabled: false, price: "", link: "" },
  myntra: { enabled: false, price: "", link: "" },
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

  const [pricing, setPricing] = useState<Pricing>(defaultPricing);

  /* ================= LOAD ================= */

  const loadCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));
    setCategories(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Category, "id">),
      }))
    );
  };

  const loadProducts = async (catName: string) => {
    const q = query(collection(db, "products"), where("category", "==", catName));
    const snap = await getDocs(q);

    setProducts(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Product, "id">),
      }))
    );
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= CATEGORY ================= */

  const saveCategory = async () => {
    if (!newCategory || fields.length === 0)
      return alert("Category needs a name and at least one field.");

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
    if (!confirm("Are you sure?")) return;

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
    if (fields.includes(fieldInput.trim())) return alert("Field exists");

    setFields([...fields, fieldInput.trim()]);
    setFieldInput("");
  };

  const removeField = (i: number) =>
    setFields(fields.filter((_, idx) => idx !== i));

  /* ================= PRODUCT ================= */

  const saveProduct = async () => {
    if (!selectedCat) return;
    if (!productData.name) return alert("Product name required");

    const filteredPricing: Partial<Pricing> = {};

    (Object.keys(pricing) as PricingKey[]).forEach((key) => {
      if (pricing[key].enabled) {
        filteredPricing[key] = pricing[key];
      }
    });

    const payload = {
      ...productData,
      category: selectedCat.name,
      pricing: filteredPricing,
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
    if (!confirm("Delete?")) return;
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

    // ✅ FIXED MERGE (NO ERROR)
    const merged: Pricing = { ...defaultPricing };

    (Object.keys(p.pricing || {}) as PricingKey[]).forEach((k) => {
      const item = p.pricing?.[k];
      if (item) {
        merged[k] = { ...item, enabled: true };
      }
    });

    setPricing(merged);
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductData({ name: "", description: "", image: "", specs: {} });
    setPricing(defaultPricing);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8">
      <main className="grid lg:grid-cols-12 gap-8">

        {/* LEFT SIDE (UNCHANGED) */}
        <div className="lg:col-span-4">
          {/* KEEP YOUR EXISTING CATEGORY UI */}
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-8">
          {!selectedCat ? (
            <div>Select category</div>
          ) : (
            <div>

              {/* PRODUCT FORM */}
              <div className="bg-[#111] p-6 rounded-2xl mb-6">
                <h2 className="text-green-400 mb-4">
                  {editingProductId ? "Edit Product" : "Add Product"}
                </h2>

                <input
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                />

                {/* PRICING */}
                <div className="mt-6 space-y-3">
                  {(Object.keys(pricing) as PricingKey[]).map((site) => {
                    const item = pricing[site];

                    return (
                      <div key={site} className="flex items-center gap-2">

                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) =>
                            setPricing({
                              ...pricing,
                              [site]: {
                                ...item,
                                enabled: e.target.checked,
                              },
                            })
                          }
                        />

                        <span className="w-20 capitalize">{site}</span>

                        <input
                          disabled={!item.enabled}
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) =>
                            setPricing({
                              ...pricing,
                              [site]: { ...item, price: e.target.value },
                            })
                          }
                        />

                        <input
                          disabled={!item.enabled}
                          placeholder="Link"
                          value={item.link}
                          onChange={(e) =>
                            setPricing({
                              ...pricing,
                              [site]: { ...item, link: e.target.value },
                            })
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                <button onClick={saveProduct}>Save</button>
              </div>

              {/* PRODUCT LIST */}
              {products.map((p) => (
                <div key={p.id}>
                  {p.name}
                  <button onClick={() => startEditProduct(p)}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}