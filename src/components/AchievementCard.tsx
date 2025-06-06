import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { convertGoogleDriveUrl } from '../utils/imageUtils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url?: string;
  is_approved: boolean;
  created_at: string;
  awarded_by?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-lg shadow-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {achievement.title}
          </h3>
        </div>
        
        <p className={`mb-4 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {achievement.description}
        </p>
        
        {achievement.image_url && (
          <div className="mb-4">
            <img
              src={convertGoogleDriveUrl(achievement.image_url)}
              alt={achievement.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        
        {achievement.awarded_by && (
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Awarded By: {achievement.awarded_by}
          </p>
        )}
        
        <div className={`flex justify-between items-center text-sm mt-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <span>
            {new Date(achievement.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard; 