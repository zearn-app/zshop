"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

/* ========= TYPES ========= */

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

type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  qty: number;
};

/* ========= CART ========= */

const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
};

const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

/* ========= ANIMATION ========= */

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

/* ========= COMPONENT ========= */

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : null;

  /* ========= FETCH ========= */

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const productSnap = await getDoc(doc(db, "products", id));

        if (!productSnap.exists()) {
          setProduct(null);
          return;
        }

        const prod = {
          id: productSnap.id,
          ...(productSnap.data() as Omit<Product, "id">),
        };

        setProduct(prod);

        const catSnap = await getDocs(
          query(
            collection(db, "categories"),
            where("name", "==", prod.category)
          )
        );

        if (!catSnap.empty) {
          const catData = {
            id: catSnap.docs[0].id,
            ...(catSnap.docs[0].data() as Omit<Category, "id">),
          };

          setCategory(catData);
          setActiveTab(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ========= CART COUNT ========= */

  useEffect(() => {
    const cart = getCart();
    setCartCount(cart.reduce((sum, i) => sum + i.qty, 0));
  }, []);

  /* ========= ADD CART ========= */

  const addToCart = () => {
    if (!product) return;

    const cart = getCart();

    const price =
      Object.values(product.pricing || {}).find(
        (p) => p.enabled && p.price
      )?.price || "0";

    const index = cart.findIndex((i) => i.id === product.id);

    if (index > -1) cart[index].qty += 1;
    else
      cart.push({
        id: product.id,
        name: product.name,
        price,
        image: product.image,
        qty: 1,
      });

    saveCart(cart);
    setCartCount(cart.reduce((s, i) => s + i.qty, 0));
  };

  /* ========= UI ========= */

  if (loading)
    return <div className="text-center mt-10 text-white">Loading...</div>;

  if (!product)
    return <div className="text-center mt-10 text-red-400">Not found</div>;

  const platforms = Object.keys(product.pricing || {});
  const best = platforms.find(
    (p) => product.pricing[p]?.enabled && product.pricing[p]?.price
  );

  const price = best ? product.pricing[best].price : "N/A";
  const buyLink = best ? product.pricing[best].link : "#";

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="min-h-screen bg-black text-white p-4 md:p-8"
    >
      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-800 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <div className="h-64 bg-gray-800 rounded mb-6 flex items-center justify-center">
            {product.image ? (
              <img src={product.image} className="h-full object-cover" />
            ) : (
              "No Image"
            )}
          </div>

          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-400 mt-2">{product.description}</p>

          <p className="text-yellow-400 text-2xl font-bold mt-4">
            ₹{price}
          </p>

          {/* ADD CART */}
          <button
            onClick={addToCart}
            className="mt-4 w-full bg-green-400 text-black py-3 rounded-lg"
          >
            Add to Cart
          </button>

          <a href={buyLink} target="_blank">
            <button className="mt-3 w-full bg-yellow-400 text-black py-3 rounded-lg">
              Buy Now
            </button>
          </a>
        </div>

        {/* 🔥 PRICE LIST */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-purple-400 mb-3">Price Comparison</h2>

          {platforms.map((p) => {
            const d = product.pricing[p];
            if (!d?.enabled) return null;

            return (
              <div key={p} className="flex justify-between mb-2">
                <span>{p}</span>
                <span>₹{d.price}</span>
              </div>
            );
          })}
        </div>

        {/* 🔥 SPECS FIXED (THIS WAS MISSING) */}
        {category && (
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-blue-400 mb-4">Specifications</h2>

            {/* TABS */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {category.specGroups.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-3 py-1 rounded ${
                    activeTab === i
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-800"
                  }`}
                >
                  {g.groupName}
                </button>
              ))}
            </div>

            {/* CONTENT */}
            {category.specGroups[activeTab] && (
              <div className="bg-gray-800 p-4 rounded">
                {category.specGroups[activeTab].fields.map((f, i) => (
                  <div key={i} className="text-sm mb-1">
                    <span className="text-gray-400">{f}: </span>
                    {product.specs?.[f] || "-"}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔥 FIXED CART BUTTON (ALWAYS SAME PLACE) */}
      <button
        onClick={() => router.push("/cart")}
        className="fixed bottom-5 left-5 z-50 bg-yellow-400 text-black px-5 py-3 rounded-full shadow-lg"
      >
        🛒 {cartCount}
      </button>
    </motion.div>
  );
};

export default ProductPage;