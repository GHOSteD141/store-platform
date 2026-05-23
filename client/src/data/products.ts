export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  heroImage?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  collection: string;
  price: number;
  description: string;
  longDescription: string;
  materials: string;
  dimensions?: string;
  images: string[];
  featured?: boolean;
  new?: boolean;
}

export const collections: Collection[] = [
  {
    id: "crystals",
    name: "Crystals",
    slug: "crystals",
    description: "Polished points, spheres, and tumbled stones",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=1920&q=80",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    slug: "bracelets",
    description: "Wearable energy for everyday intention",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&q=80",
  },
  {
    id: "raw-stones",
    name: "Raw Stones",
    slug: "raw-stones",
    description: "Untouched beauty straight from the earth",
    image: "https://images.unsplash.com/photo-1587301669258-467f50dfa5b4?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1587301669258-467f50dfa5b4?w=1920&q=80",
  },
  {
    id: "crystal-trees",
    name: "Crystal Trees",
    slug: "crystal-trees",
    description: "Sculptural wire trees bearing gemstone leaves",
    image: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1920&q=80",
  },
  {
    id: "recommended",
    name: "Recommended",
    slug: "recommended",
    description: "Our most loved and highly sought pieces",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1920&q=80",
  },
  {
    id: "others",
    name: "Others",
    slug: "others",
    description: "Unique spiritual tools and accessories",
    image: "https://images.unsplash.com/photo-1603704235478-f682d338f9b9?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1603704235478-f682d338f9b9?w=1920&q=80",
  },
];

// PLaceholder products so your frontend grid doesn't break
export const products: Product[] = [
  {
    id: "amethyst-cluster",
    name: "Raw Amethyst Cluster",
    slug: "raw-amethyst-cluster",
    collection: "raw-stones",
    price: 4500,
    description: "Deep purple druzy cluster for calming energy",
    longDescription: "This raw Amethyst cluster features deep, vibrant purple points. Perfect for meditation spaces or bedside tables, Amethyst is known for its calming properties and ability to enhance intuition.",
    materials: "Natural Amethyst from Uruguay",
    dimensions: "Approx. 4x3 inches",
    images: [
      "https://images.unsplash.com/photo-1587301669258-467f50dfa5b4?w=800&q=80",
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800&q=80",
    ],
    featured: true,
  },
  {
    id: "rose-quartz-bracelet",
    name: "Rose Quartz Beaded Bracelet",
    slug: "rose-quartz-bracelet",
    collection: "bracelets",
    price: 850,
    description: "8mm genuine rose quartz beads",
    longDescription: "A gentle, loving energy surrounds this Rose Quartz bracelet. Hand-strung with high-quality 8mm beads, it serves as a daily reminder to practice unconditional love and compassion.",
    materials: "Natural Rose Quartz, elastic cord",
    dimensions: "7.5 inch stretch fit",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800&q=80",
    ],
    new: true,
  },
  {
    id: "citrine-tree",
    name: "Prosperity Citrine Tree",
    slug: "prosperity-citrine-tree",
    collection: "crystal-trees",
    price: 2200,
    description: "Copper wire tree with citrine gemstone leaves",
    longDescription: "Hand-twisted copper wire forms the trunk of this beautiful decorative tree, while hundreds of genuine Citrine chips act as the leaves. Citrine is widely known as the stone of abundance and manifestation.",
    materials: "Copper wire, natural Citrine chips, wooden base",
    dimensions: "8 inches tall",
    images: [
      "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=800&q=80",
      "https://images.unsplash.com/photo-1587301669258-467f50dfa5b4?w=800&q=80",
    ],
    featured: true,
  },
  {
    id: "clear-quartz-point",
    name: "Clear Quartz Generator",
    slug: "clear-quartz-generator",
    collection: "crystals",
    price: 1500,
    description: "Polished clear quartz standing point",
    longDescription: "A highly clear, polished Quartz generator. Known as the 'Master Healer', Clear Quartz amplifies energy and thought, making it an essential piece for any collection.",
    materials: "Natural Clear Quartz",
    dimensions: "3 inches tall",
    images: [
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800&q=80",
      "https://images.unsplash.com/photo-1587301669258-467f50dfa5b4?w=800&q=80",
    ],
    new: true,
  }
];

export const getProductsByCollection = (collectionSlug: string): Product[] => {
  return products.filter((product) => product.collection === collectionSlug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getNewProducts = (): Product[] => {
  return products.filter((product) => product.new);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug);
};

export const getCollectionBySlug = (slug: string): Collection | undefined => {
  return collections.find((collection) => collection.slug === slug);
};

export const getRelatedProducts = (productId: string, limit = 4): Product[] => {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];
  
  return products
    .filter((p) => p.collection === product.collection && p.id !== productId)
    .slice(0, limit);
};