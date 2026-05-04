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
        /* 🔹 FETCH PRODUCT */
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

        /* 🔹 FETCH CATEGORY */
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
        } else {
          setCategory(null);
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
    return <div className="text-center mt-10 text-white">Loading...</div>;
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-800 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* 🔥 TOP CARD */}
        <div className="bg-gray-900 p-6 rounded-xl">

          <div className="h-64 bg-gray-800 rounded mb-6 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                className="h-full object-cover rounded"
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/300x200";
                }}
              />
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

          <a href={buyLink} target="_blank">
            <button
              disabled={buyLink === "#"}
              className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600"
            >
              {buyLink === "#" ? "Not Available" : "Buy Now"}
            </button>
          </a>
        </div>

        {/* 🔥 PRICE COMPARISON */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl text-purple-400 mb-4">
            Price Comparison
          </h2>

          <div className="space-y-3">
            {platforms.map((platform) => {
              const data = product.pricing?.[platform];

              if (!data?.enabled) return null;

              return (
                <div
                  key={platform}
                  className="flex justify-between items-center bg-gray-800 p-3 rounded"
                >
                  <span className="capitalize">{platform}</span>

                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 font-bold">
                      ₹{data.price || "-"}
                    </span>

                    {data.link && (
                      <a href={data.link} target="_blank">
                        <button className="bg-yellow-400 text-black px-3 py-1 rounded">
                          Buy
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔥 SPECS */}
        {category && (
          <div className="bg-gray-900 p-6 rounded-xl">

            <h2 className="text-xl font-semibold mb-4 text-blue-400">
              Specifications
            </h2>

            {/* ✅ Horizontal scroll fixed */}
            <div className="flex gap-4 overflow-x-auto pb-2">

              {category.specGroups.map((group, i) => (
                <div
                  key={i}
                  className="min-w-[260px] bg-gray-800 p-4 rounded-lg flex-shrink-0"
                >
                  <h3 className="text-yellow-400 font-semibold mb-3">
                    {group.groupName}
                  </h3>

                  <div className="space-y-2">
                    {group.fields.map((field, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="text-gray-400">
                          {field}:
                        </span>{" "}
                        <span className="text-white">
                          {product.specs?.[field] || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductPage;