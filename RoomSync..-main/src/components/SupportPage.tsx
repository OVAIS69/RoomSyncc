import React, { useState } from 'react';
import { Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { faqData } from '../data';
import { supportAPI } from '../services/api';

interface SupportPageProps {
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ showNotification }) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await supportAPI.create(contactForm);
      showNotification('Message sent successfully! We\'ll get back to you soon.');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error: any) {
      showNotification(error.message || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Support & Help</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
            <Mail className="w-6 h-6 text-indigo-600" />
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Name</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Email</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="your.email@college.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div key={idx} className="border rounded-xl border-gray-600">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-700/50 transition-all duration-200 rounded-xl text-white"
                >
                  <span className="font-medium">{faq.question}</span>
                  {expandedFAQ === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedFAQ === idx && (
                  <div className="px-4 pb-3 text-gray-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
