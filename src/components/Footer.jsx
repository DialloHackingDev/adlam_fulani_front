import { Link } from 'react-router-dom';
import { 
  HiMail, 
  HiPhone, 
  HiLocationMarker,
  HiGlobeAlt,
  HiNewspaper,
  HiBookOpen,
  HiAcademicCap,
  HiHeart,
  HiArrowUp
} from 'react-icons/hi';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    platform: [
      { name: '𞤃𞤢𞤦𞤢𞤤𞤫', path: '/articles' },
      { name: '𞤃𞤫𞤧𞤫', path: '/ebooks' },
      { name: '𞤔𞤢𞤲𞤺𞤮𞤤', path: '/education' },
      { name: '𞤔𞤮𞤲𞤲𞤣𞤭', path: '/contact' }
    ],
    categories: [
      { name: '𞤀𞤣𞤢𞤦𞤢𞤲', path: '/articles?category=litterature' },
      { name: '𞤚𞤢𞤪𞤭𞤲𞤢𞤤', path: '/articles?category=histoire' },
      { name: '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤', path: '/articles?category=culture' },
      { name: '𞤄𞤭𞤲𞤢𞤤', path: '/articles?category=religion' }
    ],
    support: [
      { name: '𞤖𞤢𞤤𞤢𞤲𞤣𞤫', path: '/contact' },
      { name: '𞤚𞤫𞤳𞤲𞤭𞤳 𞤖𞤢𞤤𞤢𞤲𞤣𞤫', path: '/support' },
      { name: '𞤔𞤢𞤲𞤺𞤮𞤤 𞤀𞤣𞤤𞤢𞤥', path: '/learn-adlam' },
      { name: '𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤', path: '/about' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', color: 'hover:text-blue-600' },
    { name: 'Twitter', url: 'https://twitter.com', color: 'hover:text-sky-500' },
    { name: 'WhatsApp', url: 'https://whatsapp.com', color: 'hover:text-green-600' },
    { name: 'YouTube', url: 'https://youtube.com', color: 'hover:text-red-600' }
  ];

  return (
    <footer className="bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1" dir="rtl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">𞤃𞤢𞤪𞤸𞤢𞤤 𞤀𞤣𞤤𞤢𞤥</h3>
              <p className="text-gray-300 leading-relaxed">
                𞤃𞤢𞤪𞤸𞤢𞤤 𞤀𞤣𞤤𞤢𞤥 - 𞤅𞤢𞤭𞤼 𞤑𞤫𞤧𞤮 𞤫 𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤 𞤫 𞤀𞤣𞤤𞤢𞤥 𞤫 𞤔𞤢𞤲𞤺𞤮𞤤 𞤊𞤵𞤤𞤢𞤪
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <HiMail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">contact@adlam-platform.com</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <HiPhone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">+224 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <HiLocationMarker className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">𞤑𞤮𞤲𞤢𞤳𞤪𞤭, 𞤘𞤭𞤲𞤫</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div dir="rtl">
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <HiGlobeAlt className="h-5 w-5 ml-2" />
              𞤃𞤢𞤪𞤸𞤢𞤤
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div dir="rtl">
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <HiNewspaper className="h-5 w-5 ml-2" />
              𞤊𞤮𞤪𞤲𞤣𞤫
            </h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Learning */}
          <div dir="rtl">
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <HiAcademicCap className="h-5 w-5 ml-2" />
              𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤫 𞤔𞤢𞤲𞤺𞤮𞤤
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div dir="rtl">
              <h4 className="text-xl font-bold mb-4">𞤅𞤢𞤦𞤼𞤮 𞤫 𞤀𞤣𞤢𞤲𞤭 𞤖𞤢𞤦𞤢𞤪𞤫</h4>
              <p className="text-gray-300">
                𞤅𞤢𞤦𞤼𞤮 𞤀𞤣𞤢𞤲𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤃𞤫𞤧𞤫 𞤫 𞤖𞤢𞤦𞤢𞤪𞤫 𞤃𞤢𞤸𞤢𞤲𞤣𞤫
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳 𞤃𞤢𞤳..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                dir="rtl"
              />
              <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium whitespace-nowrap">
                𞤅𞤢𞤦𞤼𞤮
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 space-x-reverse mb-6 md:mb-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors duration-200 transform hover:scale-110`}
                >
                  <span className="sr-only">{social.name}</span>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    {social.name.charAt(0)}
                  </div>
                </a>
              ))}
            </div>
            
            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 space-x-reverse text-gray-400 hover:text-white transition-colors group"
            >
              <HiArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform duration-200" />
              <span>𞤪𞤵𞤼𞤢𞤲 𞤊𞤢𞤪𞤭</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex items-center mb-4 md:mb-0" dir="rtl">
              <span>© 2024 𞤃𞤢𞤪𞤸𞤢𞤤 𞤀𞤣𞤤𞤢𞤥. 𞤊𞤮𞤪𞤪𞤫 𞤸𞤢𞤳𞤫 𞤸𞤢𞤯𞤢𞤲𞤣𞤫.</span>
            </div>
            <div className="flex items-center space-x-6 space-x-reverse">
              <Link to="/privacy" className="hover:text-white transition-colors">
                𞤅𞤭𞤪𞤭 𞤖𞤢𞤯𞤢𞤲𞤣𞤫
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                𞤅𞤢𞤪𞤣𞤫 𞤖𞤵𞤤𞤢𞤲𞤣𞤫
              </Link>
              <div className="flex items-center">
                <span className="ml-1">𞤃𞤢𞤸𞤢𞤲𞤣𞤫 𞤫</span>
                <HiHeart className="h-4 w-4 text-red-500 mx-1" />
                <span>𞤫 𞤘𞤭𞤲𞤫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;