import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, Search, ArrowRight, Star, RefreshCw, BarChart2, 
  Sparkles, ShieldAlert, Award, FileText, Info, Trash2, Edit2, Plus, 
  ExternalLink, User, Check, X, Clipboard, HelpCircle, Activity,
  Coins, Lock, TrendingUp, ChevronRight
} from 'lucide-react';

// Interfaces mapping database schema
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  review_count: number;
  trust_score: number;
  authenticity_score: number;
  transparency_score: number;
  warranty_score: number;
  complaint_rate: number;
  return_rate: number;
  verified_review_rate: number;
  is_sponsored: boolean;
  is_premium_only: boolean;
  trusted_circle_score?: number;
  trusted_circle_activity?: { friends: number; purchased: number; mentors: number; experts: number };
  trusted_circle_feed?: Array<{ id: string; author: string; role: string; text: string }>;
}

interface Brand {
  id: string;
  brand_name: string;
  credibility_score: number;
  transparency_score: number;
  website: string;
  verified: boolean;
  years_in_business: number;
  warranty_policy: string;
  customer_service_score: number;
  transparency_rating: string;
  value_for_money?: number;
  advantages?: string[];
  disadvantages?: string[];
  trusted_circle_activity?: { friends: number; purchased: number; mentors: number; experts: number };
  trusted_circle_score?: number;
  journey?: { year: number; score: number }[];
  status?: string;
  accountability?: { expectations: number; repurchase: number; promises: number };
  insights?: string;
  weight_breakdown?: { verification: number; sat: number; transparency: number; consistency: number; community: number; maturity: number; circle: number };
  associated_products?: string[];
  trust_score?: number;
  scam_risk?: string;
  scam_risk_description?: string;
  scam_risk_level?: 'safe' | 'warning' | 'danger';
}

const fakeHiddenGems: Brand[] = [
  {
    id: "hg_1",
    brand_name: "GlowNest",
    credibility_score: 94,
    transparency_score: 96,
    website: "https://glownest.co",
    verified: true,
    years_in_business: 4,
    warranty_policy: "2 Year Clean-Ingredient & Freshness Guarantee",
    customer_service_score: 96,
    transparency_rating: "A+",
    value_for_money: 89,
    advantages: ["100% certified bio-derived ingredients", "Open-source batch testing logs and lab certificates", "Excellent dermatological ratings with zero reported adverse indicators"],
    disadvantages: ["Slightly higher premium pricing tier", "Limited batch runs occasionally lead to pre-order delays"],
    trusted_circle_activity: { friends: 8, purchased: 22, mentors: 4, experts: 6 },
    trusted_circle_score: 94,
    journey: [{ year: 2024, score: 89 }, { year: 2025, score: 91 }, { year: 2026, score: 94 }],
    status: "Stable",
    accountability: { expectations: 95, repurchase: 96, promises: 94 },
    insights: "GlowNest has set the benchmark for clean beauty by publishing full third-party chromatographic testing logs for every batch.",
    weight_breakdown: {
      verification: 98,
      sat: 96,
      transparency: 96,
      consistency: 93,
      community: 95,
      circle: 94,
      maturity: 85
    },
    scam_risk: "Very Low",
    scam_risk_description: "Fully verified brand footprint. Lab registries are transparent and third-party audited.",
    scam_risk_level: "safe"
  },
  {
    id: "hg_2",
    brand_name: "HerbAura",
    credibility_score: 91,
    transparency_score: 93,
    website: "https://herbaura.in",
    verified: true,
    years_in_business: 5,
    warranty_policy: "1 Year Pure-Extract Performance Pledge",
    customer_service_score: 92,
    transparency_rating: "A",
    value_for_money: 91,
    advantages: ["Sustainably harvested Himalayan herbs", "Carbon-neutral zero-plastic packaging", "Direct-to-consumer ethical fair-trade supply loops"],
    disadvantages: ["Slight natural scent variance between seasonal batches", "Relatively slow standard delivery logs"],
    trusted_circle_activity: { friends: 5, purchased: 18, mentors: 3, experts: 5 },
    trusted_circle_score: 92,
    journey: [{ year: 2024, score: 86 }, { year: 2025, score: 89 }, { year: 2026, score: 91 }],
    status: "Stable",
    accountability: { expectations: 92, repurchase: 91, promises: 90 },
    insights: "HerbAura excels in publishing geographic harvest origin trails for every botanical formulation.",
    weight_breakdown: {
      verification: 95,
      sat: 92,
      transparency: 93,
      consistency: 90,
      community: 91,
      circle: 92,
      maturity: 88
    },
    scam_risk: "Very Low",
    scam_risk_description: "Direct agricultural tie-ins with certified fair trade farms. Audits show high organic consistency.",
    scam_risk_level: "safe"
  },
  {
    id: "hg_3",
    brand_name: "AuraWell",
    credibility_score: 88,
    transparency_score: 89,
    website: "https://aurawell.org",
    verified: true,
    years_in_business: 3,
    warranty_policy: "3 Year Wellness Alignment Guarantee",
    customer_service_score: 89,
    transparency_rating: "B+",
    value_for_money: 87,
    advantages: ["Hypoallergenic organic materials used", "Custom app wellness synchronization without lock-in subscriptions", "Excellent 24/7 consumer chat support resolution"],
    disadvantages: ["Integration is highly optimized for local protocols only"],
    trusted_circle_activity: { friends: 4, purchased: 11, mentors: 2, experts: 3 },
    trusted_circle_score: 88,
    journey: [{ year: 2024, score: 83 }, { year: 2025, score: 85 }, { year: 2026, score: 88 }],
    status: "Improving",
    accountability: { expectations: 89, repurchase: 88, promises: 87 },
    insights: "AuraWell has quickly established itself as a leading trust provider of ethical wellness and fitness trackers.",
    weight_breakdown: {
      verification: 90,
      sat: 89,
      transparency: 89,
      consistency: 87,
      community: 88,
      circle: 88,
      maturity: 70
    },
    scam_risk: "Very Low",
    scam_risk_description: "No registry compliance delays. Consistent positive support reports.",
    scam_risk_level: "safe"
  },
  {
    id: "hg_dyson",
    brand_name: "Dyson",
    credibility_score: 92,
    transparency_score: 90,
    website: "https://dyson.in",
    verified: true,
    years_in_business: 33,
    warranty_policy: "5 Year Direct Mechanical Parts and Engineering Warranty",
    customer_service_score: 94,
    transparency_rating: "A",
    value_for_money: 82,
    advantages: [
      "Revolutionary styling engineering and air multipliers",
      "Quick direct replacement and direct-to-home technician site audits",
      "Excellent 2-year and 5-year solid customer warranty compliance lines"
    ],
    disadvantages: [
      "Extremely premium pricing thresholds across all offerings",
      "Occasional replacement filter backorders in selective regional areas"
    ],
    trusted_circle_activity: { friends: 14, purchased: 9, mentors: 6, experts: 11 },
    trusted_circle_score: 91,
    journey: [{ year: 2024, score: 89 }, { year: 2025, score: 91 }, { year: 2026, score: 92 }],
    status: "Stable",
    accountability: { expectations: 94, repurchase: 95, promises: 93 },
    insights: "Dyson holds an outstanding trust premium in India for high-quality engineering, reliable warranties, and authentic customer satisfaction ratings.",
    weight_breakdown: {
      verification: 96,
      sat: 94,
      transparency: 90,
      consistency: 93,
      community: 92,
      circle: 91,
      maturity: 95
    },
    associated_products: ["Hair Care", "Air Purifiers", "Vacuum Cleaners", "Electronics"],
    scam_risk: "Very Low",
    scam_risk_description: "Fully verified multinational hardware presence. Verified retail registers and real manufacturing compliance tracking on corporate layers.",
    scam_risk_level: "safe"
  }
];

interface UserSession {
  id: string;
  username: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

interface Review {
  id: string;
  product_id: string;
  rating: number;
  author: string;
  verified: boolean;
  review_text: string;
}

export default function App() {
  // Navigation & Frame parameters
  const [currentTab, setCurrentTab] = useState<'home' | 'directory' | 'compare' | 'transparency' | 'top_trusted' | 'chat' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [clickMetrics, setClickMetrics] = useState<{ [key: string]: number }>({});
  
  // Auth states
  const [user, setUser] = useState<UserSession | null>(null);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '', isRegister: false });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');

  // App UI feedback states
  const [affiliateNotification, setAffiliateNotification] = useState<{ product: string, platform: string, count: number } | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<'metrics' | 'circle'>('metrics');
  const [votedProductAspects, setVotedProductAspects] = useState<{ [key: string]: boolean }>({});
  const [compareList, setCompareList] = useState<string[]>([]);
  
  // Brand specific search & comparison states
  const [compareBrandsList, setCompareBrandsList] = useState<string[]>([]);
  const [selectedBrandOverview, setSelectedBrandOverview] = useState<Brand | null>(null);
  const [expandedBrandComponents, setExpandedBrandComponents] = useState<string | null>(null);
  const [votedAspects, setVotedAspects] = useState<{ [key: string]: boolean }>({});
  const [isVotingLoader, setIsVotingLoader] = useState<{ [key: string]: boolean }>({});
  const [directoryMode, setDirectoryMode] = useState<'brands' | 'never_render_appliances'>('brands');
  const [compareViewMode, setCompareViewMode] = useState<'brands' | 'never_render_appliances'>('brands');

  // Review submission state
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, text: '', verified: true });
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // AI Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am **Vouch AI**, your DTC brand trust and credibility advisor. Ask me anything like:\n\n* *'Which skincare brands are highly trusted?'*\n* *'Is Dyson's customer service score better than other electronics brands?'*\n* *'Recommend some ethical home goods small businesses.'*\n\nI parse real, verified credibility ratings, review bot indicators, and customer circle score algorithms to keep you safe!"
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Admin Dashboard Add Form State
  const [adminProductForm, setAdminProductForm] = useState({
    name: '', brand: '', category: 'Skincare & Cream', description: '', price: 0,
    rating: 4.5, trust_score: 90, authenticity_score: 90, transparency_score: 85,
    warranty_score: 90, complaint_rate: 1.5, return_rate: 2.0, verified_review_rate: 90,
    is_sponsored: false, is_premium_only: false
  });
  const [adminBrandForm, setAdminBrandForm] = useState({
    brand_name: '', credibility_score: 85, transparency_score: 80, website: '', verified: true,
    years_in_business: 10, warranty_policy: '1 Year Brand Warranty', customer_service_score: 85,
    transparency_rating: 'A'
  });
  const [adminEditId, setAdminEditId] = useState<string | null>(null);

  // Categories helper suited for clean brands
  const categoriesList = ['All', 'Clean Skincare', 'Hair Care', 'Beauty & Cosmetics', 'Electronics', 'Herbal Remedies', 'Wearables', 'Home Goods', 'Beverages', 'Sustainable Textiles'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load app data from local Express APIs
  const fetchAllData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      setProducts(prodData);

      const brandRes = await fetch('/api/brands');
      const brandData = await brandRes.json();
      const mergedBrands = [...brandData];
      fakeHiddenGems.forEach(fake => {
        if (!mergedBrands.some(b => b.id === fake.id)) {
          mergedBrands.push(fake);
        }
      });
      setBrands(mergedBrands);

      const revRes = await fetch('/api/reviews');
      const revData = await revRes.json();
      setReviews(revData);

      const savedRes = await fetch('/api/saved');
      const savedData = await savedRes.json();
      setSavedProducts(savedData);

      const clickRes = await fetch('/api/affiliate/clicks');
      const clickData = await clickRes.json();
      setClickMetrics(clickData);
    } catch (e) {
      console.error("Error communicating with backend Express API:", e);
    }
  };

  // Dynamic brand voting callback
  const handleBrandVote = async (brandId: string, aspect: 'expectations' | 'repurchase' | 'promises', isPositive: boolean) => {
    const key = `${brandId}_${aspect}`;
    if (votedAspects[key]) {
      alert("You have already voted on this aspect today!");
      return;
    }
    
    setIsVotingLoader(prev => ({ ...prev, [key]: true }));

    try {
      const res = await fetch('/api/brands/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, aspect, isPositive })
      });
      const data = await res.json();
      if (data.success) {
        setBrands(data.brands);
        setProducts(data.products);
        setVotedAspects(prev => ({ ...prev, [key]: true }));
        
        // If overview open, sync with updated state
        if (selectedBrandOverview && selectedBrandOverview.id === brandId) {
          const updatedBrand = data.brands.find((b: Brand) => b.id === brandId);
          if (updatedBrand) {
            setSelectedBrandOverview(updatedBrand);
          }
        }
      }
    } catch (err) {
      console.error("Error updating dynamic accountability metrics:", err);
    } finally {
      setIsVotingLoader(prev => ({ ...prev, [key]: false }));
    }
  };

  // Compare brand toggle
  const handleToggleCompareBrand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareBrandsList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 brands simultaneously.");
        return prev;
      }
      return [...prev, id];
    });
  };

  // Dynamic Brand Filter & Relevance Sort engine
  const getSearchedBrands = () => {
    const lowerSearch = searchQuery.toLowerCase().trim();
    
    // Base category listing map
    const categoryQueryMap: { [key: string]: string } = {
      'Clean Skincare': 'skincare',
      'Hair Care': 'hair care',
      'Beauty & Cosmetics': 'beauty',
      'Herbal Remedies': 'remedies',
      'Wearables': 'wearables',
      'Home Goods': 'goods',
      'Beverages': 'beverages',
      'Sustainable Textiles': 'textiles',
      'Electronics': 'electronics'
    };

    if (!lowerSearch) {
      // Filter only by category tab if search query is empty
      if (selectedCategory === 'All') {
        const sorted = [...brands];
        sorted.sort((a, b) => b.credibility_score - a.credibility_score);
        return sorted;
      }
      const matched = brands.filter(b => {
        const associates = b.associated_products?.map(p => p.toLowerCase()) || [];
        const targetWord = categoryQueryMap[selectedCategory]?.toLowerCase() || selectedCategory.toLowerCase();
        return associates.some(assoc => assoc.includes(targetWord) || targetWord.includes(assoc));
      });
      matched.sort((a, b) => b.credibility_score - a.credibility_score);
      return matched;
    }

    // Comprehensive case-insensitive partial-match search across brand fields
    const matchedBrands = brands.filter(b => {
      const name = b.brand_name.toLowerCase();
      const associates = b.associated_products?.map(p => p.toLowerCase()) || [];
      const insights = (b.insights || "").toLowerCase();
      const risk = (b.scam_risk || "").toLowerCase();
      const warranty = (b.warranty_policy || "").toLowerCase();

      // Explicitly map search keywords & tags per brand for bulletproof relevance
      const brandKeywords: string[] = [];
      const brandTags: string[] = [];

      if (name.includes("dyson")) {
        brandKeywords.push("hair", "haircare", "beauty", "electronics", "dryer", "fans", "purifier", "styling", "hair care", "vacuum");
        brandTags.push("Premium", "Engineering", "High-Tech", "Trusted");
      } else if (name.includes("tresemme")) {
        brandKeywords.push("hair", "haircare", "hair care", "beauty", "shampoo", "conditioner", "salon");
        brandTags.push("Salon-grade", "Professional");
      } else if (name.includes("dove")) {
        brandKeywords.push("hair", "haircare", "hair care", "beauty", "skincare", "skin", "moisturizing", "soap", "shampoo", "conditioner");
        brandTags.push("Moisturizing", "Gentle", "Derm-Recommended");
      } else if (name.includes("pantene")) {
        brandKeywords.push("hair", "haircare", "hair care", "beauty", "shampoo", "pro-v", "shine");
        brandTags.push("Affordable", "Classic");
      } else if (name.includes("l'oréal") || name.includes("loreal")) {
        brandKeywords.push("hair", "haircare", "hair care", "beauty", "skincare", "skin", "makeup", "cosmetics", "salon");
        brandTags.push("Research-backed", "Premium");
      } else if (name.includes("moxie")) {
        brandKeywords.push("hair", "haircare", "hair care", "beauty", "curly", "wavy", "coily", "clean", "shampoo");
        brandTags.push("Sulfate-free", "Silicone-free", "Indian Hair");
      } else if (name.includes("schwarzkopf")) {
        brandKeywords.push("hair", "haircare", "hair care", "beauty", "dye", "pigments", "color", "salon", "conditioner", "shampoo");
        brandTags.push("Professional", "German-Quality");
      } else if (name.includes("mamaearth")) {
        brandKeywords.push("hair", "haircare", "hair care", "skincare", "skin", "beauty", "onion", "shampoo", "natural", "organic", "baby");
        brandTags.push("Toxin-free", "Cruelty-free", "Eco-friendly");
      } else if (name.includes("wow skin") || name.includes("wowskin")) {
        brandKeywords.push("hair", "haircare", "hair care", "skincare", "skin", "beauty", "apple cider", "shampoo", "natural", "organic");
        brandTags.push("Bioactive", "Natural");
      } else if (name.includes("minimalist")) {
        brandKeywords.push("skincare", "skin", "beauty", "serum", "clean", "peeling", "actives", "niacinamide", "salicylic");
        brandTags.push("Clinically-Proven", "Fragrance-free", "Transparent");
      } else if (name.includes("derma co") || name.includes("dermaco")) {
        brandKeywords.push("skincare", "skin", "beauty", "acne", "dermatologist", "potency", "salicylic", "serum");
        brandTags.push("Dermatologist-Designed", "Active-rich");
      } else if (name.includes("cetaphil")) {
        brandKeywords.push("skincare", "skin", "beauty", "cleanser", "moisturizer", "sensitive", "eczema", "dry skin");
        brandTags.push("Clinical-standard", "Hypoallergenic", "Soap-free");
      } else if (name.includes("cerave")) {
        brandKeywords.push("skincare", "skin", "beauty", "ceramide", "moisturizer", "barrier", "dry skin", "cleanser");
        brandTags.push("Barrier-healing", "MVE-Tech", "Derm-Developed");
      } else if (name.includes("forest essentials") || name.includes("forestessentials")) {
        brandKeywords.push("skincare", "skin", "beauty", "ayurvedic", "natural", "luxury", "oil", "facial", "massage", "remedies");
        brandTags.push("Luxury Ayurvedic", "Artisanal", "Pure-botanical");
      } else if (name.includes("maybelline")) {
        brandKeywords.push("beauty", "cosmetics", "makeup", "lipstick", "eyeliner", "mascara", "foundation", "face");
        brandTags.push("Pigmented", "Longwear", "Affordable");
      } else if (name.includes("lakme") || name.includes("lakmé")) {
        brandKeywords.push("beauty", "cosmetics", "makeup", "lipstick", "kajal", "foundation", "salon", "eyeliner");
        brandTags.push("Indian Pioneer", "Weatherproof");
      } else if (name.includes("nykaa")) {
        brandKeywords.push("beauty", "cosmetics", "makeup", "lipstick", "eyeliner", "nail polish", "compact");
        brandTags.push("Authentic", "Trendy", "Affordable");
      } else if (name.includes("sugar")) {
        brandKeywords.push("beauty", "cosmetics", "makeup", "lipstick", "matte", "transfer-proof", "liner");
        brandTags.push("Transfer-proof", "Vibrant");
      } else if (name.includes("apple")) {
        brandKeywords.push("electronics", "tech", "phone", "iphone", "laptop", "macbook", "watch", "smartwatch", "gadgets", "audio", "airpods");
        brandTags.push("Apex-Ecosystem", "Impeccable-Support", "High-Tech");
      } else if (name.includes("sony")) {
        brandKeywords.push("electronics", "tech", "audio", "tv", "headphones", "anc", "camera", "playstation", "gaming", "bravia");
        brandTags.push("Audio-king", "Japanese-Pedigree");
      } else if (name.includes("samsung")) {
        brandKeywords.push("electronics", "tech", "phone", "tv", "appliances", "refrigerator", "smartwatch", "smartthings");
        brandTags.push("Display-pioneer", "Robust-network");
      } else if (name.includes("glownest")) {
        brandKeywords.push("beauty", "skincare", "skin", "cream", "hair", "haircare", "organic", "serum", "hydrating", "rose", "moisturizer", "clean beauty");
        brandTags.push("Clean", "Organic", "Vegan", "Derm-Approved");
      } else if (name.includes("herbaura")) {
        brandKeywords.push("herbal", "remedies", "himalayan", "natural", "tea", "organic", "supplements", "beauty", "skincare", "wellness", "botanical");
        brandTags.push("Fair-trade", "Sustainable", "Eco-friendly", "Carbon-neutral");
      } else if (name.includes("aurawell")) {
        brandKeywords.push("wellness", "fitness", "trackers", "watch", "smartwatch", "electronics", "biological", "heart", "health", "wearables");
        brandTags.push("Tech", "Health", "Active", "Verified");
      } else if (name.includes("econest")) {
        brandKeywords.push("home", "goods", "living", "eco", "recycled", "sustainable", "sustainable living", "bamboo", "accessories", "lifestyle");
        brandTags.push("Zero-waste", "Circular", "Recycled");
      } else if (name.includes("pureleaf")) {
        brandKeywords.push("tea", "beverages", "organic", "herbal", "infusions", "natural", "drink", "matcha");
        brandTags.push("Purity", "QR Verified");
      } else if (name.includes("bloomberry")) {
        brandKeywords.push("kids", "apparel", "textiles", "children", "baby", "clothes", "cotton", "toddler");
        brandTags.push("Certified Organic", "Hypoallergenic");
      } else if (name.includes("techbloom")) {
        brandKeywords.push("electronics", "accessories", "modular", "bluetooth", "charger", "gadgets", "audio", "tech");
        brandTags.push("Modular", "Eco-smart");
      }

      const matchesName = name.includes(lowerSearch);
      const matchesAssociates = associates.some(assoc => assoc.includes(lowerSearch) || lowerSearch.includes(assoc));
      const matchesInsights = insights.includes(lowerSearch);
      const matchesRisk = risk.includes(lowerSearch);
      const matchesWarranty = warranty.includes(lowerSearch);
      const matchesKeywords = brandKeywords.some(kw => kw.includes(lowerSearch) || lowerSearch.includes(kw));
      const matchesTags = brandTags.some(tag => tag.toLowerCase().includes(lowerSearch));

      return matchesName || matchesAssociates || matchesInsights || matchesRisk || matchesWarranty || matchesKeywords || matchesTags;
    });

    // Sort order: best to least
    matchedBrands.sort((a, b) => b.credibility_score - a.credibility_score);

    // Prioritization check if relevant
    const isHairCream = lowerSearch.includes('hair cream') || lowerSearch.includes('cream') || selectedCategory === 'Clean Skincare';
    if (isHairCream) {
      const glowNestIndex = matchedBrands.findIndex(b => b.brand_name.toLowerCase() === 'glownest');
      if (glowNestIndex > -1) {
        const [glowBrand] = matchedBrands.splice(glowNestIndex, 1);
        matchedBrands.unshift(glowBrand);
      }
    }

    return matchedBrands;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync saved list toggles
  const handleToggleSave = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/saved/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (data.success) {
        setSavedProducts(data.saved);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Affiliate Click Tracker
  const handleAffiliateClick = async (productId: string, platform: string, label: string) => {
    try {
      const res = await fetch('/api/affiliate/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, platform })
      });
      const data = await res.json();
      if (data.success) {
        // Increment local click metrics state immediately
        const key = `${platform}_${productId}`;
        setClickMetrics(prev => ({ ...prev, [key]: data.count }));
        
        // Show stylish floating notification popup
        setAffiliateNotification({
          product: label,
          platform: platform.toUpperCase(),
          count: data.count
        });
        setTimeout(() => setAffiliateNotification(null), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Authentication Logic
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = authForm.isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authForm.username,
          email: authForm.email,
          password: authForm.password
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setShowAuthModal(false);
        // Clear forms
        setAuthForm({ username: '', email: '', password: '', isRegister: false });
        fetchAllData();
      } else {
        setAuthError(data.error || 'Authentication error occurred');
      }
    } catch (err) {
      setAuthError('Connection error to database authentication module');
    }
  };

  const handleTogglePremium = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/toggle-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentTab('home');
  };

  // Post Review
  const handlePostReview = async (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.text) {
      alert("Please fill in author and review message!");
      return;
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating: reviewForm.rating,
          author: reviewForm.author,
          reviewText: reviewForm.text,
          verified: reviewForm.verified
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccessMsg("Review submitted! AI computed new metrics on the product successfully.");
        setReviewForm({ author: user?.username || '', rating: 5, text: '', verified: true });
        // update main state
        setProducts(data.products);
        setReviews(data.reviews);
        // Refresh detail overlay if opened
        const updatedProd = data.products.find((p: Product) => p.id === productId);
        if (updatedProd) {
          setSelectedProductDetails(updatedProd);
        }
        setTimeout(() => setReviewSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error("Critical error posting review:", err);
    }
  };

  // Vote or interact with Product Trusted Circle Activity
  const handleVoteProductCircle = async (productId: string, action: 'recommend' | 'purchase' | 'expectations_yes' | 'expectations_no') => {
    // Optimistically set action as voted to prevent spam
    const key = `${productId}_${action}`;
    if (votedProductAspects[key]) return; // already voted

    try {
      const res = await fetch('/api/products/vote-circle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          action,
          username: user?.username || "Verified Peer"
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setVotedProductAspects(prev => ({ ...prev, [key]: true }));

        // Refresh detail overlay if open
        const updatedProd = data.products.find((p: Product) => p.id === productId);
        if (updatedProd) {
          setSelectedProductDetails(updatedProd);
        }
      }
    } catch (err) {
      console.error("Error submitting product circle action:", err);
    }
  };

  // Chatbot Gemini Handler
  const handleSendChat = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const query = textOverride || chatInput;
    if (!query.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: query }];
    setChatMessages(newMsgs);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          isPremium: user?.isPremium || false
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Error loading dynamic response. Check your local API configurations." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Admin add or edit operations
  const handleAdminProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!adminEditId;
    const url = isEdit ? '/api/admin/product/edit' : '/api/admin/product/add';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...adminProductForm,
          id: adminEditId
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        // Clear form
        setAdminProductForm({
          name: '', brand: '', category: 'Skincare & Cream', description: '', price: 0,
          rating: 4.5, trust_score: 90, authenticity_score: 90, transparency_score: 85,
          warranty_score: 90, complaint_rate: 1.5, return_rate: 2.0, verified_review_rate: 90,
          is_sponsored: false, is_premium_only: false
        });
        setAdminEditId(null);
        alert(isEdit ? "Product metrics updated successfully." : "New product created and scored.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminDeleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product from Vouch database?")) return;
    try {
      const res = await fetch(`/api/admin/product/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/brand/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminBrandForm)
      });
      const data = await res.json();
      if (data.success) {
        setBrands(data.brands);
        setAdminBrandForm({
          brand_name: '', credibility_score: 85, transparency_score: 80, website: '', verified: true,
          years_in_business: 10, warranty_policy: '1 Year Brand Warranty', customer_service_score: 85,
          transparency_rating: 'A'
        });
        alert("Brand profile archived and transparency rating compiled!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Moderate and delete this user review?")) return;
    try {
      const res = await fetch(`/api/admin/review/${reviewId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentTab('directory');
  };

  // Compare toggles
  const handleToggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 products simultaneously.");
        return prev;
      }
      return [...prev, id];
    });
  };

  // Score Helper function
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
    return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
  };

  const getScoreBadgeText = (score: number) => {
    if (score >= 80) return 'Highly Trusted';
    if (score >= 60) return 'Moderate Trust';
    return 'Low Trust';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // Filters Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="vouch-page-frame" className="min-h-screen bg-[#f0f9f6] p-3 sm:p-6 font-sans">
      {/* Dynamic Affiliate Floating Notification Popup */}
      {affiliateNotification && (
        <div id="affiliate-alert" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-emerald-500/40 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl animate-bounce">
          <Activity className="h-5 w-5 animate-pulse text-emerald-500" />
          <div>
            <p className="text-xs text-slate-400">Affiliate Link Redirected</p>
            <p className="text-sm font-bold text-white">Buying "{affiliateNotification.product}" on {affiliateNotification.platform}</p>
          </div>
          <div className="bg-emerald-950/50 text-emerald-300 font-mono text-xs px-2 py-0.5 rounded border border-emerald-500/20">
            Total Clicks: {affiliateNotification.count}
          </div>
        </div>
      )}

      {/* Main Container mirroring the custom design framework */}
      <div id="vouch-app-dashboard-container" className="mx-auto max-w-7xl rounded-3xl bg-[#030712] text-slate-100 shadow-[0_25px_60px_-15px_rgba(3,7,18,0.7)] overflow-hidden border border-slate-800">
        
        {/* Navigation Header precisely matching high-fidelity layout */}
        <header id="vouch-navbar" className="flex flex-col md:flex-row items-center justify-between px-6 py-5 border-b border-slate-800 bg-[#060b18] gap-4">
          <div id="vouch-logo-section" className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentTab('home'); setSelectedCategory('All'); }}>
            <div id="vouch-icon" className="bg-[#12b76a] p-2.5 rounded-xl flex items-center justify-center text-slate-900 shadow-md">
              <Shield className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span id="logo-text-p1" className="text-2xl font-black tracking-tight text-white">Vouch</span>
                <span id="logo-badge" className="text-[10px] font-bold bg-[#12b76a]/20 text-[#12b76a] px-1.5 py-0.5 rounded uppercase tracking-wider">India</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">The Credit Score for Brands</p>
            </div>
          </div>

          <nav id="vouch-tabs" className="flex flex-wrap items-center gap-1.5 bg-[#0a1226] p-1.5 rounded-xl border border-slate-800/85">
            <button
              id="tab-home"
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 ${
                currentTab === 'home' 
                  ? 'bg-[#12b76a] text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              🏠 Home
            </button>
            <button
              id="tab-directory"
              onClick={() => { setCurrentTab('directory'); setSelectedCategory('All'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 ${
                currentTab === 'directory' 
                  ? 'bg-[#12b76a] text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              🔍 Discover Brands
            </button>
            <button
              id="tab-top-trusted"
              onClick={() => setCurrentTab('top_trusted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 ${
                currentTab === 'top_trusted' 
                  ? 'bg-[#12b76a] text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              💎 Hidden Gems
            </button>
            <button
              id="tab-compare"
              onClick={() => setCurrentTab('compare')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-1 ${
                currentTab === 'compare' 
                  ? 'bg-[#12b76a] text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              ⚖️ Compare Brands
              {compareBrandsList.length > 0 && (
                <span className="bg-slate-900 text-[#12b76a] text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center font-mono">
                  {compareBrandsList.length}
                </span>
              )}
            </button>
            <button
              id="tab-transparency"
              onClick={() => setCurrentTab('transparency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 ${
                currentTab === 'transparency' 
                  ? 'bg-[#12b76a] text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              📈 Trust Insights
            </button>
            <button
              id="tab-ai-assistant"
              onClick={() => setCurrentTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-1 ${
                currentTab === 'chat' 
                  ? 'bg-indigo-600 text-white shadow-md font-bold' 
                  : 'text-indigo-400 hover:text-indigo-200 hover:bg-slate-800/50'
              }`}
            >
              🤖 Ask Vouch
            </button>
            {user?.isAdmin && (
              <button
                id="tab-admin"
                onClick={() => setCurrentTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 ${
                  currentTab === 'admin' 
                    ? 'bg-rose-600 text-white shadow-md font-bold' 
                    : 'text-rose-450 hover:text-rose-200 hover:bg-slate-800/50'
                }`}
              >
                ⚙️ Admin
              </button>
            )}
          </nav>

          <div id="vouch-auth-section" className="flex items-center gap-3.5">
            {user ? (
              <div className="flex items-center gap-4 bg-[#0a1226] py-1 px-3.5 rounded-xl border border-slate-800">
                <div className="text-right">
                  <p className="text-xs text-slate-300 font-bold">@{user.username}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <span onClick={handleTogglePremium} className={`text-[10px] font-extrabold px-1.5 rounded-full cursor-pointer uppercase transition-all ${
                      user.isPremium ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`} title="Toggle membership tier">
                      {user.isPremium ? '⭐ Premium' : 'Free Tier'}
                    </span>
                    {user.isAdmin && <span className="text-[9px] bg-rose-500 text-white font-extrabold px-1 rounded uppercase">Admin</span>}
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-rose-400 font-medium border-l border-slate-800 pl-3.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  id="navbar-sign-in" 
                  onClick={() => { setAuthForm({ ...authForm, isRegister: false }); setShowAuthModal(true); }}
                  className="text-xs font-semibold text-slate-300 hover:text-white transition duration-250 uppercase tracking-wider"
                >
                  Sign In
                </button>
                <button 
                  id="navbar-create-account" 
                  onClick={() => { setAuthForm({ username: '', email: '', password: '', isRegister: true }); setShowAuthModal(true); }}
                  className="bg-[#12b76a] hover:bg-[#10a15b] transition duration-200 text-slate-950 text-xs font-extrabold px-4.5 py-2 rounded-xl uppercase tracking-wider shadow-sm"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Home Tab precisely matching design of outer hero screenshot */}
        {currentTab === 'home' && (
          <div id="vouch-home-view" className="p-6 md:p-10 space-y-12">
            
            {/* HERO CONTAINER: Rounded and deeply dark matching photo */}
            <div id="vouch-hero-card" className="relative rounded-3xl bg-[#02050c] border border-slate-800/80 p-8 md:p-14 text-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-950/20 via-transparent to-transparent pointer-events-none" />
              
              <div className="inline-flex items-center gap-2 bg-[#12b76a]/10 border border-[#12b76a]/20 px-3 py-1 rounded-full text-xs text-[#12b76a] font-bold tracking-wide uppercase mb-6 animate-pulse">
                <Info className="h-3 w-3" />
                Consumer Empowerment Platform
              </div>

              <h1 id="vouch-hero-title" className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
                Trust Before <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 bg-clip-text text-transparent">Transaction</span>
              </h1>

              <p id="vouch-hero-description" className="text-slate-200 text-base sm:text-lg md:text-xl font-bold max-w-2xl mx-auto mt-4 tracking-tight">
                The Credit Score for Brands
              </p>

              <p className="text-slate-450 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
                Vouch calculates Dynamic Trust Scores, authenticating customer guarantees, verified reviews, and scam risk indicators for premium brands and boutique businesses in India.
              </p>

              {/* Central Search block precisely aligned as screenshot */}
              <form onSubmit={handleSearchExecute} className="max-w-2xl mx-auto mt-10">
                <div className="flex flex-col sm:flex-row items-stretch bg-[#0c1325] border border-slate-700/80 p-1.5 rounded-2xl gap-2 focus-within:border-emerald-500/40 transition-all shadow-lg">
                   <div className="flex-1 flex items-center px-3.5 gap-2.5">
                    <Search className="h-5 w-5 text-slate-400 shrink-0" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search brands, boutique offerings, or sustainable categories (e.g., Skincare)..."
                      className="w-full bg-transparent border-none text-slate-100 text-sm focus:outline-none placeholder-slate-500"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-[#12b76a] hover:bg-[#10a15b] transition text-slate-950 text-xs sm:text-sm font-extrabold px-6 py-3 rounded-xl uppercase tracking-wider shrink-0"
                  >
                    Explore Scoring
                  </button>
                </div>
              </form>

              {/* Stats divider line */}
              <div className="w-full h-[1px] bg-slate-800/80 max-w-3xl mx-auto mt-14 mb-8" />

              {/* Real Stats matching the user's uploaded layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">96%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Heuristic Bot Accuracy</p>
                </div>
                <div className="space-y-1 border-t md:border-t-0 md:border-x border-slate-800/80 py-4 md:py-0">
                  <p className="text-3xl md:text-4xl font-extrabold text-white font-mono tracking-tight">₹3,42,10,500+</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Safe Purchases Tracked</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-[#12b76a] font-mono tracking-tight">100%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Independent Audit</p>
                </div>
              </div>
            </div>

            {/* THREE COLUMNS GRID BELOW HERO precisely styled as suggested */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#080d1a] border border-slate-800/70 p-6 rounded-2xl flex gap-4 hover:border-emerald-500/30 transition duration-300">
                <div className="bg-[#12b76a]/10 text-[#12b76a] p-3 rounded-xl h-fit shrink-0">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Review Authenticity Weight</h3>
                  <p className="text-xs text-slate-100 mt-2 leading-relaxed">
                    We parse and target client accounts across retail platforms in India. Suspicious bot strings and multi-item copy/paste clusters are weighted out of the scoring schema automatically.
                  </p>
                </div>
              </div>

              <div className="bg-[#080d1a] border border-slate-800/70 p-6 rounded-2xl flex gap-4 hover:border-emerald-500/30 transition duration-300">
                <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl h-fit shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Warranty Compliance</h3>
                  <p className="text-xs text-slate-100 mt-2 leading-relaxed">
                    Tracks whether manufacturing brands provide actual replacement speed or trap users in fine print parameters. Scores are calculated through real consumer claims filed.
                  </p>
                </div>
              </div>

              <div className="bg-[#080d1a] border border-slate-800/70 p-6 rounded-2xl flex gap-4 hover:border-emerald-500/30 transition duration-300">
                <div className="bg-emerald-500/10 text-emerald-300 p-3 rounded-xl h-fit shrink-0">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Scam Risk Indicators</h3>
                  <p className="text-xs text-slate-100 mt-2 leading-relaxed">
                    Calculates warning signals, dropshipping traits, and automated feedback patterns. Brands with poor compliance or high flags are instantly highlighted for consumer safety.
                  </p>
                </div>
              </div>
            </div>

            {/* Rising Emerging Brands and Explanation Section side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Leaderboard/Explanation */}
              <div className="lg:col-span-8 bg-[#060b16] border border-slate-830 rounded-2xl p-6.5 space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#12b76a]" />
                    Trending Brand Houses Scored This Week
                  </h2>
                  <p className="text-xs text-slate-400">High search volumes on credibility scores across organic, skincare, apparel, and direct-to-consumer brand segments.</p>
                </div>

                <div className="divide-y divide-slate-800/60 font-medium">
                  {brands.slice(0, 5).map((b) => (
                    <div 
                      key={b.id} 
                      className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-900/30 transition duration-200 cursor-pointer" 
                      onClick={() => { setSelectedBrandOverview(b); }}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-black text-slate-800 text-xs shrink-0 font-mono">
                          {b.brand_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">{b.years_in_business} Years Established &bull; {b.verified ? 'Verified Partner' : 'Registered'}</p>
                          <p className="text-sm font-bold text-white leading-tight mt-0.5">{b.brand_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className={`px-3 py-1 rounded-lg border text-sm font-bold font-mono ${getScoreColor(b.credibility_score)}`}>
                          {b.credibility_score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => { setCurrentTab('directory'); setSelectedCategory('All'); setDirectoryMode('brands'); }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-850/80 border border-slate-800 text-xs font-bold uppercase text-emerald-400 tracking-wider rounded-xl transition flex items-center justify-center gap-2"
                >
                  Browse Full Brand Directory
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* HIDDEN GEMS (Features small local high trust brands or warnings) */}
              <div className="lg:col-span-4 bg-[#060b16] border border-slate-830 rounded-2xl p-6.5 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md w-fit tracking-widest mb-3 border border-emerald-500/20">
                    Hidden Gems Spotlight
                  </div>
                  <h2 className="text-lg font-black text-white tracking-tight">Hidden Gems & Scam Warnings</h2>
                  <p className="text-xs text-slate-400 mt-1">Direct boutique brands and critical scam hazard analysis metrics.</p>
                </div>

                <div className="space-y-4 my-4 font-medium">
                  {fakeHiddenGems.map(b => {
                    const isRisky = b.scam_risk_level === 'danger';
                    return (
                      <div 
                        key={b.id} 
                        onClick={() => setSelectedBrandOverview(b)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between group/gem ${
                          isRisky 
                            ? 'bg-rose-50/10 border-rose-900/30 text-rose-200 hover:bg-rose-950/20' 
                            : 'bg-slate-900/40 border-slate-800/80 text-slate-200 hover:bg-slate-850/60'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className={`text-xs font-bold truncate ${isRisky ? 'text-rose-400' : 'text-slate-100'}`}>
                              {b.brand_name}
                            </p>
                            {b.verified && !isRisky && <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                            {isRisky && <ShieldAlert className="h-3.5 w-3.5 text-rose-500 animate-pulse shrink-0" />}
                          </div>
                          
                          {/* Scam Risk Indicator badge */}
                          <div className="flex items-center gap-1">
                            <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                              isRisky 
                                ? 'bg-rose-950/50 text-rose-400 border-rose-900/30' 
                                : 'bg-emerald-950/50 text-emerald-400 border-emerald-900/30'
                            }`}>
                              Risk: {b.scam_risk || 'Very Low'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-[11px] font-black ${isRisky ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {b.transparency_rating} Grade
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Score: {b.credibility_score}
                          </div>
                          <span className="text-[9px] text-indigo-400 hover:underline font-bold block mt-0.5">
                            View details &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => { setCurrentTab('directory'); setDirectoryMode('brands'); }}
                  className="w-full py-2.5 bg-emerald-950/20 border border-emerald-900/40 text-xs font-bold uppercase text-[#12b76a] tracking-wider rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  Verify All Registered Brands
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* How Vouch Trust Engine calculates Scores */}
            <div className="bg-[#070c18] border border-slate-800 p-8 rounded-3xl space-y-6">
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  How is a Vouch Trust Score generated?
                </h3>
                <p className="text-xs text-slate-400 mt-1">Our platform monitors and updates brand credit scores dynamically based on 5 core pillars daily.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-medium">
                <div className="bg-slate-900/70 p-4.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-[#12b76a] mb-1 font-bold">Pillar 01</div>
                  <h4 className="text-sm font-bold text-slate-100">Verified buyers Only</h4>
                  <p className="text-xs text-slate-400 mt-1">Review weight factors verify actual transactions. Suspicious strings drop the score.</p>
                </div>

                <div className="bg-slate-900/70 p-4.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-[#12b76a] mb-1 font-bold">Pillar 02</div>
                  <h4 className="text-sm font-bold text-slate-100">Warranty fulfillment</h4>
                  <p className="text-xs text-slate-400 mt-1">Continuous calculation on brand resolution speeds for warranty claims.</p>
                </div>

                <div className="bg-slate-900/70 p-4.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-[#12b76a] mb-1 font-bold">Pillar 03</div>
                  <h4 className="text-sm font-bold text-slate-100">Return & Scam Risk</h4>
                  <p className="text-xs text-slate-400 mt-1">Calculates warning signals, dropshipping traits, and customer refund claims.</p>
                </div>

                <div className="bg-slate-900/70 p-4.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-[#12b76a] mb-1 font-bold">Pillar 04</div>
                  <h4 className="text-sm font-bold text-slate-100">Brand Transparency</h4>
                  <p className="text-xs text-slate-400 mt-1">Factoring corporate honesty, public policies, years in business, and support.</p>
                </div>

                <div className="bg-slate-900/70 p-4.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-[#12b76a] mb-1 font-bold">Pillar 05</div>
                  <h4 className="text-sm font-bold text-slate-100">Corporate Backing</h4>
                  <p className="text-xs text-slate-400 mt-1">Registered brand authenticity verification and legal compliance in India.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Directory Search and Rating System */}
        {currentTab === 'directory' && (
          <div id="vouch-directory-view" className="p-6 md:p-8 space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Clipboard className="h-6 w-6 text-[#12b76a]" />
                  Verify Trust & Authenticity
                </h1>
                <p className="text-xs text-slate-400 mt-1">Sift through direct-to-consumer guarantees, scam risk warnings, and authenticated customer reviews in India.</p>
              </div>

              {/* Strictly focusing on verified brand houses */}
            </div>

            {/* Main searching frame holding custom categories */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
              {/* Categories scroller */}
              <div className="flex flex-wrap gap-1.5 bg-[#070d18] p-1.5 rounded-xl border border-slate-800 flex-1">
                {categoriesList.slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      selectedCategory === cat 
                        ? 'bg-[#12b76a]/20 text-[#12b76a] border border-[#12b76a]/30'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#09101d] text-xs font-bold text-slate-200 focus:outline-none px-2 rounded cursor-pointer border border-slate-800"
                >
                  <option value="All">More Categories...</option>
                  {categoriesList.slice(6).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Reset Controls */}
              <div className="flex gap-2">
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-bold px-4 rounded-xl border border-slate-800 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Center Quick Filter Search bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Verify brands: type 'hair cream' or other categories to dynamically filter brand houses (e.g. Moxie, Dyson, Loreal)..."
                  className="w-full bg-[#0a1122] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-[#12b76a]/60 focus:outline-none focus:ring-1 focus:ring-[#12b76a]/20"
                />
              </div>
            </div>

            {/* MODE 1: BRAND VERIFICATION CENTER (Best to Least Sorted cards) */}
            {directoryMode === 'brands' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs text-slate-400 font-medium px-1">
                  <span>Dynamic analysis matching: <strong className="text-emerald-400">{getSearchedBrands().length} verified brands</strong></span>
                  <span>Sorted by: <strong className="text-white">Credibility Rating (Best to Least)</strong></span>
                </div>

                {getSearchedBrands().length > 0 ? (
                  <div className="grid grid-cols-1 gap-8">
                    {getSearchedBrands().map(b => {
                    const currentTrust = b.trust_score || b.credibility_score || 85;
                    const isVotedExpectations = votedAspects[`${b.id}_expectations`];
                    const isVotedRepurchase = votedAspects[`${b.id}_repurchase`];
                    const isVotedPromises = votedAspects[`${b.id}_promises`];

                    const displayValueForMoney = b.value_for_money || 85;

                    return (
                      <div 
                        key={b.id} 
                        className="bg-[#060b16] border border-slate-800/80 rounded-2xl p-6.5 hover:border-slate-700/60 transition-all duration-300 relative overflow-hidden flex flex-col xl:flex-row gap-6 group brand-card-shiny"
                      >
                        {/* Core Status & Logo Info Column */}
                        <div className="xl:w-1/4 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-slate-800/80 pb-5 xl:pb-0 xl:pr-6 whitespace-normal">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <h2 className="text-xl font-bold font-display text-white">{b.brand_name}</h2>
                              {b.verified && (
                                <span className="bg-emerald-950/70 text-[#12b76a] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-900/30 flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  Audit Verified
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-slate-400 font-medium">
                              Corporate Maturity: <span className="text-slate-200 font-bold">{b.years_in_business} Years</span>
                            </p>

                            <div className="bg-[#030610] p-3 rounded-xl border border-slate-850/70 text-xs">
                              <span className="text-slate-450 uppercase text-[8.5px] font-bold tracking-wider block">Warranty Standard:</span>
                              <p className="text-slate-300 font-semibold mt-1 leading-normal leading-4">{b.warranty_policy || "1 Year General Replacement Coverage"}</p>
                            </div>

                            <div className="bg-indigo-950/25 p-3 rounded-xl border border-indigo-900/30 text-xs shadow-inner">
                              <span className="text-[#a5b4fc] uppercase text-[8px] font-black tracking-wider block">★ AI Trust Summary:</span>
                              <p className="text-slate-300 mt-1 leading-relaxed text-[11px] italic">
                                "{b.insights || "Consistent positive registry audits and balanced satisfaction margins denote extremely high structural integrity."}"
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 flex flex-col gap-2">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-slate-450">Value rating:</span>
                              <span className="text-white font-bold font-mono">{displayValueForMoney}% Index</span>
                            </div>
                            {/* Value scale bar */}
                            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                              <div className="bg-[#12b76a] h-full" style={{ width: `${displayValueForMoney}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Middle detailed indicators: Advantages, Disadvantages & Trusted Circles */}
                        <div className="xl:w-2/5 flex flex-col justify-between space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Advantages */}
                            <div className="space-y-2">
                              <h4 className="text-[10px] text-emerald-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Advantages
                              </h4>
                              <ul className="space-y-1.5">
                                {(b.advantages || ["Excellent build construction", "Highly responsive onsite services"]).map((adv, idx) => (
                                  <li key={idx} className="text-xs text-slate-350 flex items-start gap-1.5 leading-snug">
                                    <span className="text-emerald-500 font-bold shrink-0">•</span>
                                    <span>{adv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Disadvantages */}
                            <div className="space-y-2">
                              <h4 className="text-[10px] text-rose-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                                <ShieldAlert className="h-3 w-3" /> Disadvantages
                              </h4>
                              <ul className="space-y-1.5">
                                {(b.disadvantages || ["Premium cost barrier", "Complex claim documentation request"]).map((dis, idx) => (
                                  <li key={idx} className="text-xs text-slate-350 flex items-start gap-1.5 leading-snug">
                                    <span className="text-rose-400 font-bold shrink-0">•</span>
                                    <span>{dis}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Trusted Circle integration Section */}
                          <div className="bg-[#030611] p-3 rounded-xl border border-slate-850/80 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 w-full">
                              <div className="bg-indigo-950/50 p-2.5 rounded-lg text-indigo-400 border border-indigo-900/30 shrink-0">
                                <User className="h-4.5 w-4.5" />
                              </div>
                              <div className="w-full">
                                <div className="text-xs text-slate-200 font-bold">Trusted Circle activity</div>
                                <div className="text-[10px] text-slate-400 mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 font-mono w-full">
                                  <span className="flex justify-between border-b border-slate-900/40 pb-0.5 sm:pb-0 sm:border-0">
                                    <span className="text-slate-455">Friends Recommend:</span>
                                    <strong className="text-emerald-400 font-bold">{b.trusted_circle_activity?.friends || 4}</strong>
                                  </span>
                                  <span className="flex justify-between border-b border-slate-900/40 pb-0.5 sm:pb-0 sm:border-0">
                                    <span className="text-slate-455">Family Purchased:</span>
                                    <strong className="text-amber-400 font-bold">{b.trusted_circle_activity?.purchased || 10}</strong>
                                  </span>
                                  <span className="flex justify-between border-b border-slate-900/40 pb-0.5 sm:pb-0 sm:border-0">
                                    <span className="text-slate-455">Mentors Trust:</span>
                                    <strong className="text-indigo-300 font-bold">{b.trusted_circle_activity?.mentors || 2}</strong>
                                  </span>
                                  <span className="flex justify-between pb-0.5 sm:pb-0">
                                    <span className="text-slate-455">Experts Recommend:</span>
                                    <strong className="text-teal-400 font-bold">{b.trusted_circle_activity?.experts || 5}</strong>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[9px] bg-indigo-500/10 text-indigo-300 font-black tracking-wider px-2 py-1 rounded border border-indigo-500/20 uppercase block">
                                Circle Score: {b.trusted_circle_score || 88}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Trust Score & Interactive Polling Column */}
                        <div className="xl:w-1/3 flex flex-col justify-between bg-[#040813] p-4 rounded-xl border border-slate-850/60 text-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-850/40">
                            <div>
                              <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Vouch Credit Score:</p>
                              <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className={`text-2xl font-black font-mono leading-none ${currentTrust >= 80 ? 'text-emerald-400' : currentTrust >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                  {currentTrust}
                                </span>
                                <span className="text-[10px] text-slate-450">/ 100</span>
                              </div>
                            </div>

                            {/* Trust journey trend timeline block */}
                            <div className="text-right">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                                b.status === 'Improving' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/40' :
                                b.status === 'Stable' ? 'bg-slate-900 text-slate-300 border border-slate-800' :
                                'bg-rose-900/30 text-rose-400 border border-rose-900/40'
                              }`}>
                                {b.status || 'Stable'}
                              </span>
                              <div className="text-[9px] text-slate-450 font-mono mt-1 flex gap-1 justify-end">
                                {(b.journey || [{ year: 2024, score: 82 }, { year: 2025, score: 84 }, { year: 2026, score: 85 }]).map(yr => (
                                  <span key={yr.year} title={`Year ${yr.year}`} className="hover:text-white transition">
                                    {yr.year}:{yr.score}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Accountability check section */}
                          <div className="space-y-2.5 pt-3">
                            <h5 className="text-[10px] text-indigo-300 uppercase tracking-widest font-extrabold flex items-center gap-1">
                              <Activity className="h-3 w-3 text-indigo-400" /> Dynamic Accountability check
                            </h5>
                            
                            <div className="space-y-1.5 text-[11px]">
                              {/* expectations aspect */}
                              <div className="flex justify-between items-center bg-[#070c18] p-1.5 rounded">
                                <span className="text-slate-400 font-sans">Did expectations match performance?</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-white font-bold">{b.accountability?.expectations || 85}%</span>
                                  <div className="flex gap-0.5">
                                    <button 
                                      onClick={() => handleBrandVote(b.id, 'expectations', true)} 
                                      disabled={isVotingLoader[`${b.id}_expectations`] || isVotedExpectations}
                                      className={`px-1.5 py-0.5 rounded text-[10px] ${isVotedExpectations ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 transition'}`}
                                    >
                                      👍
                                    </button>
                                    <button 
                                      onClick={() => handleBrandVote(b.id, 'expectations', false)} 
                                      disabled={isVotingLoader[`${b.id}_expectations`] || isVotedExpectations}
                                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-rose-950 hover:text-rose-400 transition"
                                    >
                                      👎
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* repurchase aspect */}
                              <div className="flex justify-between items-center bg-[#070c18] p-1.5 rounded">
                                <span className="text-slate-400 font-sans">Would repurchase from them?</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-white font-bold">{b.accountability?.repurchase || 82}%</span>
                                  <div className="flex gap-0.5">
                                    <button 
                                      onClick={() => handleBrandVote(b.id, 'repurchase', true)} 
                                      disabled={isVotingLoader[`${b.id}_repurchase`] || isVotedRepurchase}
                                      className={`px-1.5 py-0.5 rounded text-[10px] ${isVotedRepurchase ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 transition'}`}
                                    >
                                      👍
                                    </button>
                                    <button 
                                      onClick={() => handleBrandVote(b.id, 'repurchase', false)} 
                                      disabled={isVotingLoader[`${b.id}_repurchase`] || isVotedRepurchase}
                                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-rose-950 hover:text-rose-400 transition"
                                    >
                                      👎
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* promises aspect */}
                              <div className="flex justify-between items-center bg-[#070c18] p-1.5 rounded">
                                <span className="text-slate-400 font-sans">Fulfill corporate warranty promises?</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-white font-bold">{b.accountability?.promises || 84}%</span>
                                  <div className="flex gap-0.5">
                                    <button 
                                      onClick={() => handleBrandVote(b.id, 'promises', true)} 
                                      disabled={isVotingLoader[`${b.id}_promises`] || isVotedPromises}
                                      className={`px-1.5 py-0.5 rounded text-[10px] ${isVotedPromises ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 transition'}`}
                                    >
                                      👍
                                    </button>
                                    <button 
                                      onClick={() => handleBrandVote(b.id, 'promises', false)} 
                                      disabled={isVotingLoader[`${b.id}_promises`] || isVotedPromises}
                                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-rose-950 hover:text-rose-400 transition"
                                    >
                                      👎
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions at footer bottom */}
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-850/40 mt-3">
                            <button
                              onClick={() => setSelectedBrandOverview(b)}
                              className="flex-1 bg-indigo-950/50 hover:bg-indigo-900 border border-indigo-900/40 text-indigo-300 rounded p-1.5 uppercase font-black text-[9px] tracking-wide transition cursor-pointer text-center"
                              title="View full comprehensive metrics modal"
                            >
                              Verify Brand Overview
                            </button>
                            <button
                              onClick={(e) => handleToggleCompareBrand(b.id, e)}
                              className={`flex-1 border rounded p-1.5 uppercase font-black text-[9px] tracking-wide transition cursor-pointer text-center ${
                                compareBrandsList.includes(b.id)
                                  ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-405'
                              }`}
                            >
                              {compareBrandsList.includes(b.id) ? '✓ Compare added' : '+ Compare Brand'}
                            </button>
                            <button
                              onClick={() => setExpandedBrandComponents(prev => prev === b.id ? null : b.id)}
                              className={`flex-1 border rounded p-1.5 uppercase font-black text-[9px] tracking-wide transition cursor-pointer text-center ${
                                expandedBrandComponents === b.id
                                  ? 'bg-[#12b76a] text-slate-950 border-[#12b76a] font-black'
                                  : 'bg-slate-900 hover:bg-slate-800 border-[#12b76a]/30 text-[#12b76a] font-bold'
                              }`}
                            >
                              {expandedBrandComponents === b.id ? 'Hide weighted components' : 'View Weighted Components'}
                            </button>
                          </div>

                          {/* Dynamic components list drawer */}
                          {expandedBrandComponents === b.id && (
                            <div className="mt-4 p-4 bg-[#030611] rounded-xl border border-slate-850/80 space-y-3 text-xs animate-fadeIn text-slate-200">
                              <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                                <span className="text-[10px] uppercase font-black text-[#12b76a] tracking-wider">Weighted Calculation breakdown ({b.brand_name})</span>
                                <span className="text-[10px] text-slate-400 font-mono font-bold">Sum Credibility Rating: {currentTrust}/100</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(() => {
                                  const breakdown = b.weight_breakdown || {
                                    verification: b.verified ? 92 : 30,
                                    sat: b.customer_service_score || 85,
                                    transparency: b.transparency_score || 80,
                                    consistency: b.credibility_score - 2 || 83,
                                    community: b.credibility_score + 4 || 89,
                                    circle: b.trusted_circle_score || 85,
                                    maturity: Math.min(100, b.years_in_business * 8)
                                  };
                                  const components = [
                                    { name: 'Verification Score (20%)', score: breakdown.verification },
                                    { name: 'Customer Satisfaction - In App (20%)', score: breakdown.sat },
                                    { name: 'Transparency Score (20%)', score: breakdown.transparency },
                                    { name: 'Consistency Score (15%)', score: breakdown.consistency },
                                    { name: 'Community Trust - Reviews (10%)', score: breakdown.community },
                                    { name: 'Trusted Circle Score (5%)', score: breakdown.circle },
                                    { name: 'Brand Maturity Score (10%)', score: breakdown.maturity }
                                  ];
                                  return components.map((c, i) => (
                                    <div key={i} className="space-y-1">
                                      <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-slate-300 font-bold">{c.name}</span>
                                        <span className="text-white font-mono font-bold">{c.score}%</span>
                                      </div>
                                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full ${
                                            c.score >= 80 ? 'bg-emerald-500' : c.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                          }`} 
                                          style={{ width: `${c.score}%` }} 
                                        />
                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#070c18] border border-slate-850 p-12 text-center rounded-2xl shadow-xl border-dashed border-indigo-900/20">
                  <Clipboard className="h-10 w-10 text-slate-600 mx-auto animate-bounce" />
                  <p className="text-slate-200 text-sm font-bold mt-4">No matching brands found.</p>
                  <p className="text-xs text-slate-500 mt-2">Try resetting the filters or type active categories like "electronics", "beauty", "hair" or "skincare" to find verified small businesses and hidden gems.</p>
                </div>
              )}
            </div>
          )}

            {/* MODE 2: PRODUCT CATALOGING (Individual models with pricing redirects) - disabled */}
            {directoryMode === 'never_render_appliances' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-medium">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <div 
                      key={p.id}
                      className="bg-[#080d19] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition duration-250 flex flex-col justify-between relative shadow-lg group cursor-pointer"
                      onClick={() => setSelectedProductDetails(p)}
                    >
                      {/* Sponsored badge */}
                      {p.is_sponsored && (
                        <div className="absolute top-3.5 left-3.5 bg-[#12b76a]/15 text-[#12b76a] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#12b76a]/20">
                          SPONSORED BRAND
                        </div>
                      )}

                      {/* Bookmark Toggle */}
                      <button 
                        onClick={(e) => handleToggleSave(p.id, e)}
                        className={`absolute top-3.5 right-3.5 p-1.5 rounded-lg border transition ${
                          savedProducts.includes(p.id)
                            ? 'bg-amber-400/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-350'
                        }`}
                        title="Save to profile list"
                      >
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </button>

                      {/* Image Container */}
                      <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative mt-4">
                        <img 
                          src={p.image_url} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                        />
                        {p.is_premium_only && (
                          <div className="absolute bottom-2 right-2 bg-indigo-900/90 text-indigo-300 text-[10px] font-black tracking-wide px-2 py-0.5 rounded flex items-center gap-1 border border-indigo-500/40">
                            <Lock className="h-3 w-3" />
                            PREMIUM DEEP METRICS
                          </div>
                        )}
                      </div>

                      {/* Descriptive Section */}
                      <div className="space-y-2.5 mt-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{p.brand} &bull; {p.category}</span>
                        </div>
                        
                        <h3 className="text-base font-black text-white group-hover:text-[#12b76a] transition leading-snug truncate">
                          {p.name}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 h-8 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Score Indicator Pillar block */}
                        <div className="bg-[#040812] border border-slate-850 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 flex items-center gap-1 text-[11px] font-bold">
                              Vouch Score:
                            </span>
                            <span className={`font-extrabold px-1.5 rounded text-[10px] uppercase ${getScoreColor(p.trust_score)}`}>
                              {p.trust_score} / 100 ({getScoreBadgeText(p.trust_score)})
                            </span>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${getProgressBarColor(p.trust_score)}`} style={{ width: `${p.trust_score}%` }} />
                          </div>
                          
                          {/* Secondary Indicators */}
                          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                            <div>
                              <span className="text-slate-400 text-[9px] font-sans">REVIEWS AUTH: </span>
                              <span className={p.authenticity_score >= 85 ? "text-emerald-400 font-bold" : p.authenticity_score >= 70 ? "text-amber-400" : "text-rose-400"}>
                                {p.authenticity_score}%
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[9px] font-sans">WARRANTY: </span>
                              <span className="text-indigo-300 font-bold">{p.warranty_score}/100</span>
                            </div>
                          </div>

                          {/* Mini Trusted Circle Panel */}
                          <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 mt-1.5 text-[10px]">
                            <span className="text-slate-400 font-sans flex items-center gap-1">
                              <User className="h-3 w-3 text-indigo-400" />
                              Trusted Circle:
                            </span>
                            <span className="text-indigo-400 font-mono font-bold flex items-center gap-1">
                              {p.trusted_circle_score || 91}% ({p.trusted_circle_activity?.friends || 8} peers)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Affiliate Links redirect buttons */}
                      <div className="space-y-2 mt-4.5">
                        <div className="grid grid-cols-2 gap-1 font-bold">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAffiliateClick(p.id, 'official', p.name); }}
                            className="bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-emerald-400 text-[10px] p-2 rounded-lg border border-slate-800 transition text-center truncate"
                          >
                            Official Store
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAffiliateClick(p.id, 'croma', p.name); }}
                            className="bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-teal-400 text-[10px] p-2 rounded-lg border border-slate-800 transition text-center truncate"
                          >
                            Buy on Croma
                          </button>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button 
                            onClick={(e) => handleToggleCompare(p.id, e)}
                            className={`flex-1 text-[10px] uppercase font-black tracking-widest py-1 px-3 rounded-lg border transition ${
                              compareList.includes(p.id)
                                ? 'bg-indigo-900/35 text-indigo-300 border-indigo-700/60'
                                : 'bg-[#03060c] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            {compareList.includes(p.id) ? '✓ Compares active' : '+ Compare Model'}
                          </button>
                          
                          <button 
                            className="text-[#12b76a] hover:text-white bg-emerald-950/20 text-[10px] font-black uppercase tracking-widest px-3 rounded-lg border border-emerald-900/40 transition hover:bg-[#12b76a] hover:text-slate-950"
                          >
                            Review Detail →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-[#070c18] border border-slate-800 p-12 text-center rounded-2xl">
                    <Clipboard className="h-10 w-10 text-slate-600 mx-auto" />
                    <p className="text-slate-400 text-sm font-bold mt-3">No matching brands found.</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting filters or explore other direct-to-consumer brand categories.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Detailed Side side Comparison Tool */}
        {currentTab === 'compare' && (
          <div id="vouch-compare-view" className="p-6 md:p-8 space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <BarChart2 className="h-6 w-6 text-[#12b76a]" />
                  Interactive Brand Houses Comparison Engine
                </h1>
                <p className="text-xs text-slate-400 mt-1">Sift and evaluate corporate brand houses side-by-side on detailed credibility metrics.</p>
              </div>
            </div>

            {/* COMPARATIVE BRAND HOUSES SECTION */}
            {true && (
              compareBrandsList.length === 0 ? (
                <div className="bg-[#070c18] border border-slate-850 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
                  <BarChart2 className="h-12 w-12 text-[#12b76a]/60 mx-auto" />
                  <h3 className="text-base font-black text-slate-200">Brand checklist is empty</h3>
                  <p className="text-xs text-slate-400">Please browse the Verify Trust directory and click "+ Compare Brand" on up to 3 manufacturer profiles to evaluate their credibility side by side.</p>
                  <button 
                    onClick={() => { setCurrentTab('directory'); setDirectoryMode('brands'); }}
                    className="bg-[#12b76a] text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-[#10a15b]"
                  >
                    Browse Brand Directories
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-[#070c18] border border-slate-800 p-3 px-4 rounded-xl">
                    <span className="text-xs text-slate-300 font-bold">Currently comparing {compareBrandsList.length} corporate profiles</span>
                    <button 
                      onClick={() => setCompareBrandsList([])}
                      className="text-xs text-rose-400 hover:text-white cursor-pointer"
                    >
                      Clear Brand Checklist
                    </button>
                  </div>

                  {/* Brand Comparison table */}
                  <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-[#050914] font-medium">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-[#091024]">
                          <th className="p-4.5 text-xs font-black uppercase text-slate-400 tracking-wider">Scoring Attribute</th>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <th key={id} className="p-4.5 min-w-[220px]">
                                {b ? (
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                      <h3 className="text-sm font-bold text-white">{b.brand_name}</h3>
                                      <p className="text-[10px] text-slate-450 uppercase">{b.transparency_rating} Transparency Grade</p>
                                    </div>
                                    <button 
                                      onClick={(e) => handleToggleCompareBrand(b.id, e)} 
                                      className="text-slate-550 hover:text-rose-400 ml-1 cursor-pointer"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">Brand House Unknown</span>
                                )}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/85 text-xs text-slate-300">
                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Overall Vouch Credit Score</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            const currentTrust = b ? (b.trust_score || b.credibility_score) : 85;
                            return (
                              <td key={id} className="p-4">
                                {b ? (
                                  <span className={`px-2.5 py-1 rounded font-mono font-black ${
                                    currentTrust >= 80 ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-900/30' :
                                    currentTrust >= 65 ? 'bg-amber-950/70 text-amber-400 border border-amber-900/40' :
                                    'bg-rose-950/70 text-rose-400 border border-rose-900/40'
                                  }`}>
                                    {currentTrust} / 100
                                  </span>
                                ) : '-'}
                              </td>
                            );
                          })}
                        </tr>

                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Value For Money Index</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <td key={id} className="p-4 text-slate-200 font-mono font-bold">
                                {b?.value_for_money || 85}% Value Index
                              </td>
                            );
                          })}
                        </tr>

                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Maturity (Years in Retail)</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <td key={id} className="p-4 text-slate-200 font-mono font-semibold">
                                {b?.years_in_business || 10} Years Active
                              </td>
                            );
                          })}
                        </tr>

                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Warranty Resolution Quality</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <td key={id} className="p-4 max-w-[240px] whitespace-normal leading-relaxed text-slate-300">
                                {b?.warranty_policy || "1 Year General Coverage"}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Satisfaction Metrics group */}
                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Expectations Alignment %</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <td key={id} className="p-4 text-emerald-400 font-mono font-bold">
                                {b?.accountability?.expectations || 85}% Confirmed
                              </td>
                            );
                          })}
                        </tr>

                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Repurchase Trust Ratio</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <td key={id} className="p-4 text-indigo-300 font-mono font-bold">
                                {b?.accountability?.repurchase || 82}% Repurchased
                              </td>
                            );
                          })}
                        </tr>

                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Fulfill Promises Rating</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <td key={id} className="p-4 text-[#12b76a] font-mono font-bold">
                                {b?.accountability?.promises || 84}% Rated High
                              </td>
                            );
                          })}
                        </tr>

                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Trusted Circle Score</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <td key={id} className="p-4">
                                <span className="bg-indigo-950/65 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/40 font-mono font-extrabold">
                                  {b?.trusted_circle_score || 88} Rating
                                </span>
                              </td>
                            );
                          })}
                        </tr>

                        {/* Advantages list compared */}
                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Key Advantages</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <td key={id} className="p-4 max-w-[240px] whitespace-normal">
                                <ul className="space-y-1">
                                  {(b?.advantages || ["Premium customer speed", "Excellent long-term assistance model"]).map((adv, idx) => (
                                    <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1">
                                      <span className="text-emerald-500">•</span>
                                      <span>{adv}</span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            );
                          })}
                        </tr>

                        {/* Disadvantages list compared */}
                        <tr>
                          <td className="p-4 bg-[#091024]/40 font-bold text-slate-350">Major Bottlenecks</td>
                          {compareBrandsList.map(id => {
                            const b = brands.find(brand => brand.id === id);
                            return (
                              <td key={id} className="p-4 max-w-[240px] whitespace-normal">
                                <ul className="space-y-1">
                                  {(b?.disadvantages || ["Premium pricing overhead", "Complex online registration request"]).map((dis, idx) => (
                                    <li key={idx} className="text-[11px] text-slate-350 flex items-start gap-1">
                                      <span className="text-rose-450">•</span>
                                      <span>{dis}</span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Brand Transparency view compiles lists of manufacturing corporate transparency */}
        {currentTab === 'transparency' && (
          <div id="vouch-transparency-view" className="p-6 md:p-8 space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#12b76a]" />
                Corporate transparency metrics
              </h1>
              <p className="text-xs text-slate-400 mt-1">Dissect company years in business, country registered, actual warranty terms, and active customer resolution support grades.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-medium">
              {brands.map(b => (
                <div key={b.id} className="bg-[#080e1b] border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-white">{b.brand_name}</h2>
                        {b.verified && (
                          <span className="bg-emerald-950/80 text-[#12b76a] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-emerald-900/50 flex items-center gap-1">
                            <Check className="h-3 w-3 text-[#12b76a]" />
                            VERIFIED BRAND
                          </span>
                        )}
                      </div>
                      <span className="text-2xl font-black text-emerald-400 leading-none">{b.transparency_rating} Grade</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                      Years in market: <span className="text-slate-200 font-bold font-mono">{b.years_in_business} years</span> &bull; 
                      Official Web portal: <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300 font-mono ml-1">{b.website.replace('https://', '')}</a>
                    </p>

                    <div className="bg-[#03060c] p-3 rounded-xl border border-slate-850 text-xs">
                      <p className="text-slate-400 uppercase text-[9px] font-bold tracking-widest">Compulsory warranty Policy</p>
                      <p className="text-slate-200 font-semibold mt-1 font-sans">{b.warranty_policy}</p>
                    </div>

                    {/* Progress indicators */}
                    <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-slate-400 font-sans">CREDIBILITY ACCORD:</span>
                          <span className="text-white font-bold">{b.credibility_score}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#12b76a] h-full" style={{ width: `${b.credibility_score}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-slate-400 font-sans">SERVICE SPEED:</span>
                          <span className="text-white font-bold">{b.customer_service_score}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-400 h-full" style={{ width: `${b.customer_service_score}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500 font-mono">SCORED: Q2 2026</span>
                    <button 
                      onClick={() => { setSearchQuery(b.brand_name); setCurrentTab('directory'); }}
                      className="text-xs text-[#12b76a] hover:underline font-bold"
                    >
                      Search brand models &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Scored brands leaderboard */}
        {currentTab === 'top_trusted' && (
          <div id="vouch-top-trusted-view" className="p-6 md:p-8 space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Award className="h-6 w-6 text-[#12b76a]" />
                Brand Trust Scores Leaderboard
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Real-time compilation of the highest Vouch trust ratings across premium DTC brands and boutique houses currently live.</p>
            </div>

            <div className="overflow-hidden border border-slate-800 rounded-2xl bg-[#040813] font-medium">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#070d1e] text-slate-400 text-xs font-black uppercase tracking-wider">
                    <th className="p-4 text-center w-16 font-mono">Rank</th>
                    <th className="p-4">Brand Profile</th>
                    <th className="p-4">Primary Offerings</th>
                    <th className="p-4 text-center w-36">Vouch score</th>
                    <th className="p-4 text-center w-32">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {brands.slice().sort((a,b) => b.credibility_score - a.credibility_score).slice(0, 10).map((b, idx) => (
                    <tr key={b.id} className="hover:bg-slate-900/30 transition cursor-pointer" onClick={() => setSelectedBrandOverview(b)}>
                      <td className="p-4 text-center font-mono font-bold text-slate-455 text-base">
                        {idx + 1 === 1 ? '🥇' : idx + 1 === 2 ? '🥈' : idx + 1 === 3 ? '🥉' : idx + 1}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 font-extrabold text-[#12b76a] text-xs shrink-0 font-mono">
                            {b.brand_name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm leading-tight">{b.brand_name}</p>
                            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">{b.years_in_business} Years Established</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-300 uppercase tracking-wide">
                        {b.associated_products?.join(', ') || 'Various Offerings'}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-lg border text-xs font-extrabold font-mono ${getScoreColor(b.credibility_score)}`}>
                          {b.credibility_score}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedBrandOverview(b); }}
                          className="bg-[#12b76a]/10 hover:bg-[#12b76a] text-[#12b76a] hover:text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-[#12b76a]/30 transition"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Live AI Assistant wrapper using modern SDK from backend Express server */}
        {currentTab === 'chat' && (
          <div id="vouch-assistant-view" className="p-6 md:p-8 space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-indigo-400" />
                  Gemini-Powered AI shopping advisor
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">Query live database specs, comparison parameters, and genuine authenticity levels instantly.</p>
              </div>

              {/* Status card */}
              <div className="bg-indigo-950/40 border border-indigo-850 text-indigo-300 text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <span className="h-2 w-2 bg-indigo-400 rounded-full animate-ping" />
                <span>Connected &bull; {user?.isPremium ? 'Premium intelligence Mode' : 'Free tier limitations'}</span>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="border border-slate-800 rounded-2xl bg-[#050914] overflow-hidden flex flex-col h-[500px]">
              
              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 font-medium" id="chat-scroller">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 shadow ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-[#0b1224] text-slate-200 rounded-bl-none border border-slate-800/80'
                    }`}>
                      <p className="text-[10px] text-slate-450 uppercase font-bold tracking-widest mb-1">
                        {msg.sender === 'user' ? 'You' : 'Voch AI Assitant'}
                      </p>
                      
                      {/* Simple markdown string rendering */}
                      <p className="whitespace-pre-wrap font-sans">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0b1224] border border-slate-800/80 text-indigo-300 text-xs rounded-2xl p-4 flex items-center gap-2.5">
                      <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                      <span>Sifting through user reviews, warrants, and complaint logs...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preset suggestion helpers */}
              <div className="bg-[#070b16] md:px-5 py-2.5 flex flex-wrap gap-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold items-center py-1 self-center">Ask Vouch:</span>
                <button 
                  onClick={() => handleSendChat(undefined, "I need a reliable coding laptop with top durability")}
                  className="bg-slate-900 hover:bg-slate-800 text-[10px] text-indigo-300 px-3 py-1 rounded-lg border border-slate-800 transition"
                >
                  "Durable coding Laptop"
                </button>
                <button 
                  onClick={() => handleSendChat(undefined, "Which smart TV has the highest review authenticity score?")}
                  className="bg-slate-900 hover:bg-slate-800 text-[10px] text-indigo-300 px-3 py-1 rounded-lg border border-slate-800 transition"
                >
                  "Highest genuine reviews TV"
                </button>
                <button 
                  onClick={() => handleSendChat(undefined, "Compare Apple MacBook and Samsung Galaxy Book4 warranty compliance details")}
                  className="bg-slate-900 hover:bg-slate-800 text-[10px] text-indigo-300 px-3 py-1 rounded-lg border border-slate-800 transition"
                >
                  "Compare Laptop Warranties"
                </button>
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="p-3 bg-[#0c142b] border-t border-slate-800 flex gap-2">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Inquire about return percentages, brand transparency grades, active warranties..."
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-550 focus:border-indigo-500 focus:outline-none"
                />
                <button 
                  type="submit" 
                  disabled={isChatLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-5 rounded-xl transition uppercase tracking-wider"
                >
                  Inquire
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Admin Dashboard: Fully functional metrics editor, reviews moderator and click log manager */}
        {currentTab === 'admin' && user?.isAdmin && (
          <div id="vouch-admin-view" className="p-6 md:p-8 space-y-10 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Shield className="h-6 w-6 text-rose-500" />
                Vouch Admin Central Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1">Audit active brand houses, manage corporate transparency grade benchmarks, calibrate authentic rating weights, and monitor organic referral logs.</p>
            </div>

            {/* Live stats section for Admin Matching Brand Trust Intelligence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-medium">
              <div className="bg-[#080e1b] border border-slate-800 rounded-xl p-4.5 space-y-1">
                <p className="text-xs text-slate-450 uppercase">Monitored Brand Houses</p>
                <p className="text-2xl font-mono font-extrabold text-[#12b76a]">{brands.length} Brands</p>
              </div>
              <div className="bg-[#080e1b] border border-slate-800 rounded-xl p-4.5 space-y-1">
                <p className="text-xs text-slate-450 uppercase">Verified Small Businesses</p>
                <p className="text-2xl font-mono font-extrabold text-[#12b76a]">{brands.filter(b => b.verified).length} Active</p>
              </div>
              <div className="bg-[#080e1b] border border-slate-800 rounded-xl p-4.5 space-y-1">
                <p className="text-xs text-slate-455 uppercase">Unmoderated User reviews</p>
                <p className="text-2xl font-mono font-extrabold text-[#12b76a]">{reviews.length} Active</p>
              </div>
              <div className="bg-[#080e1b] border border-slate-800 rounded-xl p-4.5 space-y-1">
                <p className="text-xs text-slate-450 uppercase">Vouch tracked affiliate revenue clicks</p>
                <p className="text-2xl font-mono font-extrabold text-indigo-400">
                  {Object.values(clickMetrics).reduce((acc: number, current: any) => acc + (Number(current) || 0), 0)} leads
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-medium">
              
              {/* Product create / edit form */}
              <div className="lg:col-span-8 bg-[#070b13] border border-slate-800 rounded-2xl p-6.5 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="h-5 w-5 text-[#12b76a]" />
                    {adminEditId ? 'Edit Scored Product Details' : 'Score and publish a new Product'}
                  </h2>
                  <p className="text-xs text-slate-400">Inputs calculate dynamic trust index immediately on submission.</p>
                </div>

                <form onSubmit={handleAdminProductSubmit} className="space-y-4 text-xs text-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={adminProductForm.name} 
                        onChange={(e) => setAdminProductForm({ ...adminProductForm, name: e.target.value })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                        placeholder="e.g. Redmi Note 13 Pro"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Brand Name</label>
                      <input 
                        type="text" 
                        required
                        value={adminProductForm.brand} 
                        onChange={(e) => setAdminProductForm({ ...adminProductForm, brand: e.target.value })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                        placeholder="e.g. Samsung / Apple"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Category Selection</label>
                      <select 
                        value={adminProductForm.category} 
                        onChange={(e) => setAdminProductForm({ ...adminProductForm, category: e.target.value })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                      >
                        {categoriesList.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Specification Description Summary</label>
                    <textarea 
                      value={adminProductForm.description} 
                      onChange={(e) => setAdminProductForm({ ...adminProductForm, description: e.target.value })}
                      className="w-full h-16 bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                      placeholder="Input highlight features..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Vouch Trust score (0-100)</label>
                      <input 
                        type="number" 
                        required
                        value={adminProductForm.trust_score} 
                        onChange={(e) => setAdminProductForm({ ...adminProductForm, trust_score: Number(e.target.value) })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Review Authenticity %</label>
                      <input 
                        type="number" 
                        required
                        value={adminProductForm.authenticity_score} 
                        onChange={(e) => setAdminProductForm({ ...adminProductForm, authenticity_score: Number(e.target.value) })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Warranty Score (0-100)</label>
                      <input 
                        type="number" 
                        required
                        value={adminProductForm.warranty_score} 
                        onChange={(e) => setAdminProductForm({ ...adminProductForm, warranty_score: Number(e.target.value) })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Sellers Return Rate %</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={adminProductForm.return_rate} 
                        onChange={(e) => setAdminProductForm({ ...adminProductForm, return_rate: Number(e.target.value) })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Complaint Rate %</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={adminProductForm.complaint_rate} 
                        onChange={(e) => setAdminProductForm({ ...adminProductForm, complaint_rate: Number(e.target.value) })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 flex items-center gap-2 pt-4">
                      <input 
                        type="checkbox" 
                        id="is_sponsored"
                        checked={adminProductForm.is_sponsored} 
                        onChange={(e) => setAdminProductForm({ ...adminProductForm, is_sponsored: e.target.checked })}
                        className="h-4 w-4 bg-[#0a1122]"
                      />
                      <label htmlFor="is_sponsored" className="text-[10px] uppercase font-bold text-slate-400 cursor-pointer">Paid Sponsored Badge</label>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-4">
                    <button 
                      type="submit"
                      className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-6 py-2.5 rounded-xl uppercase tracking-wider"
                    >
                      {adminEditId ? 'Update dynamic scores' : 'Publish model and score'}
                    </button>
                    {adminEditId && (
                      <button 
                        onClick={() => { setAdminEditId(null); setAdminProductForm({
                          name: '', brand: '', category: 'Skincare & Cream', description: '', price: 0,
                          rating: 4.5, trust_score: 90, authenticity_score: 90, transparency_score: 85,
                          warranty_score: 90, complaint_rate: 1.5, return_rate: 2.0, verified_review_rate: 90,
                          is_sponsored: false, is_premium_only: false
                        }); }}
                        className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 font-bold px-4 py-2.5 rounded-xl"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Brand transparency publishing */}
              <div className="lg:col-span-4 bg-[#070b13] border border-slate-800 rounded-2xl p-6.5 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#12b76a]" />
                    Archive Corporate Brand
                  </h2>
                  <p className="text-xs text-slate-400 text-slate-430">Setup corporate credibility transparency ratios and active customer service metrics.</p>
                </div>

                <form onSubmit={handleAdminAddBrand} className="space-y-4 text-xs text-slate-200">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Brand Corporate identity Name</label>
                    <input 
                      type="text" 
                      required
                      value={adminBrandForm.brand_name} 
                      onChange={(e) => setAdminBrandForm({ ...adminBrandForm, brand_name: e.target.value })}
                      className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Credibility Score</label>
                      <input 
                        type="number" 
                        required
                        value={adminBrandForm.credibility_score} 
                        onChange={(e) => setAdminBrandForm({ ...adminBrandForm, credibility_score: Number(e.target.value) })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Transparency Grade</label>
                      <input 
                        type="text" 
                        required
                        value={adminBrandForm.transparency_rating} 
                        onChange={(e) => setAdminBrandForm({ ...adminBrandForm, transparency_rating: e.target.value })}
                        className="w-full bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none"
                        placeholder="e.g. A+, B"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Compulsory corporate Warranty terms</label>
                    <textarea 
                      required
                      value={adminBrandForm.warranty_policy} 
                      onChange={(e) => setAdminBrandForm({ ...adminBrandForm, warranty_policy: e.target.value })}
                      className="w-full h-14 bg-[#0a1122] border border-slate-800 p-2 rounded focus:outline-none font-sans"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-2 rounded-lg uppercase tracking-wider transition"
                  >
                    Archive and score brand &rarr;
                  </button>
                </form>
              </div>
            </div>

            {/* Catalog management review lists */}
            <div className="bg-[#050914] border border-slate-800 rounded-2xl p-6.5 space-y-6">
              <h2 className="text-lg font-bold text-white">Direct-to-Consumer Product Catalogue (Monitored offerings)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-medium text-xs">
                  <thead>
                    <tr className="bg-[#0c142b] text-slate-400 border-b border-slate-800 text-slate-350 uppercase text-[9px] font-black tracking-widest">
                      <th className="p-3">DTC Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Trust score</th>
                      <th className="p-3">Auth %</th>
                      <th className="p-3 flex gap-0.5 items-center">Verified reviewer ratio</th>
                      <th className="p-3">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-white">{p.name} <span className="text-[10px] text-slate-500">({p.brand})</span></td>
                        <td className="p-3 text-slate-400">{p.category}</td>
                        <td className="p-3 font-mono"><span className={`px-1.5 py-0.5 rounded font-bold ${getScoreColor(p.trust_score)}`}>{p.trust_score}</span></td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">{p.authenticity_score}%</td>
                        <td className="p-3 font-mono text-slate-400">{p.verified_review_rate}% ratio</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setAdminEditId(p.id);
                                setAdminProductForm({
                                  name: p.name, brand: p.brand, category: p.category, description: p.description,
                                  price: p.price, rating: p.rating, trust_score: p.trust_score,
                                  authenticity_score: p.authenticity_score, transparency_score: p.transparency_score,
                                  warranty_score: p.warranty_score, complaint_rate: p.complaint_rate,
                                  return_rate: p.return_rate, verified_review_rate: p.verified_review_rate,
                                  is_sponsored: p.is_sponsored, is_premium_only: p.is_premium_only
                                });
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                              }}
                              className="text-indigo-400 hover:text-white bg-indigo-950/40 p-1.5 rounded border border-indigo-900/60 transition"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleAdminDeleteProduct(p.id)}
                              className="text-rose-400 hover:text-white bg-rose-950/40 p-1.5 rounded border border-rose-900/60 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User review moderation lists */}
            <div className="bg-[#050914] border border-slate-800 rounded-2xl p-6.5 space-y-6">
              <h2 className="text-lg font-bold text-white">Review Moderation queue</h2>
              <div className="space-y-3.5">
                {reviews.map(r => {
                  const targetP = products.find(p => p.id === r.product_id);
                  return (
                    <div key={r.id} className="bg-[#0c1228] border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{r.author}</span>
                          <span className={`${r.verified ? 'bg-emerald-950/80 text-[#12b76a]' : 'bg-rose-950/80 text-rose-400'} text-[9px] font-black uppercase px-2 py-0.2 rounded border border-slate-800`}>
                            {r.verified ? 'Verified buyer' : 'Suspicious / bot'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">on model: <strong className="text-slate-250 font-bold">{targetP?.name || r.product_id}</strong></span>
                        </div>
                        <p className="text-xs text-slate-400 italic mt-2">"{r.review_text}"</p>
                      </div>
                      <button 
                        onClick={() => handleAdminDeleteReview(r.id)}
                        className="text-xs text-rose-400 hover:text-white border border-rose-900/80 hover:bg-rose-950 px-3 py-1.5 rounded-lg transition"
                      >
                        Delete Review
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Detail Overlay Page when item is clicked */}
        {selectedProductDetails && (
          <div id="vouch-detail-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#060b18] border border-slate-800 max-w-4xl w-full rounded-2xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
              
              <button 
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-[#03060c] p-2 rounded-xl h-fit border border-slate-800"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Product Image Section */}
              <div className="w-full md:w-1/2 bg-[#02050c] p-6.5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 overflow-y-auto">
                <div className="space-y-4">
                  <div className="h-56 rounded-xl overflow-hidden border border-slate-800">
                    <img 
                      src={selectedProductDetails.image_url} 
                      alt={selectedProductDetails.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">{selectedProductDetails.brand} &bull; {selectedProductDetails.category}</span>
                    <h2 className="text-lg font-black text-white mt-1">{selectedProductDetails.name}</h2>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{selectedProductDetails.description}</p>
                </div>

                <div className="pt-6 border-t border-slate-800 space-y-4">
                  {/* Affiliate Actions in modal as specified */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button 
                      onClick={() => handleAffiliateClick(selectedProductDetails.id, 'official', selectedProductDetails.name)}
                      className="bg-[#12b76a]/10 hover:bg-[#12b76a] text-emerald-400 hover:text-slate-950 p-2.5 rounded-xl border border-[#12b76a]/20 text-center transition uppercase font-black tracking-wider flex items-center justify-center gap-1.5"
                    >
                      Official Store <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleAffiliateClick(selectedProductDetails.id, 'croma', selectedProductDetails.name)}
                      className="bg-teal-600/10 hover:bg-teal-600 text-teal-400 hover:text-white p-2.5 rounded-xl border border-teal-600/20 text-center transition uppercase font-black tracking-wider flex items-center justify-center gap-1.5"
                    >
                      Croma Store <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time calculated Integrity report section & Trusted Circle tabs */}
              <div className="w-full md:w-1/2 p-6.5 overflow-y-auto flex flex-col justify-between max-h-[90vh]">
                <div className="space-y-4">
                  
                  {/* Tab Selector Row */}
                  <div className="flex border-b border-slate-800/80 pb-2 justify-between items-center">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setDetailModalTab('metrics')}
                        className={`text-xs uppercase font-extrabold pb-2 tracking-wider border-b-2 transition flex items-center gap-1.5 ${
                          detailModalTab === 'metrics' 
                            ? 'border-emerald-500 text-emerald-400' 
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        📊 Integrity Metrics
                      </button>
                      <button 
                        onClick={() => setDetailModalTab('circle')}
                        className={`text-xs uppercase font-extrabold pb-2 tracking-wider border-b-2 transition flex items-center gap-1.5 ${
                          detailModalTab === 'circle' 
                            ? 'border-indigo-500 text-indigo-400' 
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        👥 Trusted Circle
                        <span className="text-[8px] bg-indigo-500/15 text-[#12b76a] font-black uppercase px-1.5 py-0.5 rounded border border-indigo-500/10 animate-pulse">LIVE</span>
                      </button>
                    </div>
                  </div>

                  {detailModalTab === 'metrics' ? (
                    <div className="space-y-5">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Scoring and Integrity metrics report</h3>
                      
                      {/* Big Core Score Circle */}
                      <div className="flex items-center gap-4 bg-[#0a1122] p-4 rounded-xl border border-slate-800">
                        <div className={`h-16 w-16 rounded-full border-2 flex items-center justify-center text-xl font-extrabold font-mono ${getScoreColor(selectedProductDetails.trust_score)}`}>
                          {selectedProductDetails.trust_score}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{getScoreBadgeText(selectedProductDetails.trust_score)}</p>
                          <p className="text-[10px] text-[#12b76a] font-bold">Heuristic recalculation active</p>
                          <p className="text-[10px] text-slate-450 mt-0.5">Dynamically evaluated model integrity standard based on claims filed</p>
                        </div>
                      </div>

                      {/* Progressive integrity lists */}
                      <div className="space-y-3.5 text-xs text-slate-300 font-medium">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400 flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5 text-[#12b76a]" />
                              Review Authenticity index
                            </span>
                            <span className="text-emerald-400 font-bold">{selectedProductDetails.authenticity_score}% Genuine matches</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full" style={{ width: `${selectedProductDetails.authenticity_score}%` }} />
                          </div>
                          <p className="text-[9px] text-slate-450 leading-normal">
                            ({100 - selectedProductDetails.authenticity_score}% suspicious bot postings flagged or zeroed)
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Award className="h-3.5 w-3.5 text-indigo-400" />
                              Warranty Compliance Level
                            </span>
                            <span className="text-[#12b76a] font-bold">{selectedProductDetails.warranty_score} / 100</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-400 h-full" style={{ width: `${selectedProductDetails.warranty_score}%` }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 font-mono text-[10px] pt-1">
                          <div className="bg-[#030612] p-2 rounded border border-slate-850">
                            <span className="text-slate-450 font-sans block text-[9px] uppercase">RETURN RATE (RMA)</span>
                            <span className={selectedProductDetails.return_rate > 3.0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                              {selectedProductDetails.return_rate}% of sales
                            </span>
                          </div>
                          <div className="bg-[#030612] p-2 rounded border border-slate-850">
                            <span className="text-slate-450 font-sans block text-[9px] uppercase">COMPLAINT RATE</span>
                            <span className="text-slate-200 font-bold">{selectedProductDetails.complaint_rate}% of sales</span>
                          </div>
                        </div>
                      </div>

                      {/* Reviews section inside modal */}
                      <div className="border-t border-slate-800 pt-4 space-y-3">
                        <h4 className="text-xs font-black uppercase text-slate-400">Calculated Buyer Reviews</h4>
                        
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {reviews.filter(r => r.product_id === selectedProductDetails.id).map(r => (
                            <div key={r.id} className="bg-[#030713]/85 p-2.5 rounded border border-slate-850">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-350 font-bold">{r.author}</span>
                                <span className={r.verified ? "text-emerald-400" : "text-rose-400"}>
                                  {r.verified ? "✓ Verified buyer" : "⚠ Non-Verified (Filtered)"}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 italic mt-1 leading-normal">"{r.review_text}"</p>
                            </div>
                          ))}
                        </div>

                        {/* Add Review Form */}
                        <form onSubmit={(e) => handlePostReview(e, selectedProductDetails.id)} className="space-y-2 bg-[#030714] p-3 rounded-lg border border-slate-850">
                          <p className="text-[10px] uppercase font-black text-slate-450 font-sans">Contribute your transaction feedback</p>
                          {reviewSuccessMsg && <p className="text-[10px] text-emerald-400 font-bold">{reviewSuccessMsg}</p>}
                          
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              required
                              value={reviewForm.author} 
                              onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                              placeholder="Your name"
                              className="bg-slate-950 border border-slate-850 p-1 px-2 rounded text-[10px] focus:outline-none focus:border-emerald-500 text-slate-100"
                            />
                            <select 
                              value={reviewForm.rating} 
                              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                              className="bg-slate-950 border border-slate-850 p-1 px-2 rounded text-[10px] text-slate-200"
                            >
                              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                              <option value="4">⭐⭐⭐⭐ (4/5)</option>
                              <option value="3">⭐⭐⭐ (3/5)</option>
                              <option value="2">⭐⭐ (2/5)</option>
                              <option value="1">⭐ (1/5)</option>
                            </select>
                          </div>

                          <div className="flex gap-1.5 items-center">
                            <input 
                              type="checkbox" 
                              id="form-verified"
                              checked={reviewForm.verified} 
                              onChange={(e) => setReviewForm({ ...reviewForm, verified: e.target.checked })}
                              className="h-3 w-3 bg-slate-950" 
                            />
                            <label htmlFor="form-verified" className="text-[9px] text-slate-400 font-bold select-none cursor-pointer">I bought this device with registered receipt</label>
                          </div>

                          <input 
                            type="text" 
                            required
                            value={reviewForm.text} 
                            onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                            placeholder="Share actual warranty resolution speed or build defects..."
                            className="w-full bg-slate-950 border border-slate-850 p-1.5 px-2 rounded text-[10px] focus:outline-none focus:border-emerald-500 text-slate-200"
                          />

                          <button 
                            type="submit"
                            className="w-full bg-[#12b76a] text-slate-950 hover:bg-[#10a15b] transition text-[10px] font-black uppercase py-1 rounded cursor-pointer"
                          >
                            Post with integrity engine recalculate
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    // TRUSTED CIRCLE VIEW MODULE (BASED ON IMAGE 1 & IMAGE 3)
                    <div className="space-y-4 font-sans animate-fadeIn">
                      
                      {/* Circle Score circular design */}
                      <div className="flex items-center gap-4 bg-[#050a18] p-4 rounded-xl border border-indigo-900/40">
                        <div className="relative h-16 w-16 rounded-full border-2 border-indigo-500/80 flex flex-col items-center justify-center text-center bg-slate-950">
                          <span className="text-lg font-black text-indigo-400 leading-none">
                            {selectedProductDetails.trusted_circle_score || 91}
                          </span>
                          <span className="text-[7px] text-slate-400 uppercase tracking-widest font-bold">Circle</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-black px-1.5 py-0.5 rounded uppercase text-[10px] tracking-wide">Excellent Circle score</span>
                            <span className="text-[9px] text-[#12b76a] font-bold">96% Approval Match</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1">Aggregated rating from real-world peers, advisors, and professional mentors.</p>
                        </div>
                      </div>

                      {/* Your Trusted Circle Activity Panel */}
                      <div className="bg-[#030612] bg-gradient-to-b from-[#060b18]/45 to-transparent border border-slate-800/80 p-4.5 rounded-2xl relative">
                        
                        {/* Peer Private Data Pill */}
                        <div className="absolute top-3.5 right-3.5 bg-emerald-950/45 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-900/30">
                          PEER PRIVATE DATA
                        </div>

                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-[#12b76a]" />
                          <h4 className="text-xs font-black text-white tracking-tight uppercase">Your Trusted Circle Activity</h4>
                        </div>
                        <p className="text-[10px] text-slate-405 leading-relaxed mt-1">
                          Aggregated recommendations from friends, peers, and mentors you follow on Vouch.
                        </p>

                        {/* Grid of 4 counters compiles from Image 3 */}
                        <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850/80 flex flex-col justify-center min-h-[50px]">
                            <span className="text-lg font-black font-mono text-emerald-450 leading-none">
                              {selectedProductDetails.trusted_circle_activity?.friends || 8}
                            </span>
                            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1 block leading-tight">FRIENDS REC.</span>
                          </div>
                          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850/80 flex flex-col justify-center min-h-[50px]">
                            <span className="text-lg font-black font-mono text-amber-400 leading-none">
                              {selectedProductDetails.trusted_circle_activity?.purchased || 2}
                            </span>
                            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1 block leading-tight">FAMILY PUR.</span>
                          </div>
                          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850/80 flex flex-col justify-center min-h-[50px]">
                            <span className="text-lg font-black font-mono text-indigo-400 leading-none">
                              {selectedProductDetails.trusted_circle_activity?.mentors || 3}
                            </span>
                            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1 block leading-tight">MENTORS TRUST</span>
                          </div>
                          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850/80 flex flex-col justify-center min-h-[50px]">
                            <span className="text-lg font-black font-mono text-teal-400 leading-none">
                              {selectedProductDetails.trusted_circle_activity?.experts || 3}
                            </span>
                            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1 block leading-tight">EXPERTS REC.</span>
                          </div>
                        </div>

                        {/* Recent Peer Endorsement actions, exactly as listed in image 3 */}
                        <div className="mt-4 border-t border-slate-850 pt-3">
                          <h5 className="text-[9px] font-black uppercase text-slate-450 tracking-wider mb-2">RECENT PEER ENDORSEMENT ACTIONS</h5>
                          
                          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                            {(selectedProductDetails.trusted_circle_feed || []).map((item, idx) => {
                              const initials = item.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                              
                              let roleColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                              if (item.role === 'MENTOR') {
                                roleColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                              } else if (item.role === 'EXPERT') {
                                roleColor = "bg-teal-500/10 text-teal-400 border border-teal-500/20";
                              }

                              return (
                                <div key={item.id || idx} className="flex items-center justify-between bg-slate-950/80 p-2 rounded-xl border border-slate-850/40 hover:border-slate-800 transition">
                                  <div className="flex items-center gap-2.5 text-xs truncate">
                                    <div className="h-7 w-7 rounded-full bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 flex items-center justify-center text-[10px] font-black shrink-0">
                                      {initials || "PE"}
                                    </div>
                                    <div className="truncate">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-extrabold text-white text-[11px] shrink-0">{item.author}</span>
                                        <span className={`text-[8px] px-1 rounded uppercase font-black shrink-0 ${roleColor}`}>{item.role}</span>
                                      </div>
                                      <p className="text-[9px] text-slate-400 italic mt-0.5 leading-normal truncate">"{item.text}"</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Voting Poll & Actions Block */}
                      <div className="bg-[#040816] border border-slate-850 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <span className="text-[11px] font-black text-indigo-300 uppercase shrink-0">Quick Interactions Poll</span>
                            <p className="text-[9px] text-slate-450">Join consensus anonymously to update your friends' scores instantly</p>
                          </div>
                        </div>

                        {/* Recommendation Trigger buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            disabled={!!votedProductAspects[`${selectedProductDetails.id}_recommend`]}
                            onClick={() => handleVoteProductCircle(selectedProductDetails.id, 'recommend')}
                            className={`p-2.5 rounded-xl border text-[10px] uppercase font-black tracking-wider transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                              votedProductAspects[`${selectedProductDetails.id}_recommend`] 
                                ? 'bg-[#12b76a]/10 border-[#12b76a]/30 text-emerald-400'
                                : 'bg-slate-950 border-slate-850 text-slate-300 hover:text-white hover:bg-slate-900'
                            }`}
                          >
                            <span className="text-[11px]">👍</span>
                            {votedProductAspects[`${selectedProductDetails.id}_recommend`] ? "Recommended!" : "Recommend Model"}
                          </button>
                          
                          <button 
                            disabled={!!votedProductAspects[`${selectedProductDetails.id}_purchase`]}
                            onClick={() => handleVoteProductCircle(selectedProductDetails.id, 'purchase')}
                            className={`p-2.5 rounded-xl border text-[10px] uppercase font-black tracking-wider transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                              votedProductAspects[`${selectedProductDetails.id}_purchase`] 
                                ? 'bg-amber-400/10 border-amber-500/20 text-amber-400'
                                : 'bg-slate-950 border-slate-850 text-slate-300 hover:text-white hover:bg-slate-900'
                            }`}
                          >
                            <span className="text-[11px]">🛒</span>
                            {votedProductAspects[`${selectedProductDetails.id}_purchase`] ? "Bought and Logged!" : "Log Purchase"}
                          </button>
                        </div>

                        {/* Polling Question 1 */}
                        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850/60 space-y-1.5 text-[10px]">
                          <div className="flex justify-between items-baseline text-[9px] font-bold text-slate-400">
                            <span>SURVEY: Meets design expectations?</span>
                            <span className="text-emerald-400">93% Confirmed YES</span>
                          </div>
                          
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full" style={{ width: "93%" }} />
                          </div>

                          <div className="flex gap-2 justify-end pt-1">
                            <button 
                              disabled={!!votedProductAspects[`${selectedProductDetails.id}_expectations`]}
                              onClick={() => handleVoteProductCircle(selectedProductDetails.id, 'expectations_yes')}
                              className="bg-emerald-950 hover:bg-emerald-900/60 text-emerald-400 text-[9px] font-black uppercase px-2 py-1 rounded"
                            >
                              ✓ Yes, Met
                            </button>
                            <button 
                              disabled={!!votedProductAspects[`${selectedProductDetails.id}_expectations`]}
                              onClick={() => handleVoteProductCircle(selectedProductDetails.id, 'expectations_no')}
                              className="bg-rose-955 hover:bg-rose-900/65 text-rose-455 text-[9px] font-black uppercase px-2 py-1 rounded"
                            >
                              ✗ No, Unmet
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Vouch Pros & Cons Analysis compiled from Image 3 */}
                      <div className="bg-[#030612] bg-gradient-to-b from-[#060b18]/15 to-transparent border border-slate-800/80 p-4.5 rounded-2xl relative text-[10px] leading-relaxed">
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-xs font-black text-white tracking-tight uppercase flex items-center gap-1">
                            <Shield className="h-4 w-4 text-indigo-400" />
                            Vouch Pros & Cons Analysis
                          </h4>
                          <span className="text-[8px] bg-slate-900 text-slate-400 font-bold px-1.5 py-0.2 rounded uppercase tracking-widest pl-1 border border-slate-800">
                            AUDITED LIST
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-450 mb-3 block">Audited lists compiled from actual verified purchaser records.</p>
                        
                        <div className="space-y-2 mt-2">
                          <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/20 text-emerald-300">
                            <strong>✓ ADVANTAGES:</strong> Consistent build performance standards, reliable local service warranty indices, and highly genuine review profiles.
                          </div>
                          <div className="bg-rose-950/35 p-2.5 rounded-xl border border-rose-900/20 text-rose-300">
                            <strong>⚠ DISADVANTAGES:</strong> Higher upfront price matches or slightly slower setup response curves for non-technical users.
                          </div>
                        </div>

                        {/* Audit verification badge */}
                        <div className="flex justify-end pt-3 text-[9px] font-bold text-emerald-405 mt-2.5">
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 uppercase font-black tracking-widest leading-none">
                            <span className="h-1.5 w-1.5 bg-[#12b76a] rounded-full inline-block animate-pulse"></span>
                            AUDIT COMPLIANCE: PASS VERIFICATION
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

        {/* Brand Overview Modal */}
        {selectedBrandOverview && (
          <div id="vouch-brand-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#060b18] border border-slate-800 max-w-2xl w-full rounded-2xl overflow-hidden relative shadow-2xl p-6.5 max-h-[90vh] overflow-y-auto space-y-6">
              
              <button 
                onClick={() => setSelectedBrandOverview(null)}
                className="absolute top-4 right-4 text-slate-450 hover:text-[#0f172a] bg-[#03060c] p-2 rounded-xl h-fit border border-slate-800 cursor-pointer text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title & Brand Meta info */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-white">{selectedBrandOverview.brand_name}</h2>
                  {selectedBrandOverview.verified && (
                    <span className="bg-emerald-950/70 text-[#12b76a] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-900/30 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Audit Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Website: <a href={selectedBrandOverview.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-1">{selectedBrandOverview.website} <ExternalLink className="h-3 w-3 inline" /></a> &middot; Established: <span className="text-slate-200 mt-0.5 font-bold font-mono">{selectedBrandOverview.years_in_business} Years</span>
                </p>
              </div>

              {/* Scam Risk Indicator Segment */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                selectedBrandOverview.scam_risk_level === 'danger'
                  ? 'bg-rose-50 border-rose-250 text-rose-900 border-rose-300'
                  : 'bg-emerald-50 border-emerald-250 text-emerald-900 border-emerald-300'
              }`}>
                {selectedBrandOverview.scam_risk_level === 'danger' ? (
                  <ShieldAlert className="h-6 w-6 text-rose-600 animate-pulse shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="text-slate-900">
                  <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 font-display text-slate-900">
                    Scam Risk Indicator: <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      selectedBrandOverview.scam_risk_level === 'danger' ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                    }`}>{selectedBrandOverview.scam_risk || 'Very Low (Safe)'}</span>
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 leading-normal">
                    {selectedBrandOverview.scam_risk_description || "Consistent market registry footprint, confirmed customer service channels, and positive physical inventory audits mean this brand presents extremely low risk of financial loss, falsified reviews, or warranty dodging."}
                  </p>
                </div>
              </div>

              {/* AI Trust Summary Segment */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-indigo-900/10 to-slate-950 border border-indigo-500/25 text-[#e0e7ff] shadow-inner space-y-1">
                <h4 className="text-[10px] text-indigo-300 uppercase tracking-widest font-extrabold flex items-center gap-1.5 font-display">
                  <span>★ AI Trust Summary Insight</span>
                </h4>
                <p className="text-xs text-indigo-100 font-medium leading-relaxed italic">
                  "{selectedBrandOverview.insights || "Consistent market registry footprint, confirmed customer service channels, and positive physical inventory audits mean this brand presents extremely low risk of financial loss, falsified reviews, or warranty dodging."}"
                </p>
              </div>

              {/* Detailed Trusted Circle Stats in Brand Profile Modal */}
              <div className="bg-[#030611] p-4 rounded-xl border border-slate-850/80 space-y-2.5">
                <h4 className="text-[10px] text-indigo-300 uppercase tracking-widest font-extrabold flex items-center gap-1.5 font-display">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Trusted Circle Verification Activity</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/85">
                    <span className="text-lg font-black font-mono text-emerald-400 leading-none">
                      {selectedBrandOverview.trusted_circle_activity?.friends || 4}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Friends Recommend</span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/85">
                    <span className="text-lg font-black font-mono text-amber-400 leading-none">
                      {selectedBrandOverview.trusted_circle_activity?.purchased || 10}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Family Purchased</span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/85">
                    <span className="text-lg font-black font-mono text-indigo-350 leading-none">
                      {selectedBrandOverview.trusted_circle_activity?.mentors || 2}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Mentors Trust</span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/85">
                    <span className="text-lg font-black font-mono text-teal-400 leading-none">
                      {selectedBrandOverview.trusted_circle_activity?.experts || 5}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Experts Recommend</span>
                  </div>
                </div>
              </div>

              {/* Trust Score Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Trust Score Components</h3>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-450 uppercase font-black">Overall Rating:</span>
                    <p className={`text-xl font-mono font-black ${
                      selectedBrandOverview.credibility_score >= 80 ? 'text-emerald-400' : selectedBrandOverview.credibility_score >=65 ? 'text-amber-400' : 'text-rose-500'
                    }`}>{selectedBrandOverview.credibility_score} / 100</p>
                  </div>
                </div>

                {/* Score Specific Weights calculated exactly as requested */}
                {(() => {
                  const breakdown = selectedBrandOverview.weight_breakdown || {
                    verification: selectedBrandOverview.verified ? 92 : 30,
                    sat: selectedBrandOverview.customer_service_score || 85,
                    transparency: selectedBrandOverview.transparency_score || 80,
                    consistency: selectedBrandOverview.credibility_score - 2 || 83,
                    community: selectedBrandOverview.credibility_score + 4 || 89,
                    circle: selectedBrandOverview.trusted_circle_score || 85,
                    maturity: Math.min(100, selectedBrandOverview.years_in_business * 8)
                  };

                  const components = [
                    { name: 'Verification Score – 20%', weight: 20, score: breakdown.verification || breakdown.verification === 0 ? breakdown.verification : 80 },
                    { name: 'Customer Satisfaction Score (In App) – 20%', weight: 20, score: breakdown.sat || breakdown.sat === 0 ? breakdown.sat : 85 },
                    { name: 'Transparency Score – 20%', weight: 20, score: breakdown.transparency || breakdown.transparency === 0 ? breakdown.transparency : 80 },
                    { name: 'Consistency Score – 15%', weight: 15, score: breakdown.consistency || breakdown.consistency === 0 ? breakdown.consistency : 85 },
                    { name: 'Community Trust Score (Reviews) – 10%', weight: 10, score: breakdown.community || breakdown.community === 0 ? breakdown.community : 85 },
                    { name: 'Trusted Circle Score – 5%', weight: 5, score: breakdown.circle || breakdown.circle === 0 ? breakdown.circle : 85 },
                    { name: 'Brand Maturity Score – 10%', weight: 10, score: breakdown.maturity || breakdown.maturity === 0 ? breakdown.maturity : 80 }
                  ];

                  return (
                    <div className="space-y-3.5 bg-[#030611] p-4.5 rounded-xl border border-slate-850">
                      <div className="text-[10.5px] text-slate-400 flex items-center justify-between mb-1 font-mono">
                        <span>Evaluation Component</span>
                        <span>Weight Influence</span>
                      </div>
                      
                      {components.map((c, i) => {
                        const contribution = ((c.score * c.weight) / 100).toFixed(1);
                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-300 font-bold">{c.name}</span>
                              <span className="text-white font-mono font-bold">
                                {c.score}% <span className="text-slate-500 font-normal">({contribution}% of {c.weight}%)</span>
                              </span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  c.score >= 80 ? 'bg-emerald-500' : c.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                }`} 
                                style={{ width: `${c.score}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })}

                      {/* Summary Contribution row */}
                      <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs font-bold text-slate-200">
                        <span>Computed Net Score (Weighted Sum):</span>
                        <span className="font-mono text-[#12b76a] font-black text-sm">
                          {components.reduce((acc, curr) => acc + (curr.score * curr.weight) / 100, 0).toFixed(1)} / 100
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Extra Perks Adv/Dis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <h5 className="text-[10px] text-emerald-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Brand Advantages
                  </h5>
                  <ul className="space-y-1">
                    {(selectedBrandOverview.advantages || ["Solid customer complaint responses", "Direct OEM quality parts standard"]).map((adv, idx) => (
                      <li key={idx} className="text-xs text-slate-350 flex items-start gap-1">
                        <span className="text-emerald-500 shrink-0">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-[10px] text-rose-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> Identified Bottlenecks
                  </h5>
                  <ul className="space-y-1">
                    {(selectedBrandOverview.disadvantages || ["Premium product markup pricing", "Requires digital claim portal submission"]).map((dis, idx) => (
                      <li key={idx} className="text-xs text-slate-350 flex items-start gap-1">
                        <span className="text-rose-450 shrink-0">•</span>
                        <span>{dis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Warranty and Close actions */}
              <div className="bg-[#030612] p-3 rounded-lg text-xs flex justify-between items-center border border-slate-850 gap-4 mt-2">
                <div>
                  <span className="text-slate-450 text-[9px] uppercase tracking-wider font-bold block">Assigned Warranty Standard:</span>
                  <p className="text-slate-200 font-bold mt-0.5">{selectedBrandOverview.warranty_policy || "1 Year General Coverage"}</p>
                </div>
                <button
                  onClick={() => setSelectedBrandOverview(null)}
                  className="bg-[#12b76a] hover:bg-[#10a15b] text-slate-950 text-xs font-black uppercase px-4 py-2 rounded-xl transition shrink-0 cursor-pointer"
                >
                  Close Heuristics View
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Global authentication modal */}
        {showAuthModal && (
          <div id="vouch-auth-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-medium">
            <div className="bg-[#060b18] border border-slate-800 p-6.5 rounded-2xl max-w-sm w-full relative space-y-4">
              <button 
                onClick={() => { setShowAuthModal(false); setAuthError(''); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-white">{authForm.isRegister ? 'Join Vouch' : 'Sign In to Vouch'}</h3>
                <p className="text-xs text-slate-400 text-slate-420">Verify review integrity algorithms and compare full warranty compliance.</p>
              </div>

              {authError && (
                <div className="bg-rose-950/40 text-rose-400 border border-rose-900/30 text-xs p-2.5 rounded-lg text-center font-bold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs text-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-450">Username</label>
                  <input 
                    type="text" 
                    required
                    value={authForm.username} 
                    onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                    className="w-full bg-[#030611] border border-slate-850 p-2 rounded focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. buyer_expert"
                  />
                </div>

                {authForm.isRegister && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-450">Email address</label>
                    <input 
                      type="email" 
                      required
                      value={authForm.email} 
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full bg-[#030611] border border-slate-850 p-2 rounded focus:outline-none focus:border-emerald-500"
                      placeholder="you@vouch.in"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-450">Password</label>
                  <input 
                    type="password" 
                    required
                    value={authForm.password} 
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full bg-[#030611] border border-slate-850 p-2 rounded focus:outline-none focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#12b76a] hover:bg-[#10a15b] transition text-slate-950 font-black text-xs py-2.5 rounded-xl uppercase tracking-wider"
                >
                  {authForm.isRegister ? 'Publish profile' : 'Authenticated login'}
                </button>
              </form>

              {/* BackDoor logs helper */}
              <div className="bg-[#030612]/90 border border-slate-850 p-2 rounded text-[10px] space-y-1">
                <p className="text-slate-550 font-bold uppercase text-[8px] tracking-widest">Backdoor direct logins:</p>
                <div className="text-slate-400 flex flex-wrap gap-1.5 leading-normal">
                  <span onClick={() => setAuthForm({ username: 'admin', email: 'admin@vouch.in', password: 'adminpassword', isRegister: false })} className="cursor-pointer underline text-[#12b76a]">Admin (admin / adminpassword)</span>
                  <span onClick={() => setAuthForm({ username: 'premium_user', email: 'premium@vouch.in', password: 'password', isRegister: false })} className="cursor-pointer underline text-indigo-400">Premium (premium_user / password)</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <button 
                  onClick={() => setAuthForm({ ...authForm, isRegister: !authForm.isRegister })}
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  {authForm.isRegister ? 'Already have an profile? Login' : 'First connection? Register catalog'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Brand credit Footer */}
        <footer id="vouch-footer" className="p-6 bg-[#040813] border-t border-slate-850 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#12b76a]" />
            <span>&copy; 2026 Vouch &bull; Indias consumer credit scoring standard.</span>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[10px]">
            <span>BOT DETECTOR ACTIVE</span>
            <span>SECURE ENCRYPTED DB</span>
            <span>AFFILIATE TRACKING MODULE</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
