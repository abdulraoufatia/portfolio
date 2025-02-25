import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, X } from 'lucide-react';
import { projectsApi, articlesApi, experiencesApi, Project, Article, Experience } from '../lib/api';
import MDEditor from '@uiw/react-md-editor';

interface ProjectFormData {
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  tags: string;
}

interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  read_time: string;
}

interface ExperienceFormData {
  company: string;
  position: string;
  period: string;
  description: string;
  technologies: string;
}

function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'articles' | 'experiences'>('projects');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    title: '',
    description: '',
    image_url: '',
    github_url: '',
    tags: '',
  });

  const [articleForm, setArticleForm] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    read_time: '',
  });

  const [experienceForm, setExperienceForm] = useState<ExperienceFormData>({
    company: '',
    position: '',
    period: '',
    description: '',
    technologies: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadData();
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out failed:', error);
      alert('Failed to sign out');
    }
  };

  const loadData = async () => {
    const [projectsData, articlesData, experiencesData] = await Promise.all([
      projectsApi.getAll(),
      articlesApi.getAll(),
      experiencesApi.getAll()
    ]);
    setProjects(projectsData);
    setArticles(articlesData);
    setExperiences(experiencesData);
  };

  const resetForms = () => {
    setProjectForm({
      title: '',
      description: '',
      image_url: '',
      github_url: '',
      tags: '',
    });
    setArticleForm({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      read_time: '',
    });
    setExperienceForm({
      company: '',
      position: '',
      period: '',
      description: '',
      technologies: '',
    });
    setEditingId(null);
  };

  const handleEdit = (item: Project | Article | Experience) => {
    setEditingId(item.id);
    if ('github_url' in item) {
      setProjectForm({
        ...item,
        tags: item.tags.join(', '),
      });
    } else if ('read_time' in item) {
      setArticleForm(item);
    } else {
      setExperienceForm({
        ...item,
        technologies: item.technologies.join(', '),
      });
    }
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      if (activeTab === 'projects') {
        await projectsApi.delete(id);
      } else if (activeTab === 'articles') {
        await articlesApi.delete(id);
      } else {
        await experiencesApi.delete(id);
      }
      await loadData();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'projects') {
        const projectData = {
          ...projectForm,
          tags: projectForm.tags.split(',').map(tag => tag.trim()),
          user_id: user!.id,
        };

        if (editingId) {
          await projectsApi.update(editingId, projectData);
        } else {
          await projectsApi.create(projectData);
        }
      } else if (activeTab === 'articles') {
        const articleData = {
          ...articleForm,
          user_id: user!.id,
        };

        if (editingId) {
          await articlesApi.update(editingId, articleData);
        } else {
          await articlesApi.create(articleData);
        }
      } else {
        const experienceData = {
          ...experienceForm,
          technologies: experienceForm.technologies.split(',').map(tech => tech.trim()),
          user_id: user!.id,
        };

        if (editingId) {
          await experiencesApi.update(editingId, experienceData);
        } else {
          await experiencesApi.create(experienceData);
        }
      }

      await loadData();
      setShowForm(false);
      resetForms();
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <LogOut size={20} className="mr-2" />
          Sign Out
        </button>
      </div>

      <div className="glass rounded-lg p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('projects');
              setShowForm(false);
              resetForms();
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'projects'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => {
              setActiveTab('articles');
              setShowForm(false);
              resetForms();
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'articles'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => {
              setActiveTab('experiences');
              setShowForm(false);
              resetForms();
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'experiences'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Experiences
          </button>
        </div>

        {!showForm ? (
          <>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mb-6"
            >
              <Plus size={20} className="mr-2" />
              Add {activeTab === 'projects' ? 'Project' : activeTab === 'articles' ? 'Article' : 'Experience'}
            </button>

            <div className="space-y-4">
              {activeTab === 'projects' && projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-gray-400">{project.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit size={20} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {activeTab === 'articles' && articles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-gray-400">{article.excerpt}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit size={20} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {activeTab === 'experiences' && experiences.map((experience) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{experience.company}</h3>
                    <p className="text-sm text-blue-400">{experience.position}</p>
                    <p className="text-sm text-gray-400">{experience.period}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(experience)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit size={20} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(experience.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit' : 'Add'} {activeTab === 'projects' ? 'Project' : activeTab === 'articles' ? 'Article' : 'Experience'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForms();
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {activeTab === 'projects' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={projectForm.github_url}
                    onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="React, TypeScript, Tailwind"
                    required
                  />
                </div>
              </>
            )}

            {activeTab === 'articles' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt</label>
                  <textarea
                    value={articleForm.excerpt}
                    onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
                  <div data-color-mode="dark">
                    <MDEditor
                      value={articleForm.content}
                      onChange={(value) => setArticleForm({ ...articleForm, content: value || '' })}
                      preview="edit"
                      height={400}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={articleForm.image_url}
                    onChange={(e) => setArticleForm({ ...articleForm, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Read Time</label>
                  <input
                    type="text"
                    value={articleForm.read_time}
                    onChange={(e) => setArticleForm({ ...articleForm, read_time: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5 min read"
                    required
                  />
                </div>
              </>
            )}

            {activeTab === 'experiences' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <input
                    type="text"
                    value={experienceForm.position}
                    onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Period</label>
                  <input
                    type="text"
                    value={experienceForm.period}
                    onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2022 - Present"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={experienceForm.technologies}
                    onChange={(e) => setExperienceForm({ ...experienceForm, technologies: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="React, Node.js, AWS"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForms();
                }}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
}

export default Admin;