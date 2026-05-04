"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  Plus,
  Save,
  Trash2,
  Package,
  Layers,
  CheckCircle2,
} from "lucide-react";

/* ================= TYPES ================= */

type SpecGroup = { groupName: string; fields: string[] };

type Category = {
  id: string;
  name: string;
  specGroups: SpecGroup[];
};

type PricingItem = { enabled: boolean; price: string; link: string };
type Pricing = Record<
  "amazon" | "flipkart" | "meesho" | "myntra",
  PricingItem
>;

type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  specs: Record<string, string>;
  pricing: Pricing;
};

const INITIAL_PRICING: Pricing = {
  amazon: { enabled: false, price: "", link: "" },
  flipkart: { enabled: false, price: "", link: "" },
  meesho: { enabled: false, price: "", link: "" },
  myntra: { enabled: false, price: "", link: "" },
};

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  /* CATEGORY STATE */
  const [newCatName, setNewCatName] = useState("");
  const [tempGroups, setTempGroups] = useState<SpecGroup[]>([]);
  const [curGroupName, setCurGroupName] = useState("");

  /* BULK INPUT */
  const [bulkSpecInput, setBulkSpecInput] = useState("");

  /* PRODUCT */
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    image: "",
    specs: {} as Record<string, string>,
  });

  const [pricing, setPricing] = useState<Pricing>(INITIAL_PRICING);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));
    setCategories(
      snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category))
    );
  };

  const loadProducts = async (catName: string) => {
    setLoading(true);
    const q = query(
      collection(db, "products"),
      where("category", "==", catName)
    );
    const snap = await getDocs(q);
    setProducts(
      snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
    );
    setLoading(false);
  };

  /* ================= BULK PARSER ================= */

  const handlePasteSpecGroups = async () => {
    if (!bulkSpecInput || !newCatName)
      return alert("Enter category name + paste spec");

    try {
      let clean = bulkSpecInput.trim();

      // 🔥 supports JS + JSON
      if (clean.startsWith("const")) {
        clean = clean
          .replace(/const\s+\w+\s*=\s*/, "")
          .replace(/;$/, "");
      }

      const parsed: SpecGroup[] = JSON.parse(clean);

      await addDoc(collection(db, "categories"), {
        name: newCatName,
        specGroups: parsed,
      });

      setBulkSpecInput("");
      setNewCatName("");
      setTempGroups([]);
      loadCategories();

      alert("✅ Category created!");
    } catch (err) {
      console.error(err);
      alert("❌ Invalid format");
    }
  };

  /* ================= CATEGORY ================= */

  const handleSaveCategory = async () => {
    if (!newCatName || tempGroups.length === 0)
      return alert("Enter name + groups");

    await addDoc(collection(db, "categories"), {
      name: newCatName,
      specGroups: tempGroups,
    });

    setNewCatName("");
    setTempGroups([]);
    loadCategories();
  };

  /* ================= PRODUCT ================= */

  const handleSaveProduct = async () => {
    if (!selectedCat) return;

    setLoading(true);

    await addDoc(collection(db, "products"), {
      ...productData,
      category: selectedCat.name,
      pricing,
      createdAt: serverTimestamp(),
    });

    setProductData({
      name: "",
      description: "",
      image: "",
      specs: {},
    });

    setPricing(INITIAL_PRICING);
    loadProducts(selectedCat.name);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-zinc-900/50 border rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layers className="text-blue-400 w-5 h-5" /> Create Category
            </h2>

            <input
              className="w-full bg-zinc-800 rounded-lg p-2 mb-4"
              placeholder="Category Name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />

            {/* BULK */}
            <textarea
              className="w-full bg-zinc-800 rounded-lg p-3 text-xs mb-3 h-32"
              placeholder="Paste specGroups..."
              value={bulkSpecInput}
              onChange={(e) => setBulkSpecInput(e.target.value)}
            />

            <button
              onClick={handlePasteSpecGroups}
              className="w-full bg-purple-600 mb-4 py-2 rounded-lg"
            >
              🚀 Create from JSON
            </button>

            {/* EXISTING */}
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-zinc-800 rounded p-2 text-sm"
                placeholder="Group"
                value={curGroupName}
                onChange={(e) => setCurGroupName(e.target.value)}
              />
              <button
                onClick={() => {
                  if (curGroupName)
                    setTempGroups([
                      ...tempGroups,
                      { groupName: curGroupName, fields: [] },
                    ]);
                  setCurGroupName("");
                }}
                className="bg-zinc-700 p-2 rounded"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleSaveCategory}
              className="w-full bg-blue-600 py-2 rounded-xl flex justify-center gap-2"
            >
              <Save size={18} /> Save Category
            </button>
          </section>

          {/* CATEGORY SELECT */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCat(c);
                  loadProducts(c.name);
                }}
                className="px-3 py-1 bg-zinc-800 rounded"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT - PRODUCT UI RESTORED */}
        <div className="lg:col-span-8 space-y-6">

          {selectedCat && (
            <div className="bg-zinc-900 p-6 rounded-xl">
              <h2 className="text-xl mb-4">Add Product</h2>

              <input
                className="w-full bg-zinc-800 p-2 mb-3 rounded"
                placeholder="Product Name"
                value={productData.name}
                onChange={(e) =>
                  setProductData({ ...productData, name: e.target.value })
                }
              />

              <textarea
                className="w-full bg-zinc-800 p-2 mb-3 rounded"
                placeholder="Description"
                value={productData.description}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    description: e.target.value,
                  })
                }
              />

              <input
                className="w-full bg-zinc-800 p-2 mb-3 rounded"
                placeholder="Image URL"
                value={productData.image}
                onChange={(e) =>
                  setProductData({ ...productData, image: e.target.value })
                }
              />

              {/* SPECS */}
              {selectedCat.specGroups.map((group, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-sm text-blue-400">{group.groupName}</h3>

                  {group.fields.map((field, idx) => (
                    <input
                      key={idx}
                      className="w-full bg-zinc-800 p-2 mt-1 rounded"
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

              <button
                onClick={handleSaveProduct}
                className="w-full bg-green-600 py-3 rounded-xl flex justify-center gap-2"
              >
                <CheckCircle2 /> Save Product
              </button>
            </div>
          )}

          {/* PRODUCT LIST */}
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-900 p-4 rounded flex justify-between"
            >
              <span>{p.name}</span>
              <Trash2 size={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}