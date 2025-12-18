import React, { useState, useEffect, type JSX } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  excerpt: string;
  content: any;
  category: string;
  author: string;
  date: string;
  featured_image?: {
    url: string;
  };
  createdAt: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${strapiUrl}/api/blogs/${id}`, {
          params: {
            populate: '*',
          },
        });

        setBlog(response.data.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, strapiUrl]);

  const renderRichText = (content: any): React.ReactNode => {
    if (!content) return null;

    // If it's a string, just return it
    if (typeof content === 'string') {
      return <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{content}</p>;
    }

    // If it's an array of blocks (rich text editor format)
    if (Array.isArray(content)) {
      return content.map((block, index) => {
        if (block.type === 'heading') {
          const level = block.level || 2;
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
          return React.createElement(
            HeadingTag,
            {
              key: index,
              className: `font-bold text-gray-900 dark:text-white mb-3 ${
                level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl'
              }`,
            },
            block.children?.map((child: any) => child.text).join('')
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p
              key={index}
              className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
            >
              {block.children?.map((child: any, idx: number) => (
                <span key={idx}>{child.text}</span>
              ))}
            </p>
          );
        }

        if (block.type === 'list') {
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
          return React.createElement(
            ListTag,
            {
              key: index,
              className: `${
                block.format === 'ordered' ? 'list-decimal' : 'list-disc'
              } list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2`,
            },
            block.children?.map((item: any, idx: number) =>
              React.createElement(
                'li',
                { key: idx },
                item.children?.map((child: any) => child.text).join('')
              )
            )
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-blue-600 pl-4 italic text-gray-700 dark:text-gray-300 mb-4"
            >
              {block.children?.map((child: any) => child.text).join('')}
            </blockquote>
          );
        }

        // Default paragraph for unknown types
        return (
          <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {block.children?.map((child: any) => child.text).join('')}
          </p>
        );
      });
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading blog...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error || 'Blog not found'}</p>
          <Link
            to="/blog"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
      {/* Back Button */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      {blog.featured_image?.url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <img
            src={`${strapiUrl}${blog.featured_image.url}`}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
              {blog.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(blog.date || blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>By</span>
            <span className="font-semibold">{blog.author}</span>
          </div>
        </header>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-8 border-l-4 border-blue-600 pl-4">
            {blog.excerpt}
          </p>
        )}

        {/* Main Content */}
        <div className="prose prose-invert max-w-none">
          {renderRichText(blog.content)}
        </div>

        {/* Author Info */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {blog.author}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Author at MOSC
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Blogs Link */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Want to read more?</p>
          <Link
            to="/blog"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;