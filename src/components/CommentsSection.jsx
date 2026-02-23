import React, { useState, useEffect } from 'react';
import { HiChat, HiHeart, HiOutlineHeart, HiFlag, HiReply } from 'react-icons/hi';
import { apiService } from '../services/apiService';

const CommentsSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchComments();
  }, [articleId, sortBy]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await apiService.comments.getByArticle(articleId, { sort: sortBy });
      setComments(response.data.comments);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const commentData = {
        content: newComment,
        articleId,
        parentCommentId: null
      };

      await apiService.comments.create(commentData);
      setNewComment('');
      fetchComments();
    } catch (error) {
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      const replyData = {
        content: replyText,
        articleId,
        parentCommentId: commentId
      };

      await apiService.comments.create(replyData);
      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
    }
  };

  const handleLike = async (commentId) => {
    try {
      await apiService.comments.like(commentId);
      fetchComments();
    } catch (error) {
    }
  };

  const handleReport = async (commentId) => {
    try {
      await apiService.comments.report(commentId);
      alert('𞤅𞤭𞤧𞤼𞤫𞤥 𞤲𞤣𞤫 𞤸𞤢𞤤𞤭 𞤧𞤭𞤲𞤢𞤤𞤭𞥄𞤲');
    } catch (error) {
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '𞤸𞤢𞤤𞤭𞤲𞤣𞤫';
    if (diffMins < 60) return `𞤭𞤤𞤭 ${diffMins} 𞤣𞤢𞤳𞤭𞤳𞤢`;
    if (diffHours < 24) return `𞤭𞤤𞤭 ${diffHours} 𞤧𞤢𞥄𞤢𞥄`;
    return `𞤭𞤤𞤭 ${diffDays} 𞤴𞤮𞤪𞤭`;
  };

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-black flex items-center">
          <HiChat className="ml-3 h-6 w-6" />
          💬 𞤑𞤮𞤥𞤢𞤲𞤼𞤫𞤪𞤫 ({comments.length})
        </h3>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="recent">𞤀𞤤𞤣𞤭𞤥 𞤴𞤫𞤱𞤮𞥄𞤲</option>
          <option value="popular">𞤀𞤤𞤣𞤭𞤥 𞤆𞤫𞥄𞤪𞤭𞥄𞤲</option>
          <option value="oldest">𞤀𞤤𞤣𞤭𞤥 𞤳𞤵𞤣𞤭𞤥</option>
        </select>
      </div>

      {/* Formulaire d'ajout de commentaire */}
      <form onSubmit={handleSubmitComment} className="bg-gray-50 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-black mb-4">𞤀𞤬𞤭𞤲 𞤳𞤮𞤥𞤢𞤲𞤼𞤫𞤪𞤫</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="𞤔𞤢𞤤𞤢𞤲𞤣𞤫 𞤳𞤮𞤥𞤢𞤲𞤼𞤫𞤪𞤫 𞤥𞤢𞤲..."
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
          rows={4}
          dir="rtl"
        />
        
        <div className="mt-4 flex items-center justify-between">
          <HCaptcha
            sitekey="your-hcaptcha-sitekey"
            onVerify={setCaptchaToken}
          />
          
          <button
            type="submit"
            disabled={!newComment.trim() || !captchaToken}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            𞤐𞤵𞤦𞤭𞤪𞤫
          </button>
        </div>
      </form>

      {/* Liste des commentaires */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center ml-3">
                  <span className="text-black font-bold">
                    {comment.author?.name?.charAt(0) || '𞤢'}
                  </span>
                </div>
                <div>
                  <h5 className="font-bold text-black">
                    {comment.author?.name || '𞤃𞤢𞤶𞤭𞤥𞤭𞥄𞤲'}
                  </h5>
                  <p className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-gray-800 mb-4" dir="rtl">
              {comment.content}
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => handleLike(comment._id)}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                {comment.isLiked ? (
                  <HiHeart className="h-4 w-4 ml-1 text-red-600" />
                ) : (
                  <HiOutlineHeart className="h-4 w-4 ml-1" />
                )}
                {comment.likes || 0}
              </button>

              <button
                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                className="flex items-center text-gray-600 hover:text-black transition-colors"
              >
                <HiReply className="h-4 w-4 ml-1" />
                𞤪𞤭𞤥𞤢𞥄𞤣𞤭
              </button>

              <button
                onClick={() => handleReport(comment._id)}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <HiFlag className="h-4 w-4 ml-1" />
                𞤔𞤭𞤲𞤢𞤤𞤭𞥄𞤲
              </button>
            </div>

            {/* Formulaire de réponse */}
            {replyingTo === comment._id && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="𞤔𞤢𞤤𞤢𞤲𞤣𞤫 𞤪𞤭𞤥𞤢𞥄𞤣𞤭..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  dir="rtl"
                />
                <div className="mt-2 flex justify-end space-x-2 space-x-reverse">
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
                  >
                    𞤁𞤫𞥄𞤤𞤢𞤭
                  </button>
                  <button
                    onClick={() => handleReply(comment._id)}
                    disabled={!replyText.trim()}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    𞤐𞤵𞤦𞤭𞤪𞤫
                  </button>
                </div>
              </div>
            )}

            {/* Réponses */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-4 pr-8 border-r-2 border-gray-200">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ml-2">
                        <span className="text-black font-bold text-sm">
                          {reply.author?.name?.charAt(0) || '𞤢'}
                        </span>
                      </div>
                      <div>
                        <h6 className="font-bold text-black text-sm">
                          {reply.author?.name || '𞤃𞤢𞤶𞤭𞤥𞤭𞥄𞤲'}
                        </h6>
                        <p className="text-xs text-gray-500">
                          {formatDate(reply.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-800 text-sm" dir="rtl">
                      {reply.content}
                    </div>
                    <div className="mt-2 flex items-center space-x-3 space-x-reverse">
                      <button
                        onClick={() => handleLike(reply._id)}
                        className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm"
                      >
                        {reply.isLiked ? (
                          <HiHeart className="h-3 w-3 ml-1 text-red-600" />
                        ) : (
                          <HiOutlineHeart className="h-3 w-3 ml-1" />
                        )}
                        {reply.likes || 0}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <HiChat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            𞤢𞤬𞤭𞤲 𞤳𞤮𞤥𞤢𞤲𞤼𞤫𞤪𞤫 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫. 𞤔𞤵𞤲 𞤤𞤫𞥄𞤳𞤭𞤲𞤣𞤫 𞤢𞤬𞤭𞤲 𞤣𞤭𞤥𞤢𞥄𞤲!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
