export default function ProductCard({ product }: any) {
  const best = Math.min(product.amazon, product.flipkart);

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h2>{product.name}</h2>
      <p>Amazon: ₹{product.amazon}</p>
      <p>Flipkart: ₹{product.flipkart}</p>
      <b>Best: ₹{best}</b>
    </div>
  );
}
