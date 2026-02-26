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
      <h1 className="text-4xl font-extrabold mb-10 text-center text-[var(--text-primary)]">Support & Help</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] shadow-xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-[var(--text-primary)]">
            <Mail className="w-7 h-7 text-indigo-600" />
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--text-secondary)]">Name</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-[var(--text-tertiary)]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--text-secondary)]">Email</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-[var(--text-tertiary)]"
                placeholder="your.email@college.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none"
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
        <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] shadow-xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-[var(--text-primary)]">
            <MessageSquare className="w-7 h-7 text-purple-600" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div key={idx} className="border rounded-xl border-[var(--border)] overflow-hidden transition-all duration-200 hover:border-indigo-500/30">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-indigo-500/5 transition-all duration-200 text-[var(--text-primary)]"
                >
                  <span className="font-bold">{faq.question}</span>
                  {expandedFAQ === idx ? <ChevronUp size={20} className="text-indigo-600" /> : <ChevronDown size={20} className="text-[var(--text-tertiary)]" />}
                </button>
                {expandedFAQ === idx && (
                  <div className="px-5 pb-5 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-4">
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
