import React from 'react';
import { Building, CheckCircle, User, MessageSquare, Clock, Calendar, Users, MapPin, Mail } from 'lucide-react';

interface PrivacyPageProps {
  setCurrentPage?: (page: string) => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="px-4 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
          {setCurrentPage && (
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200"
            >
              <Building className="w-5 h-5" />
              Back to Home
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 text-[var(--text-primary)]">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">Privacy Policy</h1>
            <p className="text-[var(--text-tertiary)] text-lg font-medium mt-1">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <p className="text-[var(--text-secondary)] text-xl leading-relaxed max-w-2xl">
          Your privacy is at the core of everything we build. This policy details how we handle your data with transparency and security.
        </p>
      </div>

      {/* Privacy Content */}
      <div className="space-y-6">
        {/* Section Template */}
        {[
          {
            icon: User,
            title: "1. Information We Collect",
            color: "text-emerald-500",
            content: (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Name and contact details', 'User credentials', 'Booking history', 'Device and usage data'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] font-medium">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            )
          },
          {
            icon: Clock,
            title: "2. How We Use Information",
            color: "text-blue-500",
            content: "We use your information strictly to provide services, process bookings, send essential notifications, and continuously improve the RoomSync experience while ensuring platform security."
          },
          {
            icon: MessageSquare,
            title: "3. Information Sharing",
            color: "text-purple-500",
            content: "We never sell your data. Sharing only occurs with your consent, for legal compliance, or with trusted service providers who help us operate our essential services."
          },
          {
            icon: CheckCircle,
            title: "4. Data Security",
            color: "text-indigo-500",
            content: "We employ industry-standard encryption and security protocols to safeguard your personal data against unauthorized access or disclosure."
          },
          {
            icon: Calendar,
            title: "5. Data Retention",
            color: "text-orange-500",
            content: "Information is kept only as long as necessary for administrative purposes or as required by institutional policies."
          },
          {
            icon: Users,
            title: "6. Your Rights",
            color: "text-pink-500",
            content: "You have full control over your data. You may access, correct, or request deletion of your information at any time through your account settings or by contacting us."
          },
          {
            icon: MapPin,
            title: "7. Cookies",
            color: "text-amber-600",
            content: "We use essential cookies to maintain your session and improve site performance. You can manage these preferences in your browser."
          },
          {
            icon: Building,
            title: "8. Third Parties",
            color: "text-cyan-500",
            content: "Our platform may link to campus resources. We are not responsible for the privacy practices of external institutional sites."
          },
          {
            icon: Mail,
            title: "9. Contact Us",
            color: "text-indigo-600",
            content: (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/5 dark:border-indigo-500/20">
                <div className="p-3 bg-indigo-600 rounded-xl">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[var(--text-secondary)] font-medium">For any privacy concerns, reach out to:</p>
                  <a href="mailto:privacy@campus.edu" className="text-indigo-600 font-bold hover:underline">privacy@campus.edu</a>
                </div>
              </div>
            )
          }
        ].map((section, idx) => (
          <section key={idx} className="bg-[var(--surface)] rounded-3xl p-8 border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
              <section.icon className={`w-7 h-7 ${section.color}`} />
              {section.title}
            </h2>
            <div className="text-[var(--text-secondary)] leading-relaxed text-lg font-medium">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 text-center p-8 border-t border-[var(--border)]">
        <p className="text-[var(--text-tertiary)] font-bold uppercase tracking-widest text-xs">RoomSync • Professional Edition</p>
      </div>
    </div>
  );
};

export default PrivacyPage;
