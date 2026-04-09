import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, User, Send } from 'lucide-react';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/community/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;

    try {
      await axios.post(
        `${BACKEND_URL}/api/community/posts`,
        { content: newPost },
        { withCredentials: true }
      );
      setNewPost('');
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Community Feed
          </h1>
          <p className="text-[#A1A1AA]">Share your achievements and connect</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6 mb-8"
        >
          <div className="flex gap-4">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center">
                <User className="w-6 h-6 text-black" />
              </div>
            )}
            <div className="flex-1">
              <textarea
                data-testid="new-post-textarea"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your learning journey..."
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  data-testid="post-button"
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-6 py-2 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">User</p>
                    <p className="text-sm text-[#A1A1AA]">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-white mb-4">{post.content}</p>

                <div className="flex items-center gap-6 text-sm text-[#A1A1AA]">
                  <button className="flex items-center gap-2 hover:text-[#EF4444] transition-colors">
                    <Heart className="w-5 h-5" />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    {post.comments_count}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <MessageSquare className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
              <p className="text-[#A1A1AA]">No posts yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;