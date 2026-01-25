import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiHome, HiChevronLeft, HiHeart, HiOutlineHeart, HiShare, HiClock, HiOutlineBookOpen, HiMenu } from 'react-icons/hi';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import { apiService } from '../services/apiService';
import CommentsSection from '../components/CommentsSection';
import TableOfContents from '../components/TableOfContents';
import ReadingProgress from '../components/ReadingProgress';
import SimilarArticles from '../components/SimilarArticles';

const ArticleDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [readingProgress, setReadingProgress] = useState(0);
    const [showTOC, setShowTOC] = useState(false);

    useEffect(() => {
        fetchArticle();
        // Ajouter le scroll listener pour la barre de progression
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const response = await apiService.articles.getBySlug(slug);
            setArticle(response.data.article);
            setLikesCount(response.data.article.likes || 0);
        } catch (error) {
            console.error('Error fetching article:', error);
            // Rediriger si l'article n'existe pas
            if (error.response?.status === 404) {
                navigate('/articles');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            // Toggle like localement
            setLiked(!liked);
            setLikesCount(prev => liked ? prev - 1 : prev + 1);

            // Appeler l'API (à implémenter)
            // await apiService.articles.toggleLike(article._id);
        } catch (error) {
            console.error('Error toggling like:', error);
            // Reverser en cas d'erreur
            setLiked(!liked);
            setLikesCount(prev => liked ? prev + 1 : prev - 1);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt,
                url: window.location.href
            });
        } else {
            // Copier le lien
            navigator.clipboard.writeText(window.location.href);
            alert('𞤂𞤭𞤲𞤳 𞤳𞤮𞤨𞤭𞤲𞤢𞤲!');
        }
    };

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 150; // Vitesse de lecture moyenne
        const text = content.replace(/<[^>]*>/g, ''); // Enlever les balises HTML
        const words = text.length / 6; // Approximation mots en arabe/adlam
        return Math.ceil(words / wordsPerMinute);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
        <>
            {/* Barre de progression de lecture */}
            <ReadingProgress progress={readingProgress} />
            
            <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 space-x-reverse text-sm" dir="rtl">
                        <Link to="/" className="text-gray-500 hover:text-black flex items-center">
                            <HiHome className="h-4 w-4 ml-1" />
                            𞤀𞤧𞤵𞤤
                        </Link>
                        <HiChevronLeft className="h-4 w-4 text-gray-400" />
                        <Link to="/articles" className="text-gray-500 hover:text-black">
                            𞤃𞤢𞤦𞤢𞤤𞤫
                        </Link>
                        <HiChevronLeft className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 truncate max-w-xs">{article.title}</span>
                    </nav>
                </div>
            </div>

            {/* Hero Image */}
            {article.coverImage && (
                <div className="relative w-full h-96 bg-gray-100 overflow-hidden">
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Bouton TOC mobile */}
                    <button
                        onClick={() => setShowTOC(!showTOC)}
                        className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg md:hidden"
                    >
                        <HiMenu className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* Article Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Table des matières - Desktop */}
                    <div className="hidden lg:block lg:col-span-1">
                        <TableOfContents content={article.content} />
                    </div>
                    
                    {/* Contenu principal */}
                    <article className="lg:col-span-3">
                {/* Category & Date */}
                <div className="flex items-center justify-between mb-6" dir="rtl">
                    <span className="inline-block bg-black text-white px-3 py-1 text-sm font-medium">
                        {article.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                        {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight" dir="rtl">
                    {article.title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center justify-between border-y border-gray-200 py-4 mb-8" dir="rtl">
                    <div className="flex items-center space-x-6 space-x-reverse text-gray-600">
                        <span className="flex items-center">
                            <HiClock className="h-5 w-5 ml-2" />
                            {calculateReadingTime(article.content)} 𞤣𞤢𞤳𞤭𞤳𞤢
                        </span>
                        <button
                            onClick={handleLike}
                            className="flex items-center hover:text-red-600 transition-colors"
                        >
                            {liked ? (
                                <HiHeart className="h-5 w-5 ml-2 text-red-600" />
                            ) : (
                                <HiOutlineHeart className="h-5 w-5 ml-2" />
                            )}
                            {likesCount}
                        </button>
                    </div>

                    <button
                        onClick={handleShare}
                        className="flex items-center text-gray-600 hover:text-black transition-colors"
                    >
                        <HiShare className="h-5 w-5 ml-2" />
                        𞤧𞤢𞤪𞤫
                    </button>
                </div>

                {/* Excerpt */}
                {article.excerpt && (
                    <div className="bg-gray-50 border-l-4 border-black p-6 mb-8" dir="rtl">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {article.excerpt}
                        </p>
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none"
                    dir="rtl"
                    style={{
                        fontFamily: 'Noto Sans Adlam, sans-serif',
                        textAlign: 'right'
                    }}
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200" dir="rtl">
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-gray-200" dir="rtl">
                    <h3 className="text-lg font-bold text-black mb-4">𞤧𞤢𞤪𞤫 𞤃𞤢𞤦𞤢𞤤 𞤲𞤣𞤫</h3>
                    <div className="flex flex-wrap gap-4">
                        <FacebookShareButton
                            url={window.location.href}
                            title={article.title}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            Facebook
                        </FacebookShareButton>
                        <TwitterShareButton
                            url={window.location.href}
                            title={article.title}
                            className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center"
                        >
                            Twitter
                        </TwitterShareButton>
                        <WhatsappShareButton
                            url={window.location.href}
                            title={article.title}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                            WhatsApp
                        </WhatsappShareButton>
                        <button
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            𞤂𞤭𞤲𞤳 𞤳𞤮𞤨𞤭𞤲𞤢𞤲
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <CommentsSection articleId={article._id} />
                
                {/* Similar Articles */}
                <SimilarArticles categoryId={article.category} currentArticleId={article._id} />
                    </article>
                </div>
                
                {/* TOC Mobile */}
                {showTOC && (
                    <div className="lg:hidden fixed inset-0 z-50 bg-white">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">𞤚𞤢𞤥𞤵𞤤𞤫 𞤥𞤢𞤲𞤭𞤲𞤢𞥄𞤲</h3>
                                <button
                                    onClick={() => setShowTOC(false)}
                                    className="text-gray-500 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>
                            <TableOfContents content={article.content} mobile={true} />
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default ArticleDetail;
