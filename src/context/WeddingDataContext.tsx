import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  WeddingInvitationConfig, 
  WeddingProject, 
  GuestWish, 
  RsvpSubmission, 
  GuestContact, 
  WeddingTheme,
  LayoutArchetype,
  AdminUser
} from '../types';
import { 
  DEFAULT_PROJECTS, 
  DEFAULT_WEDDING_CONFIG, 
  THEMES 
} from '../data/weddingData';
import { isSupabaseConfigured, getSupabase } from '../lib/supabase';
import { 
  fetchProjectsFromSupabase, 
  upsertProjectToSupabase, 
  deleteProjectFromSupabase, 
  upsertGuestToSupabase, 
  deleteGuestFromSupabase, 
  insertRsvpToSupabase, 
  deleteRsvpFromSupabase, 
  insertWishToSupabase, 
  updateWishLikesInSupabase, 
  deleteWishFromSupabase, 
  subscribeToProjectRealtime 
} from '../services/supabaseService';

export type ViewMode = 'invitation' | 'admin';
export type DevicePreview = 'mobile' | 'tablet' | 'desktop';

export const DEFAULT_DEMO_USER: AdminUser = {
  id: 'usr-admin-demo',
  name: 'Arya & Anindya Studio Team',
  email: 'admin@weddingpro.id',
  role: 'admin',
  studioName: 'Royal Bliss Wedding Studio',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  loginAt: new Date().toISOString(),
};

interface WeddingDataContextType {
  // Mode & Navigation
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  previewDevice: DevicePreview;
  setPreviewDevice: (device: DevicePreview) => void;

  // Authentication
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: () => void;
  registerStudio: (name: string, email: string, studioName: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Project List & Management
  projects: WeddingProject[];
  activeProjectId: string;
  activeProject: WeddingProject;
  setActiveProjectId: (id: string) => void;
  createProject: (title: string, clientName: string, templateTheme?: WeddingTheme, templateLayout?: LayoutArchetype) => string;
  duplicateProject: (projectId: string) => string;
  deleteProject: (projectId: string) => void;
  updateProjectMeta: (projectId: string, partial: { title?: string; clientName?: string; slug?: string }) => void;
  
  // Current Invitation Data (Synced with Active Project)
  data: WeddingInvitationConfig;
  updateData: (partial: Partial<WeddingInvitationConfig>) => void;
  guestName: string;
  setGuestName: (name: string) => void;

  // Guest List Management & WhatsApp Blast
  guests: GuestContact[];
  addGuest: (guest: Omit<GuestContact, 'id'>) => void;
  addBatchGuests: (rawNames: string, category: GuestContact['category'], defaultPax?: number) => number;
  updateGuest: (id: string, partial: Partial<GuestContact>) => void;
  deleteGuest: (id: string) => void;
  toggleGuestSent: (id: string) => void;
  clearAllGuests: () => void;

  // RSVP Submissions
  rsvps: RsvpSubmission[];
  submitRsvp: (rsvp: RsvpSubmission) => Promise<{ success: boolean; message?: string }>;
  deleteRsvp: (identifier: number | string) => void;
  clearAllRsvps: () => void;

  // Wishes / Guestbook
  wishes: GuestWish[];
  addWish: (wish: Omit<GuestWish, 'id' | 'createdAt' | 'likes' | 'isLiked'>) => Promise<void>;
  toggleLikeWish: (id: string) => void;
  deleteWish: (id: string) => void;

  // Import / Export
  exportProjectJson: (projectId?: string) => string;
  importProjectJson: (jsonString: string) => { success: boolean; message: string; projectId?: string };
  resetAllToDefault: () => void;

  // Supabase & Cloud State
  isSupabaseConnected: boolean;
  isSyncingWithDb: boolean;
  reloadFromSupabase: () => Promise<void>;

  // Misc
  isLoading: boolean;
  isLivePreview: boolean;
}

const WeddingDataContext = createContext<WeddingDataContextType | undefined>(undefined);

const STORAGE_KEY = 'wedding_projects_v2';
const ACTIVE_PROJECT_KEY = 'wedding_active_project_id_v2';
const AUTH_USER_KEY = 'wedding_studio_user_v2';

function applyThemeVariables(themeId: WeddingTheme = 'classic-midnight') {
  if (typeof document === 'undefined') return;
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const root = document.documentElement;
  
  root.style.setProperty('--theme-bg', theme.bgHex);
  root.style.setProperty('--theme-card-bg', theme.cardBgHex);
  root.style.setProperty('--theme-primary', theme.primaryColor);
  root.style.setProperty('--theme-secondary', theme.secondaryColor);
  root.style.setProperty('--theme-glow', theme.glowHex || 'rgba(223, 180, 97, 0.25)');
  root.style.setProperty('--theme-border', `${theme.primaryColor}40`);
  root.style.setProperty('--theme-border-strong', `${theme.primaryColor}80`);
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-category', theme.category);
  root.setAttribute('data-ornament', theme.ornamentType || 'royal-crown');
}

export const WeddingDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 0. Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(AUTH_USER_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {}
    }
    return null;
  });

  const isAuthenticated = !!currentUser;

  // 1. Projects State (Loaded from localStorage or fallback to DEFAULT_PROJECTS)
  const [projects, setProjects] = useState<WeddingProject[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Failed to load projects from localStorage:', err);
      }
    }
    return DEFAULT_PROJECTS;
  });

  // 2. Active Project ID
  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedId = localStorage.getItem(ACTIVE_PROJECT_KEY);
        if (savedId && projects.some((p) => p.id === savedId)) {
          return savedId;
        }
      } catch {}
    }
    return projects[0]?.id || 'proj-1';
  });

  // 3. View mode & preview device (Default to admin/dashboard mode)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('to') || params.get('tamu') || params.get('guest') || params.get('view') === 'invitation') {
        return 'invitation';
      }
      if (params.get('mode') === 'invitation') {
        return 'invitation';
      }
    }
    return 'admin';
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [previewDevice, setPreviewDevice] = useState<DevicePreview>('desktop');
  const [guestName, setGuestNameState] = useState<string>('Bapak/Ibu/Saudara/i');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLivePreview, setIsLivePreview] = useState<boolean>(false);

  // 4. Supabase integration states
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(() => isSupabaseConfigured());
  const [isSyncingWithDb, setIsSyncingWithDb] = useState<boolean>(false);

  // Authentication Handlers
  const login = useCallback(async (email: string, password?: string, remember: boolean = true) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    setIsLoading(false);

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Silakan masukkan alamat email yang valid.' };
    }

    const userName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

    const user: AdminUser = {
      id: 'usr-' + Date.now(),
      name: email === 'admin@weddingpro.id' ? 'Arya & Anindya Studio Team' : `${formattedName} Studio`,
      email,
      role: 'admin',
      studioName: 'Royal Bliss Wedding Studio',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      loginAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    if (remember && typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } catch {}
    }
    return { success: true };
  }, []);

  const quickDemoLogin = useCallback(() => {
    setCurrentUser(DEFAULT_DEMO_USER);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
      } catch {}
    }
  }, []);

  const registerStudio = useCallback(async (name: string, email: string, studioName: string, password?: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 450));
    setIsLoading(false);

    if (!name.trim()) return { success: false, error: 'Nama penanggung jawab wajib diisi.' };
    if (!email.trim() || !email.includes('@')) return { success: false, error: 'Email tidak valid.' };
    if (!studioName.trim()) return { success: false, error: 'Nama Studio / Organizer wajib diisi.' };

    const newUser: AdminUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      studioName: studioName.trim(),
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      loginAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      } catch {}
    }
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(AUTH_USER_KEY);
      } catch {}
    }
    setViewMode('admin');
  }, []);

  // Reload data from Supabase
  const reloadFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseConnected(false);
      return;
    }
    setIsSyncingWithDb(true);
    try {
      const cloudProjects = await fetchProjectsFromSupabase();
      if (cloudProjects && cloudProjects.length > 0) {
        setProjects(cloudProjects);
        setIsSupabaseConnected(true);
      } else {
        setIsSupabaseConnected(true);
      }
    } catch (err) {
      console.warn('Failed to reload from Supabase:', err);
    } finally {
      setIsSyncingWithDb(false);
    }
  }, []);

  // Fetch Supabase data on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      reloadFromSupabase();
    }
  }, [reloadFromSupabase]);

  // Get active project
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0] || DEFAULT_PROJECTS[0];
  }, [projects, activeProjectId]);

  const activeConfig = activeProject.config;
  const activeGuests = activeProject.guests || [];
  const activeRsvps = activeProject.rsvps || [];
  const activeWishes = activeProject.wishes || [];

  // Persist projects to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      } catch (err) {
        console.error('Failed to save projects to localStorage:', err);
      }
    }
  }, [projects]);

  // Persist active project ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
      } catch {}
    }
  }, [activeProjectId]);

  // Realtime Supabase Subscription for active project
  useEffect(() => {
    if (!isSupabaseConnected || !activeProjectId) return;

    const unsubscribe = subscribeToProjectRealtime(activeProjectId, {
      onWishInsert: (wish) => {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === activeProjectId) {
              if (p.wishes?.some((w) => w.id === wish.id)) return p;
              return { ...p, wishes: [wish, ...(p.wishes || [])] };
            }
            return p;
          })
        );
      },
      onWishUpdate: (wish) => {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === activeProjectId) {
              return {
                ...p,
                wishes: (p.wishes || []).map((w) => (w.id === wish.id ? wish : w)),
              };
            }
            return p;
          })
        );
      },
      onWishDelete: (wishId) => {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === activeProjectId) {
              return {
                ...p,
                wishes: (p.wishes || []).filter((w) => w.id !== wishId),
              };
            }
            return p;
          })
        );
      },
      onRsvpInsert: (rsvp) => {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === activeProjectId) {
              if (p.rsvps?.some((r) => r.id === rsvp.id)) return p;
              return { ...p, rsvps: [rsvp, ...(p.rsvps || [])] };
            }
            return p;
          })
        );
      },
      onRsvpDelete: (rsvpId) => {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === activeProjectId) {
              return {
                ...p,
                rsvps: (p.rsvps || []).filter((r) => r.id !== rsvpId),
              };
            }
            return p;
          })
        );
      },
    });

    return () => {
      unsubscribe();
    };
  }, [activeProjectId, isSupabaseConnected]);

  // Apply Theme CSS variables whenever active theme changes
  useEffect(() => {
    applyThemeVariables(activeConfig.theme || 'classic-midnight');
  }, [activeConfig.theme]);

  // Check URL query parameters on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);

    // 1. Guest Name parameter (?to=Nama+Tamu or ?guest=...)
    const urlGuestName = urlParams.get('to') || urlParams.get('guest') || urlParams.get('tamu') || urlParams.get('n');
    if (urlGuestName) {
      setGuestNameState(urlGuestName.trim());
    }

    // 2. Project Slug or ID parameter (?job=slug or ?project=id)
    const jobParam = urlParams.get('job') || urlParams.get('project') || urlParams.get('slug');
    if (jobParam) {
      const match = projects.find((p) => p.slug === jobParam || p.id === jobParam);
      if (match) {
        setActiveProjectIdState(match.id);
      }
    }

    // 3. PostMessage handler for iframe integration
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'UPDATE_WEDDING_DATA' || event.data.type === 'SYNC_INVITATION_CONFIG') {
        setIsLivePreview(true);
        if (event.data.payload) {
          updateData(event.data.payload);
        }
      }

      if (event.data.type === 'SET_GUEST_NAME' && typeof event.data.payload === 'string') {
        setGuestNameState(event.data.payload);
      }

      if (event.data.type === 'SET_VIEW_MODE' && (event.data.payload === 'admin' || event.data.payload === 'invitation')) {
        setViewMode(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [projects]);

  // Update active project helper
  const updateActiveProject = useCallback((updater: (prev: WeddingProject) => WeddingProject) => {
    setProjects((prevProjects) => {
      return prevProjects.map((p) => {
        if (p.id === activeProjectId) {
          const updated = updater(p);
          const projectWithTimestamp = {
            ...updated,
            updatedAt: new Date().toISOString().split('T')[0],
          };
          // Asynchronously sync project config to Supabase
          if (isSupabaseConfigured()) {
            upsertProjectToSupabase(projectWithTimestamp);
          }
          return projectWithTimestamp;
        }
        return p;
      });
    });
  }, [activeProjectId]);

  // Update Config of Active Project
  const updateData = useCallback((partial: Partial<WeddingInvitationConfig>) => {
    updateActiveProject((project) => ({
      ...project,
      config: {
        ...project.config,
        ...partial,
      },
    }));
  }, [updateActiveProject]);

  // Switch Active Project
  const setActiveProjectId = useCallback((id: string) => {
    if (projects.some((p) => p.id === id)) {
      setActiveProjectIdState(id);
    }
  }, [projects]);

  // Create New Project
  const createProject = useCallback((
    title: string, 
    clientName: string, 
    templateTheme: WeddingTheme = 'classic-midnight',
    templateLayout?: LayoutArchetype
  ) => {
    const newId = 'proj-' + Date.now();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'undangan-baru';

    const selectedThemeObj = THEMES.find((t) => t.id === templateTheme) || THEMES[0];
    const initialLayout = templateLayout || selectedThemeObj.defaultLayout || 'royal-symmetrical';

    const baseConfig: WeddingInvitationConfig = {
      ...DEFAULT_WEDDING_CONFIG,
      slug,
      invitationTitle: title,
      theme: templateTheme,
      layoutStyle: initialLayout,
      groom: {
        ...DEFAULT_WEDDING_CONFIG.groom,
        name: 'Mempelai Pria',
        fullName: 'Nama Lengkap Pria, S.T.',
        parentInfo: 'Putra dari Bpk. ... & Ibu ...',
      },
      bride: {
        ...DEFAULT_WEDDING_CONFIG.bride,
        name: 'Mempelai Wanita',
        fullName: 'Nama Lengkap Wanita, S.Pd.',
        parentInfo: 'Putri dari Bpk. ... & Ibu ...',
      },
    };

    const newProject: WeddingProject = {
      id: newId,
      title: title || 'Undangan Pernikahan Baru',
      clientName: clientName || 'Klien Baru',
      slug,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      config: baseConfig,
      guests: [],
      rsvps: [],
      wishes: [],
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectIdState(newId);

    if (isSupabaseConfigured()) {
      upsertProjectToSupabase(newProject);
    }

    return newId;
  }, []);

  // Duplicate Project
  const duplicateProject = useCallback((projectId: string) => {
    const source = projects.find((p) => p.id === projectId);
    if (!source) return '';

    const newId = 'proj-' + Date.now();
    const duplicated: WeddingProject = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      title: `${source.title} (Salinan)`,
      clientName: `${source.clientName} (Copy)`,
      slug: `${source.slug}-copy`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setProjects((prev) => [duplicated, ...prev]);
    setActiveProjectIdState(newId);

    if (isSupabaseConfigured()) {
      upsertProjectToSupabase(duplicated);
    }

    return newId;
  }, [projects]);

  // Delete Project
  const deleteProject = useCallback((projectId: string) => {
    if (projects.length <= 1) {
      alert('Minimal harus ada satu proyek undangan!');
      return;
    }

    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== projectId);
      if (activeProjectId === projectId) {
        setActiveProjectIdState(filtered[0]?.id || 'proj-1');
      }
      return filtered;
    });

    if (isSupabaseConfigured()) {
      deleteProjectFromSupabase(projectId);
    }
  }, [projects, activeProjectId]);

  // Update Project Meta (Title, Client, Slug)
  const updateProjectMeta = useCallback((projectId: string, partial: { title?: string; clientName?: string; slug?: string }) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updated = {
            ...p,
            ...partial,
            config: {
              ...p.config,
              ...(partial.slug ? { slug: partial.slug } : {}),
              ...(partial.title ? { invitationTitle: partial.title } : {}),
            },
            updatedAt: new Date().toISOString().split('T')[0],
          };
          if (isSupabaseConfigured()) {
            upsertProjectToSupabase(updated);
          }
          return updated;
        }
        return p;
      })
    );
  }, []);

  // Set Guest Name
  const setGuestName = useCallback((name: string) => {
    setGuestNameState(name);
    if (typeof window !== 'undefined' && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('to', name);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Guests Operations
  const addGuest = useCallback((guest: Omit<GuestContact, 'id'>) => {
    const newGuest: GuestContact = {
      id: 'guest-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      ...guest,
    };
    updateActiveProject((project) => ({
      ...project,
      guests: [newGuest, ...(project.guests || [])],
    }));

    if (isSupabaseConfigured()) {
      upsertGuestToSupabase(activeProjectId, newGuest);
    }
  }, [updateActiveProject, activeProjectId]);

  const addBatchGuests = useCallback((rawNames: string, category: GuestContact['category'], defaultPax: number = 2) => {
    const lines = rawNames
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return 0;

    const newGuests: GuestContact[] = lines.map((name, idx) => ({
      id: 'guest-' + Date.now() + '-' + idx,
      name,
      category,
      paxLimit: defaultPax,
      isSent: false,
    }));

    updateActiveProject((project) => ({
      ...project,
      guests: [...newGuests, ...(project.guests || [])],
    }));

    if (isSupabaseConfigured()) {
      newGuests.forEach((g) => upsertGuestToSupabase(activeProjectId, g));
    }

    return newGuests.length;
  }, [updateActiveProject, activeProjectId]);

  const updateGuest = useCallback((id: string, partial: Partial<GuestContact>) => {
    let updatedTarget: GuestContact | null = null;
    updateActiveProject((project) => {
      const updatedList = (project.guests || []).map((g) => {
        if (g.id === id) {
          updatedTarget = { ...g, ...partial };
          return updatedTarget;
        }
        return g;
      });
      return { ...project, guests: updatedList };
    });

    if (isSupabaseConfigured() && updatedTarget) {
      upsertGuestToSupabase(activeProjectId, updatedTarget);
    }
  }, [updateActiveProject, activeProjectId]);

  const deleteGuest = useCallback((id: string) => {
    updateActiveProject((project) => ({
      ...project,
      guests: (project.guests || []).filter((g) => g.id !== id),
    }));

    if (isSupabaseConfigured()) {
      deleteGuestFromSupabase(id);
    }
  }, [updateActiveProject]);

  const toggleGuestSent = useCallback((id: string) => {
    let updatedTarget: GuestContact | null = null;
    updateActiveProject((project) => {
      const updatedList = (project.guests || []).map((g) => {
        if (g.id === id) {
          const isSent = !g.isSent;
          updatedTarget = {
            ...g,
            isSent,
            sentAt: isSent ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
          return updatedTarget;
        }
        return g;
      });
      return { ...project, guests: updatedList };
    });

    if (isSupabaseConfigured() && updatedTarget) {
      upsertGuestToSupabase(activeProjectId, updatedTarget);
    }
  }, [updateActiveProject, activeProjectId]);

  const clearAllGuests = useCallback(() => {
    updateActiveProject((project) => ({
      ...project,
      guests: [],
    }));
  }, [updateActiveProject]);

  // RSVP Operations
  const submitRsvp = useCallback(async (rsvp: RsvpSubmission): Promise<{ success: boolean; message?: string }> => {
    const rsvpWithId: RsvpSubmission = {
      ...rsvp,
      id: rsvp.id || 'rsvp-' + Date.now(),
      submittedAt: rsvp.submittedAt || new Date().toISOString(),
    };

    updateActiveProject((project) => ({
      ...project,
      rsvps: [rsvpWithId, ...(project.rsvps || [])],
    }));

    // Async sync with Supabase
    if (isSupabaseConfigured()) {
      insertRsvpToSupabase(activeProjectId, rsvpWithId);
    }

    // Webhook call if configured
    if (activeConfig.rsvpWebhookUrl) {
      try {
        await fetch(activeConfig.rsvpWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: activeConfig.slug,
            ...rsvpWithId,
          }),
        });
      } catch (err) {
        console.warn('RSVP webhook failed, saved locally:', err);
      }
    }

    return { success: true, message: 'Konfirmasi kehadiran Anda telah tercatat!' };
  }, [updateActiveProject, activeProjectId, activeConfig.rsvpWebhookUrl, activeConfig.slug]);

  const deleteRsvp = useCallback((identifier: number | string) => {
    let rsvpIdToDelete: string | null = null;
    updateActiveProject((project) => {
      const remaining = (project.rsvps || []).filter((r, idx) => {
        const match = typeof identifier === 'number' ? idx === identifier : r.id === identifier || String(idx) === identifier;
        if (match && r.id) {
          rsvpIdToDelete = r.id;
        }
        return !match;
      });
      return { ...project, rsvps: remaining };
    });

    if (isSupabaseConfigured() && rsvpIdToDelete) {
      deleteRsvpFromSupabase(rsvpIdToDelete);
    }
  }, [updateActiveProject]);

  const clearAllRsvps = useCallback(() => {
    updateActiveProject((project) => ({
      ...project,
      rsvps: [],
    }));
  }, [updateActiveProject]);

  // Wishes Operations
  const addWish = useCallback(async (newWishData: Omit<GuestWish, 'id' | 'createdAt' | 'likes' | 'isLiked'>) => {
    const newWish: GuestWish = {
      id: 'wish-' + Date.now(),
      ...newWishData,
      createdAt: 'Baru saja',
      likes: 0,
      isLiked: false,
    };

    updateActiveProject((project) => ({
      ...project,
      wishes: [newWish, ...(project.wishes || [])],
    }));

    if (isSupabaseConfigured()) {
      insertWishToSupabase(activeProjectId, newWishData);
    }

    if (activeConfig.wishesApiUrl) {
      try {
        await fetch(activeConfig.wishesApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: activeConfig.slug,
            ...newWish,
          }),
        });
      } catch (err) {
        console.warn('Wish webhook failed:', err);
      }
    }
  }, [updateActiveProject, activeProjectId, activeConfig.wishesApiUrl, activeConfig.slug]);

  const toggleLikeWish = useCallback((id: string) => {
    let targetLikes = 0;
    updateActiveProject((project) => ({
      ...project,
      wishes: (project.wishes || []).map((item) => {
        if (item.id === id) {
          const isLiked = !item.isLiked;
          targetLikes = isLiked ? item.likes + 1 : Math.max(0, item.likes - 1);
          return {
            ...item,
            isLiked,
            likes: targetLikes,
          };
        }
        return item;
      }),
    }));

    if (isSupabaseConfigured()) {
      updateWishLikesInSupabase(id, targetLikes);
    }
  }, [updateActiveProject]);

  const deleteWish = useCallback((id: string) => {
    updateActiveProject((project) => ({
      ...project,
      wishes: (project.wishes || []).filter((w) => w.id !== id),
    }));

    if (isSupabaseConfigured()) {
      deleteWishFromSupabase(id);
    }
  }, [updateActiveProject]);

  // Export / Import JSON
  const exportProjectJson = useCallback((projectId?: string) => {
    const target = projectId ? projects.find((p) => p.id === projectId) : activeProject;
    return JSON.stringify(target || activeProject, null, 2);
  }, [projects, activeProject]);

  const importProjectJson = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Format JSON tidak valid!' };
      }

      let newProject: WeddingProject;
      if (parsed.config && parsed.id) {
        newProject = {
          ...parsed,
          id: 'proj-' + Date.now(),
          title: `${parsed.title} (Imported)`,
        };
      } else if (parsed.groom && parsed.bride) {
        const newId = 'proj-' + Date.now();
        newProject = {
          id: newId,
          title: parsed.invitationTitle || `Undangan ${parsed.groom?.name} & ${parsed.bride?.name}`,
          clientName: `${parsed.groom?.name} & ${parsed.bride?.name}`,
          slug: parsed.slug || 'undangan-import',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          config: { ...DEFAULT_WEDDING_CONFIG, ...parsed },
          guests: [],
          rsvps: [],
          wishes: [],
        };
      } else {
        return { success: false, message: 'Struktur data undangan tidak dikenali!' };
      }

      setProjects((prev) => [newProject, ...prev]);
      setActiveProjectIdState(newProject.id);

      if (isSupabaseConfigured()) {
        upsertProjectToSupabase(newProject);
      }

      return { success: true, message: `Proyek "${newProject.title}" berhasil diimpor!`, projectId: newProject.id };
    } catch (err: any) {
      return { success: false, message: `Gagal membaca file JSON: ${err.message}` };
    }
  }, []);

  const resetAllToDefault = useCallback(() => {
    if (confirm('Yakin ingin mereset seluruh data kembali ke setelan bawaan pabrik?')) {
      setProjects(DEFAULT_PROJECTS);
      setActiveProjectIdState(DEFAULT_PROJECTS[0].id);
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
      } catch {}
    }
  }, []);

  return (
    <WeddingDataContext.Provider
      value={{
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        previewDevice,
        setPreviewDevice,
        currentUser,
        isAuthenticated,
        login,
        quickDemoLogin,
        registerStudio,
        logout,
        projects,
        activeProjectId,
        activeProject,
        setActiveProjectId,
        createProject,
        duplicateProject,
        deleteProject,
        updateProjectMeta,
        data: activeConfig,
        updateData,
        guestName,
        setGuestName,
        guests: activeGuests,
        addGuest,
        addBatchGuests,
        updateGuest,
        deleteGuest,
        toggleGuestSent,
        clearAllGuests,
        rsvps: activeRsvps,
        submitRsvp,
        deleteRsvp,
        clearAllRsvps,
        wishes: activeWishes,
        addWish,
        toggleLikeWish,
        deleteWish,
        exportProjectJson,
        importProjectJson,
        resetAllToDefault,
        isSupabaseConnected,
        isSyncingWithDb,
        reloadFromSupabase,
        isLoading,
        isLivePreview,
      }}
    >
      {children}
    </WeddingDataContext.Provider>
  );
};

export function useWeddingData(): WeddingDataContextType {
  const context = useContext(WeddingDataContext);
  if (!context) {
    throw new Error('useWeddingData must be used within a WeddingDataProvider');
  }
  return context;
}
