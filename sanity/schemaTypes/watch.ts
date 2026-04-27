import { defineField, defineType } from "sanity";

/**
 * Studio-ready `watch` document. Matches GROQ in `src/lib/sanity.ts` and mapping in `src/lib/mapSanityWatch.ts`.
 * Register in `sanity.config.ts`: `schema: { types: [watchType, ...] }` or import from `./schemaTypes`.
 */
export const watchType = defineType({
  name: "watch",
  title: "Watch",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Public URL segment: /product/<slug>. Must be unique and stable for cart links.",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Optional (e.g. men, women). Reserved for future filters.",
    }),
    defineField({
      name: "price",
      title: "Price (NGN)",
      description: "Amount in Nigerian naira (nominal storefront currency).",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "availability",
      title: "Availability",
      description: "Customer-facing status. The storefront does not derive this from stock counts.",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Out of stock", value: "out-of-stock" },
          { title: "Pre-order", value: "pre-order" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stockQuantity",
      title: "Stock quantity (internal)",
      description: "Optional. When set, caps cart quantity for this SKU; not shown on the storefront.",
      type: "number",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Primary image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Gallery images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "object",
      fields: [
        defineField({ name: "movement", title: "Movement", type: "string" }),
        defineField({ name: "dial", title: "Dial", type: "string" }),
        defineField({ name: "case", title: "Case", type: "string" }),
        defineField({ name: "powerReserve", title: "Power reserve", type: "string" }),
        defineField({ name: "waterResistance", title: "Water resistance", type: "string" }),
        defineField({
          name: "strapOrBracelet",
          title: "Strap / bracelet",
          type: "string",
          description: "e.g. Oyster bracelet, alligator strap.",
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Editorial flag (stored on Watch.featured). UI does not surface it yet.",
      initialValue: false,
    }),
    defineField({
      name: "isNewArrival",
      title: "New arrival",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isLimitedEdition",
      title: "Limited edition",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "collection", media: "image" },
  },
});
