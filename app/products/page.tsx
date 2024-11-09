import ProductsTable from "@/components/products/table";
import SearchBar from "@/components/search-bar";
import CreateDialog from "@/components/products/create-dialog";

export default function Products({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const searchQuery = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="container max-w-screen-md mx-auto">
      <h1 className="text-center text-2xl">Products</h1>
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <SearchBar />
          <CreateDialog />
        </div>
        <div className="mt-2">
          <ProductsTable searchQuery={searchQuery} page={page} />
        </div>
      </div>
    </div>
  );
}
