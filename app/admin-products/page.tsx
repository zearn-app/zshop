"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { Plus, Save, Trash2, Package, Layers, ExternalLink, CheckCircle2 } from "lucide-react";

/* ================= TYPES (Refined) ================= */

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

/* ================= COMPONENT ================= */

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Category Form State
  const [newCatName, setNewCatName] = useState("");
  const [tempGroups, setTempGroups] = useState<SpecGroup[]>([]);
  const [curGroupName, setCurGroupName] = useState("");

  // Product Form State
  const [productData, setProductData] = useState({ name: "", description: "", image: "", specs: {} as Record<string, string> });
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

  /* ================= HANDLERS ================= */

  const handleSaveCategory = async () => {
    if (!newCatName || tempGroups.length === 0) return alert("Enter name and at least one group");
    await addDoc(collection(db, "categories"), { name: newCatName, specGroups: tempGroups });
    setNewCatName(""); setTempGroups([]); loadCategories();
  };

  const handleSaveProduct = async () => {
    if (!selectedCat) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        ...productData,
        category: selectedCat.name,
        pricing,
        createdAt: serverTimestamp(),
      });
      setProductData({ name: "", description: "", image: "", specs: {} });
      setPricing(INITIAL_PRICING);
      loadProducts(selectedCat.name);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONFIGURATION */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layers className="text-blue-400 w-5 h-5" /> Create Category
            </h2>
            <input 
              className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2.5 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Smartphones" 
              value={newCatName} onChange={e => setNewCatName(e.target.value)} 
            />
            
            <div className="flex gap-2 mb-4">
              <input 
                className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg p-2 text-sm"
                placeholder="Group (Display, Battery...)" 
                value={curGroupName} onChange={e => setCurGroupName(e.target.value)} 
              />
              <button 
                onClick={() => { if(curGroupName) setTempGroups([...tempGroups, {groupName: curGroupName, fields: []}]); setCurGroupName(""); }}
                className="bg-zinc-700 hover:bg-zinc-600 p-2 rounded-lg transition"
              >
                <Plus w-4 h-4 />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {tempGroups.map((g, i) => (
                <div key={i} className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                  <p className="text-xs font-bold uppercase text-zinc-500 mb-2">{g.groupName}</p>
                  <div className="flex gap-2">
                    <input 
                      className="flex-1 bg-zinc-900 border-zinc-700 rounded p-1.5 text-xs"
                      placeholder="Add Field"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          const updated = [...tempGroups];
                          updated[i].fields.push(val);
                          setTempGroups(updated);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {g.fields.map((f, idx) => <span key={idx} className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px]">{f}</span>)}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleSaveCategory}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition"
            >
              <Save size={18} /> Save Category Template
            </button>
          </section>

          {/* CATEGORY SELECTOR */}
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedCat(c); loadProducts(c.name); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCat?.id === c.id ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT ENTRY & LIST */}
        <div className="lg:col-span-8 space-y-8">
          {selectedCat ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Add New {selectedCat.name}</h2>
                  <p className="text-zinc-500 text-sm">Fill in the specifications for the product catalog.</p>
                </div>
                <Package className="text-zinc-700 w-10 h-10" />
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-400">Basic Info</label>
                  <input 
                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 outline-none" 
                    placeholder="Product Name" 
                    value={productData.name}
                    onChange={e => setProductData({...productData, name: e.target.value})}
                  />
                  <textarea 
                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 outline-none h-32" 
                    placeholder="Description" 
                    value={productData.description}
                    onChange={e => setProductData({...productData, description: e.target.value})}
                  />
                  <input 
                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 outline-none" 
                    placeholder="Image URL" 
                    value={productData.image}
                    onChange={e => setProductData({...productData, image: e.target.value})}
                  />
                </div>

                <div className="space-y-6">
                  <label className="block text-sm font-medium text-zinc-400">Pricing & Links</label>
                  <div className="grid grid-cols-1 gap-3">
                    {(Object.keys(INITIAL_PRICING) as Array<keyof Pricing>).map((site) => (
                      <div key={site} className="flex items-center gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-800">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-600"
                          checked={pricing[site].enabled}
                          onChange={e => setPricing({...pricing, [site]: {...pricing[site], enabled: e.target.checked}})}
                        />
                        <span className="w-20 text-sm capitalize">{site}</span>
                        <input 
                          disabled={!pricing[site].enabled}
                          className="flex-1 bg-zinc-900 border-zinc-700 rounded p-1.5 text-xs disabled:opacity-30"
                          placeholder="Price"
                          value={pricing[site].price}
                          onChange={e => setPricing({...pricing, [site]: {...pricing[site], price: e.target.value}})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DYNAMIC SPECS */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-zinc-400 mb-4">Technical Specifications</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedCat.specGroups.map((group, i) => (
                    <div key={i} className="space-y-3">
                      <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">{group.groupName}</h3>
                      {group.fields.map((field, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500 w-24 truncate">{field}</span>
                          <input 
                            className="flex-1 bg-zinc-800 border-zinc-700 rounded p-2 text-sm"
                            placeholder="Value"
                            value={productData.specs[field] || ""}
                            onChange={e => setProductData({
                              ...productData, 
                              specs: { ...productData.specs, [field]: e.target.value }
                            })}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                disabled={loading}
                onClick={handleSaveProduct}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-900/20 transition flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : <><CheckCircle2 /> Publish Product</>}
              </button>
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-600">
              <Package size={48} className="mb-2 opacity-20" />
              <p>Select a category to start adding products</p>
            </div>
          )}

          {/* PRODUCT LIST PREVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden">
                    {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <h4 className="font-medium">{p.name}</h4>
                    <p className="text-xs text-zinc-500">{p.category}</p>
                  </div>
                </div>
                <button className="text-zinc-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
