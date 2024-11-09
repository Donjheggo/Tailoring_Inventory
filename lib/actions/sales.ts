"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";
import { GetProductById } from "./products";

export async function GetSales(
  searchQuery: string,
  page: number,
  items_per_page: number
) {
  try {
    const supabase = createClient();
    const query = supabase
      .from("sales")
      .select(`*, product_id(*)`)
      .order("created_at", { ascending: true })
      .range((page - 1) * items_per_page, page * items_per_page - 1);

    const { data, error } = searchQuery
      ? await query.ilike("product_id.name", `%${searchQuery}%`)
      : await query;

    if (error) {
      console.error(error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function CreateSale(formData: FormData) {
  try {
    const product = await GetProductById(
      formData.get("product_id")?.toString() || ""
    );

    if (!product) {
      return { error: "Product not found" };
    }

    const quantity = parseInt(formData.get("quantity")?.toString() || "0");
    if (isNaN(quantity) || quantity <= 0) {
      return { error: "Invalid quantity" };
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("sales")
      .insert({
        product_id: formData.get("product_id"),
        color: formData.get("color"),
        quantity: formData.get("quantity"),
        total_price: product.price * quantity,
      })
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/sales");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetSaleById(id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("sales")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return false;
    }
    return data;
  } catch (error) {
    return false;
  }
}

export async function UpdateSale(formData: FormData) {
  try {
    const product = await GetProductById(
      formData.get("product_id")?.toString() || ""
    );

    if (!product) {
      return { error: "Product not found" };
    }

    const quantity = parseInt(formData.get("quantity")?.toString() || "0");
    if (isNaN(quantity) || quantity <= 0) {
      return { error: "Invalid quantity" };
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("sales")
      .update({
        product_id: formData.get("product_id"),
        color: formData.get("color"),
        quantity: formData.get("quantity"),
        total_price: product.price * quantity,
      })
      .eq("id", formData.get("id"))
      .select();

    if (error) {
      return { error: error };
    }
    revalidatePath("/sales");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function DeleteSale(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("sales").delete().eq("id", id);

    if (error) {
      return { error: error };
    }
    revalidatePath("/sales");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetTotalSales() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("sales")
      .select("total_price")
      .throwOnError();

    if (error) {
      console.error("Error fetching sales:", error);
      return 0;
    }

    // Sum all total_price values
    const totalSales = data.reduce(
      (sum, sale) => sum + (sale.total_price || 0),
      0
    );

    // Return with 2 decimal places
    return Number(totalSales.toFixed(2));
  } catch (error) {
    console.error("Error calculating total sales:", error);
    return 0;
  }
}
