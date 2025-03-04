import { getProducts } from "@/lib/actions/product.action";
import ProductList from "@/components/shared/product/product-list";
import { getFeaturedProducts } from "@/lib/actions/product.action";
import ProductCarousel from "@/components/shared/product/product-carousel";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const metadata = {
  title: "Home",
};
const Home = async () => {
  const products = await getProducts();
  const latesProducts = await getFeaturedProducts();

  return (
    <div>
      <ProductCarousel data={latesProducts as any} />
      <ProductList data={products as any} title="Newest Arrivals"></ProductList>
    </div>
  );
};

export default Home;
