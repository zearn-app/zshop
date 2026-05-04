"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, Info, Activity } from "lucide-react";

/* ========= TYPE ========= */

type PricingItem = {
  enabled?: boolean;
  price?: string;
  link?: string;
};

type SpecGroup = {
  groupName: string;
  fields: string[];
};

type Category = {
  id: string;
  name: string;
  specGroups: SpecGroup[];
};

type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  specs: Record<string, string>;
  pricing: Record<string, PricingItem>;
};

/* ========= COMPONENT ========= */

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const prod = {
          id: snap.id,
          ...(snap.data() as Omit<Product, "id">),
        };

        setProduct(prod);

        const q = query(
          collection(db, "categories"),
          where("name", "==", prod.category)
        );

        const catSnap = await getDocs(q);

        if (!catSnap.empty) {
          setCategory({
            id: catSnap.docs[0].id,
            ...(catSnap.docs[0].data() as Omit<Category, "id">),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ========= PRICE LOGIC ========= */

  const platforms = ["amazon", "flipkart", "meesho", "myntra"];
  const validPlatform = platforms.find(
    (p) => product?.pricing?.[p]?.enabled && product?.pricing?.[p]?.price
  );

  const price = (validPlatform && product?.pricing[validPlatform]?.price) || "N/A";
  const buyLink = (validPlatform && product?.pricing[validPlatform]?.link) || "#";

  /* ========= LOADING STATE ========= */

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-red-400 flex flex-col items-center justify-center">
        <p className="text-xl font-bold">Product not found</p>
        <button onClick={() => router.back()} className="mt-4 text-white underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      
      {/* BACK BUTTON */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to Shop</span>
      </motion.button>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* TOP CARD: PRODUCT INFO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0f0f0f] border border-white/5 p-6 md:p-10 rounded-3xl shadow-2xl"
        >
          {/* IMAGE SECTION */}
          <div className="relative aspect-square bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 group">
            {product.image ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={product.image}
                className="w-full h-full object-contain p-4 transition-transform duration-500"
                alt={product.name}
              />
            ) : (
              <span className="text-gray-500">No Preview Available</span>
            )}
          </div>

          {/* CONTENT SECTION */}
          <div className="flex flex-col justify-center">
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2"
            >
              {product.category}
            </motion.span>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">{product.name}</h1>
            <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-sm text-gray-500 font-medium">Best Price:</span>
              <span className="text-4xl font-black text-white">₹{price}</span>
            </div>

            <motion.a 
              href={buyLink} 
              target="_blank"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                disabled={buyLink === "#"}
                className="w-full bg-yellow-400 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-300 disabled:bg-gray-700 disabled:text-gray-400 transition-all shadow-lg shadow-yellow-400/10"
              >
                <ShoppingCart size={20} />
                {buyLink === "#" ? "Currently Out of Stock" : "Buy from Store"}
              </button>
            </motion.a>
          </div>
        </motion.div>

        {/* SPECS SECTION */}
        <AnimatePresence>
          {category && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0f0f0f] border border-white/5 p-6 md:p-8 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Activity className="text-blue-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold">Technical Specifications</h2>
              </div>

              {/* HORIZONTAL SCROLLABLE GROUPS */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {category.specGroups.map((group, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="min-w-[280px] bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm"
                  >
                    <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                      {group.groupName}
                    </h3>

                    <div className="space-y-4">
                      {group.fields.map((field, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">
                            {field}
                          </span>
                          <span className="text-sm text-gray-200 mt-1">
                            {product.specs?.[field] || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductPage;
