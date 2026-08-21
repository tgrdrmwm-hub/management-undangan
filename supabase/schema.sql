-- ==============================================================================
-- SUPABASE DATABASE SCHEMA & SEED DATA (PRODUCTION READY)
-- Digital Wedding Invitation & Studio Management Platform
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE DEFINITIONS & COLUMN UPGRADES
-- ==============================================================================

-- A. MASTER THEMES TABLE (20+ Luxury, Botanical, Heritage, Modern Themes)
CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    cultural_label TEXT,
    description TEXT,
    primary_color TEXT NOT NULL,
    secondary_color TEXT NOT NULL,
    bg_hex TEXT NOT NULL,
    card_bg_hex TEXT NOT NULL,
    gradient_text TEXT NOT NULL,
    glow_hex TEXT NOT NULL,
    ornament_type TEXT NOT NULL,
    card_radius TEXT NOT NULL DEFAULT 'rounded-2xl',
    frame_style TEXT NOT NULL DEFAULT 'royal-arch',
    default_layout TEXT,
    preview_class TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. MASTER LAYOUT ARCHETYPES TABLE (20+ Layout Archetypes)
CREATE TABLE IF NOT EXISTS public.layout_archetypes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    cultural_tag TEXT,
    description TEXT,
    hero_layout TEXT NOT NULL,
    couple_card_style TEXT NOT NULL,
    events_style TEXT NOT NULL,
    badge_icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. WEDDING PROJECTS TABLE (Projects / Invitations)
CREATE TABLE IF NOT EXISTS public.wedding_projects (
    id TEXT PRIMARY KEY DEFAULT ('proj-' || uuid_generate_v4()),
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pastikan kolom baru tetap ada jika tabel sudah pernah dibuat sebelumnya
ALTER TABLE public.wedding_projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.wedding_projects ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.wedding_projects ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE public.wedding_projects ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.wedding_projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- D. GUEST CONTACTS TABLE (Daftar Tamu & WA Blast)
CREATE TABLE IF NOT EXISTS public.guest_contacts (
    id TEXT PRIMARY KEY DEFAULT ('gst-' || uuid_generate_v4()),
    project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    category TEXT NOT NULL DEFAULT 'Umum',
    pax_limit INTEGER DEFAULT 2,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    custom_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.guest_contacts ADD COLUMN IF NOT EXISTS custom_note TEXT;

-- E. RSVP SUBMISSIONS TABLE (Konfirmasi Kehadiran)
CREATE TABLE IF NOT EXISTS public.rsvp_submissions (
    id TEXT PRIMARY KEY DEFAULT ('rsvp-' || uuid_generate_v4()),
    project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    phone_number TEXT,
    attendance TEXT NOT NULL,
    pax_count INTEGER NOT NULL DEFAULT 1,
    selected_event_id TEXT,
    event_session TEXT,
    notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.rsvp_submissions ADD COLUMN IF NOT EXISTS selected_event_id TEXT;
ALTER TABLE public.rsvp_submissions ADD COLUMN IF NOT EXISTS event_session TEXT;
ALTER TABLE public.rsvp_submissions ADD COLUMN IF NOT EXISTS notes TEXT;

-- F. GUEST WISHES TABLE (Buku Tamu & Ucapan Doa)
CREATE TABLE IF NOT EXISTS public.guest_wishes (
    id TEXT PRIMARY KEY DEFAULT ('wish-' || uuid_generate_v4()),
    project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sender_name TEXT,
    status TEXT NOT NULL DEFAULT 'Hadir',
    message TEXT NOT NULL,
    relation TEXT,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.guest_wishes ADD COLUMN IF NOT EXISTS sender_name TEXT;
ALTER TABLE public.guest_wishes ADD COLUMN IF NOT EXISTS relation TEXT;
ALTER TABLE public.guest_wishes ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_wedding_projects_slug ON public.wedding_projects(slug);
CREATE INDEX IF NOT EXISTS idx_guest_contacts_project_id ON public.guest_contacts(project_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_submissions_project_id ON public.rsvp_submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_guest_wishes_project_id ON public.guest_wishes(project_id);
CREATE INDEX IF NOT EXISTS idx_guest_wishes_created_at ON public.guest_wishes(created_at DESC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layout_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_wishes ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access
DROP POLICY IF EXISTS "Public can view themes" ON public.themes;
CREATE POLICY "Public can view themes" ON public.themes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert themes" ON public.themes;
CREATE POLICY "Public can insert themes" ON public.themes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view layouts" ON public.layout_archetypes;
CREATE POLICY "Public can view layouts" ON public.layout_archetypes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert layouts" ON public.layout_archetypes;
CREATE POLICY "Public can insert layouts" ON public.layout_archetypes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view projects" ON public.wedding_projects;
CREATE POLICY "Public can view projects" ON public.wedding_projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert/update projects" ON public.wedding_projects;
CREATE POLICY "Public can insert/update projects" ON public.wedding_projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public manage guest contacts" ON public.guest_contacts;
CREATE POLICY "Public manage guest contacts" ON public.guest_contacts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view RSVPs" ON public.rsvp_submissions;
CREATE POLICY "Public can view RSVPs" ON public.rsvp_submissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can submit RSVPs" ON public.rsvp_submissions;
CREATE POLICY "Public can submit RSVPs" ON public.rsvp_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update/delete RSVPs" ON public.rsvp_submissions;
CREATE POLICY "Public can update/delete RSVPs" ON public.rsvp_submissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view wishes" ON public.guest_wishes;
CREATE POLICY "Public can view wishes" ON public.guest_wishes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert wishes" ON public.guest_wishes;
CREATE POLICY "Public can insert wishes" ON public.guest_wishes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update wishes (likes)" ON public.guest_wishes;
CREATE POLICY "Public can update wishes (likes)" ON public.guest_wishes FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete wishes" ON public.guest_wishes;
CREATE POLICY "Public can delete wishes" ON public.guest_wishes FOR DELETE USING (true);

-- ==============================================================================
-- 5. REALTIME PUBLICATION SETUP
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvp_submissions, public.guest_wishes, public.wedding_projects;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
  END;
END $$;

-- ==============================================================================
-- 6. SEED DATA: MASTER THEMES (20 PRESETS)
-- ==============================================================================
INSERT INTO public.themes (id, name, category, cultural_label, description, primary_color, secondary_color, bg_hex, card_bg_hex, gradient_text, glow_hex, ornament_type, card_radius, frame_style, default_layout, preview_class)
VALUES
('classic-midnight', 'Midnight Royal Gold', 'Signature Luxury', 'Royal Imperial Gold', 'Nuansa gelap malam bertabur emas mewah khas kerajaan Eropa modern.', '#dfb461', '#fce09c', '#090a10', '#12141d', 'from-[#fce09c] via-[#dfb461] to-[#b38728]', 'rgba(223, 180, 97, 0.25)', 'royal-crown', 'rounded-3xl', 'royal-arch', 'royal-symmetrical', 'bg-gradient-to-br from-[#090a10] via-[#141724] to-[#0d0f17] border-[#dfb461]'),
('black-diamond', 'Black Diamond & Platinum', 'Signature Luxury', 'Obsidian Platinum Glamour', 'Hitam pekat obsidian dengan aksen kristal platinum perak dan kilau berlian.', '#e0e4ec', '#ffffff', '#08080a', '#131418', 'from-[#ffffff] via-[#d0d6e2] to-[#8890a0]', 'rgba(224, 228, 236, 0.25)', 'platinum-diamond', 'rounded-2xl', 'ornate-corners', 'obsidian-prism', 'bg-gradient-to-br from-[#08080a] via-[#131418] to-[#050507] border-[#d0d6e2]'),
('champagne', 'Champagne Obsidian Glow', 'Signature Luxury', 'Warm Champagne Glamour', 'Gradasi hitam hangat arang dengan kilau emas sampanye eksklusif.', '#e5c17b', '#fff1d6', '#100e0b', '#1c1914', 'from-[#fff1d6] via-[#e5c17b] to-[#b88c42]', 'rgba(229, 193, 123, 0.25)', 'royal-crown', 'rounded-3xl', 'royal-arch', 'monaco-velvet', 'bg-gradient-to-br from-[#100e0b] via-[#1c1914] to-[#080705] border-[#e5c17b]'),
('midnight-amethyst', 'Midnight Amethyst & Rose Gold', 'Signature Luxury', 'Royal Amethyst Violet', 'Ungu malam royal pekat dengan taburan aksen rose gold dan violet mistis.', '#d6a3e6', '#fbe8ff', '#100a16', '#1c1226', 'from-[#fbe8ff] via-[#d6a3e6] to-[#9b5fb3]', 'rgba(214, 163, 230, 0.28)', 'platinum-diamond', 'rounded-3xl', 'ornate-corners', 'amethyst-crystal', 'bg-gradient-to-br from-[#100a16] via-[#1c1226] to-[#09050d] border-[#d6a3e6]'),
('royal-emerald', 'Emerald Forest & Gold', 'Botanical Nature', 'Emerald Gardenia Elegance', 'Kemewahan hijau zamrud elegan berpadu dengan aksen emas hangat botanical.', '#e2ba64', '#fef3c7', '#061712', '#0d2820', 'from-[#fef3c7] via-[#e2ba64] to-[#b48a3c]', 'rgba(226, 186, 100, 0.25)', 'botanical-leaf', 'rounded-3xl', 'botanical-border', 'botanical-capsule', 'bg-gradient-to-br from-[#061712] via-[#0d2820] to-[#040e0b] border-[#e2ba64]'),
('sage-eucalyptus', 'Sage Eucalyptus & Ivory', 'Botanical Nature', 'Serene Eucalyptus & White Linen', 'Hijau sage menenangkan dengan sentuhan krem gading lembut dan dedaunan eukaliptus.', '#9ec4a5', '#f3f8f4', '#0a1510', '#13241b', 'from-[#f3f8f4] via-[#9ec4a5] to-[#5b8764]', 'rgba(158, 196, 165, 0.28)', 'botanical-leaf', 'rounded-3xl', 'botanical-border', 'botanical-capsule', 'bg-gradient-to-br from-[#0a1510] via-[#13241b] to-[#070e0a] border-[#9ec4a5]'),
('olive-garden', 'Tuscan Olive & Warm Amber', 'Botanical Nature', 'Mediterranean Tuscan Olive', 'Nuansa zaitun Mediterania hangat berpadu kilau amber keemasan yang asri.', '#d6b864', '#faf3dd', '#12140b', '#202213', 'from-[#faf3dd] via-[#d6b864] to-[#8d7732]', 'rgba(214, 184, 100, 0.25)', 'botanical-leaf', 'rounded-3xl', 'botanical-border', 'tuscan-laurel', 'bg-gradient-to-br from-[#12140b] via-[#202213] to-[#0a0c06] border-[#d6b864]'),
('pine-terracotta', 'Nordic Pine & Earth Gold', 'Botanical Nature', 'Nordic Pine Woodland', 'Hijau pinus pekat Skandinavia berpadu hangatnya elemen bumi dan aksen emas.', '#c9af6d', '#f7edd2', '#081412', '#10221f', 'from-[#f7edd2] via-[#c9af6d] to-[#7f6932]', 'rgba(201, 175, 109, 0.25)', 'botanical-leaf', 'rounded-3xl', 'botanical-border', 'nordic-woodland', 'bg-gradient-to-br from-[#081412] via-[#10221f] to-[#040b0a] border-[#c9af6d]'),
('rose-gold', 'Velvet Rose Gold Romance', 'Romantic Floral', 'English Rose & Warm Copper', 'Sentuhan burgundy lembut berpadu kilau rose gold yang manis, hangat, dan intim.', '#e8a598', '#fde8e4', '#140a12', '#221220', 'from-[#fde8e4] via-[#e8a598] to-[#be6c5e]', 'rgba(232, 165, 152, 0.28)', 'romantic-rose', 'rounded-3xl', 'floral-crest', 'romantic-chiffon', 'bg-gradient-to-br from-[#140a12] via-[#221220] to-[#0c050a] border-[#e8a598]'),
('dusty-rose', 'Dusty Rose & Champagne Pearl', 'Romantic Floral', 'Vintage Dusty Rose & Pearl', 'Palet merah muda dusty anggun dengan aksen kilau mutiara sampanye Eropa.', '#df9f98', '#fae9e7', '#160d13', '#241720', 'from-[#fae9e7] via-[#df9f98] to-[#ab655e]', 'rgba(223, 159, 152, 0.28)', 'romantic-rose', 'rounded-3xl', 'floral-crest', 'victorian-cameo', 'bg-gradient-to-br from-[#160d13] via-[#241720] to-[#0d070b] border-[#df9f98]'),
('lavender-twilight', 'Lavender Twilight Lilac', 'Romantic Floral', 'Provence Lavender Twilight', 'Kelembutan ungu lavender pastel dengan semburat senja lilac romantis.', '#c8a8e9', '#f6effe', '#110b17', '#1e1428', 'from-[#f6effe] via-[#c8a8e9] to-[#8d62b8]', 'rgba(200, 168, 233, 0.28)', 'romantic-rose', 'rounded-3xl', 'floral-crest', 'romantic-chiffon', 'bg-gradient-to-br from-[#110b17] via-[#1e1428] to-[#09050d] border-[#c8a8e9]'),
('peach-blossom', 'Blushing Peach & Apricot', 'Romantic Floral', 'Sweet Peach & Apricot Blossom', 'Keceriaan buah persik dan aprikot pastel dengan aksen emas mutiara hangat.', '#f0a882', '#fef0e8', '#170f0b', '#281a13', 'from-[#fef0e8] via-[#f0a882] to-[#c76f44]', 'rgba(240, 168, 130, 0.28)', 'romantic-rose', 'rounded-3xl', 'floral-crest', 'boho-arch', 'bg-gradient-to-br from-[#170f0b] via-[#281a13] to-[#0e0806] border-[#f0a882]'),
('blush-peony', 'Blush Peony & Silk Cream', 'Romantic Floral', 'Chiffon Blush Peony', 'Keanggunan kelopak bunga peony merah muda sutra dengan latar krem lembut.', '#ea9bb0', '#feeef3', '#170c12', '#27151f', 'from-[#feeef3] via-[#ea9bb0] to-[#b85b73]', 'rgba(234, 155, 176, 0.28)', 'romantic-rose', 'rounded-3xl', 'floral-crest', 'romantic-chiffon', 'bg-gradient-to-br from-[#170c12] via-[#27151f] to-[#0e060a] border-[#ea9bb0]'),
('royal-sapphire', 'Sapphire Navy & Platinum Gold', 'Ocean & Sapphire', 'Imperial Sapphire Palace', 'Biru safir pekat yang megah dengan taburan aksen emas platinium kerajaan.', '#dfc27d', '#f4e5bf', '#080d1a', '#11192e', 'from-[#f4e5bf] via-[#dfc27d] to-[#ad8a38]', 'rgba(223, 194, 125, 0.25)', 'celestial-star', 'rounded-3xl', 'celestial-frame', 'oceanic-horizon', 'bg-gradient-to-br from-[#080d1a] via-[#11192e] to-[#050810] border-[#dfc27d]'),
('celestial-blue', 'Celestial Midnight & Star Gold', 'Ocean & Sapphire', 'Cosmic Starlight & Nebula', 'Biru kosmik langit malam berbintang dengan aksen emas astronomi mewah.', '#e0c37b', '#f9f1d8', '#060a17', '#0e162d', 'from-[#f9f1d8] via-[#e0c37b] to-[#997c33]', 'rgba(224, 195, 123, 0.3)', 'celestial-star', 'rounded-3xl', 'celestial-frame', 'celestial-astral', 'bg-gradient-to-br from-[#060a17] via-[#0e162d] to-[#03060f] border-[#e0c37b]'),
('ocean-breeze', 'Deep Ocean Teal & Aqua Gold', 'Ocean & Sapphire', 'Azure Coral & Aqua Lagoon', 'Gradasi toska samudra dalam dengan kilau ombak air keemasan nan segar.', '#63cfbe', '#e2faf6', '#061416', '#0c2428', 'from-[#e2faf6] via-[#63cfbe] to-[#2b887a]', 'rgba(99, 207, 190, 0.28)', 'celestial-star', 'rounded-3xl', 'celestial-frame', 'oceanic-horizon', 'bg-gradient-to-br from-[#061416] via-[#0c2428] to-[#030b0c] border-[#63cfbe]'),
('powder-blue', 'Monaco Powder Blue & Silver', 'Ocean & Sapphire', 'Monaco Royal Powder Blue', 'Biru pastel ningrat istana Monaco berpadu perak bersih dan aksen salju mutiara.', '#9ec0e6', '#f0f6fd', '#09101a', '#121f31', 'from-[#f0f6fd] via-[#9ec0e6] to-[#5b83b3]', 'rgba(158, 192, 230, 0.28)', 'celestial-star', 'rounded-2xl', 'celestial-frame', 'split-editorial', 'bg-gradient-to-br from-[#09101a] via-[#121f31] to-[#05090f] border-[#9ec0e6]'),
('traditional-java', 'Java Heritage Teakwood', 'Heritage Nusantara', 'Adat Jawa Mataraman Klasik', 'Warna kayu jati antik bernuansa hangat dengan ornamen emas klasik ukiran Gunungan Jawa.', '#d4af37', '#fbeaa8', '#140e0b', '#211712', 'from-[#fbeaa8] via-[#d4af37] to-[#8c6b16]', 'rgba(212, 175, 55, 0.3)', 'gunungan', 'rounded-2xl', 'ornate-corners', 'javanese-kraton', 'bg-gradient-to-br from-[#140e0b] via-[#211712] to-[#0c0806] border-[#d4af37]'),
('sunda-heritage', 'Sunda Parahyangan Ivory Gold', 'Heritage Nusantara', 'Adat Sunda Priangan Nyalindung', 'Kelembutan melati putih gading berpadu ornamen keemasan Priangan Sunda nan anggun.', '#e0bf70', '#fdf7e7', '#12100a', '#201d14', 'from-[#fdf7e7] via-[#e0bf70] to-[#997a2e]', 'rgba(224, 191, 112, 0.3)', 'sunda-jasmine', 'rounded-2xl', 'ornate-corners', 'sundanese-siger', 'bg-gradient-to-br from-[#12100a] via-[#201d14] to-[#0a0805] border-[#e0bf70]'),
('minang-crimson', 'Minang Crimson & Royal Gold', 'Heritage Nusantara', 'Adat Minangkabau Ranah Minang', 'Merah marun menyala adat Minangkabau bertabur kemegahan emas mahkota Suntiang.', '#eab856', '#fdf0d5', '#19080b', '#2d1016', 'from-[#fdf0d5] via-[#eab856] to-[#b3801f]', 'rgba(234, 184, 86, 0.35)', 'minang-suntiang', 'rounded-2xl', 'royal-arch', 'minang-gonjong', 'bg-gradient-to-br from-[#19080b] via-[#2d1016] to-[#0e0406] border-[#eab856]'),
('bali-sanctuary', 'Balinese Sandalwood & Gold', 'Heritage Nusantara', 'Adat Bali Tirta Padma Dewata', 'Kehangatan kayu cendana dan kemegahan ornamen prada pura khas Pulau Dewata.', '#e8b85b', '#fdf2db', '#150f09', '#251b12', 'from-[#fdf2db] via-[#e8b85b] to-[#9e711d]', 'rgba(232, 184, 91, 0.35)', 'bali-prada', 'rounded-2xl', 'ornate-corners', 'balinese-candi', 'bg-gradient-to-br from-[#150f09] via-[#251b12] to-[#0c0804] border-[#e8b85b]'),
('palembang-songket', 'Palembang Songket & Ruby Red', 'Heritage Nusantara', 'Adat Palembang Sriwijaya Emas', 'Merah delima anggun terinspirasi dari kemewahan tenun benang emas songket Sriwijaya.', '#ebb758', '#fcf0d4', '#18070e', '#2c0f1c', 'from-[#fcf0d4] via-[#ebb758] to-[#ad7818]', 'rgba(235, 183, 88, 0.35)', 'palembang-songket', 'rounded-2xl', 'royal-arch', 'palembang-songket', 'bg-gradient-to-br from-[#18070e] via-[#2c0f1c] to-[#0d0307] border-[#ebb758]'),
('minimal-monochrome', 'Architectural Pure Monochrome', 'Modern Editorial', 'High-Fashion Swiss Minimalist', 'Kontras hitam putih minimalis dengan tipografi editorial modern dan aksen platinum.', '#e2e5eb', '#ffffff', '#0a0a0c', '#151518', 'from-[#ffffff] via-[#e2e5eb] to-[#9ca3af]', 'rgba(226, 229, 235, 0.2)', 'editorial-cross', 'rounded-xl', 'minimal-sharp', 'minimalist-swiss', 'bg-gradient-to-br from-[#0a0a0c] via-[#151518] to-[#050506] border-neutral-400'),
('terracotta-sunset', 'Terracotta Sunset Warmth', 'Modern Editorial', 'Warm Terracotta & Earth Clay', 'Warna tembikar senja hangat berpadu cokelat tanah liat dan kilau jingga keemasan.', '#e8895b', '#fdebe2', '#160d09', '#271912', 'from-[#fdebe2] via-[#e8895b] to-[#b05225]', 'rgba(232, 137, 91, 0.28)', 'editorial-cross', 'rounded-2xl', 'minimal-sharp', 'boho-arch', 'bg-gradient-to-br from-[#160d09] via-[#271912] to-[#0e0705] border-[#e8895b]'),
('pearl-ivory', 'Pearl Ivory & Cashmere Cream', 'Modern Editorial', 'Haute Cashmere & Pearl Silk', 'Kemewahan monokrom putih gading kasmir nan anggun, bersih, dan berkelas tinggi.', '#d6be8b', '#fff9ed', '#11100d', '#1e1c17', 'from-[#fff9ed] via-[#d6be8b] to-[#967d49]', 'rgba(214, 190, 139, 0.25)', 'editorial-cross', 'rounded-2xl', 'minimal-sharp', 'haute-couture', 'bg-gradient-to-br from-[#11100d] via-[#1e1c17] to-[#0a0907] border-[#d6be8b]'),
('ruby-crimson', 'Burgundy Velvet & Deep Crimson', 'Modern Editorial', 'Deep Bordeaux & Rosewood', 'Merah marun anggur pekat berpadu aksen emas tembaga mewah dan eksotis.', '#e0987c', '#fcece7', '#17080b', '#291015', 'from-[#fcece7] via-[#e0987c] to-[#a35235]', 'rgba(224, 152, 124, 0.3)', 'editorial-cross', 'rounded-2xl', 'minimal-sharp', 'vogue-lookbook', 'bg-gradient-to-br from-[#17080b] via-[#291015] to-[#0d0406] border-[#e0987c]')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 7. SEED DATA: MASTER LAYOUT ARCHETYPES (20 PRESETS)
-- ==============================================================================
INSERT INTO public.layout_archetypes (id, name, category, cultural_tag, description, hero_layout, couple_card_style, events_style, badge_icon_name)
VALUES
('royal-symmetrical', 'Royal Symmetrical Imperial', 'Imperial Luxury', 'Majestic Centerpiece', 'Tata letak simetris megah dengan gerbang lengkung emas royal, jam hitung mundur berbingkai ganda, dan tipografi serif aristokrat.', 'symmetrical', 'classic-circle', 'dual-arch', 'Crown'),
('monaco-velvet', 'Monaco Sovereign Velvet', 'Imperial Luxury', 'Gold Bullion & Crown', 'Garis pinstripe emas batangan Monako, lambang mahkota monarki berdaulat, dan bayangan kedalaman beludru mewah.', 'symmetrical', 'arch-portal', 'dual-arch', 'ShieldCheck'),
('victorian-cameo', 'Victorian Cameo Filigree', 'Imperial Luxury', 'Antique Medallion Scroll', 'Ukiran sulur emas rococo Eropa klasik, medali potret cameo oval antik, dan jam ornamen kerajaan antik berputar anggun.', 'cameo-antique', 'cameo-oval', 'dual-arch', 'Award'),
('haute-couture', 'Haute Couture Atelier', 'Imperial Luxury', 'Runway Seal & Hairline', 'Tata letak rumah mode Paris dengan garis rambut ultra-tipis, segel monogram cap emas stempel, dan spasi estetika tinggi.', 'linear-minimal', 'magazine-editorial', 'boarding-pass', 'Sparkles'),
('javanese-kraton', 'Javanese Kraton Gunungan', 'Adat Nusantara', 'Gapura Kagungan Dalem', 'Gapura Gunungan Wayang agung kembar, ornamen ukir klasik Jawa, dan bilah waktu beraksen filosofis adiluhung.', 'cultural-gate', 'arch-portal', 'songket-scroll', 'Landmark'),
('sundanese-siger', 'Sundanese Siger Priangan', 'Adat Nusantara', 'Mahkota Siger Pasundan', 'Kubah mahkota Siger perak-emas megah, untaian ronce melati pusaka, kartu lembut Priangan bernuansa syahdu.', 'cultural-gate', 'arch-portal', 'timeline-vertical', 'Crown'),
('minang-gonjong', 'Minang Rumah Gadang Gonjong', 'Adat Nusantara', 'Gonjong Suntiang Nan Megah', 'Siluet atap Gonjong melengkung tajam, bingkai permadani Songket emas Pandai Sikek, dan blok waktu berbingkai merah kirmizi mewah.', 'cultural-gate', 'diamond-facet', 'songket-scroll', 'Sparkles'),
('balinese-candi', 'Balinese Candi Bentar Sanctuary', 'Adat Nusantara', 'Gapura Candi & Patra Punggel', 'Gapura Candi Bentar terbelah agung, ornamen daun Patra Punggel keemasan, dan motif teratai suci bernuansa sakral dewata.', 'cultural-gate', 'arch-portal', 'dual-arch', 'Flame'),
('palembang-songket', 'Palembang Sriwijaya Songket', 'Adat Nusantara', 'Rumah Limas & Tenun Emas', 'Mahkota atap Limas keemasan, motif tenun Songket Lepus intan berlian, dan kartu acara berbingkai songket anggun.', 'cultural-gate', 'diamond-facet', 'songket-scroll', 'Coins'),
('split-editorial', 'Split Modern Editorial', 'Modern & Editorial', 'Duotone Split Screen', 'Tata letak 2-kolom modern dengan preview potret mempelai berdampingan, tipografi avant-garde besar, dan bilah hitung mundur linear presisi.', 'split-duotone', 'magazine-editorial', 'swiss-grid', 'Columns'),
('minimalist-swiss', 'Swiss Modern Clean Sheet', 'Modern & Editorial', 'International Typographic', 'Grid asimetris minimalis mutakhir, kontras tipografi tinggi, bilah hitung mundur horizontal dengan penanda progres presisi tinggi.', 'linear-minimal', 'scandi-card', 'swiss-grid', 'Layers'),
('vogue-lookbook', 'Vogue Wedding Lookbook', 'Modern & Editorial', 'Haute Fashion Masthead', 'Header sampul majalah fashion premium, stempel barcode VIP, kutipan editorial mode, dan tata letak lookbook potret penuh.', 'magazine-masthead', 'magazine-editorial', 'boarding-pass', 'BookOpen'),
('bauhaus-quadrant', 'Bauhaus Geometric Quadrant', 'Modern & Editorial', 'Modular 4-Block Grid', 'Susunan 4 kuadran modular geometris berani, garis tepi arsitektural tegas, dan hierarki angka monolitik modern.', 'quadrant-grid', 'scandi-card', 'swiss-grid', 'Grid'),
('obsidian-prism', 'Obsidian Cyber Prism', 'Modern & Editorial', 'Faceted Diamond Edges', 'Bentuk kristal poligon bersudut 3D, garis neon platinum futuristik, dan blok waktu dengan estetika prisma berlian hitam.', 'faceted-prism', 'diamond-facet', 'swiss-grid', 'Gem'),
('botanical-capsule', 'Botanical Frosted Herbarium', 'Nature & Botanical', 'Organic Glass Capsule', 'Watermark dedaunan monstera & pakis tropis, kapsul kaca buram melengkung lembut, dan pembatas sulur organik alami.', 'capsule-pill', 'glass-capsule', 'glass-dashboard', 'Leaf'),
('nordic-woodland', 'Nordic Scandinavian Woodland', 'Nature & Botanical', 'Clean Hygge Asymmetry', 'Desain Skandinavia hangat dan seimbang, aksen cemara & pine, kartu asimetris bersih bernuansa hygge.', 'linear-minimal', 'scandi-card', 'swiss-grid', 'Trees'),
('tuscan-laurel', 'Tuscan Olive Laurel', 'Nature & Botanical', 'Roman Laurel Wreath', 'Karangan daun salam zaitun Romawi kuno, tekstur batu hangat Toscana, dan ritme tipografi serif klasik yang abadi.', 'capsule-pill', 'classic-circle', 'timeline-vertical', 'Sun'),
('boho-arch', 'Bohemian Terracotta Sunburst', 'Nature & Botanical', 'Desert Sun & Niche Arches', 'Lengkungan kubah gurun terracotta, motif sinar matahari terbit boho, dan kartu bergaya lorong istana gurun pasir hangat.', 'boho-arch', 'arch-portal', 'timeline-vertical', 'SunMedium'),
('romantic-chiffon', 'Romantic Chiffon Heart', 'Romantic & Celestial', 'Pillow Soft & Cursive Glow', 'Panel lembut melengkung hangat menyerupai bantal sutera, kaligrafi kursif bersinar, dan partikel hati melayang syahdu.', 'symmetrical', 'arch-portal', 'timeline-vertical', 'Heart'),
('celestial-astral', 'Celestial Astral Starlight', 'Romantic & Celestial', 'Constellation Orbit Rings', 'Cincin hitung mundur orbital astronomis, titik rasi bintang bercahaya, dan visual aurora galaksi malam yang memikat.', 'astral-rings', 'classic-circle', 'glass-dashboard', 'Orbit'),
('oceanic-horizon', 'Sapphire Oceanic Horizon', 'Romantic & Celestial', 'Coastal Wave Rhythm', 'Garis ritme gelombang laut dinamis, lencana jangkar safir maritim, dan gradasi cakrawala samudra biru tua.', 'split-duotone', 'glass-capsule', 'glass-dashboard', 'Compass'),
('amethyst-crystal', 'Mystic Amethyst Geode', 'Romantic & Celestial', 'Violet Gem Facet', 'Potongan kristal permata kecubung ungu bercahaya, sudut geometris faset heksagonal, dan aura magis yang memukau.', 'faceted-prism', 'diamond-facet', 'glass-dashboard', 'Hexagon')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 8. SEED DATA: DEFAULT WEDDING PROJECT (Arya & Anindya)
-- ==============================================================================
INSERT INTO public.wedding_projects (id, title, client_name, slug, status, config)
VALUES (
    'proj-arya-anindya-main',
    'The Wedding of Arya & Anindya',
    'Arya & Anindya',
    'arya-anindya',
    'published',
    $json$
    {
      "slug": "arya-anindya",
      "invitationTitle": "The Wedding of Arya & Anindya",
      "weddingDate": "2026-10-24T08:00:00+07:00",
      "cityLocation": "Jakarta, Indonesia",
      "theme": "classic-midnight",
      "layoutStyle": "royal-symmetrical",
      "petalEffect": "rose",
      "groom": {
        "name": "Arya",
        "fullName": "Arya Pratama, S.T.",
        "role": "Groom",
        "parentInfo": "Putra Pertama dari Bpk. Bambang Sutrisno & Ibu Sri Rahayu",
        "instagram": "@aryapratama.id",
        "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        "description": "Pria yang tenang, penuh dedikasi, dan menemukan ketenangan terbesarnya saat bersama Anindya."
      },
      "bride": {
        "name": "Anindya",
        "fullName": "Anindya Larasati, S.Ds.",
        "role": "Bride",
        "parentInfo": "Putri Kedua dari Bpk. Ir. Hendro Wibowo & Ibu Maya Kartika",
        "instagram": "@anindyalarasati",
        "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "description": "Sosok hangat penuh senyuman yang mengisi setiap hari Arya dengan warna dan kebahagiaan tak terhingga."
      },
      "holyQuote": {
        "surah": "QS. Ar-Rum : 21",
        "text": "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
      },
      "events": [
        {
          "id": "akad",
          "title": "Akad Nikah",
          "subtitle": "Momen Sakral Ikrar Suci",
          "dateString": "Sabtu, 24 Oktober 2026",
          "timeRange": "08.00 - 10.00 WIB",
          "venueName": "Grand Ballroom The Dharmawangsa Hotel",
          "address": "Jl. Brawijaya Raya No. 26, Kebayoran Baru, Jakarta Selatan",
          "googleMapsUrl": "https://maps.google.com/?q=The+Dharmawangsa+Jakarta",
          "calendarEventTitle": "Akad Nikah Arya & Anindya",
          "dresscode": "Formal / Tradisional Elegan",
          "dresscodeColors": [
            { "name": "Sage Green", "hex": "#6f8f72" },
            { "name": "Champagne Gold", "hex": "#d4af37" },
            { "name": "Warm Cream", "hex": "#f4ecd8" }
          ],
          "isVirtualAvailable": true,
          "virtualStreamUrl": "https://youtube.com/live"
        },
        {
          "id": "resepsi",
          "title": "Resepsi Pernikahan",
          "subtitle": "Perayaan Cinta & Syukuran",
          "dateString": "Sabtu, 24 Oktober 2026",
          "timeRange": "18.30 - 21.30 WIB",
          "venueName": "Royal Glass House & Garden The Dharmawangsa",
          "address": "Jl. Brawijaya Raya No. 26, Kebayoran Baru, Jakarta Selatan",
          "googleMapsUrl": "https://maps.google.com/?q=The+Dharmawangsa+Jakarta",
          "calendarEventTitle": "Resepsi Pernikahan Arya & Anindya",
          "dresscode": "Black Tie / Evening Formal Batik & Kebaya Modern",
          "dresscodeColors": [
            { "name": "Emerald Forest", "hex": "#164e3b" },
            { "name": "Midnight Navy", "hex": "#1e293b" },
            { "name": "Warm Gold", "hex": "#e5b84c" }
          ],
          "isVirtualAvailable": true,
          "virtualStreamUrl": "https://youtube.com/live"
        }
      ],
      "loveStory": [
        {
          "year": "2021",
          "title": "Pertemuan Pertama",
          "description": "Takdir mempertemukan kami di sebuah workshop desain & teknologi di Bandung. Percakapan singkat tentang kopi dan arsitektur berlanjut menjadi obrolan hangat tanpa henti.",
          "icon": "Sparkles",
          "photoUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80"
        },
        {
          "year": "2023",
          "title": "Menjalin Komitmen",
          "description": "Setelah melalui berbagai cerita, petualangan mendaki bersama, dan saling mendukung mimpi masing-masing, kami memutuskan untuk melangkah ke jenjang yang lebih serius.",
          "icon": "HeartHandshake",
          "photoUrl": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=80"
        },
        {
          "year": "2025",
          "title": "The Proposal under the Stars",
          "description": "Di bawah gemerlap langit malam Bromo, Arya berlutut menyematkan cincin tanda cinta abadi, dan Anindya menjawab Ya dengan penuh air mata bahagia.",
          "icon": "Heart",
          "photoUrl": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=700&q=80"
        }
      ],
      "gallery": [
        {
          "id": "gal-1",
          "title": "Golden Hour Reverie",
          "category": "outdoor",
          "imageUrl": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
          "caption": "Dalam tatap lembutmu, kutemukan rumah tempat jiwaku pulang.",
          "aspect": "landscape"
        },
        {
          "id": "gal-2",
          "title": "Elegance in Tradition",
          "category": "traditional",
          "imageUrl": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
          "caption": "Menjunjung tinggi warisan leluhur dalam ikatan sakral abadi.",
          "aspect": "portrait"
        },
        {
          "id": "gal-3",
          "title": "Studio Serenade",
          "category": "studio",
          "imageUrl": "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
          "caption": "Dua hati yang berpadu dalam harmoni simfoni kehidupan.",
          "aspect": "square"
        },
        {
          "id": "gal-4",
          "title": "Candid Laughter",
          "category": "candid",
          "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
          "caption": "Tawa tulus yang menjadi melodi terindah di setiap hari kami.",
          "aspect": "portrait"
        },
        {
          "id": "gal-5",
          "title": "Twilight Walk",
          "category": "outdoor",
          "imageUrl": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
          "caption": "Menggenggam erat tanganmu melewati setiap musim kehidupan.",
          "aspect": "landscape"
        },
        {
          "id": "gal-6",
          "title": "The Promise Ring",
          "category": "studio",
          "imageUrl": "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
          "caption": "Simbol janji setia yang terukir selamanya.",
          "aspect": "portrait"
        }
      ],
      "bankAccounts": [
        {
          "id": "bca",
          "bankName": "BCA (Bank Central Asia)",
          "accountNumber": "8735091244",
          "accountHolder": "ARYA PRATAMA",
          "logoType": "bca"
        },
        {
          "id": "mandiri",
          "bankName": "Bank Mandiri",
          "accountNumber": "1370019284752",
          "accountHolder": "ANINDYA LARASATI",
          "logoType": "mandiri"
        },
        {
          "id": "qris",
          "bankName": "QRIS Digital Gift (Semua E-Wallet / Bank)",
          "accountNumber": "NMID: ID1020039281729",
          "accountHolder": "Arya & Anindya Wedding",
          "logoType": "qris"
        }
      ],
      "giftAddress": {
        "recipient": "Arya Pratama & Anindya Larasati",
        "phone": "0812-8899-7722",
        "address": "Cluster Gardenia Hills Blok C-12, Jl. Kenanga Indah, Pondok Indah, Jakarta Selatan, DKI Jakarta 12310",
        "note": "Konfirmasi pengiriman kado via WhatsApp terlebih dahulu agar paket diterima dengan baik."
      },
      "audioTitle": "Romantic Acoustic Piano - Canon in D",
      "guestName": "Tamu Undangan Terhormat"
    }
    $json$::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 9. SEED DATA: INITIAL GUEST CONTACTS, RSVPs & WISHES
-- ==============================================================================
INSERT INTO public.guest_contacts (id, project_id, name, phone, category, pax_limit, is_sent, custom_note)
VALUES
('gst-1', 'proj-arya-anindya-main', 'Bpk. H. Prasetyo & Keluarga', '081234567890', 'VIP', 4, true, 'Keluarga Besar Paman Arya'),
('gst-2', 'proj-arya-anindya-main', 'Raditya Pratama & Pasangan', '081987654321', 'Sahabat', 2, true, 'Sahabat Kuliah ITB'),
('gst-3', 'proj-arya-anindya-main', 'Dinda Maharani & Suami', '085712345678', 'Rekan Kerja', 2, false, 'Tim Design Studio'),
('gst-4', 'proj-arya-anindya-main', 'Rian Firmansyah', '081399887766', 'Rekan Kerja', 1, false, 'Project Manager')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.rsvp_submissions (id, project_id, guest_name, phone_number, attendance, pax_count, selected_event_id, event_session, notes)
VALUES
('rsvp-1', 'proj-arya-anindya-main', 'Raditya Pratama', '081987654321', 'Hadir', 2, 'resepsi', 'Sesi Malam', 'Selamat ya bro! Siap hadir tepat waktu.'),
('rsvp-2', 'proj-arya-anindya-main', 'Bpk. H. Prasetyo', '081234567890', 'Hadir', 4, 'akad', 'Sesi Akad & Resepsi', 'Insya Allah sekeluarga hadir mendoakan.'),
('rsvp-3', 'proj-arya-anindya-main', 'Rian Firmansyah', '081399887766', 'Masih Ragu', 1, 'resepsi', 'Sesi Malam', 'Sedang menyesuaikan jadwal dinas keluar kota.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.guest_wishes (id, project_id, name, sender_name, status, message, relation, likes)
VALUES
('wish-1', 'proj-arya-anindya-main', 'Raditya & Vania', 'Raditya Pratama', 'Hadir', 'Selamat ya Arya dan Anindya! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Lancar sampai hari H sahabatku! 🎉✨', 'Sahabat Kuliah', 12),
('wish-2', 'proj-arya-anindya-main', 'Keluarga Bpk. H. Prasetyo', 'Bpk. H. Prasetyo', 'Hadir', 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khoir. Doa terbaik dari kami sekeluarga untuk kedua mempelai.', 'Keluarga', 8),
('wish-3', 'proj-arya-anindya-main', 'Dinda Maharani & Suami', 'Dinda Maharani', 'Hadir', 'Aaaa terharu banget melihat perjalanan kalian dari awal! Cantik dan ganteng banget, cant wait to celebrate with you guys! ❤️', 'Teman Kantor', 19),
('wish-4', 'proj-arya-anindya-main', 'Rian Firmansyah', 'Rian Firmansyah', 'Masih Ragu', 'Selamat brother Arya! Sedang usahakan jadwal dinas agar bisa terbang ke Jakarta hadir di momen sakral ini. Sukses lancar!', 'Rekan Kerja', 4)
ON CONFLICT (id) DO NOTHING;
