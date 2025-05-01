'use client';
import React, { useState } from 'react';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('loading');

    try {
      const response = await fetch('http://localhost:3001/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setSubmissionStatus('error');
      }
    } catch {
      setSubmissionStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-700 mb-12">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Centre Information</h2>
            <div className="text-gray-700 space-y-4">
              <div>
                <p className="font-semibold">📍 Address</p>
                <p>Itakarlapalli Sub Centre</p>
                <p>Near Panchayat Office, Itakarlapalli Village</p>
                <p>Cheepurupalle Mandal, Vizianagaram,</p>
                <p>Andhra Pradesh - 535125</p>
              </div>
              <div>
                <p className="font-semibold">🕘 Operating Hours</p>
                <p>Mon - Sat: 9:00 AM - 5:00 PM</p>
                <p>Sun: Closed (Emergency available)</p>
              </div>
              <div>
                <p className="font-semibold">📞 Phone Numbers</p>
                <p>ANM: +91 XXXXX XXXXX</p>
                <p>Health Worker: +91 XXXXX XXXXX</p>
                <p>Emergency: +91 XXXXX XXXXX</p>
              </div>
              <div>
                <p className="font-semibold">📧 Email</p>
                <p>sutherdha@gmail.com</p>
              </div>
              <div>
                <p className="font-semibold">👨‍⚕️ Visiting Doctor</p>
                <p>Dr. [Name] - Every Wednesday (10:00 AM - 1:00 PM)</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Name" name="name" type="text" value={formData.name} onChange={handleChange} required />
              <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
              <Input label="Email (Optional)" name="email" type="email" value={formData.email} onChange={handleChange} />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Your Message or Query"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={submissionStatus === 'loading'}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl transition"
                >
                  {submissionStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                {submissionStatus === 'success' && <p className="text-green-600 text-sm italic">✅ Message sent successfully!</p>}
                {submissionStatus === 'error' && <p className="text-red-600 text-sm italic">❌ Failed to send. Try again later.</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

interface InputProps {
  label: string;
  name: keyof ContactForm;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function Input({ label, name, type, value, onChange, required }: InputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={`Enter your ${name}`}
      />
    </div>
  );
}
