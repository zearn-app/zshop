"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";

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
        // 🔹 Fetch product
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

        // 🔹 Fetch category for spec groups
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

  /* ========= PRICE ========= */

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

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-800 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP CARD */}
        <div className="bg-gray-900 p-6 rounded-xl">

          <div className="h-64 bg-gray-800 rounded mb-6 flex items-center justify-center overflow-hidden">
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
            <button
              disabled={buyLink === "#"}
              className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600"
            >
              {buyLink === "#" ? "Not Available" : "Buy Now"}
            </button>
          </a>
        </div>

        {/* 🔥 SPECS SECTION (NEW) */}
        {category && (
          <div className="bg-gray-900 p-6 rounded-xl">

            <h2 className="text-xl font-semibold mb-4 text-blue-400">
              Specifications
            </h2>

            {/* GROUPS → HORIZONTAL */}
            <div className="flex gap-6 overflow-x-auto pb-2">

              {category.specGroups.map((group, i) => (
                <div
                  key={i}
                  className="min-w-[260px] bg-gray-800 p-4 rounded-lg"
                >
                  {/* GROUP NAME */}
                  <h3 className="text-yellow-400 font-semibold mb-3">
                    {group.groupName}
                  </h3>

                  {/* FIELDS → VERTICAL */}
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