"use client";

import * as React from "react";
import {
  Home, MapPin, Image as ImageIcon, Tag,
  ChevronRight, CheckCircle2, Upload, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ListingBasics {
  mode: "short-term" | "long-term" | "buy";
  title: string;
  location: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  maxGuests: string;
  amenities: string[];
  images: string[]; // IPFS CIDs / preview URLs
}

interface ListingWizardPart1Props {
  onNext: (data: ListingBasics) => void;
}

// ─── Amenity options ──────────────────────────────────────────────────────────

const ALL_AMENITIES = [
  "WiFi", "Parking", "Heating", "Air conditioning",
  "Kitchen", "Pool", "Gym", "Smart lock",
  "Ocean view", "Pet friendly", "Washer/Dryer", "EV charger",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase tracking-[0.2em] text-blue-400">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, multiline }: {
  value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-4 py-2.5 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  return multiline
    ? <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(cls, "resize-none")} />
    : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />;
}

function NumInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="number" min={0} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 px-4 py-2.5 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ListingWizardPart1({ onNext }: ListingWizardPart1Props) {
  const [form, setForm] = React.useState<ListingBasics>({
    mode: "short-term",
    title: "",
    location: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    maxGuests: "",
    amenities: [],
    images: [],
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof ListingBasics, string>>>({});
  const [imagePreviews, setImagePreviews] = React.useState<{ name: string; url: string }[]>([]);

  const set = <K extends keyof ListingBasics>(key: K, value: ListingBasics[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleAmenity = (a: string) =>
    set("amenities", form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const previews = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setImagePreviews((p) => [...p, ...previews]);
    // In production: upload to IPFS and push CIDs to form.images
    set("images", [...form.images, ...files.map((f) => `ipfs://placeholder/${f.name}`)]);
    e.target.value = "";
  };

  const removeImage = (i: number) => {
    setImagePreviews((p) => p.filter((_, idx) => idx !== i));
    set("images", form.images.filter((_, idx) => idx !== i));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.bedrooms) e.bedrooms = "Required";
    if (!form.bathrooms) e.bathrooms = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(form); };

  const MODE_OPTIONS: { key: ListingBasics["mode"]; label: string; sub: string }[] = [
    { key: "short-term", label: "Short-Term Stay", sub: "Nightly / vacation rental" },
    { key: "long-term",  label: "Long-Term Rental", sub: "Monthly lease" },
    { key: "buy",        label: "For Sale",          sub: "Direct property sale" },
  ];

  return (
    <div className="space-y-8">
      {/* Step header */}
      <div className="flex items-center gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">1</span>
        <div>
          <p className="font-semibold text-foreground">Basic Info &amp; Media</p>
          <p className="text-xs text-blue-400">Step 1 of 2 · Details, amenities, and photos</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          <span className="h-2 w-8 rounded-full bg-blue-600" />
          <span className="h-2 w-8 rounded-full bg-blue-800" />
        </div>
      </div>

      {/* Listing mode */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Listing type</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {MODE_OPTIONS.map((opt) => (
            <button key={opt.key} type="button" onClick={() => set("mode", opt.key)}
              className={cn("rounded-2xl border p-4 text-left transition",
                form.mode === opt.key
                  ? "border-blue-500 bg-blue-500/10 text-foreground"
                  : "border-blue-800 bg-blue-900/40 text-blue-300 hover:border-blue-600"
              )}>
              <Tag className="mb-2 h-4 w-4" />
              <p className="font-semibold">{opt.label}</p>
              <p className="mt-0.5 text-xs text-blue-400">{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Title & location */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Property title" error={errors.title}>
          <TextInput value={form.title} onChange={(v) => set("title", v)} placeholder="e.g. Stellar Seaside Villa" />
        </Field>
        <Field label="Location" error={errors.location}>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-blue-500" />
            <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)}
              placeholder="City, State" className="w-full rounded-2xl border border-blue-800 bg-blue-900/60 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-blue-600 focus:border-blue-500 focus:outline-none" />
          </div>
          {errors.location && <p className="text-xs text-red-400">{errors.location}</p>}
        </Field>
      </div>

      {/* Description */}
      <Field label="Description" error={errors.description}>
        <TextInput multiline value={form.description} onChange={(v) => set("description", v)}
          placeholder="Describe the property: highlights, location, what makes it unique…" />
      </Field>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Bedrooms" error={errors.bedrooms}>
          <NumInput value={form.bedrooms} onChange={(v) => set("bedrooms", v)} placeholder="e.g. 3" />
        </Field>
        <Field label="Bathrooms" error={errors.bathrooms}>
          <NumInput value={form.bathrooms} onChange={(v) => set("bathrooms", v)} placeholder="e.g. 2" />
        </Field>
        <Field label={form.mode === "buy" ? "Lot Sq Ft" : "Max Guests"}>
          <NumInput value={form.maxGuests} onChange={(v) => set("maxGuests", v)} placeholder={form.mode === "buy" ? "e.g. 6500" : "e.g. 6"} />
        </Field>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map((a) => {
            const selected = form.amenities.includes(a);
            return (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={cn("flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-sm transition",
                  selected ? "border-blue-500 bg-blue-500/15 text-foreground" : "border-blue-800 bg-blue-900/40 text-blue-300 hover:border-blue-600"
                )}>
                {selected && <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />}
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* Media upload */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Photos <span className="normal-case text-blue-600">(uploaded to IPFS on publish)</span></p>
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-blue-700 bg-blue-900/20 p-8 transition hover:border-blue-500">
          <Upload className="h-8 w-8 text-blue-500" />
          <span className="text-sm text-blue-300">Click to select photos</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageAdd} />
        </label>
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {imagePreviews.map((img, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-blue-800">
                <img src={img.url} alt={img.name} className="h-24 w-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-blue-950/80 p-1 text-blue-300 opacity-0 transition group-hover:opacity-100 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next */}
      <button type="button" onClick={handleNext}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 sm:w-auto sm:px-10">
        <Home className="h-4 w-4" />
        Continue to Pricing &amp; Smart Logic
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
