import { motion } from 'framer-motion';
import { Bell, Lock, Globe, Eye, Shield } from 'lucide-react';

const Settings = () => {
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
            Settings
          </h1>
          <p className="text-[#A1A1AA]">Manage your preferences and privacy</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#00f2fe]/10">
                <Bell className="w-6 h-6 text-[#00f2fe]" />
              </div>
              <h2 className="text-xl font-bold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                <span>Email notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                <span>New job matches</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                <span>Mentor messages</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#10B981]/10">
                <Shield className="w-6 h-6 text-[#10B981]" />
              </div>
              <h2 className="text-xl font-bold">Privacy</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                <span>Public profile</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                <span>Show progress on community</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                <span>Allow mentor requests</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#F59E0B]/10">
                <Lock className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h2 className="text-xl font-bold">Security</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full p-4 bg-black/30 rounded-xl text-left hover:bg-black/40 transition-all">
                Change Password
              </button>
              <button className="w-full p-4 bg-black/30 rounded-xl text-left hover:bg-black/40 transition-all">
                Two-Factor Authentication
              </button>
              <button className="w-full p-4 bg-black/30 rounded-xl text-left hover:bg-black/40 transition-all text-[#EF4444]">
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;