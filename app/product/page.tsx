"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";

/* ========= TYPE  ========= */

type PricingItem = {
  enabled?: boolean;
  price?: string;
  link?: string;
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
  const [loading, setLoading] = useState(true);

  // ✅ safer id handling
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : null;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProduct({
            id: snap.id,
            ...(snap.data() as Omit<Product, "id">),
          });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ========= LOADING ========= */

  if (loading) {
    return (
      <div className="text-center mt-10 text-white">
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

  /* ========= BEST PRICE LOGIC (FIXED) ========= */

  const platforms = ["amazon", "flipkart", "meesho", "myntra"];

  const validPlatform = platforms.find(
    (p) =>
      product.pricing?.[p]?.enabled &&
      product.pricing?.[p]?.price
  );

  const price =
    (validPlatform && product.pricing[validPlatform]?.price) ||
    "N/A";

  const buyLink =
    (validPlatform && product.pricing[validPlatform]?.link) ||
    "#";

  /* ========= UI ========= */

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-800 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl">

        {/* IMAGE */}
        <div className="h-64 bg-gray-800 rounded mb-6 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              className="h-full object-cover rounded"
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        {/* INFO */}
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-400 mt-2">{product.description}</p>

        {/* PRICE */}
        <p className="text-yellow-400 text-2xl font-bold mt-4">
          ₹{price}
        </p>

        {/* BUY */}
        <a href={buyLink} target="_blank">
          <button
            disabled={buyLink === "#"}
            className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600"
          >
            {buyLink === "#" ? "Not Available" : "Buy Now"}
          </button>
        </a>
      </div>
    </div>
  );
};

export default ProductPage;