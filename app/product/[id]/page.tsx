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

  /* ========= PRICE LOGIC ========= */

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

        {/* 🔥 TOP CARD */}
        <motion.div
          variants={fadeIn}
          whileHover={{ scale: 1.01 }}
          className="bg-gray-900 p-6 rounded-xl"
        >
          <motion.div
            className="h-64 bg-gray-800 rounded mb-6 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            {product.image ? (
              <motion.img
                src={product.image}
                className="h-full object-cover rounded"
                alt={product.name}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/300x200";
                }}
              />
            ) : (
              <span>No Image</span>
            )}
          </motion.div>

          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-400 mt-2">
            {product.description || "No description"}
          </p>

          <motion.p
            className="text-yellow-400 text-2xl font-bold mt-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            ₹{price}
          </motion.p>

          <a href={buyLink} target="_blank">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              disabled={buyLink === "#"}
              className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600"
            >
              {buyLink === "#" ? "Not Available" : "Buy Now"}
            </motion.button>
          </a>
        </motion.div>

        {/* 🔥 PRICE COMPARISON */}
        <motion.div variants={fadeIn} className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl text-purple-400 mb-4">
            Price Comparison
          </h2>

          <motion.div variants={stagger} className="space-y-3">
            {platforms.map((platform) => {
              const data = product.pricing?.[platform];
              if (!data?.enabled) return null;

              return (
                <motion.div
                  key={platform}
                  variants={fadeIn}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center bg-gray-800 p-3 rounded"
                >
                  <span className="capitalize">{platform}</span>

                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 font-bold">
                      ₹{data.price || "-"}
                    </span>

                    {data.link && (
                      <a href={data.link} target="_blank">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                          className="bg-yellow-400 text-black px-3 py-1 rounded"
                        >
                          Buy
                        </motion.button>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* 🔥 SPECS */}
        {category && (
          <motion.div variants={fadeIn} className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">
              Specifications
            </h2>

            {/* TABS */}
            <div className="flex gap-3 overflow-x-auto mb-4">
              {category.specGroups.map((group, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeTab === i
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {group.groupName}
                </motion.button>
              ))}
            </div>

            {/* TAB CONTENT ANIMATION */}
            <AnimatePresence mode="wait">
              {category.specGroups[activeTab] && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 p-4 rounded-lg"
                >
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="space-y-2"
                  >
                    {category.specGroups[activeTab].fields.map(
                      (field, idx) => (
                        <motion.div
                          key={idx}
                          variants={fadeIn}
                          className="text-sm"
                        >
                          <span className="text-gray-400">
                            {field}:
                          </span>{" "}
                          <span className="text-white">
                            {product.specs?.[field] || "-"}
                          </span>
                        </motion.div>
                      )
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductPage;