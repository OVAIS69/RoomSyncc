import React from 'react';
import { Building, CheckCircle, Calendar, Users, AlertCircle, Clock, Mail } from 'lucide-react';

interface TermsPageProps {
  setCurrentPage?: (page: string) => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ setCurrentPage }) => {
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
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-500/20">
            <Building className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">Terms & Conditions</h1>
            <p className="text-[var(--text-tertiary)] text-lg font-medium mt-1">Please read these terms carefully before using RoomSync.</p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="space-y-6">
        {[
          {
            icon: CheckCircle,
            title: "1. Acceptance of Terms",
            color: "text-indigo-500",
            content: "By accessing and using RoomSync, you agree to be bound by these legal terms. If you do not agree to these terms, please discontinue use of the service immediately."
          },
          {
            icon: Building,
            title: "2. Use License",
            color: "text-blue-500",
            content: "We grant you a limited, non-transferable license to access RoomSync for personal institutional use. You may not modify, reverse engineer, or use the platform for unauthorized commercial purposes."
          },
          {
            icon: Calendar,
            title: "3. Booking Policies",
            color: "text-emerald-500",
            content: "All room bookings are subject to availability and institutional guidelines. Administrators reserve the right to modify or cancel bookings to ensure fair access to campus resources."
          },
          {
            icon: Users,
            title: "4. User Responsibilities",
            color: "text-purple-500",
            content: "Users are responsible for maintaining the cleanliness of booked rooms and providing accurate information during the booking process. Misuse of the platform may lead to access restrictions."
          },
          {
            icon: AlertCircle,
            title: "5. Disclaimers",
            color: "text-red-500",
            content: "RoomSync is provided 'as is'. While we strive for 100% uptime and accuracy, we make no warranties regarding uninterrupted service or absolute correctness of all room metadata."
          },
          {
            icon: Clock,
            title: "6. Revisions",
            color: "text-amber-600",
            content: "We may update these terms periodically to reflect changes in platform functionality or institutional policy. Continued use constitutes acceptance of revised terms."
          },
          {
            icon: Mail,
            title: "7. Contact Information",
            color: "text-indigo-600",
            content: (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/5 dark:border-indigo-500/20">
                <p className="text-[var(--text-secondary)] font-medium mb-2">Legal inquiries should be directed to:</p>
                <a href="mailto:legal@campus.edu" className="text-indigo-600 font-bold hover:underline text-lg">legal@campus.edu</a>
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
        <p className="text-[var(--text-tertiary)] font-bold uppercase tracking-widest text-xs">RoomSync • 2024 Legal Documentation</p>
      </div>
    </div>
  );
};

export default TermsPage;
