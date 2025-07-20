
import React from 'react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

const formatViews = (views: number): string => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K views`;
    return `${views} views`;
};

const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const paddedS = s < 10 ? `0${s}` : s;
    const paddedM = m < 10 && h > 0 ? `0${m}` : m;

    if (h > 0) {
        return `${h}:${paddedM}:${paddedS}`;
    }
    return `${m}:${paddedS}`;
};

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formattedDate = new Date(video.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
      <div className="relative">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-100 mb-2 truncate group-hover:text-indigo-400">{video.title}</h3>
        <div className="text-sm text-gray-400 mb-3">
          <span>{formatViews(video.views)}</span> &bull; <span>{formattedDate}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-auto">
          {video.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
