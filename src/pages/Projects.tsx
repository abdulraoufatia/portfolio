import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { projectsApi, Project } from '../lib/api';

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4 gradient-text"
        >
          My Projects
        </motion.h1>
        <div className="w-24 h-1 bg-blue-500/50 mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass rounded-lg overflow-hidden glow-hover flex flex-col"
          >
            <div className="relative overflow-hidden group">
              <img 
                src={project.image_url} 
                alt={project.title} 
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2 gradient-text">{project.title}</h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="mt-auto border-t border-white/10 pt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 glass rounded-lg text-sm text-blue-300 hover:text-blue-400 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div>
                  <motion.a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 glass rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    <Github size={20} className="mr-2" />
                    View Code
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Projects;