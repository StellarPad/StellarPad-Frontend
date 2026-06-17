import { notFound } from "next/navigation";
import { propertySamples } from "@/components/property-data";
import { CheckoutSigner } from "@/components/CheckoutSigner";

export function generateStaticParams() {
  return propertySamples.map((p) => ({ id: p.id }));
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = propertySamples.find((p) => p.id === id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Checkout</p>
        <h1 className="text-3xl font-semibold text-foreground">{property.title}</h1>
        <p className="text-sm text-blue-300">{property.location}</p>
      </div>
      <CheckoutSigner
        propertyTitle={property.title}
        propertyId={property.id}
        amount={String(property.priceNight)}
      />
    </div>
  );
}
