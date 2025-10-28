import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';

// --- (1) MOCK DATA & INITIAL STATE ---

// This is our initial "database" of NGOs.
// On first load, this will be put into localStorage.
const INITIAL_NGOS = [
  {
    id: "ngo-1",
    name: "Educate Girls",
    category: "Education",
    description: "Driving community-based programs for girls' education in India's rural villages.",
    longDescription: "Educate Girls is a non-profit organization that focuses on mobilizing communities for girls’ education in India's rural and educationally backward areas. By leveraging existing government and community resources, we aim to ensure that all girls are in school and learning well.",
    logoUrl: "https://placehold.co/100x100/4299E1/white?text=EG",
    donationLink: "https://www.example.com", // Placeholder link
    verified: true,
    flagCount: 0
  },
  {
    id: "ngo-2",
    name: "Wildlife SOS",
    category: "Animals",
    description: "Rescuing and rehabilitating wildlife in distress and preserving India's natural heritage.",
    longDescription: "Wildlife SOS was established to make a lasting change to protect and conserve India’s natural heritage, forest and wildlife wealth. We actively run wildlife rescue and rehabilitation centres across India.",
    logoUrl: "https://placehold.co/100x100/48BB78/white?text=WS",
    donationLink: "https://www.example.com", // Placeholder link
    verified: true,
    flagCount: 1
  },
  {
    id: "ngo-3",
    name: "HelpAge India",
    category: "Health",
    description: "Working for the cause and care of disadvantaged older persons in India.",
    longDescription: "HelpAge India is a leading charity in India working with and for disadvantaged elderly for nearly 4 decades. It was set up in 1978 and is registered under the Societies’ Registration Act of 1860.",
    logoUrl: "https://placehold.co/100x100/ED8936/white?text=HI",
    donationLink: "https://www.example.com", // Placeholder link
    verified: false,
    flagCount: 0
  },
  {
    id: "ngo-4",
    name: "GreenFuture Collective",
    category: "Environment",
    description: "Planting trees and running clean-up drives in urban areas.",
    longDescription: "GreenFuture Collective is a community-led initiative to combat urban pollution. We organize weekly tree planting and river clean-up drives, funded entirely by community donations.",
    logoUrl: "https://placehold.co/100x100/38A169/white?text=GC",
    donationLink: "https://www.example.com", // Placeholder link
    verified: true,
    flagCount: 0
  },
  {
    id: "ngo-5",
    name: "Tech For All",
    category: "Education",
    description: "Providing refurbished laptops and coding bootcamps to underprivileged students.",
    longDescription: "We believe in leveling the playing field. Tech For All collects used electronics, refurbishes them, and distributes them to students in need. We also run free coding bootcamps on weekends.",
    logoUrl: "https://placehold.co/100x100/3182CE/white?text=TFA",
    donationLink: "https://www.example.com", // Placeholder link
    verified: false,
    flagCount: 0
  },
  {
    id: "ngo-6",
    name: "Suspicious Foundation",
    category: "Health",
    description: "Appears to be inactive. Website is down. (Test for flagging).",
    longDescription: "This is a test NGO entry to demonstrate the flagging system. It has a high flag count and will display a warning badge. The website links are intentionally broken.",
    logoUrl: "https://placehold.co/100x100/E53E3E/white?text=SF",
    donationLink: "#",
    verified: false,
    flagCount: 5
  }
];

// --- (2) INLINE SVG ICONS ---
// Using inline SVGs to avoid external icon libraries

const IconHeart = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
);

const IconHeartOutline = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
);

const IconFlag = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"></path></svg>
);

const IconCheckCircle = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
);

const IconWarning = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
);

const IconSun = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
);

const IconMoon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
);

const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

const IconArrowLeft = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
);

const IconExternalLink = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
);

// --- (3) LOCALSTORAGE HOOK ---

/**
 * A custom hook to write to localStorage
 * @param {string} key - The key to store in localStorage
 * @param {*} defaultValue - The initial value if nothing is in localStorage
 */
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    let currentValue;
    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue)
      );
    } catch (error) {
      currentValue = defaultValue;
    }
    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

// --- (4) APP CONTEXT ---
// Provides global state to all components

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [ngos, setNgos] = useLocalStorage('givify_ngos', INITIAL_NGOS);
  const [flags, setFlags] = useLocalStorage('givify_flagReports', []);
  const [favorites, setFavorites] = useLocalStorage('givify_userFavorites', []);
  const [theme, setTheme] = useLocalStorage('givify_theme', 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const submitFlag = (ngoId, reason, comment) => {
    // 1. Add new flag report
    const newFlag = {
      reportId: `flag-${Date.now()}`,
      ngoId,
      reason,
      comment,
      timestamp: new Date().toISOString()
    };
    setFlags(prevFlags => [...prevFlags, newFlag]);

    // 2. Increment flagCount on the NGO
    setNgos(prevNgos =>
      prevNgos.map(ngo =>
        ngo.id === ngoId ? { ...ngo, flagCount: (ngo.flagCount || 0) + 1 } : ngo
      )
    );
  };

  const registerNgo = (ngoData) => {
    const newNgo = {
      ...ngoData,
      id: `ngo-${Date.now()}`,
      verified: false,
      flagCount: 0,
      logoUrl: ngoData.logoUrl || `https://placehold.co/100x100/gray/white?text=${ngoData.name.substring(0, 2)}`
    };
    // Add the new NGO to the beginning of the list
    setNgos(prevNgos => [newNgo, ...prevNgos]);
  };

  const toggleFavorite = (ngoId) => {
    setFavorites(prevFavs =>
      prevFavs.includes(ngoId)
        ? prevFavs.filter(id => id !== ngoId) // Remove
        : [...prevFavs, ngoId] // Add
    );
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    ngos,
    flags,
    favorites,
    theme,
    submitFlag,
    registerNgo,
    toggleFavorite,
    toggleTheme
  }), [ngos, flags, favorites, theme]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to easily consume the context
const useAppContext = () => useContext(AppContext);

// --- (5) REUSABLE COMPONENTS ---

/**
 * Header Component
 * Contains navigation and theme toggle
 */
const Header = ({ setRoute, onRegisterClick }) => {
  const { theme, toggleTheme } = useAppContext();

  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors";
  const activeLinkClasses = "bg-gray-900 text-white";
  const inactiveLinkClasses = "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  // Note: Since we're not using a router, we can't easily get the "active" state.
  // This is a limitation of single-file apps without react-router.
  // We'll just style them as clickable.

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div
              className="flex-shrink-0 text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
              onClick={() => setRoute({ page: 'home' })}
            >
              Givify
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => setRoute({ page: 'home' })}
                  className={`${navLinkClasses} ${inactiveLinkClasses}`}
                >
                  All NGOs
                </button>
                <button
                  onClick={() => setRoute({ page: 'favorites' })}
                  className={`${navLinkClasses} ${inactiveLinkClasses}`}
                >
                  My Favorites
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRegisterClick}
              className="hidden sm:block bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Register NGO
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <IconMoon /> : <IconSun />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * Search Bar Component
 */
const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search for an NGO by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
    </div>
  );
};

/**
 * Category Filter Component
 */
const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
            ${selectedCategory === category
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

/**
 * NGO Card Component
 * Displays a single NGO's summary
 */
const NgoCard = ({ ngo, setRoute, onDonateClick }) => {
  const { favorites, toggleFavorite } = useAppContext();
  const isFavorite = favorites.includes(ngo.id);
  const REPORT_THRESHOLD = 1; // <-- UPDATED from 3 to 1

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <img
            src={ngo.logoUrl}
            alt={`${ngo.name} logo`}
            className="w-16 h-16 rounded-full border-2 border-gray-100 dark:border-gray-600"
            onError={(e) => { e.target.src = 'https://placehold.co/100x100/gray/white?text=Error'; }}
          />
          <button
            onClick={() => toggleFavorite(ngo.id)}
            className={`p-2 rounded-full transition-colors ${isFavorite
                ? 'text-red-500 bg-red-100 dark:bg-red-900'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <IconHeart className="w-5 h-5" /> : <IconHeartOutline className="w-5 h-5" />}
          </button>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{ngo.name}</h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 my-2">
          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
            {ngo.category}
          </span>

          {/* Feature: Verification Badge */}
          {ngo.verified && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
              <IconCheckCircle className="w-4 h-4" /> Verified
            </span>
          )}

          {/* Feature: Community Report Badge */}
          {ngo.flagCount >= REPORT_THRESHOLD && (
            <span className="flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
              <IconWarning className="w-4 h-4" /> Reported
            </span>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{ngo.description}</p>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => setRoute({ page: 'detail', id: ngo.id })}
            className="flex-1 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onDonateClick(ngo)}
            className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * NGO List Component
 * Renders a grid of NGO cards
 */
const NgoList = ({ ngos, setRoute, onDonateClick }) => {
  if (ngos.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No NGOs found.</h3>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {ngos.map(ngo => (
        <NgoCard
          key={ngo.id}
          ngo={ngo}
          setRoute={setRoute}
          onDonateClick={onDonateClick}
        />
      ))}
    </div>
  );
};

/**
 * RegisterNgo Modal Component
 * Modal for registering a new NGO
 */
const RegisterNgoModal = ({ isOpen, onClose }) => {
  const { registerNgo } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    description: '',
    longDescription: '',
    donationLink: '',
    logoUrl: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.description || !formData.donationLink) {
      alert('Please fill in all required fields: Name, Category, Description, and Donation Link.');
      return;
    }
    registerNgo(formData);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset modal state after closing animation
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '', category: 'Other', description: '',
        longDescription: '', donationLink: '', logoUrl: ''
      });
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4 transition-transform transform duration-300 scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
      >
        {isSubmitted ? (
          <div className="text-center">
            <IconCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Registration Submitted</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you! Your NGO has been added to the list. It will appear as "unverified" until reviewed.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Register your NGO</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">NGO Name*</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category*</label>
                <select name="category" id="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option>Education</option>
                  <option>Animals</option>
                  <option>Health</option>
                  <option>Environment</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Short Description*</label>
                <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="A one-sentence summary." />
              </div>

              <div>
                <label htmlFor="longDescription" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Description</label>
                <textarea name="longDescription" id="longDescription" rows="3" value={formData.longDescription} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Tell donors more about your mission."></textarea>
              </div>

              <div>
                <label htmlFor="donationLink" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Donation Link*</label>
                <input type="url" name="donationLink" id="donationLink" value={formData.donationLink} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="https://www.example.com/donate" />
              </div>

              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Logo URL (Optional)</label>
                <input type="url" name="logoUrl" id="logoUrl" value={formData.logoUrl} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="https://www.example.com/logo.png" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};


/**
 * Donate Modal Component
 * Warns user before redirecting to external site
 */
const DonateModal = ({ isOpen, onClose, ngo }) => {
  if (!isOpen) return null;

  const handleDonate = () => {
    window.open(ngo.donationLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4 transition-transform transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">You are leaving Givify</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You are being redirected to the official donation page for <strong className="font-medium text-gray-800 dark:text-white">{ngo.name}</strong>. We link to official sites, but please verify the URL before donating.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <a
            href={ngo.donationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDonate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Continue to Donate <IconExternalLink />
          </a>
        </div>
      </div>
    </div>
  );
};

// --- (6) PAGE COMPONENTS ---

/**
 * Home Page
 * The main landing page with search, filters, and list
 */
const HomePage = ({ setRoute, onDonateClick }) => {
  const { ngos } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => ['All', ...new Set(ngos.map(ngo => ngo.category))], [ngos]);

  const filteredNgos = useMemo(() =>
    ngos
      .filter(ngo =>
        selectedCategory === 'All' || ngo.category === selectedCategory
      )
      .filter(ngo =>
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [ngos, selectedCategory, searchTerm]
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find an NGO to Support</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Browse our directory of verified and community-vetted non-profits.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-grow">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="flex-shrink-0">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      <NgoList
        ngos={filteredNgos}
        setRoute={setRoute}
        onDonateClick={onDonateClick}
      />
    </div>
  );
};

/**
 * Favorites Page
 * Shows only the NGOs favorited by the user
 */
const FavoritesPage = ({ setRoute, onDonateClick }) => {
  const { ngos, favorites } = useAppContext();

  const favoritedNgos = useMemo(() =>
    ngos.filter(ngo => favorites.includes(ngo.id)),
    [ngos, favorites]
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Favorites</h1>
      {favoritedNgos.length > 0 ? (
        <NgoList
          ngos={favoritedNgos}
          setRoute={setRoute}
          onDonateClick={onDonateClick}
        />
      ) : (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <IconHeartOutline className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No favorites yet.</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Click the heart on an NGO to save it here.</p>
          <button
            onClick={() => setRoute({ page: 'home' })}
            className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Browse NGOs
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * NGO Detail Page
 * Shows more information about a single NGO
 */
const NgoDetailPage = ({ ngoId, setRoute }) => {
  const { ngos, submitFlag, favorites, toggleFavorite } = useAppContext();
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

  const ngo = useMemo(() =>
    ngos.find(n => n.id === ngoId),
    [ngos, ngoId]
  );

  if (!ngo) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">NGO not found.</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">The NGO you're looking for doesn't seem to exist.</p>
        <button
          onClick={() => setRoute({ page: 'home' })}
          className="text-blue-500 hover:underline"
        >
          &larr; Back to Home
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(ngo.id);
  const REPORT_THRESHOLD = 1; // <-- UPDATED from 3 to 1

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <button
          onClick={() => setRoute({ page: 'home' })}
          className="flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-6 font-medium hover:underline"
        >
          <IconArrowLeft /> Back to list
        </button>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={ngo.logoUrl}
                    alt={`${ngo.name} logo`}
                    className="w-20 h-20 rounded-full border-4 border-gray-100 dark:border-gray-700"
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100/gray/white?text=Error'; }}
                  />
                  <div>
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                      {ngo.category}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{ngo.name}</h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 my-4">
                  {ngo.verified && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                      <IconCheckCircle /> Verified Partner
                    </span>
                  )}
                  {ngo.flagCount >= REPORT_THRESHOLD && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      <IconWarning /> {ngo.flagCount >= 3 ? 'Community Reported' : 'Reported'}
                    </span>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {ngo.flagCount} {ngo.flagCount === 1 ? 'Report' : 'Reports'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(ngo.id)}
                className={`flex-shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-md border text-sm font-medium transition-colors ${isFavorite
                    ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
              >
                {isFavorite ? <IconHeart /> : <IconHeartOutline />}
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About {ngo.name}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {ngo.longDescription || ngo.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href={ngo.donationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors"
              >
                Donate Now <IconExternalLink />
              </a>

              <button
                onClick={() => setIsFlagModalOpen(true)}
                className="flex-1 flex justify-center items-center gap-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-6 py-3 rounded-lg text-base font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <IconFlag /> Report NGO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attach the modal */}
      <FlagModal
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        ngo={ngo}
        submitFlag={submitFlag}
      />
    </>
  );
};

// --- (7) MAIN APP COMPONENT ---

/**
 * The root Application component
 */
export default function App() {
  // State for routing: { page: 'home' | 'favorites' | 'detail', id: 'ngo-id' | null }
  const [route, setRoute] = useState({ page: 'home', id: null });

  // State for the donation warning modal
  const [donateModal, setDonateModal] = useState({ isOpen: false, ngo: null });

  // State for the register NGO modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleDonateClick = (ngo) => {
    setDonateModal({ isOpen: true, ngo: ngo });
  };

  const handleCloseDonateModal = () => {
    setDonateModal({ isOpen: false, ngo: null });
  };

  // Function to render the correct page based on route state
  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <HomePage setRoute={setRoute} onDonateClick={handleDonateClick} />;
      case 'favorites':
        return <FavoritesPage setRoute={setRoute} onDonateClick={handleDonateClick} />;
      case 'detail':
        return <NgoDetailPage ngoId={route.id} setRoute={setRoute} />;
      default:
        return <HomePage setRoute={setRoute} onDonateClick={handleDonateClick} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header
          setRoute={setRoute}
          onRegisterClick={() => setIsRegisterModalOpen(true)}
        />
        <main>
          {renderPage()}
        </main>

        <footer className="text-center py-6 mt-12 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Givify. All rights reserved.
          </p>
        </footer>

        <DonateModal
          isOpen={donateModal.isOpen}
          onClose={handleCloseDonateModal}
          ngo={donateModal.ngo}
        />

        <RegisterNgoModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      </div>
    </AppProvider>
  );
}

// --- (8) MISSING FLAGMODAL COMPONENT ---
// I've added this component as it was used but not defined.

const FlagModal = ({ isOpen, onClose, ngo, submitFlag }) => {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) {
      alert('Please select a reason for the report.');
      return;
    }
    submitFlag(ngo.id, reason, comment);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset state after modal closes
    setTimeout(() => {
      setIsSubmitted(false);
      setReason('');
      setComment('');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4 transition-transform transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {isSubmitted ? (
          <div className="text-center">
            <IconCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Report Submitted</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for your feedback. We will review this report for {ngo.name}.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Report {ngo.name}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Reason for reporting*</label>
                <select
                  name="reason"
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a reason...</option>
                  <option value="broken-link">Broken donation link</option>
                  <option value="inactive">NGO appears inactive</option>
                  <option value="scam">Suspicious or fraudulent</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Additional Comments (Optional)</label>
                <textarea
                  name="comment"
                  id="comment"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Please provide any additional details."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};