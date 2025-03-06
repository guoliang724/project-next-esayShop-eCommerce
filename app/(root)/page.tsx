import { getProducts } from "@/lib/actions/product.action";
import ProductList from "@/components/shared/product/product-list";
import { getFeaturedProducts } from "@/lib/actions/product.action";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const metadata = {
  title: "Home",
};
const Home = async () => {
  const products = await getProducts();
  const latesProducts = await getFeaturedProducts();

  return (
    <>
      <ProductCarousel data={latesProducts as any} />
      <ProductList data={products as any} title="Newest Arrivals"></ProductList>
      <ViewAllProductsButton />
    </>
  );
};

export default Home;
