export default function Home() {
  const products = [
    { name: "iPhone 13", amazon: 52000, flipkart: 51000 },
    { name: "Samsung S21", amazon: 45000, flipkart: 43000 }
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🛒 ZShop</h1>
      <p>Compare prices and get best deals 🔥</p>

      {products.map((p, i) => {
        const best = Math.min(p.amazon, p.flipkart);

        return (
          <div key={i} style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginTop: "10px",
            borderRadius: "10px"
          }}>
            <h2>{p.name}</h2>
            <p>Amazon: ₹{p.amazon}</p>
            <p>Flipkart: ₹{p.flipkart}</p>

            <p style={{ color: "green" }}>
              Best Price: ₹{best}
            </p>
          </div>
        );
      })}
    </div>
  );
            }
