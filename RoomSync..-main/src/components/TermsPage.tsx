import React from 'react';
import { Building } from 'lucide-react';

interface TermsPageProps {
  setCurrentPage?: (page: string) => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          {setCurrentPage && (
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
            >
              <Building className="w-5 h-5" />
              Back to Home
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
        </div>
                 <p className="text-gray-300 text-lg">
           Please read these terms and conditions carefully before using RoomSync.
         </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-8">
        {/* Acceptance */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300 leading-relaxed">
                         By accessing and using RoomSync, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        {/* Use License */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">2. Use License</h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
                             Permission is granted to temporarily access RoomSync for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
                             <li>Attempt to reverse engineer any software contained on RoomSync</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>
        </section>

        {/* Room Booking */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">3. Room Booking Policies</h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
                             RoomSync provides room booking services subject to the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Bookings must be made at least 24 hours in advance</li>
              <li>Maximum booking duration is 4 hours per session</li>
              <li>Users are responsible for leaving rooms in the same condition they found them</li>
              <li>Administrators reserve the right to cancel or modify bookings if necessary</li>
            </ul>
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">4. User Responsibilities</h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              As a user of CampusSync, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate and truthful information</li>
              <li>Respect the privacy and rights of other users</li>
              <li>Not misuse the system for unauthorized purposes</li>
              <li>Report any technical issues or security concerns</li>
            </ul>
          </div>
        </section>

        {/* Privacy & Data */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">5. Privacy & Data Protection</h2>
          <p className="text-gray-300 leading-relaxed">
            Your privacy is important to us. We collect and process personal data in accordance with our Privacy Policy. 
            By using CampusSync, you consent to such processing and warrant that all data provided is accurate.
          </p>
        </section>

        {/* Disclaimers */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">6. Disclaimers</h2>
          <p className="text-gray-300 leading-relaxed">
                         The materials on RoomSync are provided on an 'as is' basis. RoomSync makes no warranties, expressed or implied, 
            and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions 
            of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
          </p>
        </section>

        {/* Limitations */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">7. Limitations</h2>
          <p className="text-gray-300 leading-relaxed">
                         In no event shall RoomSync or its suppliers be liable for any damages (including, without limitation, damages 
                         for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials
             on RoomSync, even if RoomSync or a RoomSync authorized representative has been notified orally or in writing 
            of the possibility of such damage.
          </p>
        </section>

        {/* Revisions */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">8. Revisions and Errata</h2>
          <p className="text-gray-300 leading-relaxed">
                         The materials appearing on RoomSync could include technical, typographical, or photographic errors.
             RoomSync does not warrant that any of the materials on its website are accurate, complete, or current.
             RoomSync may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">9. Contact Information</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about these Terms & Conditions, please contact us at{' '}
            <a href="mailto:legal@campus.edu" className="text-indigo-400 hover:text-indigo-300">
              legal@campus.edu
            </a>
          </p>
        </section>

        {/* Last Updated */}
        <div className="text-center py-6">
          <p className="text-gray-400 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
