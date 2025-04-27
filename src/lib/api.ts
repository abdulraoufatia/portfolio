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
  category: string;
  slug?: string;
  visible: boolean;
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

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Generate a slug from a title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .trim();
};

// Error handling wrapper for API calls
const handleApiError = async <T>(apiCall: Promise<T>): Promise<T> => {
  try {
    return await apiCall;
  } catch (error) {
    console.error('API Error:', error);
    // Retry once in case of temporary connection issues
    try {
      return await apiCall;
    } catch (retryError) {
      console.error('API Retry Error:', retryError);
      throw retryError;
    }
  }
};

// Projects CRUD
export const projectsApi = {
  async getAll() {
    return handleApiError(
      supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error;
          return data || [];
        })
    );
  },

  async getOne(id: string) {
    return handleApiError(
      supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    return handleApiError(
      supabase
        .from('projects')
        .insert([project])
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  },

  async update(id: string, project: Partial<Project>) {
    return handleApiError(
      supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  },

  async delete(id: string) {
    return handleApiError(
      supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }
};

// Articles CRUD
export const articlesApi = {
  async getAll(category?: string) {
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Supabase articles query error:', error);
        throw error;
      }
      
      // Generate slugs for all articles if they don't have one
      return (data || []).map(article => ({
        ...article,
        slug: article.slug || generateSlug(article.title)
      }));
    } catch (error) {
      console.error('Failed to load articles:', error);
      throw error;
    }
  },

  async getOne(idOrSlug: string) {
    try {
      // Try to find by UUID first (for backward compatibility)
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUuid = uuidPattern.test(idOrSlug);
      
      let data;
      
      if (isUuid) {
        // Try to find by ID
        const { data: idData, error: idError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', idOrSlug)
          .single();
        
        if (!idError) {
          data = idData;
        }
      }
      
      // If not found by ID or not a UUID, try to find by slug
      if (!data) {
        const { data: slugData, error: slugError } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', idOrSlug)
          .single();
        
        if (slugError) {
          // If still not found, try a case-insensitive search
          const { data: likeData, error: likeError } = await supabase
            .from('articles')
            .select('*')
            .ilike('slug', idOrSlug)
            .single();
          
          if (likeError) {
            console.error('Article not found error:', likeError);
            throw new Error('Article not found');
          }
          data = likeData;
        } else {
          data = slugData;
        }
      }

      if (!data) {
        throw new Error('Article not found');
      }
      
      // Generate slug if it doesn't exist
      if (!data.slug) {
        const slug = generateSlug(data.title);
        
        // Update the article with the slug
        await supabase
          .from('articles')
          .update({ slug })
          .eq('id', data.id);
        
        data.slug = slug;
      }

      return data;
    } catch (error) {
      console.error('Failed to load article:', error);
      throw error;
    }
  },

  async create(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Generate slug from title if not provided
      if (!article.slug) {
        article.slug = generateSlug(article.title);
      }

      const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select()
        .single();

      if (error) {
        console.error('Create article error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to create article:', error);
      throw error;
    }
  },

  async update(id: string, article: Partial<Article>) {
    try {
      // Generate slug from title if title is being updated
      if (article.title && !article.slug) {
        article.slug = generateSlug(article.title);
      }

      const { data, error } = await supabase
        .from('articles')
        .update(article)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update article error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to update article:', error);
      throw error;
    }
  },

  async toggleVisibility(id: string, visible: boolean) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({ visible })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Toggle visibility error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete article error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
      throw error;
    }
  }
};

// Experiences CRUD
export const experiencesApi = {
  async getAll() {
    return handleApiError(
      supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error;
          return data || [];
        })
    );
  },

  async getOne(id: string) {
    return handleApiError(
      supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  },

  async create(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) {
    return handleApiError(
      supabase
        .from('experiences')
        .insert([experience])
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  },

  async update(id: string, experience: Partial<Experience>) {
    return handleApiError(
      supabase
        .from('experiences')
        .update(experience)
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  },

  async delete(id: string) {
    return handleApiError(
      supabase
        .from('experiences')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }
};

// Education CRUD
export const educationApi = {
  async getAll() {
    return handleApiError(
      supabase
        .from('education')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error;
          return data || [];
        })
    );
  },

  async getOne(id: string) {
    return handleApiError(
      supabase
        .from('education')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  },

  async create(education: Omit<Education, 'id' | 'created_at' | 'updated_at'>) {
    return handleApiError(
      supabase
        .from('education')
        .insert([education])
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  },

  async update(id: string, education: Partial<Education>) {
    return handleApiError(
      supabase
        .from('education')
        .update(education)
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  },

  async delete(id: string) {
    return handleApiError(
      supabase
        .from('education')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }
};