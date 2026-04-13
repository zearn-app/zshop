"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const querySnapshot = await getDocs(collection(db, "products"));

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(data);
    }

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 ZShop</h1>

      {products.length === 0 ? (
        <p>Loading...</p>
      ) : (
        products.map((p, i) => {
          const best = Math.min(p.amazon, p.flipkart);

          return (
            <div key={i} style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px"
            }}>
              <h2>{p.name}</h2>
              <p>Amazon: ₹{p.amazon}</p>
              <p>Flipkart: ₹{p.flipkart}</p>
              <b style={{ color: "green" }}>
                Best Price: ₹{best}
              </b>
            </div>
          );
        })
      )}
    </div>
  );
}