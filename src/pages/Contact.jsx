import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane } from 'react-icons/hi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center" dir="rtl">
            <h1 className="text-3xl font-bold text-black mb-4">📞 𞤔𞤮𞤲𞤲𞤣𞤭</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤀𞤥𞤫𞤲 - 𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳 𞤫 𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8" dir="rtl">
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">
                𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤔𞤮𞤲𞤲𞤣𞤭
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="bg-black text-white p-3 rounded-full">
                    <HiMail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳</h3>
                    <p className="text-gray-600">info@adlam-platform.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="bg-black text-white p-3 rounded-full">
                    <HiPhone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">𞤚𞤫𞤤𞤫𞤬𞤮𞤲</h3>
                    <p className="text-gray-600">+224 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="bg-black text-white p-3 rounded-full">
                    <HiLocationMarker className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">𞤀𞤣𞤢𞤪𞤫𞤧</h3>
                    <p className="text-gray-600">𞤑𞤮𞤲𞤢𞤳𞤪𞤭, 𞤘𞤭𞤲𞤫</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-black mb-4">
                𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳?
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤃𞤫𞤧𞤫 𞤑𞤫𞤧𞤮</li>
                <li>• 𞤚𞤫𞤳𞤲𞤭𞤳 𞤖𞤢𞤤𞤢𞤲𞤣𞤫</li>
                <li>• 𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤 𞤫 𞤀𞤣𞤤𞤢𞤥</li>
                <li>• 𞤔𞤢𞤲𞤺𞤮𞤤 𞤫 𞤀𞤣𞤤𞤢𞤥</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div dir="rtl">
            <h2 className="text-2xl font-bold text-black mb-6">
              𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤔𞤮𞤲𞤲𞤣𞤭
            </h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-center">
                <h3 className="font-medium mb-2">𞤔𞤢𞤦𞤢𞤪𞤢𞤲!</h3>
                <p>𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤳 𞤸𞤢𞤤𞤢𞤲𞤣𞤭. 𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳 𞤸𞤢𞤤 𞤸𞤢𞤤𞤢𞤲𞤣𞤫.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    𞤀𞤪𞤣𞤫 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                    placeholder="𞤀𞤪𞤣𞤫 𞤃𞤢𞤳..."
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    𞤃𞤮𞤶𞤮𞤤
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                    placeholder="𞤃𞤮𞤶𞤮𞤤 𞤖𞤢𞤤𞤢𞤲𞤣𞤫..."
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    𞤖𞤢𞤤𞤢𞤲𞤣𞤫 *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                    placeholder="𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤳..."
                    dir="rtl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <HiPaperAirplane className="h-5 w-5 ml-2" />
                      𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤲𞤫𞤤𞤤𞤭
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;