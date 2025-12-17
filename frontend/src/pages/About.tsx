import React from 'react';
import mosc_logo from '../../public/mosc-logo.svg';

const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Who Are We Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Who Are We?
              </h2>
              <p className="text-gray-700 dark:text-gray-400 mb-3 leading-relaxed">
                MOSC (Mathematics Outstanding Students Cambodia) is Cambodia's platform dedicated to nurturing 
                exceptional mathematical talent and fostering a culture of excellence in mathematics education. We are 
                committed to identifying, developing, and celebrating Cambodia's most outstanding young mathematicians.
              </p>
              <p className="text-gray-700 dark:text-gray-400 mb-3 leading-relaxed">
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

      {/* Mission, Vision, Values Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
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
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
    </div>
  );
};

export default About;
