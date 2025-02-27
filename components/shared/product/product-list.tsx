import { IProduct } from "@/type";
import ProductCard from "./productCard";

interface IProductListProps {
  data: IProduct[];
  title: string;
}

function ProductList({ data, title }: IProductListProps) {
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((product: IProduct) => (
            <ProductCard product={product} key={product.productNumber} />
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default ProductList;
