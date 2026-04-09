import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../App';
import { User, Mail, MapPin, Briefcase, Save } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    career_goal: user?.career_goal || '',
    location: user?.location || '',
    experience_years: user?.experience_years || 0
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/profile`,
        formData,
        { withCredentials: true }
      );
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

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
            My Profile
          </h1>
          <p className="text-[#A1A1AA]">Manage your personal information</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-8"
        >
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-[#00f2fe]/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center">
                <User className="w-12 h-12 text-black" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
              <p className="text-[#A1A1AA] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                data-testid="profile-name-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Bio</label>
              <textarea
                data-testid="profile-bio-input"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Career Goal</label>
              <input
                type="text"
                data-testid="profile-career-goal-input"
                value={formData.career_goal}
                onChange={(e) => setFormData({ ...formData, career_goal: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50"
                placeholder="e.g., Senior Data Scientist"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Experience (Years)</label>
                <input
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            {!isEditing ? (
              <button
                data-testid="edit-profile-button"
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-8 py-4 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      bio: user?.bio || '',
                      career_goal: user?.career_goal || '',
                      location: user?.location || '',
                      experience_years: user?.experience_years || 0
                    });
                  }}
                  className="flex-1 bg-white/5 border border-white/10 text-white rounded-full px-8 py-4 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  data-testid="save-profile-button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-8 py-4 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;