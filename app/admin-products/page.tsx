"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
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

  const [newCategory, setNewCategory] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [fieldInput, setFieldInput] = useState("");

  const [productData, setProductData] = useState<any>({
    specs: {},
  });

  const [pricing, setPricing] = useState<Product["pricing"]>({
    amazon: {},
    flipkart: {},
    meesho: {},
    myntra: {},
  });

  /* ================= LOAD DATA ================= */

  const loadCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));

    const list: Category[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Category, "id">),
    }));

    setCategories(list);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadProducts = async (catName: string) => {
    const snap = await getDocs(collection(db, "products"));

    const list: Product[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    }));

    setProducts(list.filter((p) => p.category === catName));
  };

  /* ================= CATEGORY ================= */

  const addCategory = async () => {
    if (!newCategory) return;

    await addDoc(collection(db, "categories"), {
      name: newCategory,
      fields,
    });

    setNewCategory("");
    setFields([]);
    loadCategories();
  };

  const addField = () => {
    if (!fieldInput) return;

    setFields([...fields, fieldInput]);
    setFieldInput("");
  };

  /* ================= PRODUCT ================= */

  const addProduct = async () => {
    if (!selectedCat) return;

    await addDoc(collection(db, "products"), {
      name: productData.name || "",
      description: productData.description || "",
      image: productData.image || "",
      category: selectedCat.name,
      specs: productData.specs || {},
      pricing,
    });

    alert("Product added");

    // reset form (optional but useful)
    setProductData({ specs: {} });
    setPricing({
      amazon: {},
      flipkart: {},
      meesho: {},
      myntra: {},
    });

    loadProducts(selectedCat.name);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* 🧱 CREATE CATEGORY */}
      <div className="mb-10">
        <h2 className="text-xl mb-2">Create Category</h2>

        <input
          placeholder="Category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 bg-gray-800 rounded mr-2"
        />

        <input
          placeholder="Field (RAM, Camera...)"
          value={fieldInput}
          onChange={(e) => setFieldInput(e.target.value)}
          className="p-2 bg-gray-800 rounded mr-2"
        />

        <button onClick={addField} className="bg-blue-500 px-3 py-2 rounded">
          Add Field
        </button>

        <div className="mt-2">
          {fields.map((f, i) => (
            <span key={i} className="mr-2 text-yellow-400">
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={addCategory}
          className="mt-3 bg-green-500 px-4 py-2 rounded"
        >
          Save Category
        </button>
      </div>

      {/* 📦 CATEGORY LIST */}
      <div className="mb-10">
        <h2 className="text-xl mb-3">Categories</h2>

        <div className="flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCat(cat);
                loadProducts(cat.name);
              }}
              className="bg-gray-800 px-4 py-2 rounded"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 🛍 PRODUCTS UNDER CATEGORY */}
      {selectedCat && (
        <div>
          <h2 className="text-xl mb-4">{selectedCat.name} Products</h2>

          {/* ➕ ADD PRODUCT */}
          <div className="bg-gray-900 p-4 rounded mb-6">
            <input
              placeholder="Product name"
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
              className="p-2 bg-gray-800 rounded w-full mb-2"
            />

            <input
              placeholder="Description"
              onChange={(e) =>
                setProductData({
                  ...productData,
                  description: e.target.value,
                })
              }
              className="p-2 bg-gray-800 rounded w-full mb-2"
            />

            <input
              placeholder="Image URL"
              onChange={(e) =>
                setProductData({ ...productData, image: e.target.value })
              }
              className="p-2 bg-gray-800 rounded w-full mb-4"
            />

            {/* 🔥 Dynamic fields */}
            {selectedCat.fields.map((field) => (
              <input
                key={field}
                placeholder={field}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    specs: {
                      ...productData.specs,
                      [field]: e.target.value,
                    },
                  })
                }
                className="p-2 bg-gray-800 rounded w-full mb-2"
              />
            ))}

            {/* 💰 Pricing */}
            {["amazon", "flipkart", "meesho", "myntra"].map((site) => (
              <div key={site} className="mb-3">
                <p className="text-yellow-400">{site}</p>

                <input
                  placeholder="Price"
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      [site]: {
                        ...pricing[site],
                        price: e.target.value,
                      },
                    })
                  }
                  className="p-2 bg-gray-800 rounded mr-2"
                />

                <input
                  placeholder="Link"
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      [site]: {
                        ...pricing[site],
                        link: e.target.value,
                      },
                    })
                  }
                  className="p-2 bg-gray-800 rounded"
                />
              </div>
            ))}

            <button
              onClick={addProduct}
              className="bg-green-500 px-4 py-2 rounded mt-3"
            >
              Add Product
            </button>
          </div>

          {/* 📋 PRODUCT LIST */}
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-gray-800 p-3 rounded">
                <p className="font-bold">{p.name}</p>
                <p className="text-sm text-gray-400">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}