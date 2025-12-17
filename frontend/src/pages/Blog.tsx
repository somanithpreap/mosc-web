import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const blogsPerPage = 9;
  const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const skip = (currentPage - 1) * blogsPerPage;

      const response = await axios.get(`${strapiUrl}/api/blogs`, {
        params: {
          pagination: {
            start: skip,
            limit: blogsPerPage,
          },
          populate: '*',
          sort: 'createdAt:desc',
        },
      });

      const data = response.data.data;
      const pagination = response.data.meta.pagination;

      setBlogs(data);
      setTotalPages(Math.ceil(pagination.total / blogsPerPage));
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Unable to connect to the blog server. Make sure Strapi is running at ' + strapiUrl);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getExcerpt = (blog: BlogPost): string => {
    // If excerpt exists, use it
    if (blog.excerpt) {
      return blog.excerpt;
    }

    // If content is a string, substring it
    if (typeof blog.content === 'string') {
      return blog.content.substring(0, 150);
    }

    // If content is rich text (array of blocks)
    if (Array.isArray(blog.content)) {
      let text = '';
      for (const block of blog.content) {
        if (block.children && Array.isArray(block.children)) {
          for (const child of block.children) {
            if (child.text) {
              text += child.text + ' ';
              if (text.length > 150) break;
            }
          }
          if (text.length > 150) break;
        }
      }
      return text.substring(0, 150).trim() || 'Rich content article';
    }

    // If content is rich text object
    if (typeof blog.content === 'object' && blog.content !== null) {
      if (blog.content.children && Array.isArray(blog.content.children)) {
        let text = '';
        for (const block of blog.content.children) {
          if (block.children && Array.isArray(block.children)) {
            for (const child of block.children) {
              if (child.text) {
                text += child.text + ' ';
                if (text.length > 150) break;
              }
            }
          } else if (block.text) {
            text += block.text + ' ';
          }
          if (text.length > 150) break;
        }
        return text.substring(0, 150).trim() || 'Rich content article';
      }
    }

    return 'No description available';
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
      {/* Header Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Our Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and stories from the MOSC community
          </p>
        </div>
      </section>

      {/* Blogs Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading blogs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-lg mb-2">⚠️ {error}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                To view blogs, please set up CMS.
              </p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <p className="text-gray-600 dark:text-gray-400 text-lg">📝 No blogs available yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <div
                    key={blog.documentId}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Blog Image */}
                    <div className="bg-gradient-to-r from-blue-600 to-amber-400 h-48 overflow-hidden flex items-center justify-center">
                      {blog.featured_image?.url ? (
                        <img
                          src={`${strapiUrl}${blog.featured_image.url}`}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">📝</span>
                      )}
                    </div>

                    {/* Blog Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                          {blog.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(blog.date || blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                        {getExcerpt(blog)}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">By {blog.author}</span>
                        <Link
                          to={`/blog/${blog.documentId}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-sm"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-16">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>

              {/* Page Info */}
              <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
