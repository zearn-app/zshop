export default function ProductCard({ product }: any) {
  const best = Math.min(product.amazon, product.flipkart);

  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      <h2>{product.name}</h2>
      <p>Amazon: ₹{product.amazon}</p>
      <p>Flipkart: ₹{product.flipkart}</p>
      <b>Best Price: ₹{best}</b>
    </div>
  );
}
