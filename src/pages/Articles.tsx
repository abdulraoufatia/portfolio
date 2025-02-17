import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articlesApi, Article } from '../lib/api';

function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await articlesApi.getAll();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading articles...</div>;
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
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <div className="w-24 h-1 bg-blue-500/50 mx-auto rounded-full"></div>
      </div>
      <div className="grid gap-8">
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img src={article.image_url} alt={article.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
                <p className="text-gray-300 mb-4">{article.excerpt}</p>
                <div className="flex items-center text-gray-400 space-x-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    <span>{article.read_time}</span>
                  </div>
                </div>
                <Link 
                  to={`/articles/${article.id}`}
                  className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

export default Articles;