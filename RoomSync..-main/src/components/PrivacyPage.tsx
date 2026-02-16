import React from 'react';
import { Building } from 'lucide-react';

interface PrivacyPageProps {
  setCurrentPage?: (page: string) => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ setCurrentPage }) => {
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
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Building className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
      </div>

      {/* Privacy Content */}
      <div className="space-y-8">
        {/* Information Collection */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              1. Information We Collect
            </h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name and contact information</li>
              <li>User credentials and authentication data</li>
              <li>Room booking preferences and history</li>
              <li>Communication preferences</li>
              <li>Technical information about your device and usage</li>
            </ul>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              2. How We Use Your Information
            </h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and maintain our services</li>
              <li>Process room bookings and manage schedules</li>
              <li>Send notifications and updates about your bookings</li>
              <li>Improve our services and user experience</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-400" />
              3. Information Sharing and Disclosure
            </h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>With your explicit consent</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              4. Data Security
            </h2>
          <p className="text-gray-300 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, 
            secure servers, and regular security assessments.
          </p>
        </section>

        {/* Data Retention */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">5. Data Retention</h2>
          <p className="text-gray-300 leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
            policy, comply with legal obligations, resolve disputes, and enforce our agreements. Booking history is 
            typically retained for 2 years for administrative purposes.
          </p>
        </section>

        {/* Your Rights */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to certain processing activities</li>
              <li>Withdraw consent where applicable</li>
              <li>Request data portability</li>
            </ul>
          </div>
        </section>

        {/* Cookies */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">7. Cookies and Tracking Technologies</h2>
          <p className="text-gray-300 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, 
            and provide personalized content. You can control cookie settings through your browser preferences, 
            though disabling certain cookies may affect functionality.
          </p>
        </section>

        {/* Third Party Services */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">8. Third-Party Services</h2>
          <p className="text-gray-300 leading-relaxed">
            Our service may contain links to third-party websites or services. We are not responsible for the 
            privacy practices of these external sites. We encourage you to review their privacy policies before 
            providing any personal information.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">9. Children's Privacy</h2>
          <p className="text-gray-300 leading-relaxed">
                         RoomSync is not intended for children under 13 years of age. We do not knowingly collect personal
             information from children under 13. If you are a parent or guardian and believe your child has provided
             us with personal information, please contact us immediately.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by 
            posting the new policy on this page and updating the "Last Updated" date. Your continued use of 
                         RoomSync after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">11. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
            <a href="mailto:privacy@campus.edu" className="text-emerald-400 hover:text-emerald-300">
              privacy@campus.edu
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

export default PrivacyPage;
