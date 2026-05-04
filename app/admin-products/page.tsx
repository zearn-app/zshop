"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { Plus, Save, Trash2, Package, Layers, CheckCircle2 } from "lucide-react";

/* ================= TYPES ================= */

type SpecGroup = { groupName: string; fields: string[] };

type Category = {
  id: string;
  name: string;
  specGroups: SpecGroup[];
};

type PricingItem = { enabled: boolean; price: string; link: string };
type Pricing = Record<"amazon" | "flipkart" | "meesho" | "myntra", PricingItem>;

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

  /* 🆕 BULK INPUT STATE */
  const [bulkSpecInput, setBulkSpecInput] = useState("");

  /* PRODUCT STATE */
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    image: "",
    specs: {} as Record<string, string>,
  });

  const [pricing, setPricing] = useState<Pricing>(INITIAL_PRICING);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));
    setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
  };

  const loadProducts = async (catName: string) => {
    setLoading(true);
    const q = query(collection(db, "products"), where("category", "==", catName));
    const snap = await getDocs(q);
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    setLoading(false);
  };

  /* ================= NEW BULK PARSER ================= */

  const handlePasteSpecGroups = async () => {
    if (!bulkSpecInput || !newCatName) {
      return alert("Enter category name + paste spec JSON");
    }

    try {
      const parsed: SpecGroup[] = JSON.parse(bulkSpecInput);

      await addDoc(collection(db, "categories"), {
        name: newCatName,
        specGroups: parsed,
      });

      setBulkSpecInput("");
      setNewCatName("");
      setTempGroups([]);
      loadCategories();

      alert("✅ Category created from JSON!");
    } catch (err) {
      console.error(err);
      alert("❌ Invalid JSON format");
    }
  };

  /* ================= HANDLERS ================= */

  const handleSaveCategory = async () => {
    if (!newCatName || tempGroups.length === 0)
      return alert("Enter name and at least one group");

    await addDoc(collection(db, "categories"), {
      name: newCatName,
      specGroups: tempGroups,
    });

    setNewCatName("");
    setTempGroups([]);
    loadCategories();
  };

  const handleSaveProduct = async () => {
    if (!selectedCat) return;

    setLoading(true);

    await addDoc(collection(db, "products"), {
      ...productData,
      category: selectedCat.name,
      pricing,
      createdAt: serverTimestamp(),
    });

    setProductData({ name: "", description: "", image: "", specs: {} });
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
              onChange={e => setNewCatName(e.target.value)}
            />

            {/* 🆕 BULK JSON INPUT */}
            <textarea
              className="w-full bg-zinc-800 rounded-lg p-3 text-xs mb-3 h-32"
              placeholder="Paste specGroups JSON here..."
              value={bulkSpecInput}
              onChange={e => setBulkSpecInput(e.target.value)}
            />

            <button
              onClick={handlePasteSpecGroups}
              className="w-full bg-purple-600 mb-4 py-2 rounded-lg"
            >
              🚀 Create from JSON
            </button>

            {/* EXISTING UI (UNCHANGED) */}
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-zinc-800 rounded p-2 text-sm"
                placeholder="Group"
                value={curGroupName}
                onChange={e => setCurGroupName(e.target.value)}
              />
              <button
                onClick={() => {
                  if (curGroupName)
                    setTempGroups([...tempGroups, { groupName: curGroupName, fields: [] }]);
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
            {categories.map(c => (
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

        {/* RIGHT SIDE (UNCHANGED) */}
        <div className="lg:col-span-8">
          {/* KEEP YOUR EXISTING PRODUCT UI EXACTLY SAME */}
        </div>
      </div>
    </div>
  );
}