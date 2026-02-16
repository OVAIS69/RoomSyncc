import React from 'react';
import { Building } from 'lucide-react';

interface CookiePageProps {
  setCurrentPage?: (page: string) => void;
}

const CookiePage: React.FC<CookiePageProps> = ({ setCurrentPage }) => {
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
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Building className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Cookie Policy</h1>
        </div>
        <p className="text-gray-300 text-lg">
                     This policy explains how RoomSync uses cookies and similar technologies to enhance your experience.
        </p>
      </div>

      {/* Cookie Content */}
      <div className="space-y-8">
        {/* What Are Cookies */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              1. What Are Cookies?
            </h2>
          <p className="text-gray-300 leading-relaxed">
            Cookies are small text files that are stored on your device when you visit a website. They help websites 
            remember information about your visit, such as your preferred language and other settings, which can make 
            your next visit easier and the site more useful to you.
          </p>
        </section>

        {/* How We Use Cookies */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              2. How We Use Cookies
            </h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
                             RoomSync uses cookies for several purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Essential cookies for basic functionality</li>
              <li>Authentication and security cookies</li>
              <li>Preference and customization cookies</li>
              <li>Analytics and performance cookies</li>
              <li>Session management cookies</li>
            </ul>
          </div>
        </section>

        {/* Types of Cookies */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">3. Types of Cookies We Use</h2>
          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                These cookies are necessary for the website to function properly. They enable basic functions like 
                page navigation, access to secure areas, and form submissions. The website cannot function properly 
                without these cookies.
              </p>
            </div>

            {/* Performance Cookies */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">Performance Cookies</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                These cookies collect information about how visitors use the website, such as which pages are visited 
                most often and if users get error messages. This helps us improve how the website works.
              </p>
            </div>

            {/* Functionality Cookies */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">Functionality Cookies</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                These cookies allow the website to remember choices you make and provide enhanced, more personal 
                features. They may also be used to provide services you have asked for.
              </p>
            </div>
          </div>
        </section>

        {/* Specific Cookies */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">4. Specific Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2 px-2 text-white font-semibold">Cookie Name</th>
                  <th className="text-left py-2 px-2 text-white font-semibold">Purpose</th>
                  <th className="text-left py-2 px-2 text-white font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-2">session_id</td>
                  <td className="py-2 px-2">Maintains user session</td>
                  <td className="py-2 px-2">Session</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-2">user_preferences</td>
                  <td className="py-2 px-2">Stores user preferences</td>
                  <td className="py-2 px-2">1 year</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-2">analytics_id</td>
                  <td className="py-2 px-2">Website analytics</td>
                  <td className="py-2 px-2">2 years</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">security_token</td>
                  <td className="py-2 px-2">Security verification</td>
                  <td className="py-2 px-2">24 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Third Party Cookies */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">5. Third-Party Cookies</h2>
          <p className="text-gray-300 leading-relaxed">
            Some cookies on our website are set by third-party services that we use to enhance functionality. 
            These may include analytics services, social media platforms, and advertising networks. We do not 
            control these cookies and they are subject to the third party's privacy policy.
          </p>
        </section>

        {/* Managing Cookies */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-400" />
              6. Managing Your Cookie Preferences
            </h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Browser settings: Most browsers allow you to refuse cookies or delete them</li>
              <li>Cookie consent: Use our cookie consent manager when available</li>
              <li>Third-party tools: Use browser extensions to manage cookies</li>
              <li>Mobile devices: Adjust settings in your mobile browser</li>
            </ul>
            <p className="text-sm text-gray-400 mt-4">
              Note: Disabling certain cookies may affect the functionality of RoomSync.
            </p>
          </div>
        </section>

        {/* Cookie Consent */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">7. Cookie Consent</h2>
          <p className="text-gray-300 leading-relaxed">
                         When you first visit RoomSync, you will see a cookie consent banner. By clicking "Accept All"
             or "Accept Selected", you consent to our use of cookies in accordance with this policy. You can
             change your preferences at any time through our cookie settings.
          </p>
        </section>

        {/* Updates to Policy */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">8. Updates to This Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
            operational, legal, or regulatory reasons. We will notify you of any material changes by posting 
            the updated policy on our website.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">9. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us at{' '}
            <a href="mailto:cookies@campus.edu" className="text-amber-400 hover:text-amber-300">
              cookies@campus.edu
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

export default CookiePage;
