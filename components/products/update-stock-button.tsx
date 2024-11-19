"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tables } from "@/database.types";
import { UpdateStock } from "@/lib/actions/products";
import { Save } from "lucide-react";

export default function UpdateStockButton({ item }: { item: ProductsT }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!formData.get("previous_stock") || !formData.get("add_stock")) {
      toast.error("Please fill in all the required fields correctly.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await UpdateStock(formData);
      if (error) {
        toast.error(error.toString());
      }
      router.push("/products");
    } catch (error) {
      toast.error("There was an unexpected error updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-1">
        <div className="">
          <input
            name="id"
            id="id"
            type="text"
            required
            defaultValue={item.id}
            hidden
          />
          <input
            name="previous_stock"
            id="previous_stock"
            type="number"
            required
            defaultValue={item.stock}
            hidden
          />
          <Input
            name="add_stock"
            id="stock"
            type="number"
            className="w-20"
            placeholder=""
            required
            defaultValue={0}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : <Save className="text-white"/>}
        </Button>
      </div>
    </form>
  );
}

export type ProductsT = Tables<"products">;
