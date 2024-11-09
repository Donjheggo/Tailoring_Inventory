"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UpdateSale } from "@/lib/actions/sales";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tables } from "@/database.types";
import { useState, useEffect } from "react";
import { GetAllProducts } from "@/lib/actions/products";
import { ProductsT } from "./create-dialog";

export default function UpdateSalesForm({ item }: { item: SalesT }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductsT[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await GetAllProducts();
      if (data) setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (
      !formData.get("product_id") ||
      !formData.get("color") ||
      !formData.get("quantity")
    ) {
      toast.error("Please fill in all the required fields correctly.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await UpdateSale(formData);
      if (error) {
        toast.error(error.toString());
      }
      router.push("/sales");
    } catch (error) {
      toast.error("There was an unexpected error updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 mt-5 container max-w-screen-sm mx-auto">
        <div className="grid gap-2">
          <Label htmlFor="name"></Label>
          <input
            name="id"
            id="id"
            type="text"
            placeholder=""
            required
            defaultValue={item.id}
            hidden
          />
          <Select name="product_id" defaultValue={item.product_id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {products.map((item, index) => (
                  <SelectItem key={index} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Color</Label>
          <Input
            name="color"
            id="color"
            type="color"
            placeholder=""
            required
            defaultValue={item.color}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">quantity</Label>
          <Input
            name="quantity"
            id="quantity"
            type="text"
            placeholder=""
            required
            defaultValue={item.quantity}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
}

export type SalesT = Tables<"sales">;
