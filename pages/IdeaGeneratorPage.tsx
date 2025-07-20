import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '../components/icons';

const API_URL = '/api';

interface VideoIdea {
  title: string;
  description: string;
  tags: string[];
}

export const IdeaGeneratorPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const generateIdeas = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to generate ideas.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const response = await fetch(`${API_URL}/generate-ideas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || 'An error occurred while generating ideas.');
      }
      
      if (jsonResponse.video_ideas && Array.isArray(jsonResponse.video_ideas)) {
          setIdeas(jsonResponse.video_ideas);
      } else {
          throw new Error("Invalid response format from server.");
      }

    } catch (e: unknown) {
      console.error("Failed to generate ideas:", e);
      setError(e instanceof Error ? `An error occurred: ${e.message}` : "An unknown error occurred. Check the console for details.");
    } finally {
      setLoading(false);
    }
  }, [topic]);

  const handleUseIdea = (idea: VideoIdea) => {
    navigate('/create', { state: { title: idea.title, tags: idea.tags } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateIdeas();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <SparklesIcon className="h-12 w-12 mx-auto text-indigo-400 mb-2" />
        <h1 className="text-4xl font-bold text-white">AI Video Idea Generator</h1>
        <p className="text-lg text-gray-400 mt-2">Stuck for ideas? Let AI be your creative partner.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg flex items-center gap-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
          placeholder="Enter a topic, e.g., 'healthy breakfast recipes'"
          disabled={loading}
          aria-label="Video topic"
        />
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="px-6 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition disabled:bg-indigo-400/50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg shrink-0"
        >
          {loading ? (
            <div role="status" className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              <span>Generate</span>
            </div>
          )}
        </button>
      </form>
      
      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md mb-8 text-center">{error}</div>}

      <div className="space-y-6">
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-800 p-6 rounded-lg animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
            ))}
          </div>
        )}
        
        {ideas.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {ideas.map((idea, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-indigo-500 transition-colors duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <h3 className="text-2xl font-bold text-indigo-400 mb-2">{idea.title}</h3>
                <p className="text-gray-300 mb-4">{idea.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.map((tag) => (
                    <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleUseIdea(idea)}
                  className="mt-2 px-4 py-2 text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition"
                >
                  Use this Idea
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};