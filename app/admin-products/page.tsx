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

type SpecGroup = {
  groupName: string;
  fields: string[];
};

type Category = {
  id: string;
  name: string;
  specGroups: SpecGroup[];
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

  const [newCategory, setNewCategory] = useState("");
  const [specGroups, setSpecGroups] = useState<SpecGroup[]>([]);

  const [groupName, setGroupName] = useState("");
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

  const addGroup = () => {
    if (!groupName.trim()) return;
    setSpecGroups([...specGroups, { groupName, fields: [] }]);
    setGroupName("");
  };

  const addFieldToGroup = (index: number) => {
    if (!fieldInput.trim()) return;

    const updated = [...specGroups];
    updated[index].fields.push(fieldInput);
    setSpecGroups(updated);
    setFieldInput("");
  };

  const saveCategory = async () => {
    if (!newCategory || specGroups.length === 0)
      return alert("Category + groups required");

    await addDoc(collection(db, "categories"), {
      name: newCategory,
      specGroups,
    });

    setNewCategory("");
    setSpecGroups([]);
    loadCategories();
  };

  /* ================= PRODUCT ================= */

  const saveProduct = async () => {
    if (!selectedCat) return;

    const payload = {
      ...productData,
      category: selectedCat.name,
      pricing,
    };

    await addDoc(collection(db, "products"), payload);

    setProductData({
      name: "",
      description: "",
      image: "",
      specs: {},
    });

    setPricing(defaultPricing);

    loadProducts(selectedCat.name);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 text-white">

      {/* CATEGORY CREATE */}
      <div>
        <h2>Create Category</h2>

        <input
          placeholder="Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        {/* GROUP ADD */}
        <div>
          <input
            placeholder="Group Name (Display, Camera...)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button onClick={addGroup}>Add Group</button>
        </div>

        {/* GROUP LIST */}
        {specGroups.map((g, i) => (
          <div key={i}>
            <h4>{g.groupName}</h4>

            <input
              placeholder="Field (RAM, Battery...)"
              value={fieldInput}
              onChange={(e) => setFieldInput(e.target.value)}
            />
            <button onClick={() => addFieldToGroup(i)}>Add Field</button>

            {g.fields.map((f, idx) => (
              <div key={idx}>{f}</div>
            ))}
          </div>
        ))}

        <button onClick={saveCategory}>Save Category</button>
      </div>

      {/* SELECT CATEGORY */}
      <div>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCat(c);
              loadProducts(c.name);
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* PRODUCT FORM */}
      {selectedCat && (
        <div>
          <h2>Add Product ({selectedCat.name})</h2>

          <input
            placeholder="Product Name"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />

          {/* 🔥 GROUPED SPECS UI */}
          {selectedCat.specGroups.map((group, i) => (
            <div key={i}>
              <h3>{group.groupName}</h3>

              {group.fields.map((field, idx) => (
                <input
                  key={idx}
                  placeholder={field}
                  value={productData.specs[field] || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      specs: {
                        ...productData.specs,
                        [field]: e.target.value,
                      },
                    })
                  }
                />
              ))}
            </div>
          ))}

          {/* PRICING (UNCHANGED) */}
          {(Object.keys(pricing) as PricingKey[]).map((site) => {
            const item = pricing[site];

            return (
              <div key={site}>
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      [site]: { ...item, enabled: e.target.checked },
                    })
                  }
                />
                {site}

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
              </div>
            );
          })}

          <button onClick={saveProduct}>Save Product</button>
        </div>
      )}

      {/* PRODUCT LIST */}
      {products.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}