"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";

/* ========= TYPE ========= */

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

/* ========= COMPONENT ========= */

const ProductPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProduct({
          id: snap.id,
          ...(snap.data() as Omit<Product, "id">),
        });
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="text-center mt-10 text-white">
        Loading...
      </div>
    );
  }

  /* 🔥 Get best price (example: Amazon first) */
  const price =
    product.pricing?.amazon?.price ||
    product.pricing?.flipkart?.price ||
    product.pricing?.meesho?.price ||
    product.pricing?.myntra?.price ||
    "N/A";

  const buyLink =
    product.pricing?.amazon?.link ||
    product.pricing?.flipkart?.link ||
    product.pricing?.meesho?.link ||
    product.pricing?.myntra?.link ||
    "#";

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-800 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl">

        <div className="h-64 bg-gray-800 rounded mb-6 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              className="h-full object-cover rounded"
              alt={product.name}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-400 mt-2">{product.description}</p>

        <p className="text-yellow-400 text-2xl font-bold mt-4">
          ₹{price}
        </p>

        <a href={buyLink} target="_blank">
          <button className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-300">
            Buy Now
          </button>
        </a>
      </div>
    </div>
  );
};

export default ProductPage;