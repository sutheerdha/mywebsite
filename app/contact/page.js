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
      const response = await fetch('http://localhost:3001/api/send-message', { // Ensure your backend URL is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        // Optionally clear the form
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        console.error('Failed to send message:', response.status);
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl w-full">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Centre Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-700">Address:</h3>
              <p>Itakarlapalli Sub Centre</p>
              <p>Near Panchayat Office</p>
              <p>Itakarlapalli Village</p>
              <p>Mandal: Cheepurupalle</p>
              <p>District: Vizianagaram</p>
              <p>State: Andhra Pradesh - 535125</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-700">Operating Hours:</h3>
              <p>Monday to Saturday: 9:00 AM - 5:00 PM</p>
              <p>Sunday: Closed (Emergency services available)</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-700">Phone Numbers:</h3>
              <p>ANM: +91 XXXXX XXXXX</p>
              <p>Health Worker: +91 XXXXX XXXXX</p>
              <p>Emergency: +91 XXXXX XXXXX</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-700">Email:</h3>
              <p>itakarlapalli.subcentre@health.gov.in</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-700">Visiting Doctor:</h3>
              <p>Dr. [Name] - Every Wednesday (10:00 AM - 1:00 PM)</p>
            </div>
          </div>
        </div>

        <div className="max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Your Name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="tel" placeholder="Your Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email (Optional)
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Your Email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Your Message or Query" rows="4" name="message" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={submissionStatus === 'loading'}>
                {submissionStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
              {submissionStatus === 'success' && <p className="text-green-500 text-sm italic">Message sent successfully!</p>}
              {submissionStatus === 'error' && <p className="text-red-500 text-sm italic">Failed to send message. Please try again later.</p>}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
