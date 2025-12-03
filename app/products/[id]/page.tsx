import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProductById, getProducts } from "@/lib/actions/product";
import { ProductDetailView } from "@/components/product-detail-view";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log("Requested Product ID:", id); // DEBUG LOG

    const product = await getProductById(id);

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Ürün Bulunamadı (ID: {id})</h1>
                    <Link href="/products">
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                            Ürünlere Dön
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Fetch similar products (same category, excluding current product)
    const similarProducts = await getProducts({ category: product.category?.slug });
    const filteredSimilarProducts = similarProducts
        .filter((p) => p.id !== product.id)
        .slice(0, 4);

    // Convert Decimal to number for serialization
    const serializedProduct = {
        ...product,
        price: Number(product.price)
    };

    const serializedSimilarProducts = filteredSimilarProducts.map((p) => ({
        ...p,
        price: Number(p.price)
    }));

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />
            <ProductDetailView product={serializedProduct} similarProducts={serializedSimilarProducts} />
        </div>
    );
}
