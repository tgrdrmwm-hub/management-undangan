import { getSupabase } from '../lib/supabase';
import { 
  ThemeConfig, 
  LayoutArchetypeInfo, 
  WeddingProject, 
  GuestContact, 
  RsvpSubmission, 
  GuestWish 
} from '../types';

/**
 * Konversi baris tabel 'themes' database ke interface TypeScript 'ThemeConfig'
 */
export function mapDbThemeToThemeConfig(row: any): ThemeConfig {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    culturalLabel: row.cultural_label || undefined,
    description: row.description || '',
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    bgHex: row.bg_hex,
    cardBgHex: row.card_bg_hex,
    gradientText: row.gradient_text,
    glowHex: row.glow_hex,
    ornamentType: row.ornament_type,
    cardRadius: row.card_radius || 'rounded-2xl',
    frameStyle: row.frame_style || 'royal-arch',
    defaultLayout: row.default_layout || undefined,
    previewClass: row.preview_class || '',
  };
}

/**
 * Konversi ThemeConfig TypeScript ke baris tabel database Supabase
 */
export function mapThemeConfigToDbRow(theme: ThemeConfig) {
  return {
    id: theme.id,
    name: theme.name,
    category: theme.category,
    cultural_label: theme.culturalLabel || null,
    description: theme.description || '',
    primary_color: theme.primaryColor,
    secondary_color: theme.secondaryColor,
    bg_hex: theme.bgHex,
    card_bg_hex: theme.cardBgHex,
    gradient_text: theme.gradientText,
    glow_hex: theme.glowHex,
    ornament_type: theme.ornamentType,
    card_radius: theme.cardRadius,
    frame_style: theme.frameStyle,
    default_layout: theme.defaultLayout || null,
    preview_class: theme.previewClass || '',
    updated_at: new Date().toISOString(),
  };
}

/**
 * Konversi baris tabel 'layout_archetypes' database ke interface TypeScript 'LayoutArchetypeInfo'
 */
export function mapDbLayoutToLayoutInfo(row: any): LayoutArchetypeInfo {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    culturalTag: row.cultural_tag || undefined,
    description: row.description || '',
    heroLayout: row.hero_layout,
    coupleCardStyle: row.couple_card_style,
    eventsStyle: row.events_style,
    badgeIconName: row.badge_icon_name || undefined,
  };
}

/**
 * Konversi LayoutArchetypeInfo TypeScript ke baris database
 */
export function mapLayoutInfoToDbRow(layout: LayoutArchetypeInfo) {
  return {
    id: layout.id,
    name: layout.name,
    category: layout.category,
    cultural_tag: layout.culturalTag || null,
    description: layout.description || '',
    hero_layout: layout.heroLayout,
    couple_card_style: layout.coupleCardStyle,
    events_style: layout.eventsStyle,
    badge_icon_name: layout.badgeIconName || null,
    updated_at: new Date().toISOString(),
  };
}

// ==============================================================================
// 1. THEMES & LAYOUTS API
// ==============================================================================

export async function fetchThemesFromSupabase(): Promise<ThemeConfig[] | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb.from('themes').select('*');
    if (error || !data || data.length === 0) return null;
    return data.map(mapDbThemeToThemeConfig);
  } catch (err) {
    console.warn('Gagal memuat tema dari Supabase:', err);
    return null;
  }
}

export async function fetchLayoutArchetypesFromSupabase(): Promise<LayoutArchetypeInfo[] | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb.from('layout_archetypes').select('*');
    if (error || !data || data.length === 0) return null;
    return data.map(mapDbLayoutToLayoutInfo);
  } catch (err) {
    console.warn('Gagal memuat layout archetypes dari Supabase:', err);
    return null;
  }
}

// ==============================================================================
// 2. WEDDING PROJECTS API
// ==============================================================================

export async function fetchProjectsFromSupabase(): Promise<WeddingProject[] | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data: projectsData, error: projError } = await sb
      .from('wedding_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projError || !projectsData) return null;

    const fullProjects: WeddingProject[] = [];

    for (const p of projectsData) {
      // Ambil tamu, rsvps, dan ucapan terkait project ini
      const [{ data: guests }, { data: rsvps }, { data: wishes }] = await Promise.all([
        sb.from('guest_contacts').select('*').eq('project_id', p.id),
        sb.from('rsvp_submissions').select('*').eq('project_id', p.id).order('created_at', { ascending: false }),
        sb.from('guest_wishes').select('*').eq('project_id', p.id).order('created_at', { ascending: false }),
      ]);

      fullProjects.push({
        id: p.id,
        title: p.title,
        clientName: p.client_name,
        slug: p.slug,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        config: p.config || {},
        guests: (guests || []).map((g: any) => ({
          id: g.id,
          name: g.name,
          phone: g.phone || undefined,
          category: g.category,
          paxLimit: g.pax_limit,
          isSent: g.is_sent,
          sentAt: g.sent_at || undefined,
          customNote: g.custom_note || undefined,
        })),
        rsvps: (rsvps || []).map((r: any) => ({
          id: r.id,
          guestName: r.guest_name,
          phoneNumber: r.phone_number || undefined,
          attendance: r.attendance,
          paxCount: r.pax_count,
          selectedEventId: r.selected_event_id || undefined,
          eventSession: r.event_session || undefined,
          notes: r.notes || undefined,
          submittedAt: r.submitted_at || r.created_at,
          createdAt: r.created_at,
        })),
        wishes: (wishes || []).map((w: any) => ({
          id: w.id,
          name: w.name,
          senderName: w.sender_name || undefined,
          status: w.status,
          message: w.message,
          relation: w.relation || undefined,
          likes: w.likes || 0,
          createdAt: w.created_at,
        })),
      });
    }

    return fullProjects;
  } catch (err) {
    console.warn('Gagal memuat projects dari Supabase:', err);
    return null;
  }
}

export async function fetchProjectBySlugFromSupabase(slug: string): Promise<WeddingProject | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data: p, error } = await sb
      .from('wedding_projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !p) return null;

    const [{ data: guests }, { data: rsvps }, { data: wishes }] = await Promise.all([
      sb.from('guest_contacts').select('*').eq('project_id', p.id),
      sb.from('rsvp_submissions').select('*').eq('project_id', p.id).order('created_at', { ascending: false }),
      sb.from('guest_wishes').select('*').eq('project_id', p.id).order('created_at', { ascending: false }),
    ]);

    return {
      id: p.id,
      title: p.title,
      clientName: p.client_name,
      slug: p.slug,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      config: p.config || {},
      guests: (guests || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        phone: g.phone || undefined,
        category: g.category,
        paxLimit: g.pax_limit,
        isSent: g.is_sent,
        sentAt: g.sent_at || undefined,
        customNote: g.custom_note || undefined,
      })),
      rsvps: (rsvps || []).map((r: any) => ({
        id: r.id,
        guestName: r.guest_name,
        phoneNumber: r.phone_number || undefined,
        attendance: r.attendance,
        paxCount: r.pax_count,
        selectedEventId: r.selected_event_id || undefined,
        eventSession: r.event_session || undefined,
        notes: r.notes || undefined,
        submittedAt: r.submitted_at || r.created_at,
        createdAt: r.created_at,
      })),
      wishes: (wishes || []).map((w: any) => ({
        id: w.id,
        name: w.name,
        senderName: w.sender_name || undefined,
        status: w.status,
        message: w.message,
        relation: w.relation || undefined,
        likes: w.likes || 0,
        createdAt: w.created_at,
      })),
    };
  } catch (err) {
    console.warn(`Gagal memuat project slug ${slug}:`, err);
    return null;
  }
}

export async function upsertProjectToSupabase(project: WeddingProject): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb.from('wedding_projects').upsert({
      id: project.id,
      title: project.title,
      client_name: project.clientName,
      slug: project.slug,
      config: project.config,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Gagal menyimpan project ke Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error saat menyimpan project:', err);
    return false;
  }
}

export async function deleteProjectFromSupabase(projectId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb.from('wedding_projects').delete().eq('id', projectId);
    return !error;
  } catch (err) {
    console.warn('Gagal menghapus project dari Supabase:', err);
    return false;
  }
}

// ==============================================================================
// 3. GUEST CONTACTS (WA BLAST) API
// ==============================================================================

export async function upsertGuestToSupabase(projectId: string, guest: GuestContact): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb.from('guest_contacts').upsert({
      id: guest.id,
      project_id: projectId,
      name: guest.name,
      phone: guest.phone || null,
      category: guest.category,
      pax_limit: guest.paxLimit || 2,
      is_sent: guest.isSent || false,
      sent_at: guest.sentAt || null,
      custom_note: guest.customNote || null,
      updated_at: new Date().toISOString(),
    });

    return !error;
  } catch (err) {
    console.warn('Gagal upsert guest:', err);
    return false;
  }
}

export async function deleteGuestFromSupabase(guestId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb.from('guest_contacts').delete().eq('id', guestId);
    return !error;
  } catch (err) {
    return false;
  }
}

// ==============================================================================
// 4. RSVP SUBMISSIONS API
// ==============================================================================

export async function insertRsvpToSupabase(projectId: string, rsvp: RsvpSubmission): Promise<RsvpSubmission | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb.from('rsvp_submissions').insert({
      id: rsvp.id || undefined,
      project_id: projectId,
      guest_name: rsvp.guestName,
      phone_number: rsvp.phoneNumber || null,
      attendance: rsvp.attendance,
      pax_count: rsvp.paxCount || 1,
      selected_event_id: rsvp.selectedEventId || null,
      event_session: rsvp.eventSession || null,
      notes: rsvp.notes || null,
      submitted_at: rsvp.submittedAt || new Date().toISOString(),
    }).select().single();

    if (error || !data) {
      console.warn('Gagal insert RSVP ke Supabase:', error);
      return null;
    }

    return {
      id: data.id,
      guestName: data.guest_name,
      phoneNumber: data.phone_number || undefined,
      attendance: data.attendance,
      paxCount: data.pax_count,
      selectedEventId: data.selected_event_id || undefined,
      eventSession: data.event_session || undefined,
      notes: data.notes || undefined,
      submittedAt: data.submitted_at,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.warn('Error saat submit RSVP:', err);
    return null;
  }
}

export async function deleteRsvpFromSupabase(rsvpId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb.from('rsvp_submissions').delete().eq('id', rsvpId);
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 5. GUEST WISHES (BUKU TAMU) API
// ==============================================================================

export async function insertWishToSupabase(
  projectId: string, 
  wish: Omit<GuestWish, 'id' | 'createdAt' | 'likes' | 'isLiked'>
): Promise<GuestWish | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb.from('guest_wishes').insert({
      project_id: projectId,
      name: wish.name,
      sender_name: wish.senderName || wish.name,
      status: wish.status || 'Hadir',
      message: wish.message,
      relation: wish.relation || null,
      likes: 0,
    }).select().single();

    if (error || !data) {
      console.warn('Gagal insert ucapan ke Supabase:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      senderName: data.sender_name || undefined,
      status: data.status,
      message: data.message,
      relation: data.relation || undefined,
      likes: data.likes || 0,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.warn('Error saat submit wish:', err);
    return null;
  }
}

export async function updateWishLikesInSupabase(wishId: string, newLikes: number): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb.from('guest_wishes').update({ likes: newLikes }).eq('id', wishId);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteWishFromSupabase(wishId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb.from('guest_wishes').delete().eq('id', wishId);
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 6. REALTIME SUBSCRIPTIONS
// ==============================================================================

export function subscribeToProjectRealtime(
  projectId: string,
  callbacks: {
    onWishInsert?: (wish: GuestWish) => void;
    onWishUpdate?: (wish: GuestWish) => void;
    onWishDelete?: (wishId: string) => void;
    onRsvpInsert?: (rsvp: RsvpSubmission) => void;
    onRsvpDelete?: (rsvpId: string) => void;
  }
) {
  const sb = getSupabase();
  if (!sb) return () => {};

  const channel = sb
    .channel(`realtime:project:${projectId}`)
    // Listen for Wishes
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'guest_wishes', filter: `project_id=eq.${projectId}` },
      (payload) => {
        const row = payload.new;
        callbacks.onWishInsert?.({
          id: row.id,
          name: row.name,
          senderName: row.sender_name || undefined,
          status: row.status,
          message: row.message,
          relation: row.relation || undefined,
          likes: row.likes || 0,
          createdAt: row.created_at,
        });
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'guest_wishes', filter: `project_id=eq.${projectId}` },
      (payload) => {
        const row = payload.new;
        callbacks.onWishUpdate?.({
          id: row.id,
          name: row.name,
          senderName: row.sender_name || undefined,
          status: row.status,
          message: row.message,
          relation: row.relation || undefined,
          likes: row.likes || 0,
          createdAt: row.created_at,
        });
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'guest_wishes' },
      (payload) => {
        callbacks.onWishDelete?.(payload.old.id);
      }
    )
    // Listen for RSVPs
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'rsvp_submissions', filter: `project_id=eq.${projectId}` },
      (payload) => {
        const row = payload.new;
        callbacks.onRsvpInsert?.({
          id: row.id,
          guestName: row.guest_name,
          phoneNumber: row.phone_number || undefined,
          attendance: row.attendance,
          paxCount: row.pax_count,
          selectedEventId: row.selected_event_id || undefined,
          eventSession: row.event_session || undefined,
          notes: row.notes || undefined,
          submittedAt: row.submitted_at || row.created_at,
          createdAt: row.created_at,
        });
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'rsvp_submissions' },
      (payload) => {
        callbacks.onRsvpDelete?.(payload.old.id);
      }
    )
    .subscribe();

  return () => {
    sb.removeChannel(channel);
  };
}

// ==============================================================================
// 7. BULK SYNC LOCAL DATA TO SUPABASE (1-CLICK SEED/SYNC)
// ==============================================================================

export async function syncAllLocalDataToSupabase(
  projects: WeddingProject[],
  themes: ThemeConfig[],
  layouts: LayoutArchetypeInfo[]
): Promise<{ success: boolean; message: string; details?: any }> {
  const sb = getSupabase();
  if (!sb) {
    return { success: false, message: 'Supabase client belum aktif. Konfigurasikan URL & Anon Key terlebih dahulu.' };
  }

  try {
    // 1. Sync Themes
    const themeRows = themes.map(mapThemeConfigToDbRow);
    const { error: themesErr } = await sb.from('themes').upsert(themeRows);
    if (themesErr) throw new Error(`Themes sync failed: ${themesErr.message}`);

    // 2. Sync Layouts
    const layoutRows = layouts.map(mapLayoutInfoToDbRow);
    const { error: layoutsErr } = await sb.from('layout_archetypes').upsert(layoutRows);
    if (layoutsErr) throw new Error(`Layouts sync failed: ${layoutsErr.message}`);

    // 3. Sync Projects
    for (const proj of projects) {
      await upsertProjectToSupabase(proj);

      // Sync guests
      if (proj.guests && proj.guests.length > 0) {
        const guestRows = proj.guests.map((g) => ({
          id: g.id,
          project_id: proj.id,
          name: g.name,
          phone: g.phone || null,
          category: g.category,
          pax_limit: g.paxLimit || 2,
          is_sent: g.isSent || false,
          sent_at: g.sentAt || null,
          custom_note: g.customNote || null,
        }));
        await sb.from('guest_contacts').upsert(guestRows);
      }

      // Sync RSVPs
      if (proj.rsvps && proj.rsvps.length > 0) {
        const rsvpRows = proj.rsvps.map((r) => ({
          id: r.id || undefined,
          project_id: proj.id,
          guest_name: r.guestName,
          phone_number: r.phoneNumber || null,
          attendance: r.attendance,
          pax_count: r.paxCount || 1,
          selected_event_id: r.selectedEventId || null,
          event_session: r.eventSession || null,
          notes: r.notes || null,
          submitted_at: r.submittedAt || new Date().toISOString(),
        }));
        await sb.from('rsvp_submissions').upsert(rsvpRows);
      }

      // Sync Wishes
      if (proj.wishes && proj.wishes.length > 0) {
        const wishRows = proj.wishes.map((w) => ({
          id: w.id,
          project_id: proj.id,
          name: w.name,
          sender_name: w.senderName || w.name,
          status: w.status,
          message: w.message,
          relation: w.relation || null,
          likes: w.likes || 0,
        }));
        await sb.from('guest_wishes').upsert(wishRows);
      }
    }

    return {
      success: true,
      message: `Berhasil menyinkronkan ${themes.length} Tema, ${layouts.length} Layout, dan ${projects.length} Project ke Supabase!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal sinkronisasi data: ${err.message}`,
    };
  }
}
