import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  link: string;
  created_at: string;
};

export type Experience = {
  id: string;
  position: string;
  organization: string;
  start_date: string;
  end_date: string | null;
  description: string;
  type: 'work' | 'education' | 'volunteer';
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  image_url: string;
  created_at: string;
};

interface SupabaseContextType {
  supabase: SupabaseClient;
  isAdmin: boolean;
  getProjects: () => Promise<Project[]>;
  getExperience: () => Promise<Experience[]>;
  getSkills: () => Promise<Skill[]>;
  getCertificates: () => Promise<Certificate[]>;
  submitContactForm: (name: string, email: string, message: string) => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('is_approved')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setIsAdmin(!!userData?.is_approved);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const getProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  };

  const getExperience = async (): Promise<Experience[]> => {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching experience:', error);
      return [];
    }

    return data || [];
  };

  const getSkills = async (): Promise<Skill[]> => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching skills:', error);
      return [];
    }

    return data || [];
  };

  const getCertificates = async (): Promise<Certificate[]> => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching certificates:', error);
      return [];
    }

    return data || [];
  };

  const submitContactForm = async (name: string, email: string, message: string): Promise<void> => {
    const { error } = await supabase.from('contact_messages').insert([
      { name, email, message }
    ]);

    if (error) {
      console.error('Error submitting contact form:', error);
      throw new Error('Failed to submit contact form');
    }
  };

  return (
    <SupabaseContext.Provider value={{ 
      supabase,
      isAdmin,
      getProjects,
      getExperience,
      getSkills,
      getCertificates,
      submitContactForm
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};