import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HiHome, 
  HiChevronLeft, 
  HiHeart, 
  HiOutlineHeart, 
  HiShare, 
  HiClock, 
  HiEye,
  HiUser,
  HiCalendar,
  HiTag,
  HiArrowUp,
  HiBookmark,
  HiOutlineBookmark
} from 'react-icons/hi';
import { apiService } from '../services/apiService';

const ArticleDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [readingProgress, setReadingProgress] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        fetchArticle();
        
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
            setShowScrollTop(scrolled > 300);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const response = await apiService.articles.getBySlug(slug);
            const articleData = response.data.data?.article || response.data.article;
            setArticle(articleData);
            setLikesCount(articleData.likes || 0);
        } catch (error) {
            if (error.response?.status === 404) {
                navigate('/articles');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            setLiked(!liked);
            setLikesCount(prev => liked ? prev - 1 : prev + 1);
            await apiService.articles.toggleLike(article._id);
        } catch (error) {
            setLiked(!liked);
            setLikesCount(prev => liked ? prev + 1 : prev - 1);
        }
    };

    const handleBookmark = () => {
        setBookmarked(!bookmarked);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href
                });
            } catch (error) {
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert('𞤂𞤭𞤲𞤳 𞤳𞤮𞤨𞤭𞤲𞤢𞤲!');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 150;
        const text = content.replace(/<[^>]*>/g, '');
        const words = text.length / 6;
        return Math.ceil(words / wordsPerMinute);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const categoryMap = {
        'litterature': '𞤀𞤣𞤢𞤦𞤢𞤲',
        'histoire': '𞤚𞤢𞤪𞤭𞤲𞤢𞤤',
        'education': '𞤔𞤢𞤲𞤺𞤢𞤤',
        'culture': '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤',
        'science': '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭',
        'religion': '𞤄𞤭𞤲𞤢𞤤'
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</p>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center" dir="rtl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">𞤃𞤢𞤦𞤢𞤤 𞤧𞤢𞤦𞤢𞤲𞤢𞤲</h2>
                    <Link to="/articles" className="text-black hover:underline">
                        𞤪𞤵𞤼𞤢𞤲 𞤫 𞤃𞤢𞤦𞤢𞤤𞤫
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                <div 
                    className="h-full bg-black transition-all duration-300 ease-out"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* Hero Section with Image */}
            <div className="relative">
                {/* Cover Image */}
                {article.coverImage ? (
                    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] bg-gray-900 overflow-hidden">
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Article Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                            <div className="max-w-7xl mx-auto">
                                {/* Breadcrumb */}
                                <nav className="flex items-center space-x-2 space-x-reverse text-xs sm:text-sm mb-4 sm:mb-6" dir="rtl">
                                    <Link to="/" className="text-white/80 hover:text-white flex items-center transition-colors">
                                        <HiHome className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                        𞤀𞤧𞤵𞤤
                                    </Link>
                                    <HiChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
                                    <Link to="/articles" className="text-white/80 hover:text-white transition-colors">
                                        𞤃𞤢𞤦𞤢𞤤𞤫
                                    </Link>
                                    <HiChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
                                    <span className="text-white truncate">{categoryMap[article.category] || article.category}</span>
                                </nav>

                                {/* Category Badge */}
                                <div className="mb-3 sm:mb-4">
                                    <span className="inline-block bg-white text-black px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold rounded-full">
                                        {categoryMap[article.category] || article.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight" dir="rtl">
                                    {article.title}
                                </h1>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-white/90 text-xs sm:text-sm" dir="rtl">
                                    <div className="flex items-center">
                                        <HiCalendar className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
                                        <span className="hidden sm:inline">{formatDate(article.publishedAt || article.createdAt)}</span>
                                        <span className="sm:hidden">{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <HiClock className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
                                        {calculateReadingTime(article.content)} 𞤣𞤢𞤳𞤭𞤳𞤢
                                    </div>
                                    <div className="flex items-center">
                                        <HiEye className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
                                        {article.views || 0} 𞤴𞤮𞤲𞤢𞤲
                                    </div>
                                    {article.author && (
                                        <div className="flex items-center">
                                            <HiUser className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
                                            <span className="truncate max-w-32 sm:max-w-none">{article.author.name || article.author}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Fallback Header without Image */
                    <div className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <nav className="flex items-center space-x-2 space-x-reverse text-sm mb-6" dir="rtl">
                                <Link to="/" className="text-white/80 hover:text-white flex items-center transition-colors">
                                    <HiHome className="h-4 w-4 ml-1" />
                                    𞤀𞤧𞤵𞤤
                                </Link>
                                <HiChevronLeft className="h-4 w-4 text-white/60" />
                                <Link to="/articles" className="text-white/80 hover:text-white transition-colors">
                                    𞤃𞤢𞤦𞤢𞤤𞤫
                                </Link>
                            </nav>
                            
                            <span className="inline-block bg-white text-black px-4 py-2 text-sm font-bold rounded-full mb-6">
                                {categoryMap[article.category] || article.category}
                            </span>
                            
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" dir="rtl">
                                {article.title}
                            </h1>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12 gap-4 sm:gap-0" dir="rtl">
                    <div className="flex items-center space-x-4 sm:space-x-6 space-x-reverse w-full sm:w-auto">
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-2 space-x-reverse px-3 sm:px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base ${
                                liked 
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-red-600'
                            }`}
                        >
                            {liked ? (
                                <HiHeart className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                                <HiOutlineHeart className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                            <span className="font-medium">{likesCount}</span>
                        </button>

                        <button
                            onClick={handleBookmark}
                            className={`flex items-center px-3 sm:px-4 py-2 rounded-full transition-all duration-300 ${
                                bookmarked 
                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-yellow-600'
                            }`}
                        >
                            {bookmarked ? (
                                <HiBookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                                <HiOutlineBookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center space-x-2 space-x-reverse px-3 sm:px-4 py-2 bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-all duration-300 text-sm sm:text-base"
                        >
                            <HiShare className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="font-medium hidden sm:inline">𞤧𞤢𞤪𞤫</span>
                        </button>
                    </div>
                </div>

                {/* Article Excerpt */}
                {article.excerpt && (
                    <div className="bg-gradient-to-r from-gray-50 to-white border-r-4 border-black p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 rounded-2xl" dir="rtl">
                        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                            {article.excerpt}
                        </p>
                    </div>
                )}

                {/* Article Content */}
                <article className="prose prose-lg w-full max-w-full" dir="rtl">
                    <div
                        className="text-gray-800 w-full"
                        style={{
                            fontFamily: 'Noto Sans Adlam, serif',
                            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                            lineHeight: '2',
                            textAlign: 'right',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            maxWidth: '100%'
                        }}
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </article>
                <style>{`
                    /* Container principal */
                    article {
                        width: 100% !important;
                        max-width: 100% !important;
                        overflow-wrap: break-word !important;
                    }
                    
                    /* Tous les éléments */
                    article * {
                        max-width: 100% !important;
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        box-sizing: border-box !important;
                    }
                    
                    /* Paragraphes et texte */
                    article p {
                        margin-bottom: 1.5rem;
                        line-height: 2;
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                    }
                    
                    article div, article span, article li {
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        max-width: 100% !important;
                    }
                    
                    /* Images */
                    article img {
                        max-width: 100% !important;
                        height: auto !important;
                        border-radius: 0.75rem;
                        margin: 2rem auto;
                        display: block;
                        object-fit: contain;
                    }
                    
                    /* Tables */
                    article table {
                        width: 100% !important;
                        max-width: 100% !important;
                        overflow-x: auto !important;
                        display: block !important;
                        border-collapse: collapse;
                        margin: 2rem 0;
                    }
                    
                    article table td, article table th {
                        padding: 0.75rem;
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                    }
                    
                    /* Code blocks */
                    article pre {
                        max-width: 100% !important;
                        overflow-x: auto !important;
                        padding: 1.5rem;
                        background: #f3f4f6;
                        border-radius: 0.75rem;
                        white-space: pre-wrap !important;
                        word-wrap: break-word !important;
                        margin: 2rem 0;
                    }
                    
                    article code {
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        white-space: pre-wrap !important;
                        font-size: 0.9em;
                    }
                    
                    /* Iframes et vidéos */
                    article iframe, article video, article embed, article object {
                        max-width: 100% !important;
                        width: 100% !important;
                        height: auto !important;
                        margin: 2rem 0;
                    }
                    
                    /* Listes */
                    article ul, article ol {
                        padding-right: 2rem;
                        padding-left: 0;
                        max-width: 100% !important;
                        margin: 1.5rem 0;
                    }
                    
                    article li {
                        margin-bottom: 0.75rem;
                        line-height: 1.8;
                    }
                    
                    /* Titres */
                    article h1, article h2, article h3, article h4, article h5, article h6 {
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        max-width: 100% !important;
                        margin-top: 2.5rem;
                        margin-bottom: 1.5rem;
                        line-height: 1.4;
                    }
                    
                    article h1 { font-size: 2rem; }
                    article h2 { font-size: 1.75rem; }
                    article h3 { font-size: 1.5rem; }
                    
                    /* Blockquotes */
                    article blockquote {
                        border-right: 4px solid #000;
                        padding-right: 1.5rem;
                        margin: 2rem 0;
                        font-style: italic;
                        color: #4b5563;
                    }
                    
                    /* Responsive mobile */
                    @media (max-width: 640px) {
                        article {
                            font-size: 1rem !important;
                        }
                        article h1 { font-size: 1.5rem !important; }
                        article h2 { font-size: 1.35rem !important; }
                        article h3 { font-size: 1.2rem !important; }
                        article img {
                            margin: 1.5rem auto !important;
                            border-radius: 0.5rem;
                        }
                        article table {
                            font-size: 0.875rem !important;
                        }
                        article pre {
                            padding: 1rem !important;
                            font-size: 0.875rem !important;
                        }
                        article ul, article ol {
                            padding-right: 1.25rem;
                        }
                    }
                    
                    /* Responsive desktop large */
                    @media (min-width: 1024px) {
                        article {
                            font-size: 1.125rem !important;
                        }
                        article p {
                            margin-bottom: 2rem;
                        }
                    }
                `}</style>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200" dir="rtl">
                        <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4 flex items-center">
                            <HiTag className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                            𞤚𞤢𞤺𞤫
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {article.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Share Section */}
                <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-8" dir="rtl">
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">𞤧𞤢𞤪𞤫 𞤃𞤢𞤦𞤢𞤤 𞤲𞤣𞤫</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <button
                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                        >
                            Facebook
                        </button>
                        <button
                            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                            className="bg-sky-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-sky-600 transition-colors font-medium text-sm sm:text-base"
                        >
                            Twitter
                        </button>
                        <button
                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`, '_blank')}
                            className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                        >
                            WhatsApp
                        </button>
                        <button
                            onClick={handleShare}
                            className="bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
                        >
                            𞤂𞤭𞤲𞤳 𞤳𞤮𞤨𞤭
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 bg-black text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 z-40"
                >
                    <HiArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
            )}
        </div>
    );
};

export default ArticleDetail;