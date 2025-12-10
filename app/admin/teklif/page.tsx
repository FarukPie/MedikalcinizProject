import { getProposalFormData, getProposals } from "@/lib/actions/proposal";
import OffersPageClient from "./page.client";

export default async function OffersPage() {
    const { partners, products } = await getProposalFormData();
    const proposals = await getProposals();

    return (
        <OffersPageClient
            proposals={proposals}
            partners={partners}
            products={products}
        />
    );
}
