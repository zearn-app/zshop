
import { doc, getDoc } from "firebase/firestore";

const ProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const ref = doc(db, "products", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

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
            <img src={product.image} className="h-full object-cover rounded" />
          ) : (
            <span>No Image</span>
          )}
        </div>

        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-400 mt-2">{product.description}</p>

        <p className="text-yellow-400 text-2xl font-bold mt-4">
          ₹{product.price}
        </p>

        <button className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-300">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
