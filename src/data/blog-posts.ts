export interface BlogBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'list' | 'image';
  content?: string;
  items?: string[]; // for lists
  src?: string;     // for images
  alt?: string;     // for images
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  readTime: string;
  image: string;
  tags: string[];
  blocks: BlogBlock[];
  adProductId?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-clean-oily-skin-stop-pimples-naturally',
    title: 'How to Clean Oily Skin and Stop Pimples Naturally in Summer | Pureable',
    description: 'Struggling with grease and acne breakout this summer? Discover how pure natural botanical ingredients like Tea Tree and Neem clarify your pores.',
    publishDate: '2026-05-29',
    author: {
      name: 'Dr. Ananya Mehta',
      role: 'Chief Formulation Scientist',
    },
    readTime: '5 min read',
    image: '/images/blog/teatree-acne-treatment.png',
    tags: ['Skincare', 'Tea Tree', 'Acne Care'],
    adProductId: '3e0fd1a2-95d9-4cd1-a0ad-c5eb5a03d870', // Herbs & Hills Clarifying Tea Tree Face Wash
    blocks: [
      {
        type: 'paragraph',
        content: 'As temperatures rise and summer sets in, many of us face a familiar, frustrating battle: an overproduction of facial oil and the inevitable acne breakouts that follow. While oily skin is common, managing it doesn\'t require aggressive chemical treatments that strip your face. Understanding the biological root cause of summer oily skin is the first step toward achieving a clear, radiant complexion naturally.'
      },
      {
        type: 'paragraph',
        content: 'During hot weather, your skin naturally increases sebum production to cool down and protect itself. However, when this excess sebum mixes with summer sweat, environmental pollutants, and dead skin cells, it forms a sticky plug inside your pores. Under these anaerobic conditions, acne-causing bacteria thrive, leading to inflammation, red bumps, and painful cystic pimples.'
      },
      {
        type: 'heading',
        content: 'Why Chemical Sulfates Make Acne Worse'
      },
      {
        type: 'paragraph',
        content: 'When grease builds up, the immediate human instinct is to scrub it away with a powerful, foaming face wash. Unfortunately, the vast majority of commercial cleansers rely on Sodium Lauryl Sulfate (SLS) or Sodium Laureth Sulfate (SLES) to create that squeaky-clean lather. These harsh detergents act like dish soap, stripping away your skin\'s natural moisture barrier.'
      },
      {
        type: 'paragraph',
        content: 'When the skin\'s protective lipid barrier is stripped, the body receives an emergency signal that the surface is dangerously dry. In response, your sebaceous glands go into overdrive, producing even more sebum to replenish the lost moisture. This creates a destructive cycle of extreme dryness followed by severe oiliness, worsening breakouts and leaving the skin highly sensitized.'
      },
      {
        type: 'heading',
        content: 'The Power of Botanical Extraction (Tea Tree & Neem)'
      },
      {
        type: 'paragraph',
        content: 'The key to breaking this cycle is using gentle, bioactive botanicals that cleanse the skin without altering its natural pH or stripping its protective oils. In the realm of natural acne solutions, two plants stand out above all others: Tea Tree and Neem.'
      },
      {
        type: 'list',
        items: [
          'Tea Tree (Melaleuca alternifolia): A clinical-grade essential oil known for its powerful antibacterial properties. It penetrates deep into the pores, neutralizing acne bacteria (P. acnes) and calming redness without the peeling and flaking associated with benzoyl peroxide.',
          'Neem (Azadirachta indica): Renowned in Ayurvedic medicine as a purifying agent. Neem contains Nimbin, which has anti-inflammatory and antiseptic qualities that soothe swollen skin, speed up healing, and help fade post-acne dark spots.',
          'Salicylic Acid (Willow Bark): A natural beta-hydroxy acid (BHA) that is oil-soluble, allowing it to penetrate deep into clogged pores, breaking down dead skin cells and preventing future blackheads.'
        ]
      },
      {
        type: 'heading',
        content: 'Transitioning to a Clean, Toxic-Free Routine'
      },
      {
        type: 'paragraph',
        content: 'Treating summer acne isn\'t about attacking your skin—it\'s about nourishing it. By replacing harsh chemical detergents with botanical formulations, you respect the natural biology of your skin. Over time, your skin\'s moisture barrier heals, sebum production stabilizes, and breakouts clear up naturally.'
      },
      {
        type: 'paragraph',
        content: 'To start your clean beauty transition, swap your sulfate-heavy cleanser for a soap-free, tea tree-infused alternative, hydrate with lightweight non-comedogenic oils, and always protect your skin barrier from harsh environmental stress.'
      }
    ]
  },
  {
    slug: 'science-behind-chemical-free-skincare',
    title: 'The Science Behind Chemical-Free Skincare: What You Need to Know',
    description: 'Explore why choosing organic, toxin-free ingredients is more than just a trend—it\'s a biological necessity for your skin\'s health.',
    publishDate: '2026-05-20',
    author: {
      name: 'Dr. Ananya Mehta',
      role: 'Chief Formulation Scientist',
    },
    readTime: '5 min read',
    image: '/images/blog/chemical-free-skincare.png',
    tags: ['Skincare', 'Clean Beauty', 'Science'],
    adProductId: '3e0fd1a2-95d9-4cd1-a0ad-c5eb5a03d870', // Herbs & Hills Clarifying Tea Tree Face Wash
    blocks: [
      {
        type: 'paragraph',
        content: 'In the modern cosmetics industry, the word "chemical-free" is frequently thrown around. While everything is technically composed of chemicals, what clean beauty advocates truly refer to is the exclusion of synthetic toxins, endocrine disruptors, and harsh environmental pollutants. Your skin is your largest organ, absorbing up to 60% of the products you apply. Here, we delve into the scientific reason why switching to organic, nature-first skincare is vital for your long-term cellular health.'
      },
      {
        type: 'heading',
        content: 'The Dangers of Synthetic Endocrine Disruptors'
      },
      {
        type: 'paragraph',
        content: 'Common skincare products contain parabens, phthalates, and synthetic fragrances that behave like hormones in the body. Phthalates, for instance, are plasticizers used to make fragrances last longer, but they have been linked to hormone disruption. When you apply these chemicals daily, they bioaccumulate in your tissues, leading to chronic low-grade inflammation and hormonal imbalances.'
      },
      {
        type: 'quote',
        content: 'Your skin is not a barrier; it is a sponge. What you put on your body is just as important as what you put inside it.'
      },
      {
        type: 'heading',
        content: 'Supporting Your Skin\'s Natural Acid Mantle'
      },
      {
        type: 'paragraph',
        content: 'Synthetic cleansers often contain Sodium Lauryl Sulfate (SLS), a harsh foaming agent that strips the skin of its natural oils and disrupts the lipid barrier (the acid mantle). This stripping makes the skin susceptible to environmental damage, premature aging, and acne-causing bacteria. Organic formulations use plant-derived glucoside cleansers that gently purify without stripping your natural defense mechanisms.'
      },
      {
        type: 'list',
        items: [
          'Parabens: Used as preservatives, mimic estrogen, and disrupt endocrine functions.',
          'Phthalates: Found in synthetic perfumes, linked to reproductive health issues.',
          'SLS/SLES: Create rich lather but compromise the skin\'s natural protective barrier.',
          'Mineral Oils: Petroleum byproducts that clog pores and inhibit skin cell respiration.'
        ]
      },
      {
        type: 'heading',
        content: 'The Power of Botanical Antioxidants'
      },
      {
        type: 'paragraph',
        content: 'Natural ingredients like cold-pressed rosehip oil, green tea extract, and gotu kola are active antioxidants. These plant compounds donate electrons to neutralize free radicals—unstable molecules caused by UV rays and pollution that degrade collagen and cause wrinkles. Unlike synthetic counterparts, organic botanical nutrients are highly bioavailable, meaning your skin recognizes and absorbs them easily at a cellular level.'
      }
    ]
  },
  {
    slug: 'rosemary-oil-haircare-secrets',
    title: 'Revitalize Your Hair: Essential Rosemary Oil Rituals',
    description: 'Unlock ancient haircare secrets with pure rosemary oil. Learn how to stimulate growth, treat dry scalp, and add lasting shine naturally.',
    publishDate: '2026-05-24',
    author: {
      name: 'Mira Sen',
      role: 'Ayurvedic Wellness Expert',
    },
    readTime: '4 min read',
    image: '/images/blog/haircare-secrets.png',
    tags: ['Haircare', 'Rosemary Oil', 'Rituals'],
    adProductId: 'cc9b3d11-60c8-43bb-92e2-f6aa57cc6ff5', // Herbs & hills Daily Care Hair Oil
    blocks: [
      {
        type: 'paragraph',
        content: 'For centuries, Rosemary (Rosmarinus officinalis) has been celebrated not only as a culinary herb but also as a powerful botanical remedy for the hair and scalp. Modern scientific trials have even compared rosemary oil directly to minoxidil (a popular hair loss treatment), finding that rosemary stimulates hair growth to a similar degree but without the side effects of itching, dryness, and irritation.'
      },
      {
        type: 'heading',
        content: 'How Rosemary Stimulates Hair Growth'
      },
      {
        type: 'paragraph',
        content: 'Rosemary oil contains carnosic acid, a compound known to heal tissue and nerve damage. When applied to the scalp, it improves blood microcirculation, ensuring that hair follicles receive the oxygen and nutrients they need to enter the active growth phase (anagen). Additionally, its anti-inflammatory properties soothe irritated follicles, reducing premature hair fall.'
      },
      {
        type: 'quote',
        content: 'Consistent scalp stimulation combined with active botanicals is the single most effective way to trigger healthy hair regeneration.'
      },
      {
        type: 'heading',
        content: 'The Weekly Scalp Massage Ritual'
      },
      {
        type: 'paragraph',
        content: 'To reap the maximum benefits of rosemary oil, we recommend a simple weekly scalp massage ritual:'
      },
      {
        type: 'list',
        items: [
          'Choose a Carrier: Mix 4-5 drops of organic rosemary essential oil with a tablespoon of cold-pressed jojoba or coconut oil.',
          'Warm Gently: Warm the oil mixture slightly to improve penetration.',
          'Section & Massage: Part your hair into sections. Apply the oil directly to the scalp and massage gently using your fingertips in circular motions for 10 minutes.',
          'Steam: Wrap your hair in a warm, damp towel to open follicles and let the oil penetrate for 30 minutes to an hour.',
          'Wash: Wash thoroughly with a mild, sulfate-free shampoo.'
        ]
      },
      {
        type: 'paragraph',
        content: 'Consistency is key. Performing this ritual twice a week for 3 to 6 months yields visible results, showing thicker hair shafts and a calmer, healthier scalp environment.'
      }
    ]
  },
  {
    slug: 'ayurvedic-rituals-radiant-skin',
    title: 'Ayurvedic Self-Care: Morning Rituals for Radiant Skin',
    description: 'Transform your morning routine with simple, ancient Ayurvedic beauty rituals that nurture both skin and soul.',
    publishDate: '2026-05-28',
    author: {
      name: 'Kabir Dev',
      role: 'Holistic Therapist',
    },
    readTime: '6 min read',
    image: '/images/blog/ayurvedic-rituals.png',
    tags: ['Ayurveda', 'Self-Care', 'Mindfulness'],
    adProductId: '3bb279c9-0a2c-4f12-be9f-9eafbc97bb55', // Herbs & Hills Hydrating Under-Eye Gel
    blocks: [
      {
        type: 'paragraph',
        content: 'In Ayurveda, beauty is not merely skin-deep; it is the outer reflection of inner harmony (Prasana Atma Indriya Manah). Ayurvedic skincare focuses on balancing your unique dosha (Vata, Pitta, or Kapha) through rhythmic daily practices (Dinacharya). By aligning your morning routine with these ancient self-care rituals, you invite radiant vitality into your skin and start your day with calm, grounded energy.'
      },
      {
        type: 'heading',
        content: '1. Abhyanga: The Art of Warm Oil Massage'
      },
      {
        type: 'paragraph',
        content: 'Before showering, take 5-10 minutes to perform Abhyanga, a self-massage with warm, organic oils. Sesame oil is excellent for grounding Vata, cooling coconut oil benefits Pitta, and warm mustard or light jojoba oil balances Kapha. This practice stimulates lymphatic drainage, flushes out toxins, improves skin elasticity, and wraps your nervous system in a cocoon of warmth.'
      },
      {
        type: 'quote',
        content: 'Abhyanga infuses the body with love, calms the mind, and leaves the skin with a luminous, natural glow.'
      },
      {
        type: 'heading',
        content: '2. Snana & Ubtan: The Herbal Cleansing Mask'
      },
      {
        type: 'paragraph',
        content: 'Instead of synthetic soaps, Ayurveda recommends using an Ubtan—a paste made of chickpea flour, sandalwood, turmeric, and raw milk or rosewater. Ubtan gently exfoliates dead skin cells, brightens skin tone, and deeply nourishes without altering your skin\'s natural pH balance. Apply it, let it dry slightly, and wash it off with lukewarm water.'
      },
      {
        type: 'heading',
        content: '3. Gandusha: Oil Pulling for Systemic Detoxification'
      },
      {
        type: 'paragraph',
        content: 'Although oil pulling is an oral hygiene practice, its detoxification effects reflect directly on the skin. Swishing a tablespoon of organic sesame or coconut oil in your mouth for 10-15 minutes pulls out fat-soluble impurities from the oral cavity. This reduces systemic toxicity, which is a primary cause of skin blemishes and puffiness.'
      },
      {
        type: 'list',
        items: [
          'Hydrate: Drink a glass of warm water with lemon to wake up your digestive fire (Agni).',
          'Massage: Spend 5 minutes on Abhyanga using dosha-appropriate oils.',
          'Detoxify: Practice oil pulling (Gandusha) while preparing your bath.',
          'Nourish: Cleanse your face and body with a gentle, freshly mixed herbal Ubtan.',
          'Protect: Spritz pure rosewater to tone, and lock in moisture with a botanical face oil.'
        ]
      }
    ]
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return blogPosts;
}
