
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useVideos } from '../contexts/VideoContext';
import { VideoCard } from '../components/VideoCard';
import { Video } from '../types';
import { PlusIcon, VideoCameraIcon, LightBulbIcon } from '../components/icons';

type SortOrder = 'newest' | 'oldest';

export const VideoListPage: React.FC = () => {
  const { videos, loading, error } = useVideos();
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const sortedVideos = useMemo(() => {
    const sorted = [...videos].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [videos, sortOrder]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
        <div className="text-center py-20 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
            <h2 className="text-2xl font-semibold text-white">Failed to Load Videos</h2>
            <p className="mt-2 text-red-200">{error}</p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Video Library</h1>
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2.5 appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
           </div>
        </div>
      </div>
      
      {sortedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedVideos.map((video: Video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-800 rounded-lg">
            <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-500" />
            <h2 className="mt-2 text-2xl font-semibold text-white">No videos yet</h2>
            <p className="mt-1 text-gray-400">Your video library is empty.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
                <Link to="/create" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add First Video</span>
                </Link>
                <Link to="/ideas" className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors font-semibold">
                    <LightBulbIcon className="h-5 w-5" />
                    <span>Get AI Ideas</span>
                </Link>
            </div>
        </div>
      )}
    </div>
  );
};
