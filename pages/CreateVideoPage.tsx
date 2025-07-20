
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVideos } from '../contexts/VideoContext';
import { XIcon } from '../components/icons';

export const CreateVideoPage: React.FC = () => {
  const { state } = useLocation();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<{ title?: string; tags?: string }>({});
  const { addVideo, addingVideo, addVideoError } = useVideos();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.title) {
        setTitle(state.title);
    }
    if (state?.tags) {
        setTags(state.tags);
    }
  }, [state]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim() !== '') {
      e.preventDefault();
      const newTag = currentTag.trim().toLowerCase();
      if (tags.length >= 10) {
        setErrors({ ...errors, tags: 'You can add a maximum of 10 tags.' });
        return;
      }
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setErrors({ ...errors, tags: undefined }); // Clear tag error
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; tags?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title cannot be longer than 100 characters.';
    }
    if (tags.length > 10) {
      newErrors.tags = 'You can add a maximum of 10 tags.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const success = await addVideo({ title: title.trim(), tags });
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-6">Create New Video</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg shadow-xl">
        <fieldset disabled={addingVideo} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Video Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full bg-gray-700 border text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 transition ${errors.title ? 'border-red-500' : 'border-gray-600'}`}
                placeholder="e.g., My Awesome Travel Vlog"
                aria-invalid={!!errors.title}
                aria-describedby="title-error"
              />
              {errors.title && <p id="title-error" className="text-red-400 text-sm mt-2">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                Tags (up to 10)
              </label>
              <input
                type="text"
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                className={`w-full bg-gray-700 border text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 transition ${errors.tags ? 'border-red-500' : 'border-gray-600'}`}
                placeholder="Type a tag and press Enter"
                aria-describedby='tags-error'
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center bg-indigo-500 text-white text-sm font-medium pl-3 pr-2 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-indigo-100 hover:text-white"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.tags && <p id="tags-error" className="text-red-400 text-sm mt-2">{errors.tags}</p>}
            </div>
        </fieldset>

        {addVideoError && <div className="text-red-400 text-sm text-center bg-red-900/50 p-3 rounded-md">{addVideoError}</div>}

        <div className="flex justify-end gap-4 pt-4">
            <button
                type="button"
                onClick={() => navigate('/')}
                disabled={addingVideo}
                className="px-6 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-500 transition disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={addingVideo}
                className="px-6 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition flex items-center justify-center w-36 disabled:bg-indigo-400/50 disabled:cursor-wait"
            >
                {addingVideo ? (
                    <div role="status" className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                   'Create Video'
                )}
            </button>
        </div>
      </form>
    </div>
  );
};