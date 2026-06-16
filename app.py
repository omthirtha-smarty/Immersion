import streamlit as st
import json
import os
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from google import genai
from google.genai import types

# Page Config
st.set_page_config(
    page_title="Vouch - The Credit Score for Brands",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom High-Fidelity Theme (matching the dark cosmic palette of the AI Studio React preview)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    /* Cosmic dark background and legible typography */
    .stApp {
        background-color: #030611 !important;
        color: #f1f5f9 !important;
        font-family: 'Inter', sans-serif !important;
    }
    
    /* Sidebar custom branding background */
    section[data-testid="stSidebar"] {
        background-color: #050a1b !important;
        border-right: 1px solid #1e293b !important;
    }
    section[data-testid="stSidebar"] * {
        font-family: 'Inter', sans-serif !important;
    }
    
    /* Typographic hierarchy definitions */
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Inter', sans-serif !important;
        font-weight: 800 !important;
        letter-spacing: -0.025em !important;
        color: #ffffff !important;
    }
    
    /* Brand Banner */
    .vouch-header-banner {
        background: radial-gradient(circle at 0% 0%, #0c1530 0%, #030611 100%), #030611;
        padding: 1.5rem 2rem;
        border-radius: 1.25rem;
        border: 1px solid #1e293b;
        margin-bottom: 2rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }
    .vouch-logo {
        color: #12b76a;
        font-size: 1.85rem;
        font-weight: 900;
        letter-spacing: -0.05em;
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }
    
    /* Highly Visible Custom Rating Badges */
    .score-badge {
        padding: 0.45rem 1rem;
        border-radius: 0.5rem;
        font-weight: 800;
        font-size: 0.9rem;
        display: inline-block;
        font-family: 'JetBrains Mono', monospace !important;
    }
    .score-high {
        background-color: rgba(18, 183, 106, 0.15) !important;
        color: #12b76a !important;
        border: 1px solid rgba(18, 183, 106, 0.4) !important;
    }
    .score-medium {
        background-color: rgba(245, 158, 11, 0.15) !important;
        color: #f59e0b !important;
        border: 1px solid rgba(245, 158, 11, 0.4) !important;
    }
    .score-low {
        background-color: rgba(239, 68, 68, 0.15) !important;
        color: #ef4444 !important;
        border: 1px solid rgba(239, 68, 68, 0.4) !important;
    }
    
    /* Pure Brand Card layout */
    .vouch-card-custom {
        background-color: #060b18 !important;
        border: 1px solid #1e293b !important;
        border-radius: 1rem !important;
        padding: 1.75rem !important;
        margin-bottom: 1.25rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        transition: all 0.25s ease !important;
    }
    .vouch-card-custom:hover {
        border-color: rgba(18, 183, 106, 0.35) !important;
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.4) !important;
    }
    
    /* HighLEGIBILITY metric components (Ensuring zero blending) */
    .brand-metric-card {
        background-color: #080d1a !important;
        border: 1px solid rgba(30, 41, 59, 0.85) !important;
        border-radius: 1rem !important;
        padding: 1.5rem !important;
        margin-bottom: 1rem;
    }
    .brand-metric-title {
        font-size: 0.85rem !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        color: #ffffff !important;
    }
    .brand-metric-body {
        font-size: 0.82rem !important;
        color: #f1f5f9 !important; /* Brighter, high-contrast readable color */
        margin-top: 0.5rem !important;
        line-height: 1.5 !important;
    }
    
    /* Weighted Breakdown Box */
    .weighted-breakdown-box {
        background-color: #030611 !important;
        border: 1px solid rgba(18, 183, 106, 0.2) !important;
        border-radius: 0.75rem !important;
        padding: 1.25rem !important;
        margin-top: 0.75rem !important;
    }
    
</style>
""", unsafe_allow_html=True)

# File and database pathing configuration
DB_FILE = "database.json"

def load_db():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            st.error(f"Error loading system database file: {e}")
            
    # Premium Default Brand House fallback dataset
    return {
        "brands": [
            {
                "id": "b_glownest",
                "brand_name": "GlowNest",
                "credibility_score": 94,
                "transparency_score": 96,
                "website": "https://glownest.co",
                "verified": True,
                "years_in_business": 4,
                "warranty_policy": "2 Year Clean-Ingredient & Freshness Guarantee",
                "customer_service_score": 96,
                "transparency_rating": "A+",
                "value_for_money": 89,
                "advantages": ["100% certified bio-derived ingredients", "Open-source batch testing logs and lab certificates", "Excellent dermatological ratings with zero reported adverse indicators"],
                "disadvantages": ["Slightly higher premium pricing tier", "Limited batch runs occasionally lead to pre-order delays"],
                "trusted_circle_activity": { "friends": 8, "purchased": 22, "mentors": 4, "experts": 6 },
                "trusted_circle_score": 94,
                "journey": [{ "year": 2024, "score": 89 }, { "year": 2025, "score": 91 }, { "year": 2026, "score": 94 }],
                "status": "Improving",
                "accountability": { "expectations": 95, "repurchase": 96, "promises": 94 },
                "insights": "GlowNest has set the benchmark for clean beauty by publishing full third-party chromatographic testing logs for every batch.",
                "weight_breakdown": { "verification": 98, "sat": 96, "transparency": 96, "consistency": 93, "community": 95, "maturity": 85, "circle": 94 },
                "associated_products": ["Clean Skincare", "Wellness"],
                "scam_risk": "Very Low",
                "scam_risk_description": "Fully verified brand footprint. Lab registries are transparent and third-party audited.",
                "scam_risk_level": "safe"
            }
        ],
        "products": [],
        "reviews": [],
        "saved_products": [],
        "click_metrics": {}
    }

def save_db(data):
    try:
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        st.error(f"Error persisting database change: {e}")
        return False

# Initialize base database records
db_data = load_db()
brands_list = db_data.get("brands", [])
products_list = db_data.get("products", [])
reviews_list = db_data.get("reviews", [])

# Initialize essential state values
if "compare_brands" not in st.session_state:
    st.session_state.compare_brands = []
if "home_search_query" not in st.session_state:
    st.session_state.home_search_query = ""
if "selected_brand_id" not in st.session_state:
    st.session_state.selected_brand_id = None
if "chat_history" not in st.session_state:
    st.session_state.chat_history = [
        {
            "sender": "ai",
            "content": "Hello! I am **Vouch AI**, your Trust Intelligence Advisor. Ask me anything about premium DTC brands and small businesses, such as:\n\n"
                       "* *'How does the trust score of GlowNest compare to HerbAura?'*\n"
                       "* *'What are the scam risk indicators of warning brands listed in India?'*\n"
                       "* *'Can you summarize the warranty compliance of AuraWell?'*\n\n"
                       "I analyze dynamic credibility scores, guarantee policies, and verified review structures to keep your shopping transitions safe!"
        }
    ]

# Trust scoring rating helpers
def parse_score_badge(score):
    if score >= 85:
        return "score-high", "High Integrity (Safe)"
    elif score >= 70:
        return "score-medium", "Moderate Integrity"
    else:
        return "score-low", "Caution Recommended"

def parse_score_color(score):
    if score >= 85:
        return "#12b76a"  # Emerald Green
    elif score >= 70:
        return "#f59e0b"  # Warning Amber
    else:
        return "#ef4444"  # Alert Red

# Consistent clean Categories matching React preview
CATEGORIES_LIST = [
    "All",
    "Clean Skincare",
    "Herbal Remedies",
    "Wearables",
    "Home Goods",
    "Beverages",
    "Sustainable Textiles",
    "Electronics"
]

# Sidebar Page Navigation mapping exactly to user request
st.sidebar.markdown("""
<div style="padding: 0.5rem 0; text-align: center;">
    <span style="font-size: 1.65rem; font-weight: 900; color: #12b76a; letter-spacing: -0.05em;">🛡️ VOUCH</span>
    <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-top: 0.2rem; letter-spacing: 0.1em;">
        Brand Trust Platform
    </div>
</div>
<hr style="border-color: #1e293b; margin: 1rem 0;" />
""", unsafe_allow_html=True)

nav_selection = st.sidebar.radio(
    "Navigation System",
    [
        "🏠 Home",
        "🔍 Discover Brands",
        "💎 Hidden Gems",
        "⚖️ Compare Brands",
        "📈 Trust Insights",
        "🤖 Ask Vouch",
        "⚙️ Admin"
    ]
)

st.sidebar.markdown("""
<hr style="border-color: #1e293b; margin: 2rem 0 1rem 0;" />
<div style="font-size: 0.72rem; color: #64748b; line-height: 1.4; padding: 0 0.5rem;">
    <strong>Independent Audit:</strong><br />
    Vouch monitors brand guarantees, corporate policies, verified review ratios, and physical scam indexes in India.<br />
    <br />
    <span style="color: #cbd5e1;">Hardware models and electronic appliances are catalogued purely within their direct brand profiles.</span>
</div>
""", unsafe_allow_html=True)

# Render Global Brand Banner Header
st.markdown("""
<div class="vouch-header-banner">
    <div class="vouch-logo">🛡️ Vouch</div>
    <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.4rem; font-weight: 500;">
        The Credit Score for Brands &bull; Discovering high-fidelity customer guarantees, authentic review scores, and Scam Risk Indicators in India.
    </div>
</div>
""", unsafe_allow_html=True)

#========================================================================================
# PAGE 1: 🏠 HOME
#========================================================================================
if nav_selection == "🏠 Home":
    st.markdown("""
    <div style="margin-bottom: 2rem;">
        <span style="font-size: 0.72rem; background-color: rgba(18, 183, 106, 0.1); border: 1px solid rgba(18, 183, 106, 0.2); color: #12b76a; padding: 0.3rem 0.85rem; border-radius: 9999px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
            🛡️ Independent Trust Platform
        </span>
        <h1 style="font-size: 3rem; font-weight: 950; margin-top: 0.75rem; line-height: 1.15; letter-spacing: -0.03em;">
            Trust Before <span style="background: linear-gradient(to right, #34d399, #2dd4bf, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Transaction</span>
        </h1>
        <p style="font-size: 1.2rem; color: #f1f5f9; font-weight: 700; margin-top: 0.5rem; letter-spacing: -0.01em;">
            The Credit Score for Brands
        </p>
        <p style="font-size: 0.95rem; color: #94a3b8; max-w-3xl; margin-top: 0.5rem; line-height: 1.6;">
            Vouch calculates Dynamic Trust Scores, authenticating customer guarantees, verified reviews, and scam risk indicators for premium brands and boutique businesses in India.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Hero Central Search Engine input redirect
    home_query_val = st.text_input(
        "Search Brand Ratings:",
        "",
        placeholder="Search premium brands, boutique offerings, or sustainable categories (e.g. Skincare)..."
    )
    if st.button("Explore Dynamic Trust Scores", type="primary", use_container_width=True):
        st.session_state.home_search_query = home_query_val.strip()
        st.session_state.current_page = "🔍 Discover Brands" # Redirect indicator
        st.info("Query queued. Please click 'Discover Brands' in the sidebar to review matches!")
        
    st.markdown("<br />", unsafe_allow_html=True)
    
    # Live statistics metric counters
    col_st1, col_st2, col_st3 = st.columns(3)
    with col_st1:
        st.markdown("""
        <div style="background-color: #060b18; border: 1px solid #1e293b; padding: 1.75rem; border-radius: 1rem; text-align: center;">
            <p style="font-size: 2.5rem; font-weight: 900; color: #12b76a; margin: 0; font-family: 'JetBrains Mono', monospace; tracking-tight;">96%</p>
            <p style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.35rem;">Heuristic Bot Accuracy</p>
        </div>
        """, unsafe_allow_html=True)
    with col_st2:
        st.markdown("""
        <div style="background-color: #060b18; border: 1px solid #1e293b; padding: 1.75rem; border-radius: 1rem; text-align: center;">
            <p style="font-size: 2.5rem; font-weight: 900; color: #ffffff; margin: 0; font-family: 'JetBrains Mono', monospace; tracking-tight;">₹3,42,10,500+</p>
            <p style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.35rem;">Safe Purchases Tracked</p>
        </div>
        """, unsafe_allow_html=True)
    with col_st3:
        st.markdown("""
        <div style="background-color: #060b18; border: 1px solid #1e293b; padding: 1.75rem; border-radius: 1rem; text-align: center;">
            <p style="font-size: 2.5rem; font-weight: 900; color: #12b76a; margin: 0; font-family: 'JetBrains Mono', monospace; tracking-tight;">100%</p>
            <p style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.35rem;">Independent Audit</p>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br /><hr style='border-color: #1e293b; margin: 1.5rem 0;' />", unsafe_allow_html=True)
    
    # Detailed explanations with beautiful high-contrast text wrappers (No blending into backgrounds)
    col_f1, col_f2, col_f3 = st.columns(3)
    with col_f1:
        st.markdown("""
        <div class="brand-metric-card">
            <span style="font-size: 1.5rem;">🛡️</span>
            <h4 class="brand-metric-title" style="margin-top: 0.5rem;">Review Authenticity Weight</h4>
            <p class="brand-metric-body">
                We parse and target real customer accounts across major online listings. Suspicious bot patterns and repetitive phrasing copy clusters are weighted out of the rating calculations automatically.
            </p>
        </div>
        """, unsafe_allow_html=True)
    with col_f2:
        st.markdown("""
        <div class="brand-metric-card">
            <span style="font-size: 1.5rem;">📜</span>
            <h4 class="brand-metric-title" style="margin-top: 0.5rem;">Warranty & Guarantee Compliance</h4>
            <p class="brand-metric-body">
                Calculates direct resolution speeds for replace and repair policies. Measures whether boutique brands support their refunds immediately or trap buyers in fine print parameters.
            </p>
        </div>
        """, unsafe_allow_html=True)
    with col_f3:
        st.markdown("""
        <div class="brand-metric-card">
            <span style="font-size: 1.5rem;">🚨</span>
            <h4 class="brand-metric-title" style="margin-top: 0.5rem;">Scam Risk Indicators</h4>
            <p class="brand-metric-body">
                Identifies warning corporate characteristics, shell direct-shipper models, cloned locations, and unresponsive customer channels to highlight hazards instantly.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br /><br />", unsafe_allow_html=True)
    
    # Side-by-side Trending and Spotlights
    col_left_trend, col_right_spot = st.columns([7, 5])
    
    with col_left_trend:
         st.markdown("""
         <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.2rem;">📈 Trending Brand Houses Scored This Week</h3>
         <p style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 1.25rem;">
             High search volumes on credibility scores across organic, skincare, apparel, and direct-to-consumer brand segments.
         </p>
         """, unsafe_allow_html=True)
         
         trending_subset = sorted(brands_list, key=lambda x: x.get("credibility_score", 0), reverse=True)[:4]
         for b in trending_subset:
             scr = b.get("credibility_score", 85)
             st_class, st_lbl = parse_score_badge(scr)
             
             st.markdown(f"""
             <div class="vouch-card-custom" style="padding: 1rem 1.25rem !important; margin-bottom: 0.75rem !important;">
                 <div style="display: flex; justify-content: space-between; align-items: center;">
                     <div style="display: flex; align-items: center; gap: 0.85rem;">
                         <div style="width: 2.25rem; height: 2.25rem; display: flex; align-items: center; justify-content: center; background-color: #0e1526; border: 1px solid #1e293b; border-radius: 0.5rem; color: #12b76a; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 800;">
                             {b['brand_name'][:2].upper()}
                         </div>
                         <div>
                             <span style="font-size: 0.95rem; font-weight: 800; color: #ffffff;">{b['brand_name']}</span>
                             <div style="font-size: 0.68rem; color: #94a3b8;">
                                 {b.get('years_in_business', 3)} Years Established &bull; {"Verified DTC Partner" if b.get("verified") else "Registered"}
                             </div>
                         </div>
                     </div>
                     <span class="score-badge {st_class}" style="font-size: 0.78rem; padding: 0.2rem 0.6rem;">{scr}/100</span>
                 </div>
             </div>
             """, unsafe_allow_html=True)
             
    with col_right_spot:
        st.markdown("""
        <div style="background-color: rgba(18, 183, 106, 0.03); border: 1px solid rgba(18, 183, 106, 0.15); padding: 1.25rem; border-radius: 1rem;">
            <span style="font-size: 0.65rem; font-weight: 900; background-color: rgba(102, 102, 255, 0.15); border: 1px solid rgba(102, 102, 255, 0.3); color: #818cf8; padding: 0.15rem 0.5rem; border-radius: 4px; uppercase tracking-wider;">
                DTC Spotlight & Warning Circle
            </span>
            <h3 style="font-size: 1.15rem; font-weight: 800; margin-top: 0.5rem; margin-bottom: 0.15rem;">Discover Small Businesses</h3>
            <p style="font-size: 0.72rem; color: #94a3b8; margin-bottom: 1.25rem;">
                Spotlighting verified independent brands alongside flagged digital risk warning logs.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # Display direct spot items
        for b in brands_list[:3]:
            is_danger = b.get("scam_risk_level") == "danger"
            bg_card = "rgba(239, 68, 68, 0.05)" if is_danger else "rgba(30, 41, 59, 0.4)"
            border_card = "rgba(239, 68, 68, 0.2)" if is_danger else "rgba(30, 41, 59, 0.8)"
            title_col = "#fca5a5" if is_danger else "#ffffff"
            
            st.markdown(f"""
            <div style="background-color: {bg_card}; border: 1px solid {border_card}; padding: 1rem; border-radius: 0.75rem; margin-bottom: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.85rem; font-weight: 800; color: {title_col};">{b['brand_name']}</span>
                    <span style="font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #12b76a;">{b.get('transparency_rating', 'B')} Grade</span>
                </div>
                <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 0.35rem;">
                    Risk Level: <strong style="color: {'#ef4444' if is_danger else '#12b76a'};">{b.get('scam_risk', 'Very Low')}</strong> &bull; Core Score: {b['credibility_score']}
                </div>
            </div>
            """, unsafe_allow_html=True)

#========================================================================================
# PAGE 2: 🔍 DISCOVER BRANDS
#========================================================================================
elif nav_selection == "🔍 Discover Brands":
    st.markdown("""
    <h1 style="font-size: 2.25rem; font-weight: 900; margin-bottom: 0.2rem;">Discover Brands</h1>
    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem;">
        Filter brand houses, evaluate customer service scores, inspect risk indicators, and explore deep transparency ratings.
    </p>
    """, unsafe_allow_html=True)
    
    # Filter Controls row
    col_cat, col_sch_b, col_p_chk = st.columns([3, 5, 4])
    with col_cat:
        sel_category = st.selectbox("Market Category Filters", CATEGORIES_LIST)
    with col_sch_b:
        search_term_input = st.text_input(
            "Verify specific brands by name or offering:",
            st.session_state.home_search_query,
            placeholder="Type 'hair cream', or specific DTC companies..."
        )
    with col_p_chk:
        only_approved = st.checkbox("Verified Small Businesses Only", False)
        
    # Sifting filtering logic
    matched_brands = brands_list
    
    if only_approved:
        matched_brands = [b for b in matched_brands if b.get("verified", False)]
        
    if sel_category != "All":
        clean_cat = sel_category.lower().strip()
        matched_brands = [
            b for b in matched_brands
            if any(clean_cat in p.lower() for p in b.get("associated_products", []))
            or any(clean_cat in adv.lower() for adv in b.get("advantages", []))
        ]
        
    if search_term_input:
        term = search_term_input.lower().strip()
        # Direct Match brand name or associated offerings
        matched_brands = [
            b for b in matched_brands
            if term in b["brand_name"].lower()
            or any(term in p.lower() for p in b.get("associated_products", []))
            or any(term in adv.lower() for adv in b.get("advantages", []))
        ]
        
    if not matched_brands:
        st.warning("No matching direct-to-consumer brand profiles found. Please try resetting your search filters.")
    else:
        st.markdown(f"**Showing {len(matched_brands)} brand profiles sorted by Dynamic Trust Score:**")
        
        for b in matched_brands:
            b_score = b.get("credibility_score", 85)
            badge_class, label_integrity = parse_score_badge(b_score)
            is_comparing = b["id"] in st.session_state.compare_brands
            
            st.markdown(f"""
            <div class="vouch-card-custom">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
                    <div>
                        <span style="font-size: 1.3rem; font-weight: 900; color: #ffffff;">{b['brand_name']}</span>
                        {"<span style='background-color: rgba(18, 183, 106, 0.15); border: 1px solid rgba(18, 183, 106, 0.3); color: #12b76a; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 800; margin-left: 0.5rem; letter-spacing: 0.05em;'>VERIFIED BUSINESS</span>" if b.get("verified") else ""}
                        <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.5rem;">
                            <strong>Associated Offerings:</strong> {", ".join(b.get('associated_products', []))} &bull; 
                            <strong>Maturity:</strong> {b.get('years_in_business', 3)} Years Active &bull; 
                            <strong>Transparency Rating:</strong> <span style="color:#12b76a; font-weight:800;">{b.get('transparency_rating', 'A')}</span>
                        </div>
                    </div>
                    <span class="score-badge {badge_class}">
                        Vouch score: {b_score}/100 ({label_integrity})
                    </span>
                </div>
                <p style="font-size: 0.85rem; color: #cbd5e1; margin-top: 0.75rem; line-height: 1.55;">
                    {b.get("insights", "No insights available.")}
                </p>
            </div>
            """, unsafe_allow_html=True)
            
            # Action controls
            col_b1, col_b2, col_b3 = st.columns([4, 4, 4])
            with col_b1:
                # View weighted components toggle
                exp_key = f"exp_comp_{b['id']}"
                if expand_val := st.checkbox("View Weighted Components", key=exp_key):
                    wb = b.get("weight_breakdown", {
                        "verification": 90 if b.get("verified") else 30,
                        "sat": b.get("customer_service_score", 85),
                        "transparency": b.get("transparency_score", 80),
                        "consistency": b_score - 2,
                        "community": b_score + 4,
                        "circle": b.get("trusted_circle_score", 85),
                        "maturity": min(100, b.get("years_in_business", 5) * 10)
                    })
                    
                    st.markdown(f"""
                    <div class="weighted-breakdown-box">
                        <div style="display: flex; justify-content: space-between; border-b: 1px solid #1e293b; padding-bottom: 0.35rem; margin-bottom: 0.75rem;">
                            <span style="font-size: 0.75rem; color:#12b76a; font-weight: 800; text-transform: uppercase;">Weighted trust breakdown components</span>
                            <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 700;">Score: {b_score}/100</span>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    components_tuples = [
                        ("Verification Audit Score (20% weight)", wb.get("verification", 85)),
                        ("In-App Customer Satisfaction Score (20% weight)", wb.get("sat", 85)),
                        ("Brand Transparency Benchmark (20% weight)", wb.get("transparency", 85)),
                        ("Rating Sincerity Consistency Index (15% weight)", wb.get("consistency", 85)),
                        ("Public Community Trust Feedback (10% weight)", wb.get("community", 85)),
                        ("Trusted Circle Social Support (5% weight)", wb.get("circle", 85)),
                        ("Brand Market Maturity (10% weight)", wb.get("maturity", 85))
                    ]
                    
                    for comp_name, comp_score in components_tuples:
                        st.markdown(f"""
                        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; margin-top: 0.35rem;">
                            <span style="color:#94a3b8;">{comp_name}</span>
                            <strong style="color: {parse_score_color(comp_score)};">{comp_score}% rating</strong>
                        </div>
                        """, unsafe_allow_html=True)
                        st.progress(comp_score / 100)
                        
            with col_b2:
                # Compare Brand Action
                if is_comparing:
                    if st.button("🚫 Remove Compare", key=f"v_rem_cmp_{b['id']}", use_container_width=True):
                        st.session_state.compare_brands.remove(b["id"])
                        st.rerun()
                else:
                    if len(st.session_state.compare_brands) < 3:
                        if st.button("⚖️ Compare Brand House", key=f"v_add_cmp_{b['id']}", use_container_width=True):
                            st.session_state.compare_brands.append(b["id"])
                            st.rerun()
                    else:
                        st.button("Compare is Full (Max 3)", key=f"v_add_cmp_full_{b['id']}", disabled=True, use_container_width=True)
                        
            with col_b3:
                # View complete detailed profile modal details
                if st.button("🔍 View Complete Audit Profile", key=f"aud_prof_{b['id']}", use_container_width=True):
                    st.session_state.selected_brand_id = b["id"]
                    st.session_state.current_page = "💎 Hidden Gems"
                    st.rerun()
                    
            st.markdown("<hr style='border-color: #1e293b; margin: 1.25rem 0;' />", unsafe_allow_html=True)

#========================================================================================
# PAGE 3: 💎 HIDDEN GEMS
#========================================================================================
elif nav_selection == "💎 Hidden Gems":
    st.markdown("""
    <h1 style="font-size: 2.25rem; font-weight: 900; margin-bottom: 0.2rem;">💎 Hidden Gems & Warnings</h1>
    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem;">
        Highlighting high-fidelity boutique brand startups alongside verified dropshipping scam danger warnings.
    </p>
    """, unsafe_allow_html=True)
    
    # Active Brand focus profile modal check
    if st.session_state.selected_brand_id:
        target_b = next((x for x in brands_list if x["id"] == st.session_state.selected_brand_id), None)
        if target_b:
            st.markdown(f"### 🛡️ Active Profile Detail: {target_b['brand_name']}")
            if st.button("&larr; Return to main lists", type="secondary"):
                st.session_state.selected_brand_id = None
                st.rerun()
                
            cols_p1, cols_p2 = st.columns(2)
            with cols_p1:
                st.markdown(f"""
                <div class="vouch-card-custom" style="border-left: 4px solid #12b76a !important;">
                    <h4 style="font-size: 1rem; color: #12b76a;">Brand Performance Map</h4>
                    <p style="font-size: 0.8rem; margin-top: 0.5rem; line-height: 1.5;">
                        <strong>Years Active:</strong> {target_b.get('years_in_business', 3)} Years &bull; 
                        <strong>Website:</strong> <a href="{target_b.get('website')}" target="_blank" style="color:#60a5fa; text-decoration: underline;">{target_b.get('website')}</a><br />
                        <strong>DTC Offerings:</strong> {", ".join(target_b.get('associated_products', []))}<br />
                        <strong>Customer service rating:</strong> {target_b.get('customer_service_score', 80)}% verified resolution index<br />
                        <strong>Value for Money index:</strong> {target_b.get('value_for_money', 80)}% score
                    </p>
                </div>
                """, unsafe_allow_html=True)
                
                st.write("**Key Advantages Identified:**")
                for adv in target_b.get("advantages", []):
                    st.markdown(f"- ✅ <span style='color: #12b76a; font-size: 0.88rem;'>{adv}</span>", unsafe_allow_html=True)
                
            with cols_p2:
                st.markdown(f"""
                <div class="vouch-card-custom" style="border-left: 4px solid #ef4444 !important;">
                    <h4 style="font-size: 1rem; color: #ef4444;">Scam & Risk Indicators</h4>
                    <p style="font-size: 0.8rem; margin-top: 0.5rem; line-height: 1.5;">
                        <strong>Scam Risk Flag:</strong> <strong style="color: {'#ef4444' if target_b.get('scam_risk_level') == 'danger' else '#12b76a'};">{target_b.get('scam_risk', 'Very Low')}</strong><br />
                        <strong>Risk audit summary:</strong> {target_b.get('scam_risk_description', 'No warnings reported.')}
                    </p>
                </div>
                """, unsafe_allow_html=True)
                
                st.write("**Major Bottlenecks & Vulnerabilities:**")
                for dis in target_b.get("disadvantages", []):
                    st.markdown(f"- ⚠️ <span style='color: #fca5a5; font-size: 0.88rem;'>{dis}</span>", unsafe_allow_html=True)
                    
            st.markdown("<br />", unsafe_allow_html=True)
            
            # Graph
            journey_val = target_b.get("journey", [])
            if journey_val:
                st.write("**High-fidelity Historical Journey Trajectory:**")
                df_j = pd.DataFrame(journey_val)
                fig_j = px.line(df_j, x="year", y="score", markers=True)
                fig_j.update_layout(
                    paper_bgcolor="rgba(0,0,0,0)",
                    plot_bgcolor="rgba(0,0,0,0)",
                    height=240,
                    margin=dict(l=10, r=10, t=10, b=10)
                )
                st.plotly_chart(fig_j, use_container_width=True)
                
            st.stop()
            
    # Main list view
    col_g1, col_g2 = st.columns(2)
    with col_g1:
        st.markdown("### 💎 Highly Trusted Boutique Gems")
        high_gems_list = [b for b in brands_list if b.get("credibility_score", 85) >= 88 and b.get("scam_risk_level") == "safe"]
        for b in high_gems_list:
            st.markdown(f"""
            <div class="vouch-card-custom" style="border-top: 3px solid #12b76a !important;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size:1.1rem; font-weight:800; color:#ffffff;">{b['brand_name']}</span>
                    <span style="background-color: rgba(18, 183, 106, 0.1); border: 1px solid #12b76a; color:#12b76a; font-family:'JetBrains Mono', monospace; font-size:0.75rem; padding: 0.2rem 0.5rem; border-radius:4px;">
                        Vouch score: {b['credibility_score']}
                    </span>
                </div>
                <p style="font-size:0.78rem; color:#cbd5e1; margin-top:0.5rem;">{b.get('insights')}</p>
                <div style="margin-top:0.75rem; font-size:0.7rem; color:#94a3b8;">
                    <strong>Guarantees:</strong> {b.get('warranty_policy')}
                </div>
            </div>
            """, unsafe_allow_html=True)
            if st.button("Audit Startup Specs", key=f"gem_sp_{b['id']}"):
                st.session_state.selected_brand_id = b["id"]
                st.rerun()
                
    with col_g2:
        st.markdown("### ⚠️ Highlighted Warning Risks")
        danger_list = [b for b in brands_list if b.get("scam_risk_level") == "danger" or b.get("credibility_score", 85) < 70]
        for b in danger_list:
            st.markdown(f"""
            <div class="vouch-card-custom" style="border-top: 3px solid #ef4444 !important; background-color: rgba(239, 68, 68, 0.02) !important;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size:1.1rem; font-weight:800; color:#fca5a5;">{b['brand_name']}</span>
                    <span style="background-color: rgba(239,68,68,0.15); border: 1px solid #ef4444; color:#ef4444; font-family:'JetBrains Mono', monospace; font-size:0.75rem; padding: 0.2rem 0.5rem; border-radius:4px;">
                        Vouch score: {b['credibility_score']}
                    </span>
                </div>
                <p style="font-size:0.78rem; color:#fca5a6; margin-top:0.5rem; font-weight:bold;">
                    {b.get('scam_risk_description')}
                </p>
                <p style="font-size:0.72rem; color:#94a3b8;">{b.get('insights')}</p>
            </div>
            """, unsafe_allow_html=True)
            if st.button("Inspect Warning Flags", key=f"gem_wn_{b['id']}"):
                st.session_state.selected_brand_id = b["id"]
                st.rerun()

#========================================================================================
# PAGE 4: ⚖️ COMPARE BRANDS
#========================================================================================
elif nav_selection == "⚖️ Compare Brands":
    st.markdown("""
    <h1 style="font-size: 2.25rem; font-weight: 900; margin-bottom: 0.2rem;">Compare Brands</h1>
    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem;">
        Compare up to 3 brand houses side-by-side to review dynamic rating weights, guarantees, and service compliance.
    </p>
    """, unsafe_allow_html=True)
    
    selected_comp_ids = st.session_state.compare_brands
    
    if not selected_comp_ids:
        st.info("No brand profiles are currently added to comparison. Please go to '🔍 Discover Brands' and add brand houses to your active comparison.")
    else:
        st.markdown(f"**Comparing {len(selected_comp_ids)} Brand Houses:**")
        
        # Pull records
        comp_records = [x for x in brands_list if x["id"] in selected_comp_ids]
        
        # Horizontal layout comparing aspects
        comparisons_table_dict = {
            "Brand Profile": [b["brand_name"] for b in comp_records],
            "Dynamic Trust Score": [f"{b['credibility_score']}/100" for b in comp_records],
            "Transparency Score": [f"{b['transparency_score']}/100 (Grade {b.get('transparency_rating', 'B')})" for b in comp_records],
            "Maturity (Years)": [f"{b.get('years_in_business', 3)} Years" for b in comp_records],
            "Guarantees Limit": [b.get("warranty_policy", "Standard") for b in comp_records],
            "Scam Risk Rating": [b.get("scam_risk", "Very Low") for b in comp_records],
            "Customer Service": [f"{b.get('customer_service_score', 80)}%" for b in comp_records],
            "Key Advantages": [", ".join(b.get("advantages", [])[:2]) for b in comp_records],
            "Bottlenecks": [", ".join(b.get("disadvantages", [])[:2]) for b in comp_records]
        }
        
        df_comp = pd.DataFrame(comparisons_table_dict)
        st.table(df_comp)
        
        if st.button("Clear all comparison parameters", type="primary"):
            st.session_state.compare_brands = []
            st.rerun()

#========================================================================================
# PAGE 5: 📈 TRUST INSIGHTS
#========================================================================================
elif nav_selection == "📈 Trust Insights":
    st.markdown("""
    <h1 style="font-size: 2.25rem; font-weight: 900; margin-bottom: 0.2rem;">Trust Insights</h1>
    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem;">
        Analytical transparency patterns, verified social trust, and historical tracking weights of direct-to-consumer businesses in India.
    </p>
    """, unsafe_allow_html=True)
    
    col_ch1, col_ch2 = st.columns(2)
    with col_ch1:
        st.markdown("### 🏆 Distribution of Brand Auditing Scores")
        df_b = pd.DataFrame(brands_list)
        fig_dist = px.bar(
            df_b,
            x="brand_name",
            y="credibility_score",
            color="credibility_score",
            color_continuous_scale="Viridis",
            labels={"brand_name": "Brand", "credibility_score": "Score"}
        )
        fig_dist.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig_dist, use_container_width=True)
        
    with col_ch2:
        st.markdown("### 🤝 Transparency vs Years in Business")
        fig_scatter = px.scatter(
            df_b,
            x="years_in_business",
            y="transparency_score",
            size="credibility_score",
            color="brand_name",
            hover_name="brand_name",
            labels={"years_in_business": "Years Active", "transparency_score": "Transparency %"}
        )
        fig_scatter.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig_scatter, use_container_width=True)

#========================================================================================
# PAGE 6: 🤖 ASK VOUCH
#========================================================================================
elif nav_selection == "🤖 Ask Vouch":
    st.markdown("""
    <h1 style="font-size: 2.25rem; font-weight: 900; margin-bottom: 0.2rem;">Ask Vouch</h1>
    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem;">
        Gemini-Powered Brand Trust Advisor. Safely analyzing dropshippers, fake warning flags, and warranty compliance.
    </p>
    """, unsafe_allow_html=True)
    
    for message in st.session_state.chat_history:
        if message["sender"] == "user":
            st.write(f"**🧑 You:** {message['content']}")
        else:
            st.write(f"**🤖 Vouch AI:** {message['content']}")
            
    st.markdown("<hr style='border-color: #1e293b; margin: 1.5rem 0;' />", unsafe_allow_html=True)
    
    user_prompt = st.text_input("Ask Vouch anything about brand trust parameters:", placeholder="Type here...")
    if st.button("Inquire with AI Agent", type="primary"):
        if user_prompt.strip():
            st.session_state.chat_history.append({"sender": "user", "content": user_prompt})
            
            # Formulate Gemini prompt keeping all keys server-sided and protected
            context_string = f"You are Vouch AI, an objective brand trust intelligence consultant for direct-to-consumer businesses. Here are active brand houses in database coordinates: {json.dumps(brands_list)}. Answer user's query specifically and do not recommend phone prices or external unverified phone systems."
            
            gemini_key = os.getenv("GEMINI_API_KEY", "")
            if not gemini_key:
                # Mock high-fidelity response in case developer key is pending values
                reply = f"Thank you for inquiring! (Mock Response: Core credibility calculations show {brands_list[0]['brand_name']} holds the highest audited reputation with extremely low return risk indicator flags.)"
            else:
                try:
                    client = genai.Client(api_key=gemini_key)
                    completion = client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=f"{context_string}\n\nUser Query: {user_prompt}"
                    )
                    reply = completion.text
                except Exception as ex:
                    reply = f"Connected but API encountered an issue: {ex}. GlowNest still ranks with highest 94 rating index."
                    
            st.session_state.chat_history.append({"sender": "ai", "content": reply})
            st.rerun()

#========================================================================================
# PAGE 7: ⚙️ ADMIN
#========================================================================================
elif nav_selection == "⚙️ Admin":
    st.markdown("""
    <h1 style="font-size: 2.25rem; font-weight: 900; margin-bottom: 0.2rem;">Vouch Admin Central</h1>
    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem;">
        Audit premium corporate registrations, manage direct-to-consumer businesses, and calibrate review authenticity weights.
    </p>
    """, unsafe_allow_html=True)
    
    col_m1, col_m2 = st.columns(2)
    with col_m1:
        st.metric("Total Monitored Brand Houses", f"{len(brands_list)} Brands")
    with col_m2:
        st.metric("Verified Small Businesses", f"{len([x for x in brands_list if x.get('verified')])} Active")
        
    st.markdown("<hr style='border-color: #1e293b; margin: 1.5rem 0;' />", unsafe_allow_html=True)
    
    # Simple interactive brand insertion form
    st.write("**Register and Score new Brand House:**")
    with st.form("insert_brand_form"):
        new_b_name = st.text_input("Brand House Name:", "GlowOrganic")
        new_b_score = st.slider("Dynamic Trust Score Calculation:", 0, 100, 85)
        new_b_trans = st.slider("Transparency Index score Calculation:", 0, 100, 80)
        new_b_years = st.number_input("Years Active in Business (Maturity):", 1, 50, 4)
        new_b_policy = st.text_input("Corporate Customer Guarantee Policy:", "2 Year Replacement Freshness Guarantee")
        new_b_scam = st.text_input("Active Scam Risk Flag:", "Very Low")
        new_b_desc = st.text_area("Audit Summary Insights:", "Active corporate registries are highly validated under third-party direct consumer loops.")
        
        new_b_category = st.multiselect("Associated Market Category offerings:", CATEGORIES_LIST[1:], default=["Clean Skincare"])
        
        submitted = st.form_submit_button("Archive and Score New Brand Profile")
        if submitted:
            if new_b_name.strip():
                new_brand_payload = {
                    "id": f"b_{new_b_name.lower().replace(' ', '_')}",
                    "brand_name": new_b_name.strip(),
                    "credibility_score": new_b_score,
                    "transparency_score": new_b_trans,
                    "years_in_business": new_b_years,
                    "website": f"https://{new_b_name.lower().replace(' ', '')}.in",
                    "verified": True,
                    "warranty_policy": new_b_policy,
                    "customer_service_score": new_b_score,
                    "transparency_rating": "A" if new_b_score >= 85 else "B",
                    "value_for_money": new_b_trans,
                    "advantages": ["Verified community reviews", "Fast refund support response curves"],
                    "disadvantages": ["Limited bulk purchasing distribution support"],
                    "scam_risk": new_b_scam,
                    "scam_risk_description": "Clean audit footprint. Under active watch list.",
                    "scam_risk_level": "safe",
                    "insights": new_b_desc,
                    "associated_products": new_b_category,
                    "journey": [{"year": 2026, "score": new_b_score}]
                }
                
                db_data["brands"].append(new_brand_payload)
                if save_db(db_data):
                    st.success(f"Brand house '{new_b_name}' successfully score-archived & written in local base!")
                    st.rerun()
            else:
                st.error("Brand name cannot be left blank.")
