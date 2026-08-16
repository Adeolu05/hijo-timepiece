import {defineArrayMember, defineField, defineType} from 'sanity'
import {WATCH_BRAND_OPTIONS} from './watchBrands'

const CODE_PATTERN = /^[A-Z0-9]{3,24}$/

/**
 * Keep in sync with `sanity/schemaTypes/discountCode.ts` at repo root (Vite app GROQ + mapper).
 */
export const discountCodeType = defineType({
  name: 'discountCode',
  title: 'Discount code',
  type: 'document',
  fieldsets: [
    {name: 'offer', title: 'Offer', options: {columns: 2}},
    {name: 'validity', title: 'Validity'},
    {name: 'scope', title: 'Applies to'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      description: 'Studio label only, e.g. “August social 10%”.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      description: 'Customer-facing code. Use uppercase letters and numbers only (e.g. MPDL10).',
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (value == null || typeof value !== 'string') return 'Required'
          const code = value.trim().toUpperCase()
          if (!CODE_PATTERN.test(code)) {
            return 'Use 3–24 letters and numbers only (e.g. MPDL10)'
          }
          const id = context.document?._id?.replace(/^drafts\./, '')
          if (!id) return true
          const client = context.getClient({apiVersion: '2023-05-03'})
          const existing = await client.fetch<number>(
            `count(*[_type == "discountCode" && upper(code) == $code && _id != $id && _id != $draftId])`,
            {code, id, draftId: `drafts.${id}`},
          )
          return existing === 0 || 'This code is already in use'
        }),
    }),
    defineField({
      name: 'discountType',
      title: 'Discount type',
      type: 'string',
      fieldset: 'offer',
      options: {
        list: [
          {title: 'Percent off', value: 'percent'},
          {title: 'Fixed amount (NGN)', value: 'amount'},
        ],
        layout: 'radio',
      },
      initialValue: 'percent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'percentOff',
      title: 'Percent off',
      type: 'number',
      fieldset: 'offer',
      description: '0–100. Applied to the current selling price of eligible watches.',
      hidden: ({document}) => document?.discountType !== 'percent',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.discountType !== 'percent') return true
          if (typeof value !== 'number' || !Number.isFinite(value)) return 'Required'
          if (value <= 0 || value > 100) return 'Must be greater than 0 and at most 100'
          return true
        }),
    }),
    defineField({
      name: 'amountOffNgn',
      title: 'Amount off (NGN)',
      type: 'number',
      fieldset: 'offer',
      description: 'Fixed naira amount off the eligible cart subtotal (cannot exceed that subtotal).',
      hidden: ({document}) => document?.discountType !== 'amount',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.discountType !== 'amount') return true
          if (typeof value !== 'number' || !Number.isFinite(value)) return 'Required'
          if (value <= 0) return 'Must be greater than 0'
          return true
        }),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      fieldset: 'validity',
      description: 'Paused codes stay in history but cannot be applied. Unpublish to hide from the site.',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Paused', value: 'paused'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid from',
      type: 'datetime',
      fieldset: 'validity',
      options: {timeFormat: 'HH:mm'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid until',
      type: 'datetime',
      fieldset: 'validity',
      description: 'The storefront rejects the code after this instant (client clock).',
      options: {timeFormat: 'HH:mm'},
      validation: (Rule) =>
        Rule.required().custom((endDate, context) => {
          const startDate = context.document?.validFrom
          if (
            typeof startDate === 'string' &&
            typeof endDate === 'string' &&
            new Date(endDate) <= new Date(startDate)
          ) {
            return 'Valid until must be after valid from'
          }
          return true
        }),
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'string',
      fieldset: 'scope',
      options: {
        list: [
          {title: 'All watches', value: 'all'},
          {title: 'Selected brands', value: 'brands'},
          {title: 'Selected watches', value: 'watches'},
        ],
        layout: 'radio',
      },
      initialValue: 'brands',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eligibleBrands',
      title: 'Eligible brands',
      type: 'array',
      fieldset: 'scope',
      of: [defineArrayMember({type: 'string'})],
      options: {list: [...WATCH_BRAND_OPTIONS]},
      hidden: ({document}) => document?.scope !== 'brands',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.scope !== 'brands') return true
          if (!Array.isArray(value) || value.length === 0) return 'Select at least one brand'
          return true
        }),
    }),
    defineField({
      name: 'eligibleWatches',
      title: 'Eligible watches',
      type: 'array',
      fieldset: 'scope',
      of: [defineArrayMember({type: 'reference', to: [{type: 'watch'}]})],
      hidden: ({document}) => document?.scope !== 'watches',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.scope !== 'watches') return true
          if (!Array.isArray(value) || value.length === 0) return 'Select at least one watch'
          return true
        }),
    }),
    defineField({
      name: 'excludedWatches',
      title: 'Excluded watches',
      type: 'array',
      fieldset: 'scope',
      description: 'Optional carve-outs inside an all-watches or brand campaign.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'watch'}]})],
      hidden: ({document}) => document?.scope === 'watches',
    }),
    defineField({
      name: 'storefrontNote',
      title: 'Storefront note',
      type: 'string',
      description: 'Optional line shown under the applied code in the cart.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      code: 'code',
      discountType: 'discountType',
      percentOff: 'percentOff',
      amountOffNgn: 'amountOffNgn',
      status: 'status',
      validUntil: 'validUntil',
    },
    prepare({title, code, discountType, percentOff, amountOffNgn, status, validUntil}) {
      const offer =
        discountType === 'amount' && typeof amountOffNgn === 'number'
          ? `NGN ${amountOffNgn}`
          : typeof percentOff === 'number'
            ? `${percentOff}%`
            : ''
      const until =
        typeof validUntil === 'string' && validUntil.length >= 10 ? `until ${validUntil.slice(0, 10)}` : ''
      return {
        title: (typeof code === 'string' && code.trim()) || title,
        subtitle: [offer, status, until].filter(Boolean).join(' · '),
      }
    },
  },
})
