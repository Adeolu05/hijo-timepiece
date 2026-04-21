/** Customer-facing availability; drives storefront badges and cart eligibility. */
export type WatchAvailability = "available" | "out-of-stock" | "pre-order";

/** Domain model for catalog + cart. `id` is always the public slug (URL segment), never Sanity `_id`. */
export interface Watch {
  id: string;
  name: string;
  collection: string;
  /** Optional merchandising tag (e.g. men / women) for future filters; not required by current UI. */
  category?: string;
  /** Nominal amount in NGN (Nigerian naira). */
  price: number;
  image: string;
  description: string;
  specs: {
    movement: string;
    case: string;
    powerReserve: string;
    waterResistance: string;
    strapOrBracelet: string;
  };
  images: string[];
  /** Editorial flag from Sanity; optional until the UI uses it. */
  featured?: boolean;
  isNewArrival?: boolean;
  isLimitedEdition?: boolean;
  /** May be absent on older persisted cart payloads; use `resolveWatchAvailability` when rendering. */
  availability?: WatchAvailability;
  /** Optional internal cap for order quantity; not shown on the storefront. */
  stockQuantity?: number;
  /**
   * @deprecated Old field name; only present in persisted carts from before availability.
   * Prefer `stockQuantity` + `availability`.
   */
  stock?: number;
}

export const WATCHES: Watch[] = [
  {
    id: "vanguard-skeleton",
    name: "Vanguard Skeleton",
    collection: "Tourbillon Collection",
    price: 42500,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8VB9aoPCJH7Pvk6Pv8ZR84HHVqtE6D5v3oQGsMcHY71qnbN1-8MUh9bE69lZ_VXTv14UQgoY9wOQnTjF-ukc89BUq7KIxFtLdWzRm5pQZWV7ixcxHk_NkLtTvcgpLJEzWErgitbDAegFjQU85gLcpu6q3Tp5DhflvrO0j8SRajLVhpeC5Hp7BC0TF7vH4-Ib1JUTC1BkgpPFh3Ft92k-S22Up2r1frxi3e0pgXNQMIyq9F-QTHcuSDmfBXMgP1FIj9QcnaiMOdLT",
    description:
      "An exquisite masterwork of horological architecture. The Vanguard Skeleton features an intricate, open-worked dial that meticulously unveils the silent, synchronized dance of precision engineering. Hand-finished and encased in 18k rose gold, it is a statement of technical mastery for the modern curator.",
    specs: {
      movement: "Manual Wind Calibre 402",
      case: "18k Rose Gold / 42mm",
      powerReserve: "72-Hour Reserve",
      waterResistance: "50 Meters / 5 ATM",
      strapOrBracelet: "Alligator leather strap",
    },
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHaVLkqqVYW1ZDHXdIeCDTqPcU940ilwJTTzjMWhBuaOdrho35qQpekKuM7tU72Gcu0HjoZAvc-oPwU6Shm_BMIYzvJ4aoZgh-jz5f5uEngFbCFpS4b6utvy4GBksUvZhEh9TLO6l5egWOTS0RMh_HseFfOxOwNmbX8OVTj4m2SRboStBvwa3gPBUqCrFRNi-j03jwUClowSTInO3JJgMaOCc3cddb-xQlY60jkBnxhVFosvQID4qsNGWwW4_ag83H2msBo3PeOveg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUF81IXMCneycBr0o3tn15i_0pWJ1hYLAOxcJBJR-8q88nO-ZuB4fIAk9VAu3kifhejKXAuL5m6pq6NFqozD5E0_cQXpJynYWz1-TLpqNBRjSYGQCarq21WQNEme3tDack53Cv4XS-S5HhtPc7SaqeS-iFcjcrqyYgl-vonN-S9mR5_wv35GqT_CjWvSBjYuQJ7lyccx0IVemGKfTNhE5FyNOcyyKMh_bxSufSMSYV4kwYDwN_ppj05FRVOMCE6ey4hoWJqUKVrQT1",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9KODfTeUePf5XZbVZ3kx5hjbpiMDP4-vHjbkTGbpQzxTZsFWul2_ZySPx93vLSdi6DofLt7LzV_zZRwIhqFpJIa0heVHox-oL66gNKG4PMefpIVhs0L8KWmP5CfV_xTyLp4I2TrOoTmZG110JCd2EUoHalUz2k3CF7YA0-UMVDpXLLoQlaxEdwg-FWpJfTvP5IzmyIZL7cZtg6A8dbALgQYkwxChU5H_GRHZS7365I3Di_q_QtAnQoG7KyrwE10qV6kZ-pvBKXxN6",
    ],
    isLimitedEdition: true,
    availability: "available",
    stockQuantity: 2,
  },
  {
    id: "heritage-chrono-1954",
    name: "Heritage Chrono 1954",
    collection: "Historical Archives",
    price: 18900,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkUOqC9Nsp3CRPpunTaJmYkicaMMjDnetG5NnnYsTpWMbDOhBqp0bpITQgL8fpR9tGu5Z88Qp8XLeyWOYcTQbyQbHMftM4C57X3puOJ8po0Z0CC7jO2Uae1dEVSeRgvF7Kh9lWnJMpwzlGnWu2p73y9ORayOuUw8HsV7P3aXLb1YSGIOQWHaCvxxDvXcTkpwNaz_6exozTSwvxE562ee6Lh6p6LBjbSi3pw5978kEXe89HaAa0fdxJ97n8_m51uJuWos6ASrm9IJYs",
    description: "A faithful recreation of our most iconic mid-century chronograph.",
    specs: {
      movement: "Automatic Chronograph Calibre 201",
      case: "Stainless Steel / 39mm",
      powerReserve: "48-Hour Reserve",
      waterResistance: "30 Meters / 3 ATM",
      strapOrBracelet: "Stainless steel bracelet",
    },
    images: [],
    availability: "available",
    stockQuantity: 15,
  },
  {
    id: "royal-oak-gold",
    name: "Royal Oak Gold",
    collection: "Precious Metals",
    price: 64000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcJnyLalxYWSvDaHX_IVm9bLCA6KOU6jy3MPX9nMa-xlD_OFJhYKUvyVdRXV5ii5K7v2t33rbTEcnRHxTElB2co3GpXdWyPCsu5-wAxWsysJvK9YcKLxiRJygvKXPPe9mWItQ1iP2LWHOM38QePMVkR93d0rtKUO7ycUE1fbUSqW7wiwCi9nZJX3sc6HW60ZA3s5PADhxCMIRklHowE1jHgOoXlNERCEYJz54D5oTwqVhCQ9a0VZ3hMoXb57JlTq-OkC4Zt1aQxEfG",
    description: "The epitome of luxury sports watches, crafted entirely in 18k yellow gold.",
    specs: {
      movement: "Automatic Calibre 3120",
      case: "18k Yellow Gold / 41mm",
      powerReserve: "60-Hour Reserve",
      waterResistance: "50 Meters / 5 ATM",
      strapOrBracelet: "Integrated 18k yellow gold bracelet",
    },
    images: [],
    availability: "out-of-stock",
  },
  {
    id: "lumina-gmt",
    name: "Lumina GMT",
    collection: "Steel & Precision",
    price: 8200,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPlkpIJXC6BG1wu3UhUoldfk5EqWmIu6w0zVEf2Y89WqgTw3Cxapdc9ui_tWbFdJnnpDttxEzHxQiPCMmhurYmyF0y8zc1Fkggwk_8Qqsh5srzmRFORL2R3miSSXDifCvwfXIKZwA9XlB8heJOWSlLIJ9NcAW1-i6FqXQeW5FZgcTkMSHm_aaX6u_YH63DesWWhtO4Sg-sxkecy8M-l1ZWByAFd_arzE92JGN4030ARTYcRXDiqRyga2j4qOY3q1hd2_SxlQOq7Vzn",
    description: "A modern traveler's companion featuring a dual-time zone complication.",
    specs: {
      movement: "Automatic GMT Calibre 505",
      case: "Stainless Steel / 40mm",
      powerReserve: "50-Hour Reserve",
      waterResistance: "100 Meters / 10 ATM",
      strapOrBracelet: "Oyster-style steel bracelet",
    },
    images: [],
    availability: "available",
    stockQuantity: 8,
  },
  {
    id: "obsidian-skeleton",
    name: "Obsidian Skeleton",
    collection: "The Modernist",
    price: 18600,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtK-NyC5uy_PF0w1JygXz5p0tttWTmBhzY8vItCAys-_RMhA3m6ML1r6_TrFdftSw2fX5IapKGIS5AFGhP3VhbfxWx64WOrLkOIiP0tmsZIsvB-Mt3MdmtjNBxuJa9KwywSWER8SKUtwXfhOnJYf6LSWOknQmzMuUrD8EMbvjFQkDVjQopxpZAJi_ZNTxUkXfdqUThYa1C1HDDUWNxZ6jTOAN3RQ1_KxdKcMl6keOZRaNElqNQ0O64CNfjUvp8AIeYvTlZCWQYM0_",
    description: "A stealthy, ultra-modern take on the skeletonized movement.",
    specs: {
      movement: "Manual Wind Calibre 402-B",
      case: "Black Ceramic / 42mm",
      powerReserve: "72-Hour Reserve",
      waterResistance: "50 Meters / 5 ATM",
      strapOrBracelet: "Rubber strap",
    },
    images: [],
    availability: "pre-order",
    stockQuantity: 4,
  },
  {
    id: "selene-moonphase",
    name: "Selene Moonphase",
    collection: "Complications",
    price: 15800,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXsgZ0eRKJwea8U0rh1m1ZKFJbuwQ2gxwbPqK0p1wmN9aktca3Jujh1XJZGH3z3YY8WpcWMIhdl7A72p_UDkqsf-snE4YCzvaWeFHioT1ZtyPl_hr01_oUO6y5lCSyKVH378El-zoxcuUyPLdSA50y3sCBi8opUFYboeRBxYuXPyh5ekjBkbwoV_aL6d48qgdHWUv55fNLXCqD7C89yKcXlYcinWRL0RdtaNEBdgthEA_BNSEIkO_lmX25nr0sKefc--hZMzGZSuEb",
    description: "Poetic complication displaying the lunar cycle with astronomical precision.",
    specs: {
      movement: "Automatic Calibre 909",
      case: "18k White Gold / 38mm",
      powerReserve: "48-Hour Reserve",
      waterResistance: "30 Meters / 3 ATM",
      strapOrBracelet: "Satin strap",
    },
    images: [],
    availability: "available",
    stockQuantity: 6,
  },
  {
    id: "deep-sea-master",
    name: "Deep Sea Master",
    collection: "The Explorer",
    price: 7500,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuXl6HK9v29VXzB-qEVM1QuGcyOVPUKS3zp5GN8xMrnJwcbQw4ps9joiQLzRB1j0CXshxgrlyMCA0IlVyiijvs19JhZ9hDe5DPirSZu4NkxOKm5wcYR-uQ09C7H0BkVmYZfH82epHx17HoBCpM4Ax9WOiozCiC-lhvYJKNX6eBXvrygR60M-_2sAFHPQ79gaqUXXIE4fziv1zk7AjSs50yI6wve3WDYgCL0nCH0Dt7SbZUvdKxoqKNdV1Rz9A9hHpxT3czPTeeme7R",
    description: "A professional dive watch built for the most extreme conditions.",
    specs: {
      movement: "Automatic Calibre 300",
      case: "Titanium / 43mm",
      powerReserve: "60-Hour Reserve",
      waterResistance: "300 Meters / 30 ATM",
      strapOrBracelet: "Titanium bracelet",
    },
    isNewArrival: true,
    images: [],
    availability: "available",
    stockQuantity: 22,
  },
  {
    id: "monolith-gold",
    name: "Monolith Gold",
    collection: "Essentialism",
    price: 9800,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCktuEuS0-ZK8gZwk5ZeAEF2w2tksZjav5neBIi22eiVEu5lKi8Ub-ox78mvs8NQjKs2HoTiqin-pjHX9c4NYqtWKeHYgexBYPhweIw7-CPRyvRlKPBnLnWWFNVHxoY8vhWZ_eIxN1lM_N_NcZ82B_oQ7_Yh9yCFEKZXr6Pux4uIxusdQVe7qqFwTXpx4aw0xJ2TU3Qdkge7jnTsEKdfxk9rNAENM0rty10-_BPWA5jSGXZxz4Hc6KOOrwvebqyr2UOz2Hku_C2oEgG",
    description: "The purest expression of timekeeping in a solid gold case.",
    specs: {
      movement: "Manual Wind Calibre 101",
      case: "18k Yellow Gold / 36mm",
      powerReserve: "42-Hour Reserve",
      waterResistance: "30 Meters / 3 ATM",
      strapOrBracelet: "Leather strap",
    },
    images: [],
    availability: "available",
    stockQuantity: 5,
  },
  {
    id: "caliber-800",
    name: "Caliber 800",
    collection: "The Artisan",
    price: 21200,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBw1tqovnETwwH5K9AX3h7uI4Jd9uH83SVzFMbla6c_8qidUNwiY03t3nKj56iq_1ZR98jlBJvskwAGnLqxJhKGj-j-HOEIpl5yntszhPHJ6V9o3Xm2cVWi07O5QwhVkQtbQX0Mofb89h4OlQCVx4qYZDtIt82maIokXQeNM-vyD91LYUdscPJ-PPdXO-HG8hTAFVc5kDiyklsGC9JTAFOYDxNo_fMSvHKtCOwXMkqFgKzPMK40rvXDOWXtv9a-_093Eb0GmuqdAsFa",
    description: "A showcase of traditional hand-finishing techniques on a modern movement.",
    specs: {
      movement: "Manual Wind Calibre 800",
      case: "Platinum / 40mm",
      powerReserve: "120-Hour Reserve",
      waterResistance: "30 Meters / 3 ATM",
      strapOrBracelet: "Alligator strap",
    },
    images: [],
    availability: "available",
    stockQuantity: 1,
  },
];
