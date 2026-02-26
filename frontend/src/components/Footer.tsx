import React from 'react';
import { Building, Users, Calendar, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  setCurrentPage?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', page: 'dashboard', icon: Building },
    { name: 'Schedule', page: 'calendar', icon: Calendar },
    { name: 'Campus Map', page: 'blueprint', icon: Building },
    { name: 'Support', page: 'support', icon: Building },
  ];

  const contactInfo = [
    { icon: Mail, text: 'yogita.awate@vsit.edu.in', href: 'mailto:yogita.awate@vsit.edu.in' },
    { icon: MapPin, text: 'Vidyalankar Campus, Vidyalankar College Marg, Wadala (East), Mumbai – 400 037, Maharashtra, India', href: '#' },
  ];

  const legalLinks = [
    { name: 'Terms & Conditions', page: 'terms' },
    { name: 'Privacy Policy', page: 'privacy' },
    { name: 'Cookie Policy', page: 'cookies' },
  ];

  return (
    <footer className="relative mt-20 border-t border-[var(--border)] overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-[var(--bg-secondary)] opacity-80 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5"></div>

      <div className="relative z-10 px-4 py-12 max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="RoomSync Logo" className="w-12 h-12 object-contain" />
              <div>
                <h3 className="text-[var(--text-primary)] text-xl font-bold">RoomSync</h3>
                <p className="text-[var(--accent-indigo)] text-xs font-semibold tracking-wider uppercase">Campus Management</p>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Modern campus management system providing seamless room booking,
              interactive campus maps, and efficient scheduling solutions for
              educational institutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--accent-indigo)]" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {setCurrentPage ? (
                    <button
                      onClick={() => setCurrentPage(link.page)}
                      className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-indigo)] transition-colors duration-200 text-sm font-medium w-full text-left"
                    >
                      <link.icon className="w-4 h-4 opacity-70" />
                      {link.name}
                    </button>
                  ) : (
                    <span className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium">
                      <link.icon className="w-4 h-4 opacity-70" />
                      {link.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[var(--accent-cyan)]" />
              Contact Us
            </h4>
            <ul className="space-y-2">
              {contactInfo.map((contact, index) => (
                <li key={index}>
                  <a
                    href={contact.href}
                    className="flex items-start gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors duration-200 text-sm font-medium"
                  >
                    <contact.icon className="w-4 h-4 mt-1 shrink-0 opacity-70" />
                    <span className="break-words">{contact.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-500" />
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  {setCurrentPage ? (
                    <button
                      onClick={() => setCurrentPage(link.page)}
                      className="text-[var(--text-secondary)] hover:text-purple-500 transition-colors duration-200 text-sm font-medium w-full text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <span className="text-[var(--text-secondary)] text-sm font-medium">
                      {link.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border)] opacity-50 mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-[var(--text-tertiary)] text-sm font-medium">
              © {currentYear} RoomSync. All rights reserved.
            </p>
          </div>

          {/* Member Info */}
          <div className="text-center md:text-right space-y-1">
            <p className="text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider mb-2">Developed By</p>
            <p className="text-[var(--text-secondary)] text-sm font-bold">
              Ovais Shaikh • Noorsharma Ansari • Sneha Singh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
