import React from 'react';

const Programs: React.FC = () => {
  return (
    <div>
      {/* Our Programs Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
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
    </div>
  );
};

export default Programs;
