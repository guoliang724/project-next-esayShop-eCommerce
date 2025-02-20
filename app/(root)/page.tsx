import { getProducts } from "@/lib/actions/product.action";
import ProductList from "@/components/shared/product/product-list";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const metadata = {
  title: "Home",
};
const Home = async () => {
  const products = await getProducts();

  return (
    <div>
      <ProductList data={products as any} title="Newest Arrivals"></ProductList>
    </div>
  );
};

export default Home;
