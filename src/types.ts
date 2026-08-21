export interface CoupleProfile {
  name: string;
  fullName: string;
  role: 'Groom' | 'Bride';
  parentInfo: string;
  instagram: string;
  photoUrl: string;
  description: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  subtitle: string;
  dateString: string;
  timeRange: string;
  venueName: string;
  address: string;
  googleMapsUrl: string;
  calendarEventTitle: string;
  dresscode: string;
  dresscodeColors: { name: string; hex: string }[];
  isVirtualAvailable?: boolean;
  virtualStreamUrl?: string;
}

export interface LoveMilestone {
  year: string;
  title: string;
  description: string;
  icon: string;
  photoUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'outdoor' | 'studio' | 'traditional' | 'candid';
  imageUrl: string;
  caption: string;
  aspect?: 'portrait' | 'landscape' | 'square';
}

export interface GuestWish {
  id: string;
  name: string;
  senderName?: string;
  status: 'Hadir' | 'Masih Ragu' | 'Tidak Hadir';
  message: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  relation?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoType: 'bca' | 'mandiri' | 'bri' | 'qris';
  qrisImageUrl?: string;
}

export interface GiftAddressConfig {
  recipient: string;
  phone: string;
  address: string;
  note?: string;
}

export interface HolyQuoteConfig {
  surah: string;
  text: string;
}

export type LayoutArchetype = 
  // 1. Classic & Imperial
  | 'royal-symmetrical'
  | 'monaco-velvet'
  | 'victorian-cameo'
  | 'haute-couture'
  // 2. Tradisional & Adat Nusantara
  | 'javanese-kraton'
  | 'sundanese-siger'
  | 'minang-gonjong'
  | 'balinese-candi'
  | 'palembang-songket'
  // 3. Modern & Editorial
  | 'split-editorial'
  | 'minimalist-swiss'
  | 'vogue-lookbook'
  | 'bauhaus-quadrant'
  | 'obsidian-prism'
  // 4. Nature & Botanical
  | 'botanical-capsule'
  | 'nordic-woodland'
  | 'tuscan-laurel'
  | 'boho-arch'
  // 5. Romantic & Celestial
  | 'romantic-chiffon'
  | 'celestial-astral'
  | 'oceanic-horizon'
  | 'amethyst-crystal';

export interface LayoutArchetypeInfo {
  id: LayoutArchetype;
  name: string;
  category: 'Imperial Luxury' | 'Adat Nusantara' | 'Modern & Editorial' | 'Nature & Botanical' | 'Romantic & Celestial';
  culturalTag?: string;
  description: string;
  heroLayout: 'symmetrical' | 'split-duotone' | 'cultural-gate' | 'linear-minimal' | 'astral-rings' | 'magazine-masthead' | 'quadrant-grid' | 'capsule-pill' | 'cameo-antique' | 'boho-arch' | 'faceted-prism';
  coupleCardStyle: 'classic-circle' | 'arch-portal' | 'polaroid' | 'diamond-facet' | 'magazine-editorial' | 'cameo-oval' | 'glass-capsule' | 'scandi-card';
  eventsStyle: 'timeline-vertical' | 'boarding-pass' | 'dual-arch' | 'songket-scroll' | 'swiss-grid' | 'glass-dashboard';
  badgeIconName?: string;
}

export type WeddingTheme = 
  // 1. Signature Luxury
  | 'classic-midnight' 
  | 'black-diamond'
  | 'champagne' 
  | 'midnight-amethyst'
  // 2. Botanical & Nature Elegance
  | 'royal-emerald' 
  | 'sage-eucalyptus'
  | 'olive-garden'
  | 'pine-terracotta'
  // 3. Romantic, Floral & Pastel
  | 'rose-gold' 
  | 'dusty-rose'
  | 'lavender-twilight'
  | 'peach-blossom'
  | 'blush-peony'
  // 4. Ocean, Sky & Sapphire Blue
  | 'royal-sapphire' 
  | 'celestial-blue'
  | 'ocean-breeze'
  | 'powder-blue'
  // 5. Tradisional & Heritage Nusantara
  | 'traditional-java'
  | 'sunda-heritage'
  | 'minang-crimson'
  | 'bali-sanctuary'
  | 'palembang-songket'
  // 6. Modern Minimalist, Editorial & Warm Tones
  | 'minimal-monochrome'
  | 'terracotta-sunset'
  | 'pearl-ivory'
  | 'ruby-crimson';

export type PetalType = 'rose' | 'jasmine' | 'gold_sparkles' | 'none';

export interface ThemeConfig {
  id: WeddingTheme;
  name: string;
  category: string;
  culturalLabel?: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  bgHex: string;
  cardBgHex: string;
  gradientText: string;
  glowHex: string;
  ornamentType: 
    | 'gunungan' 
    | 'sunda-jasmine' 
    | 'minang-suntiang' 
    | 'bali-prada' 
    | 'palembang-songket' 
    | 'royal-crown' 
    | 'platinum-diamond' 
    | 'botanical-leaf' 
    | 'romantic-rose' 
    | 'celestial-star' 
    | 'editorial-cross';
  cardRadius: string;
  frameStyle: 'royal-arch' | 'ornate-corners' | 'botanical-border' | 'minimal-sharp' | 'floral-crest' | 'celestial-frame';
  defaultLayout?: LayoutArchetype;
  previewClass: string;
}

export interface GuestContact {
  id: string;
  name: string;
  phone?: string;
  category: 'Keluarga' | 'VIP' | 'Sahabat' | 'Rekan Kerja' | 'Umum';
  paxLimit?: number;
  isSent?: boolean;
  sentAt?: string;
  customNote?: string;
}

export interface WeddingInvitationConfig {
  slug?: string;
  invitationTitle?: string;
  weddingDate: string; // ISO String e.g. 2026-10-24T08:00:00+07:00
  cityLocation?: string;
  groom: CoupleProfile;
  bride: CoupleProfile;
  holyQuote: HolyQuoteConfig;
  events: WeddingEvent[];
  loveStory: LoveMilestone[];
  gallery: GalleryItem[];
  bankAccounts: BankAccount[];
  giftAddress: GiftAddressConfig;
  audioUrl?: string;
  audioTitle?: string;
  guestName?: string;
  theme?: WeddingTheme;
  layoutStyle?: LayoutArchetype;
  petalEffect?: PetalType;
  rsvpWebhookUrl?: string;
  wishesApiUrl?: string;
}

export interface WeddingProject {
  id: string;
  title: string;
  clientName: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  config: WeddingInvitationConfig;
  guests: GuestContact[];
  rsvps: RsvpSubmission[];
  wishes: GuestWish[];
}

export interface RsvpSubmission {
  id?: string;
  guestName: string;
  phoneNumber?: string;
  attendance: 'Hadir' | 'Masih Ragu' | 'Tidak Hadir';
  paxCount: number;
  selectedEventId?: string;
  eventSession?: string;
  notes?: string;
  submittedAt?: string;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'wedding-planner';
  studioName?: string;
  avatarUrl?: string;
  loginAt?: string;
}
