import { notFound } from "next/navigation";
import { propertySamples } from "@/components/property-data";
import { PropertyDetailView, type PropertyDetail } from "@/components/PropertyDetailView";

// ─── Extend base samples with detail fields ───────────────────────────────────

const DETAIL_DATA: Record<string, Omit<PropertyDetail, keyof (typeof propertySamples)[0]>> = {
  "prop-1": {
    description:
      "A sun-drenched villa perched above the Pacific with panoramic ocean views, a private infinity pool, and fully-equipped chef's kitchen. Every booking is backed by a Soroban smart contract: your security deposit is locked transparently on-chain and released automatically on checkout — no disputes, no delays.",
    host: { name: "Elena Vega", initials: "EV", verified: true, responseRate: "99%", joinedYear: 2023 },
    amenities: ["WiFi", "Parking", "Heating", "Air conditioning", "Pool", "Kitchen", "Smart lock", "Ocean view deck"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    ],
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    yearBuilt: 2018,
    lotSqft: 6200,
  },
  "prop-2": {
    description:
      "A sleek downtown loft with floor-to-ceiling windows overlooking the Seattle skyline. Crypto-ready with Freighter wallet integration pre-installed on the smart TV. Ideal for digital nomads seeking a seamless, fully-verified lease with monthly USDC streaming payments.",
    host: { name: "Marcus Chen", initials: "MC", verified: true, responseRate: "97%", joinedYear: 2022 },
    amenities: ["WiFi", "Parking", "Air conditioning", "Gym access", "Concierge", "City view rooftop"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    ],
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    yearBuilt: 2015,
    lotSqft: 1800,
  },
  "prop-3": {
    description:
      "A sprawling 5-bedroom estate on the outskirts of Austin with a heated pool, solar panel array, and direct access to greenbelt trails. Available for direct purchase — the title transfers on-chain via a Soroban deed contract the moment payment is confirmed.",
    host: { name: "Jordan Rivera", initials: "JR", verified: true, responseRate: "95%", joinedYear: 2021 },
    amenities: ["WiFi", "Parking", "Heating", "Air conditioning", "Pool", "Solar panels", "Garden", "4-car garage"],
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80",
    ],
    bedrooms: 5,
    bathrooms: 4,
    maxGuests: 10,
    yearBuilt: 2010,
    lotSqft: 14500,
  },
};

export function generateStaticParams() {
  return propertySamples.map((p) => ({ id: p.id }));
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = propertySamples.find((p) => p.id === id);
  const extra = DETAIL_DATA[id];
  if (!base || !extra) notFound();

  const property: PropertyDetail = { ...base, ...extra };

  return <PropertyDetailView property={property} />;
}
