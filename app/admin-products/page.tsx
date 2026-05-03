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
      return alert("Add category name and fields");

    if (editingCategoryId) {
      await updateDoc(doc(db, "categories", editingCategoryId), {
        name: newCategory,
        fields,
      });
    } else {
      await addDoc(collection(db, "categories"), {
        name: newCategory,
        fields,
      });
    }

    resetCategoryForm();
    loadCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete category?")) return;
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
    if (!fieldInput) return;
    if (fields.includes(fieldInput)) return alert("Field exists");
    setFields([...fields, fieldInput]);
    setFieldInput("");
  };

  const removeField = (i: number) => {
    setFields(fields.filter((_, idx) => idx !== i));
  };

  /* ================= PRODUCT ================= */

  const saveProduct = async () => {
    if (!selectedCat) return;
    if (!productData.name) return alert("Name required");

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
    if (!confirm("Delete product?")) return;
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

    setPricing({
      amazon: p.pricing?.amazon || { price: "", link: "" },
      flipkart: p.pricing?.flipkart || { price: "", link: "" },
      meesho: p.pricing?.meesho || { price: "", link: "" },
      myntra: p.pricing?.myntra || { price: "", link: "" },
    });
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

  /* ================= UI ================= */

  return (
    <div className="p-6 text-white bg-black min-h-screen">

      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      {/* CATEGORY FORM */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8">
        <h2 className="text-xl mb-4">
          {editingCategoryId ? "Edit Category" : "Create Category"}
        </h2>

        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 bg-gray-800 w-full mb-2"
          placeholder="Category name"
        />

        <div className="flex gap-2 mb-2">
          <input
            value={fieldInput}
            onChange={(e) => setFieldInput(e.target.value)}
            className="p-2 bg-gray-800 flex-1"
            placeholder="Field"
          />
          <button onClick={addField} className="bg-blue-600 px-3">
            Add
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-3">
          {fields.map((f, i) => (
            <span key={i} className="bg-gray-700 px-2 py-1 rounded">
              {f}
              <button onClick={() => removeField(i)} className="ml-2 text-red-400">
                ✕
              </button>
            </span>
          ))}
        </div>

        <button onClick={saveCategory} className="bg-green-600 px-4 py-2">
          {editingCategoryId ? "Update" : "Save"}
        </button>

        {editingCategoryId && (
          <button onClick={resetCategoryForm} className="ml-2 bg-gray-700 px-4 py-2">
            Cancel
          </button>
        )}
      </div>

      {/* CATEGORY CARDS */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-gray-800 p-3 rounded-lg relative">
            <button
              onClick={() => {
                setSelectedCat(cat);
                loadProducts(cat.name);
              }}
            >
              {cat.name}
            </button>

            <div className="absolute top-0 right-0 flex gap-1">
              <button onClick={() => startEditCategory(cat)}>✎</button>
              <button onClick={() => deleteCategory(cat.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCT SECTION */}
      {selectedCat && (
        <div>
          <h2 className="text-xl mb-4">Products - {selectedCat.name}</h2>

          {/* PRODUCT FORM */}
          <div className="bg-gray-900 p-6 rounded-xl mb-6">
            <input
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
              className="p-2 bg-gray-800 w-full mb-2"
              placeholder="Product name"
            />

            <button onClick={saveProduct} className="bg-green-600 px-4 py-2">
              {editingProductId ? "Update Product" : "Add Product"}
            </button>

            {editingProductId && (
              <button onClick={resetProductForm} className="ml-2 bg-gray-700 px-4 py-2">
                Cancel
              </button>
            )}
          </div>

          {/* PRODUCT CARDS */}
          <div className="grid gap-3">
            {products.map((p) => (
              <div key={p.id} className="bg-gray-800 p-4 rounded flex justify-between">
                <div>
                  <p className="font-bold">{p.name}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => startEditProduct(p)}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}