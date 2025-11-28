import { getProducts, getAllCategories } from "@/lib/actions/product";
import { ProductListing } from "@/components/product-listing";
import { Suspense } from "react";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string }>;
}) {
    const { search, category } = await searchParams;
    const [products, categories] = await Promise.all([
        getProducts({ search, category }),
        getAllCategories(),
    ]);

    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <ProductListing initialProducts={products} categories={categories} />
        </Suspense>
    );
}
