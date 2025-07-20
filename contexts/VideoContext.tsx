import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import { Video } from '../types';

const API_URL = '/api';

export interface VideoContextType {
  videos: Video[];
  loading: boolean;
  error: string | null;
  addVideo: (videoData: { title: string; tags: string[] }) => Promise<boolean>;
  addingVideo: boolean;
  addVideoError: string | null;
}

export const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingVideo, setAddingVideo] = useState<boolean>(false);
  const [addVideoError, setAddVideoError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/videos`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const videosData: Video[] = await response.json();
        setVideos(videosData);
      } catch (e) {
        console.error("Failed to load video data from server.", e);
        setError("We couldn't load the video library. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const addVideo = useCallback(async (videoData: { title: string; tags: string[] }): Promise<boolean> => {
    setAddingVideo(true);
    setAddVideoError(null);
    try {
      const response = await fetch(`${API_URL}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error! status: ${response.status}`);
      }

      const newVideo: Video = await response.json();
      setVideos(currentVideos => [newVideo, ...currentVideos]);
      return true; // Success
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while adding the video.";
      console.error("Failed to add video:", e);
      setAddVideoError(errorMessage);
      return false; // Failure
    } finally {
      setAddingVideo(false);
    }
  }, []);

  const value = { videos, loading, error, addVideo, addingVideo, addVideoError };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};

export const useVideos = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};