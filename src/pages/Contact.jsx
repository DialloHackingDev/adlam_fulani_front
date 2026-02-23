import { useState } from 'react';
import { 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiPaperAirplane,
  HiClock,
  HiGlobeAlt,
  HiChat,
  HiSupport,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi';
import FulaniInput from '../components/FulaniInput';
import FulaniTextarea from '../components/FulaniTextarea';
import { apiService } from '../services/apiService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await apiService.contact.send(formData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setError(error.response?.data?.message || '𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤲𞤫𞤤𞤤𞤢𞤲𞤣𞤫 𞤫 𞤚𞤢𞤥𞤭𞤪. 𞤊𞤭𞤪𞤭𞤼𞤮 𞤫𞤲 𞤪𞤭𞤲𞤢𞤲.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: HiMail,
      title: '𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳',
      value: 'contact@adlam-platform.com',
      description: '𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤫 𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳',
      color: 'bg-blue-500'
    },
    {
      icon: HiPhone,
      title: '𞤚𞤫𞤤𞤫𞤬𞤮𞤲',
      value: '+224 123 456 789',
      description: '𞤔𞤢𞤪𞤭 8:00 - 18:00',
      color: 'bg-green-500'
    },
    {
      icon: HiLocationMarker,
      title: '𞤀𞤣𞤢𞤪𞤫𞤧',
      value: '𞤑𞤮𞤲𞤢𞤳𞤪𞤭, 𞤘𞤭𞤲𞤫',
      description: '𞤌𞤬𞤭𞤧 𞤃𞤢𞤪𞤳𞤢𞤶𞤭',
      color: 'bg-red-500'
    },
    {
      icon: HiGlobeAlt,
      title: '𞤅𞤢𞤭𞤼 𞤏𞤫𞤦',
      value: 'www.adlam-platform.com',
      description: '𞤅𞤢𞤭𞤼 𞤏𞤫𞤦 𞤌𞤬𞤭𞤧𞤭𞤴𞤢𞤤',
      color: 'bg-purple-500'
    }
  ];

  const supportTopics = [
    { icon: HiChat, title: '𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤃𞤫𞤧𞤫', desc: '𞤑𞤫𞤧𞤮 𞤫 𞤻𞤫𞤪𞤲𞤣𞤫' },
    { icon: HiSupport, title: '𞤚𞤫𞤳𞤲𞤭𞤳 𞤖𞤢𞤤𞤢𞤲𞤣𞤫', desc: '𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤚𞤫𞤳𞤲𞤭𞤳' },
    { icon: HiGlobeAlt, title: '𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤 𞤫 𞤀𞤣𞤤𞤢𞤥', desc: '𞤔𞤢𞤲𞤺𞤮𞤤 𞤫 𞤀𞤣𞤤𞤢𞤥' },
    { icon: HiCheckCircle, title: '𞤔𞤢𞤦𞤢𞤪𞤢𞤲 𞤫 𞤀𞤪𞤣𞤭𞤲', desc: '𞤔𞤢𞤦𞤢𞤪𞤢𞤲 𞤫 𞤀𞤪𞤣𞤭𞤲' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center" dir="rtl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <HiChat className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤀𞤥𞤫𞤲
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳 𞤫 𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳 𞤸𞤢𞤤 𞤸𞤢𞤤𞤢𞤲𞤣𞤫
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center text-gray-300">
                <HiClock className="h-5 w-5 ml-2" />
                𞤖𞤢𞤤𞤢𞤲𞤣𞤫 24/7
              </div>
              <div className="flex items-center text-gray-300">
                <HiGlobeAlt className="h-5 w-5 ml-2" />
                𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤 𞤏𞤮𞤪𞤤𞤣
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${method.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2" dir="rtl">
                    {method.title}
                  </h3>
                  <p className="text-gray-900 font-medium mb-2">
                    {method.value}
                  </p>
                  <p className="text-gray-500 text-sm" dir="rtl">
                    {method.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-black to-gray-800 px-8 py-6">
                <h2 className="text-2xl font-bold text-white" dir="rtl">
                  𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤔𞤮𞤲𞤲𞤣𞤭
                </h2>
                <p className="text-gray-300 mt-2" dir="rtl">
                  𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤳 𞤲𞤫𞤤𞤤𞤭 𞤫 𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳
                </p>
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center">
                    <HiExclamationCircle className="h-5 w-5 ml-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <HiCheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-green-700 mb-2" dir="rtl">
                      𞤔𞤢𞤦𞤢𞤪𞤢𞤲!
                    </h3>
                    <p className="text-green-600" dir="rtl">
                      𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤳 𞤸𞤢𞤤𞤢𞤲𞤣𞤭. 𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳 𞤸𞤢𞤤 𞤸𞤢𞤤𞤢𞤲𞤣𞤫.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          𞤀𞤪𞤣𞤫 *
                        </label>
                        <FulaniInput
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right transition-all duration-300 hover:border-gray-300"
                          placeholder="𞤀𞤪𞤣𞤫 𞤃𞤢𞤳..."
                          dir="rtl"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳 *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-300"
                          placeholder="email@example.com"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        𞤃𞤮𞤶𞤮𞤤
                      </label>
                      <FulaniInput
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right transition-all duration-300 hover:border-gray-300"
                        placeholder="𞤃𞤮𞤶𞤮𞤤 𞤖𞤢𞤤𞤢𞤲𞤣𞤫..."
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        𞤖𞤢𞤤𞤢𞤲𞤣𞤫 *
                      </label>
                      <FulaniTextarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right transition-all duration-300 hover:border-gray-300 resize-none"
                        placeholder="𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤳..."
                        dir="rtl"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-4 px-8 rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                          𞤔𞤢𞤪𞤭 𞤲𞤫𞤤𞤤𞤢𞤲𞤣𞤫...
                        </div>
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

          {/* Support Topics & Info */}
          <div className="space-y-8">
            {/* Support Topics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-black flex items-center" dir="rtl">
                  <HiSupport className="h-5 w-5 ml-2" />
                  𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤚𞤫𞤳𞤲𞤭𞤳
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {supportTopics.map((topic, index) => {
                    const IconComponent = topic.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-200">
                            <IconComponent className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="flex-1" dir="rtl">
                          <h4 className="font-medium text-black text-sm">{topic.title}</h4>
                          <p className="text-gray-500 text-xs mt-1">{topic.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-black to-gray-800 rounded-2xl shadow-lg text-white overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center" dir="rtl">
                  <HiClock className="h-5 w-5 ml-2" />
                  𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤚𞤢𞤥𞤭𞤪
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center" dir="rtl">
                    <span className="text-gray-300">𞤀𞤢𞤸𞤢 - 𞤀𞤭𞤲𞤭𞤄𞤲</span>
                    <span className="font-medium">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center" dir="rtl">
                    <span className="text-gray-300">𞤅𞤢𞤦𞤭𞤄𞤲 - 𞤀𞤤𞤢𞤸𞤢𞤣</span>
                    <span className="font-medium">9:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between items-center" dir="rtl">
                    <span className="text-gray-300">𞤀𞤤𞤢𞤸𞤢𞤣</span>
                    <span className="font-medium">𞤔𞤮𞤬𞤭𞤲𞤣𞤫</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-600">
                  <p className="text-xs text-gray-300" dir="rtl">
                    𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;