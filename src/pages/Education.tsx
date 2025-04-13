import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, RefreshCw } from 'lucide-react';
import { educationApi, Education } from '../lib/api';

function EducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const loadEducation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await educationApi.getAll();
      setEducationList(data);
    } catch (err) {
      console.error('Failed to load education:', err);
      setError(err instanceof Error ? err.message : 'Failed to load education');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleRetry = () => {
    setRetrying(true);
    loadEducation();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={handleRetry}
          disabled={retrying}
          className="flex items-center mx-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
        >
          {retrying ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-2" />
              Retry
            </>
          )}
        </button>
      </div>
    );
  }

  if (educationList.length === 0) {
    return (
      <div className="container mx-auto text-center py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Education</h1>
          <div className="w-24 h-1 bg-blue-500/50 mx-auto rounded-full"></div>
        </div>
        <p className="text-gray-400">No education entries found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Education</h1>
        <div className="w-24 h-1 bg-blue-500/50 mx-auto rounded-full"></div>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-blue-500/50 transform -translate-x-1/2"></div>
        
        {educationList.map((edu, index) => (
          <motion.div
            key={edu.id}
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
                <GraduationCap className="mr-2 text-blue-400" />
                <h3 className="text-xl font-bold">{edu.institution}</h3>
              </div>
              <h4 className="text-lg text-blue-400 mb-2">{edu.degree} in {edu.field}</h4>
              <div className="flex items-center text-gray-400 mb-4">
                <Calendar className="mr-2" size={16} />
                <span>{edu.start_date} - {edu.end_date}</span>
              </div>
              <p className="text-gray-300">{edu.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default EducationPage;