import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, X, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { projectsApi, articlesApi, experiencesApi, educationApi, Project, Article, Experience, Education } from '../lib/api';
import MDEditor from '@uiw/react-md-editor';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'articles' | 'experiences' | 'education'>('projects');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [showProjects, setShowProjects] = useState(true);
  const [showArticles, setShowArticles] = useState(true);
  const [showExperiences, setShowExperiences] = useState(true);
  const [showEducation, setShowEducation] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    const [projectsData, articlesData, experiencesData, educationData] = await Promise.all([
      projectsApi.getAll(),
      articlesApi.getAll(),
      experiencesApi.getAll(),
      educationApi.getAll()
    ]);
    setProjects(projectsData);
    setArticles(articlesData);
    setExperiences(experiencesData);
    setEducationList(educationData);
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      await articlesApi.toggleVisibility(id, !currentVisibility);
      await loadData();
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      alert('Failed to update article visibility');
    }
  };

  const handleEdit = (item: Project | Article | Experience | Education) => {
    setEditingId(item.id);
    setShowForm(true);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);
      switch (activeTab) {
        case 'projects':
          await projectsApi.delete(itemToDelete);
          break;
        case 'articles':
          await articlesApi.delete(itemToDelete);
          break;
        case 'experiences':
          await experiencesApi.delete(itemToDelete);
          break;
        case 'education':
          await educationApi.delete(itemToDelete);
          break;
      }
      await loadData();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const renderToggleButton = (
    show: boolean,
    setShow: (show: boolean) => void,
    count: number,
    label: string
  ) => (
    <button
      onClick={() => setShow(!show)}
      className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg mb-4"
    >
      <span className="font-semibold">{label} ({count})</span>
      {show ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
    </button>
  );

  const getItemTypeName = () => {
    switch (activeTab) {
      case 'projects':
        return 'project';
      case 'articles':
        return 'article';
      case 'experiences':
        return 'experience';
      case 'education':
        return 'education';
      default:
        return 'item';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8">
        {['projects', 'articles', 'experiences', 'education'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="glass rounded-lg p-6">
        {!showForm ? (
          <>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mb-6"
            >
              <Plus size={20} className="mr-2" />
              Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>

            <div className="space-y-4">
              {activeTab === 'articles' && articles.length > 0 && (
                <>
                  {renderToggleButton(showArticles, setShowArticles, articles.length, 'Articles')}
                  {showArticles && articles.map((article) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{article.title}</h3>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                            {article.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{article.excerpt}</p>
                        {article.slug && (
                          <p className="text-xs text-gray-500 mt-1">
                            Slug: {article.slug}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleVisibility(article.id, article.visible)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title={article.visible ? "Hide article" : "Show article"}
                        >
                          {article.visible ? (
                            <Eye size={20} className="text-green-400" />
                          ) : (
                            <EyeOff size={20} className="text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit size={20} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => confirmDelete(article.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} className="text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}

              {activeTab === 'experiences' && experiences.length > 0 && (
                <>
                  {renderToggleButton(showExperiences, setShowExperiences, experiences.length, 'Experiences')}
                  {showExperiences && experiences.map((experience) => (
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
                          onClick={() => confirmDelete(experience.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} className="text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}

              {activeTab === 'projects' && projects.length > 0 && (
                <>
                  {renderToggleButton(showProjects, setShowProjects, projects.length, 'Projects')}
                  {showProjects && projects.map((project) => (
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
                          onClick={() => confirmDelete(project.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} className="text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}

              {activeTab === 'education' && educationList.length > 0 && (
                <>
                  {renderToggleButton(showEducation, setShowEducation, educationList.length, 'Education')}
                  {showEducation && educationList.map((education) => (
                    <motion.div
                      key={education.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{education.institution}</h3>
                        <p className="text-sm text-blue-400">{education.degree} in {education.field}</p>
                        <p className="text-sm text-gray-400">{education.start_date} - {education.end_date}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(education)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit size={20} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => confirmDelete(education.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} className="text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </>
        ) : null}
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        itemType={getItemTypeName()}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}

export default Admin;