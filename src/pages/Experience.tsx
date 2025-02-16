import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar } from 'lucide-react';
import { experiencesApi, Experience } from '../lib/api';

function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await experiencesApi.getAll();
        setExperiences(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading experiences...</div>;
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
        <h1 className="text-4xl font-bold mb-4">Professional Experience</h1>
        <div className="w-24 h-1 bg-blue-500/50 mx-auto rounded-full"></div>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-blue-500/50 transform -translate-x-1/2"></div>
        
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative mb-8 md:w-1/2 ${
              index % 2 === 0 ? 'md:pr-8 md:ml-auto' : 'md:pl-8'
            }`}
          >
            {/* Timeline dot */}
            <div className="absolute left-0 md:left-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 mt-6"></div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Building2 className="mr-2 text-blue-400" />
                <h3 className="text-xl font-bold">{exp.company}</h3>
              </div>
              <h4 className="text-lg text-blue-400 mb-2">{exp.position}</h4>
              <div className="flex items-center text-gray-400 mb-4">
                <Calendar className="mr-2" size={16} />
                <span>{exp.period}</span>
              </div>
              <p className="text-gray-300 mb-4">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ExperiencePage;