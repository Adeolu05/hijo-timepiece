import { defineField, defineType } from "sanity";

export const journalPostType = defineType({
  name: "journalPost",
  title: "Journal post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Public URL: /journal/<slug>",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "string",
      description:
        "Any of: year (2024), year-month (2024-06), or full date (2024-06-15). Legacy datetime values still work.",
      placeholder: "2024 or 2024-06 or 2024-06-15",
      validation: (Rule) =>
        Rule.required().custom((val) => {
          if (val == null || typeof val !== "string") return "Required";
          const v = val.trim();
          if (!v) return "Required";
          if (/^\d{4}$/.test(v)) return true;
          if (/^\d{4}-\d{2}$/.test(v)) {
            const [, m] = v.split("-");
            const mo = parseInt(m, 10);
            if (mo >= 1 && mo <= 12) return true;
            return "Month must be 01–12 (e.g. 2024-03)";
          }
          if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
            const d = new Date(`${v}T12:00:00`);
            if (Number.isNaN(d.getTime())) return "Invalid calendar date";
            return true;
          }
          if (v.includes("T")) {
            const d = new Date(v);
            if (!Number.isNaN(d.getTime())) return true;
          }
          return "Use YYYY, YYYY-MM, or YYYY-MM-DD";
        }),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary for the journal index and SEO.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Images, videos, and text blocks in display order.",
      of: [
        {
          type: "object",
          name: "journalFigure",
          title: "Image & caption",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
        {
          type: "object",
          name: "journalVideo",
          title: "Video",
          fields: [
            defineField({
              name: "url",
              title: "Video URL",
              type: "url",
              description: "YouTube, Vimeo, or direct .mp4 link",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
        {
          type: "object",
          name: "journalText",
          title: "Text",
          fields: [
            defineField({
              name: "text",
              title: "Paragraph",
              type: "text",
              rows: 6,
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "coverImage" },
  },
  orderings: [
    {
      title: "Published date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
