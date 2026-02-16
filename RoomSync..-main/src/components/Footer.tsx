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
    <footer className="relative mt-20">
      {/* Glass gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-emerald-900/20 backdrop-blur-sm border-t border-white/10"></div>

      <div className="relative z-10 px-4 py-12 max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-emerald-400/20"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <Building className="w-7 h-7 text-white" />
                  <div className="w-1 h-1 bg-white rounded-full ml-0.5"></div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">RoomSync</h3>
                <p className="text-xs text-indigo-300 font-medium">Campus Management</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Modern campus management system providing seamless room booking,
              interactive campus maps, and efficient scheduling solutions for
              educational institutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {setCurrentPage ? (
                    <button
                      onClick={() => setCurrentPage(link.page)}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm w-full text-left"
                    >
                      <link.icon className="w-4 h-4 text-indigo-400" />
                      {link.name}
                    </button>
                  ) : (
                    <span className="flex items-center gap-2 text-gray-300 text-sm">
                      <link.icon className="w-4 h-4 text-indigo-400" />
                      {link.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              Contact Us
            </h4>
            <ul className="space-y-2">
              {contactInfo.map((contact, index) => (
                <li key={index}>
                  <a
                    href={contact.href}
                    className="flex items-start gap-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    <contact.icon className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                    <span className="break-words">{contact.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-400" />
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  {setCurrentPage ? (
                    <button
                      onClick={() => setCurrentPage(link.page)}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm w-full text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <span className="text-gray-300 text-sm">
                      {link.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} RoomSync. All rights reserved.
            </p>
          </div>

          {/* Member Info */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              Team Member: <span className="text-indigo-400 font-medium">Ovais Shaikh</span>
            </p>
            <p className="text-gray-400 text-sm">
              Team Member: <span className="text-indigo-400 font-medium">Noorsharma Ansari</span>
            </p>
            <p className="text-gray-400 text-sm">
              Team Member: <span className="text-indigo-400 font-medium">Sneha Singh</span>
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
