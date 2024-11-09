"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function GetProducts(
  searchQuery: string,
  page: number,
  items_per_page: number
) {
  try {
    const supabase = createClient();
    const query = supabase
      .from("products")
      .select(`*`)
      .order("name", { ascending: true })
      .range((page - 1) * items_per_page, page * items_per_page - 1);

    const { data, error } = searchQuery
      ? await query.ilike("name", `%${searchQuery}%`)
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

export async function CreateProduct(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .insert({
        name: formData.get("name"),
        stock: formData.get("stock"),
        price: formData.get("price"),
      })
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/products");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetProductById(id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("products")
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

export async function UpdateProduct(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({
        name: formData.get("name"),
        stock: formData.get("stock"),
        price: formData.get("price"),
      })
      .eq("id", formData.get("id"))
      .select();

    if (error) {
      return { error: error };
    }
    revalidatePath("/products");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function DeleteProduct(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return { error: error };
    }
    revalidatePath("/products");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetTotalProducts() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase.from("products").select("*");

    if (error) {
      console.error(error);
      return 0;
    }
    return data.length || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function GetAllProducts() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error(error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
