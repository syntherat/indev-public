import { redirect } from "next/navigation";

export default async function ProductAliasPage({ params }) {
  const slug = String(params?.slug || "").trim();

  if (!slug) {
    redirect("/products");
  }

  redirect(`/products/${encodeURIComponent(slug)}`);
}
