import React from 'react';
import { teamMembers, techStack } from '../data';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">About RoomSync</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Project Context */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600">Project Context</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-white">Background</h3>
              <p className="text-gray-300 leading-relaxed">
                Classroom and lab scheduling is complex, often resulting in overlapping bookings and miscommunication. 
                The current method of booking a lab or classroom is manual, leading to conflicts and inefficient resource utilization.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-white">Problem Statement</h3>
              <p className="text-gray-300 leading-relaxed">
                There is no smart interface for conflict-free room allocation. Colleges lack a centralized view of room availability, 
                resulting in scheduling conflicts and poor resource management.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-white">Solution</h3>
              <p className="text-gray-300 leading-relaxed">
                A web platform with drag-and-drop interfaces for dynamic room booking, offering real-time conflict checking, 
                smart recommendations, and an intuitive availability calendar system.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-white">Key Features</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Timetable uploader with conflict detection</li>
                <li>• Auto conflict checker for scheduling</li>
                <li>• Interactive room availability calendar</li>
                <li>• Email confirmation system</li>
                <li>• Role-based access control</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-purple-600">Development Team</h2>
          
          <div className="space-y-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-700/50 border border-gray-600">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{member.name}</h3>
                    <p className="text-sm text-gray-400">ID: {member.id}</p>
                    <p className="text-sm text-gray-300">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-indigo-900/30 border border-indigo-700">
            <h3 className="font-semibold text-lg mb-2 text-indigo-600">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
