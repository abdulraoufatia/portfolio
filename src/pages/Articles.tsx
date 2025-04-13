import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articlesApi, Article } from '../lib/api';

function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [retrying, setRetrying] = useState(false);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articlesApi.getAll();
      setArticles(data);
      setFilteredArticles(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map(article => article.category)));
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load articles. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const filterByCategory = (category: string | null) => {
    setActiveCategory(category);
    if (category === null) {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === category));
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    loadArticles();
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

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => filterByCategory(null)}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No articles found.
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No articles found in this category.
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredArticles.map((article, index) => (
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
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold">{article.title}</h2>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </span>
                  </div>
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
                    to={`/articles/${article.slug || article.id}`}
                    className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Articles;