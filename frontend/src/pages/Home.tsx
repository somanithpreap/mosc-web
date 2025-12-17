import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';
import axios from 'axios';

import mosc_logo from '../../public/mosc-logo.svg';

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

const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      setBlogsLoading(true);
      const response = await axios.get(`${strapiUrl}/api/blogs`, {
        params: {
          pagination: {
            limit: 3,
          },
          populate: '*',
          sort: 'createdAt:desc',
        },
      });

      const data = response.data.data;
      setBlogs(data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      // Set empty array on error, let the UI show placeholder
      setBlogs([]);
    } finally {
      setBlogsLoading(false);
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
      return text.substring(0, 150).trim() || 'Read the full blog for more details';
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
        return text.substring(0, 150).trim() || 'Read the full blog for more details';
      }
    }

    return 'Read the full blog for more details';
  };
  
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-amber-600 dark:text-amber-400">MOSC</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            <span className="font-bold">Mathematics Outstanding Students Cambodia</span> <br/>
            Empowering Cambodia's brightest mathematical minds through education, competition, and STEM excellence
          </p>
          <Link 
            to="/programs"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Explore More
          </Link>
        </div>
      </section>

      {/* Who Are We Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Who Are We?
              </h2>
              <p className="text-gray-700 dark:text-gray-400 mb-4 leading-relaxed">
                MOSC (Mathematics Outstanding Students Cambodia) is Cambodia's premier platform dedicated to nurturing 
                exceptional mathematical talent and fostering a culture of excellence in mathematics education. We are 
                committed to identifying, developing, and celebrating Cambodia's most outstanding young mathematicians.
              </p>
              <p className="text-gray-700 dark:text-gray-400 mb-4 leading-relaxed">
                Our organization provides world-class mathematics training, competitive opportunities, and mentorship 
                programs designed to prepare Cambodian students for international mathematical competitions. We are also 
                expanding our reach into comprehensive STEM education to equip students with 21st-century skills.
              </p>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                Join us in our mission to elevate Cambodia's presence in the global mathematics community and inspire 
                the next generation of mathematical innovators and leaders.
              </p>
            </div>
            <div className="bg-white rounded-lg h-96 shadow-lg flex items-center justify-center">
              <img
                src={mosc_logo}
                alt="MOSC Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Programs Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '📚',
                title: 'Mathematics Courses',
                description: 'Comprehensive curriculum covering algebra, geometry, trigonometry, calculus, and competition mathematics',
              },
              {
                icon: '🧮',
                title: 'Math Competitions',
                description: 'Prestigious competitions including national and international mathematics olympiads',
              },
              {
                icon: '🔬',
                title: 'STEM Workshops',
                description: 'Hands-on workshops in Science, Technology, Engineering, and Mathematics integration',
              },
              {
                icon: '🏆',
                title: 'Olympiad Training',
                description: 'Specialized coaching for IMO, ASEAN, and regional mathematical olympiad preparation',
              },
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center"
              >
                <div className="text-5xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Mission, Vision & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Mission',
                icon: '🎯',
                content: 'To identify, nurture, and develop Cambodia\'s most outstanding mathematical talent through world-class education, rigorous training, and competitive opportunities that prepare students for excellence at regional and international levels.',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                borderColor: 'border-blue-500',
              },
              {
                title: 'Vision',
                icon: '🌟',
                content: 'To establish Cambodia as a recognized hub of mathematical excellence in Southeast Asia, producing world-class mathematicians who contribute significantly to global science, technology, and innovation.',
                bgColor: 'bg-amber-50 dark:bg-amber-900/20',
                borderColor: 'border-amber-500',
              },
              {
                title: 'Values',
                icon: '💎',
                content: 'Excellence • Integrity • Collaboration • Accessibility • Innovation • Cambodian Pride',
                bgColor: 'bg-white-50 dark:bg-white-900/20',
                borderColor: 'border-white-500',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} border-l-4 ${item.borderColor} rounded-lg p-8`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Blogs Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Popular Blogs
          </h2>
          
          {blogsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading blogs...</p>
            </div>
          ) : blogs.length > 0 ? (
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
              <div className="text-center mt-12">
                <Link 
                  to="/blog"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  View All Blogs
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <p className="text-gray-600 dark:text-gray-400 text-lg">📝 No blogs available yet.</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Get In Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <form action="https://formspree.io/f/mjknndnd" target="_blank" method="POST" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Your message"
                    rows={5}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {[
                {
                  icon: '📧',
                  title: 'Email',
                  content: 'mosccambodia@gmail.com',
                },
                {
                  icon: '📍',
                  title: 'Location',
                  content: 'Phnom Penh, Cambodia',
                },
              ].map((contact, index) => (
                <div key={index} className="flex gap-4">
                  <div className="text-3xl">{contact.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {contact.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {contact.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Social Media Links */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <SocialIcon network="facebook" url="https://facebook.com/MOSCCambodia" target="_blank" style={{ width: 36, height: 36 }} />
                  <SocialIcon network="instagram" url="https://instagram.com/mosccambodia" target="_blank" style={{ width: 36, height: 36 }} />
                  <SocialIcon network="telegram" url="https://t.me/mosccambodiaMaths" target="_blank" style={{ width: 36, height: 36 }} />
                  <SocialIcon network="linkedin" url="https://linkedin.com/company/mosc-cambodia" target="_blank" style={{ width: 36, height: 36 }} />
                  <SocialIcon network="tiktok" url="https://tiktok.com/@mosc.cambodia" target="_blank" style={{ width: 36, height: 36 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 mb-2">
            © 2025 MOSC - Mathematics Outstanding Students Cambodia. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Nurturing Cambodia's brightest mathematical minds
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
