import DashboardCard from "@/components/dashboard/dashboard-card";
import { ShoppingCart, HandCoins } from "lucide-react";
import { GetTotalProducts } from "@/lib/actions/products";
import { GetTotalSales } from "@/lib/actions/sales";
import ProductsTable from "@/components/dashboard/products-table";
import SalesTable from "@/components/dashboard/sales-tables";

export default async function Dashboard() {
  const [products, sales] = await Promise.all([
    GetTotalProducts(),
    GetTotalSales(),
  ]);

  const cards = [
    {
      title: "Total Products",
      number: products,
      icon: <ShoppingCart size={30} className="text-primary" />,
    },
    {
      title: "Total Sales",
      number: sales,
      icon: <HandCoins size={30} className="text-primary" />,
    },
  ];

  return (
    <div className="container mx-auto max-w-screen-2xl">
      <h1 className="text-center text-2xl">Dashboard</h1>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 mt-4">
        {cards.map((item, index) => (
          <DashboardCard key={index} item={item} />
        ))}
      </div>
      <div className="flex flex-1 flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full">
          <ProductsTable searchQuery="" page={1} />
        </div>
        <div className="w-full lg:w-[50%]">
          <SalesTable searchQuery="" page={1} />
        </div>
      </div>
    </div>
  );
}
