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

/* ========= CART HELPERS ========= */

const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
};

const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

/* ========= ANIMATION VARIANTS ========= */

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
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

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          setProduct(null);
          return;
        }

        const prod = {
          id: productSnap.id,
          ...(productSnap.data() as Omit<Product, "id">),
        };

        setProduct(prod);

        const q = query(
          collection(db, "categories"),
          where("name", "==", prod.category)
        );

        const catSnap = await getDocs(q);

        if (!catSnap.empty) {
          const catData = {
            id: catSnap.docs[0].id,
            ...(catSnap.docs[0].data() as Omit<Category, "id">),
          };

          setCategory(catData);
          if (catData.specGroups?.length > 0) {
            setActiveTab(0);
          }
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* 🔹 LOAD CART COUNT */
  useEffect(() => {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(total);
  }, []);

  /* ========= ADD TO CART ========= */

  const addToCart = () => {
    if (!product) return;

    const cart = getCart();

    const price =
      Object.values(product.pricing || {}).find(
        (p) => p.enabled && p.price
      )?.price || "0";

    const index = cart.findIndex((item) => item.id === product.id);

    if (index > -1) {
      cart[index].qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price,
        image: product.image,
        qty: 1,
      });
    }

    saveCart(cart);

    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(total);
  };

  /* ========= LOADING ========= */

  if (loading) {
    return (
      <div className="text-center mt-10 text-white animate-pulse">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10 text-red-400">
        Product not found
      </div>
    );
  }

  /* ========= PRICE ========= */

  const platforms = Object.keys(product.pricing || {});

  const validPlatforms = platforms.filter(
    (p) =>
      product.pricing?.[p]?.enabled &&
      product.pricing?.[p]?.price
  );

  const bestPlatform = validPlatforms[0];

  const price =
    (bestPlatform && product.pricing[bestPlatform]?.price) || "N/A";

  const buyLink =
    (bestPlatform && product.pricing[bestPlatform]?.link) || "#";

  /* ========= UI ========= */

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="min-h-screen bg-black text-white p-4 md:p-8"
    >
      {/* BACK */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => router.back()}
        className="mb-6 bg-gray-800 px-4 py-2 rounded"
      >
        ← Back
      </motion.button>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP CARD */}
        <motion.div variants={fadeIn} className="bg-gray-900 p-6 rounded-xl">

          <div className="h-64 bg-gray-800 rounded mb-6 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img src={product.image} className="h-full object-cover rounded" />
            ) : (
              <span>No Image</span>
            )}
          </div>

          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-400 mt-2">
            {product.description || "No description"}
          </p>

          <p className="text-yellow-400 text-2xl font-bold mt-4">
            ₹{price}
          </p>

          {/* ✅ ADD TO CART */}
          <button
            onClick={addToCart}
            className="mt-4 w-full bg-green-400 text-black py-3 rounded-lg hover:bg-green-300"
          >
            Add to Cart
          </button>

          <a href={buyLink} target="_blank">
            <button className="mt-3 w-full bg-yellow-400 text-black py-3 rounded-lg">
              Buy Now
            </button>
          </a>
        </motion.div>

        {/* PRICE + SPECS (UNCHANGED) */}
        {/* Keep your existing animated sections exactly same */}

      </div>

      {/* 🛒 FLOATING CART BUTTON */}
      <button
        onClick={() => router.push("/cart")}
        className="fixed bottom-5 left-5 bg-yellow-400 text-black px-5 py-3 rounded-full shadow-lg relative"
      >
        🛒 Cart

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {cartCount}
          </span>
        )}
      </button>
    </motion.div>
  );
};

export default ProductPage;