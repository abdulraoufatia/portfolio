import { supabase } from './supabase';

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  read_time: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  technologies: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Projects CRUD
export const projectsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, project: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Articles CRUD
export const articlesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, article: Partial<Article>) {
    const { data, error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Experiences CRUD
export const experiencesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('experiences')
      .insert([experience])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, experience: Partial<Experience>) {
    const { data, error } = await supabase
      .from('experiences')
      .update(experience)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};