import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { articlesApi, Article } from '../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      try {
        const data = await articlesApi.getOne(id);
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 py-8">
          {error || 'Article not found'}
        </div>
        <Link
          to="/articles"
          className="inline-flex items-center text-blue-400 hover:text-blue-500 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Link
        to="/articles"
        className="inline-flex items-center text-blue-400 hover:text-blue-500 transition-colors mb-8"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Articles
      </Link>

      <article className="max-w-4xl mx-auto">
        <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center text-gray-300 space-x-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{article.read_time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-gray-300 mb-8 font-medium">
            {article.excerpt}
          </p>
          
          <div className="flex items-center my-12">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <div className="mx-4">
              <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
            </div>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          </div>

          <div className="markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              className="text-gray-200 leading-relaxed"
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export default ArticleDetail;