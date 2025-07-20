import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PlusIcon, VideoCameraIcon, LightBulbIcon } from './icons';

export const Header: React.FC = () => {
  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-gray-700 text-white'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-lg mb-8">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <VideoCameraIcon className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold text-white">VideoLib</span>
          </Link>
          <div className="flex items-center gap-2">
            <NavLink to="/" end className={navLinkStyle}>
              Library
            </NavLink>
            <NavLink to="/ideas" className={navLinkStyle}>
              <LightBulbIcon className="h-5 w-5" />
              <span>Generate Ideas</span>
            </NavLink>
            <Link
              to="/create"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Video</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};