import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import UpdateProductsForm from "@/components/products/update-form";
import { GetProductById } from "@/lib/actions/products";

export default async function UpdateCustomer({
  params,
}: {
  params: { id: string };
}) {
  const item = await GetProductById(params.id);

  return (
    <div>
      <Link href="../" className="flex gap-2 hover:underline">
        <ArrowLeft />
        Back
      </Link>
      <h1 className="text-center text-2xl">Update</h1>
      <div className="mt-5">
        <UpdateProductsForm item={item} />
      </div>
    </div>
  );
}
