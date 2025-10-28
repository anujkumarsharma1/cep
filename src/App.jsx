import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
// Make sure src/index.css is imported in main.jsx

// --- (1) MOCK DATA & INITIAL STATE ---
const INITIAL_NGOS = [
  {
    id: "ngo-1",
    name: "Educate Girls",
    category: "Education",
    description: "Driving community-based programs for girls' education in India's rural villages.",
    longDescription: "Educate Girls is a non-profit organization that focuses on mobilizing communities for girls’ education in India's rural and educationally backward areas. By leveraging existing government and community resources, we aim to ensure that all girls are in school and learning well.",
    logoUrl: "https://placehold.co/100x100/4299E1/white?text=EG",
    donationLink: "https://www.example.com",
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
    donationLink: "https://www.example.com",
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
    donationLink: "https://www.example.com",
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
    donationLink: "https://www.example.com",
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
    donationLink: "https://www.example.com",
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
// Removed default className, size can be controlled via CSS or direct props
const IconHeart = ({ size = "1.25em" }) => (
  <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
);

const IconHeartOutline = ({ size = "1.25em" }) => (
  <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
);

const IconFlag = ({ size = "1em" }) => (
    <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"></path></svg>
);

const IconCheckCircle = ({ size = "1em" }) => (
  <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
);

const IconWarning = ({ size = "1em" }) => (
    <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
);

const IconSun = ({ size = "1.5em" }) => (
    <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
);

const IconMoon = ({ size = "1.5em" }) => (
    <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
);

const IconSearch = ({ size = "1.25em" }) => (
  <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

const IconArrowLeft = ({ size = "1.25em" }) => (
  <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
);

const IconExternalLink = ({ size = "1em" }) => (
  <svg style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
);


// --- (3) LOCALSTORAGE HOOK ---
function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        let currentValue;
        try {
            const item = localStorage.getItem(key);
            currentValue = item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            currentValue = defaultValue;
        }
        return currentValue;
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    }, [value, key]);

    return [value, setValue];
}

// --- (4) APP CONTEXT ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [ngos, setNgos] = useLocalStorage('givify_ngos', INITIAL_NGOS);
    const [flags, setFlags] = useLocalStorage('givify_flagReports', []);
    const [favorites, setFavorites] = useLocalStorage('givify_userFavorites', []);
    const [theme, setTheme] = useLocalStorage('givify_theme', 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const submitFlag = (ngoId, reason, comment) => {
        const newFlag = { reportId: `flag-${Date.now()}`, ngoId, reason, comment, timestamp: new Date().toISOString() };
        setFlags(prevFlags => [...prevFlags, newFlag]);
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
        setNgos(prevNgos => [newNgo, ...prevNgos]);
    };

    const toggleFavorite = (ngoId) => {
        setFavorites(prevFavs =>
            prevFavs.includes(ngoId) ? prevFavs.filter(id => id !== ngoId) : [...prevFavs, ngoId]
        );
    };

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const value = useMemo(() => ({
        ngos, flags, favorites, theme,
        submitFlag, registerNgo, toggleFavorite, toggleTheme
    }), [ngos, flags, favorites, theme]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

// --- (5) REUSABLE COMPONENTS ---

const Header = ({ setRoute, onRegisterClick }) => {
    const { theme, toggleTheme } = useAppContext();
    return (
        <nav className="header-nav">
            <div className="container header-container">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="header-logo" onClick={() => setRoute({ page: 'home' })}>
                        Givify
                    </div>
                    <div className="header-links">
                        <button onClick={() => setRoute({ page: 'home' })} className="header-link-button">All NGOs</button>
                        <button onClick={() => setRoute({ page: 'favorites' })} className="header-link-button">My Favorites</button>
                    </div>
                </div>
                <div className="header-actions">
                    <button onClick={onRegisterClick} className="register-button button button-primary">Register NGO</button>
                    <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle dark mode">
                        {theme === 'light' ? <IconMoon /> : <IconSun />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search-bar-wrapper">
            <div className="search-icon-wrapper">
                <IconSearch />
            </div>
            <input
                type="text"
                placeholder="Search for an NGO by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
        </div>
    );
};

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="category-filter">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

const NgoCard = ({ ngo, setRoute, onDonateClick }) => {
    const { favorites, toggleFavorite } = useAppContext();
    const isFavorite = favorites.includes(ngo.id);
    const REPORT_THRESHOLD = 1;

    return (
        <div className="ngo-card">
            <div className="ngo-card-content">
                <div className="ngo-card-header">
                    <img
                        src={ngo.logoUrl}
                        alt={`${ngo.name} logo`}
                        className="ngo-card-logo"
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100/gray/white?text=Error'; }}
                    />
                    <button
                        onClick={() => toggleFavorite(ngo.id)}
                        className={`ngo-card-fav-button ${isFavorite ? 'favorited' : ''}`}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {isFavorite ? <IconHeart /> : <IconHeartOutline />}
                    </button>
                </div>
                <h3 className="ngo-card-title">{ngo.name}</h3>
                <div className="ngo-card-badges">
                    <span className="ngo-card-category-badge">{ngo.category}</span>
                    {ngo.verified && (
                        <span className="ngo-card-status-badge verified">
                            <IconCheckCircle size="1rem" /> Verified
                        </span>
                    )}
                    {ngo.flagCount >= REPORT_THRESHOLD && (
                        <span className="ngo-card-status-badge reported">
                            <IconWarning size="1rem" /> Reported
                        </span>
                    )}
                </div>
                <p className="ngo-card-description">{ngo.description}</p>
                <div className="ngo-card-actions">
                    <button onClick={() => setRoute({ page: 'detail', id: ngo.id })} className="ngo-card-button details">Details</button>
                    <button onClick={() => onDonateClick(ngo)} className="ngo-card-button donate">Donate</button>
                </div>
            </div>
        </div>
    );
};

const NgoList = ({ ngos, setRoute, onDonateClick }) => {
    if (ngos.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500 }}>No NGOs found.</h3>
                <p style={{ color: 'var(--secondary-text-light)' }}>Try adjusting your search or filters.</p>
            </div>
        );
    }
    return (
        <div className="ngo-list">
            {ngos.map(ngo => (
                <NgoCard key={ngo.id} ngo={ngo} setRoute={setRoute} onDonateClick={onDonateClick} />
            ))}
        </div>
    );
};

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Add state to control fade-in/out
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        if (isOpen) {
            // Delay visibility slightly to allow transition
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false); // Start fade out immediately
        }
    }, [isOpen]);

    const handleOverlayClick = (e) => {
         if (e.target === e.currentTarget) { // Only close if clicking the overlay itself
             onClose();
         }
    };


    // Prevent rendering if not open, ensures clean transitions
    if (!isOpen && !isVisible) return null;


    return (
        <div className={`modal-overlay ${isVisible ? 'open' : ''}`} onClick={handleOverlayClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

const RegisterNgoModal = ({ isOpen, onClose }) => {
    const { registerNgo } = useAppContext();
    const [formData, setFormData] = useState({ name: '', category: 'Other', description: '', longDescription: '', donationLink: '', logoUrl: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.category || !formData.description || !formData.donationLink) {
            // Consider using a non-blocking notification instead of alert
            console.error('Missing required fields');
            alert('Please fill in all required fields: Name, Category, Description, and Donation Link.');
            return;
        }
        registerNgo(formData);
        setIsSubmitted(true);
    };

    const handleClose = () => {
        // Reset form and submitted state when closing
        setTimeout(() => {
             setIsSubmitted(false);
             setFormData({ name: '', category: 'Other', description: '', longDescription: '', donationLink: '', logoUrl: '' });
        }, 300); // Wait for fade out animation
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            {isSubmitted ? (
                <div style={{ textAlign: 'center' }}>
                    <IconCheckCircle size="4rem" />
                    <h2>Registration Submitted</h2>
                    <p>Thank you! Your NGO has been added to the list. It will appear as "unverified" until reviewed.</p>
                    <button type="button" onClick={handleClose} className="button button-primary" style={{ width: '100%' }}>Close</button>
                </div>
            ) : (
                <>
                    <h2>Register your NGO</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="name" className="form-label">NGO Name*</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="form-input" />
                        </div>
                        <div className="form-field">
                            <label htmlFor="category" className="form-label">Category*</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} required className="form-select">
                                <option>Education</option> <option>Animals</option> <option>Health</option>
                                <option>Environment</option> <option>Other</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label htmlFor="description" className="form-label">Short Description*</label>
                            <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="form-input" placeholder="A one-sentence summary." />
                        </div>
                        <div className="form-field">
                            <label htmlFor="longDescription" className="form-label">Full Description</label>
                            <textarea name="longDescription" id="longDescription" rows="3" value={formData.longDescription} onChange={handleChange} className="form-textarea" placeholder="Tell donors more about your mission."></textarea>
                        </div>
                        <div className="form-field">
                            <label htmlFor="donationLink" className="form-label">Donation Link*</label>
                            <input type="url" name="donationLink" id="donationLink" value={formData.donationLink} onChange={handleChange} required className="form-input" placeholder="https://www.example.com/donate" />
                        </div>
                        <div className="form-field">
                            <label htmlFor="logoUrl" className="form-label">Logo URL (Optional)</label>
                            <input type="url" name="logoUrl" id="logoUrl" value={formData.logoUrl} onChange={handleChange} className="form-input" placeholder="https://www.example.com/logo.png" />
                        </div>
                        <div className="modal-actions">
                            <button type="button" onClick={handleClose} className="button button-secondary">Cancel</button>
                            <button type="submit" className="button button-primary">Submit Registration</button>
                        </div>
                    </form>
                </>
            )}
        </Modal>
    );
};

const DonateModal = ({ isOpen, onClose, ngo }) => {
    if (!ngo) return null; // Don't render if no NGO data

    const handleDonate = (e) => {
        // We let the default link behavior happen, just close the modal
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>You are leaving Givify</h2>
            <p>You are being redirected to the official donation page for <strong>{ngo.name}</strong>. We link to official sites, but please verify the URL before donating.</p>
            <div className="modal-actions">
                <button type="button" onClick={onClose} className="button button-secondary">Cancel</button>
                <a
                    href={ngo.donationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDonate}
                    className="button button-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                    Continue to Donate <IconExternalLink />
                </a>
            </div>
        </Modal>
    );
};

const FlagModal = ({ isOpen, onClose, ngo, submitFlag }) => {
     if (!ngo) return null;
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
         setTimeout(() => {
            setIsSubmitted(false);
            setReason('');
            setComment('');
         }, 300);
         onClose();
     };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
             {isSubmitted ? (
                 <div style={{ textAlign: 'center' }}>
                     <IconCheckCircle size="4rem" />
                     <h2>Report Submitted</h2>
                     <p>Thank you for your feedback. We will review this report for {ngo.name}.</p>
                     <button type="button" onClick={handleClose} className="button button-primary" style={{ width: '100%' }}>Close</button>
                 </div>
             ) : (
                 <>
                    <h2>Report {ngo.name}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="reason" className="form-label">Reason for reporting*</label>
                            <select name="reason" id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required className="form-select">
                                <option value="">Select a reason...</option>
                                <option value="broken-link">Broken donation link</option>
                                <option value="inactive">NGO appears inactive</option>
                                <option value="scam">Suspicious or fraudulent</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label htmlFor="comment" className="form-label">Additional Comments (Optional)</label>
                            <textarea name="comment" id="comment" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} className="form-textarea" placeholder="Please provide any additional details."></textarea>
                        </div>
                        <div className="modal-actions">
                            <button type="button" onClick={handleClose} className="button button-secondary">Cancel</button>
                            <button type="submit" className="button button-primary" style={{backgroundColor: '#dc2626' /* red-600 */}}>Submit Report</button>
                        </div>
                    </form>
                 </>
             )}
        </Modal>
    );
};


// --- (6) PAGE COMPONENTS ---
const HomePage = ({ setRoute, onDonateClick }) => {
    const { ngos } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = useMemo(() => ['All', ...new Set(ngos.map(ngo => ngo.category))], [ngos]);
    const filteredNgos = useMemo(() =>
        ngos
            .filter(ngo => selectedCategory === 'All' || ngo.category === selectedCategory)
            .filter(ngo => ngo.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [ngos, selectedCategory, searchTerm]
    );

    return (
        <div className="container" style={{paddingTop: '2rem', paddingBottom: '2rem'}}>
            <div className="home-banner">
                <h1 className="text-3xl font-bold">Find an NGO to Support</h1>
                <p className="text-lg">Browse our directory of verified and community-vetted non-profits.</p>
            </div>
            <div className="home-filters">
                <div className="home-search-wrapper">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>
                <div className="home-category-wrapper">
                    <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                </div>
            </div>
            <NgoList ngos={filteredNgos} setRoute={setRoute} onDonateClick={onDonateClick} />
        </div>
    );
};

const FavoritesPage = ({ setRoute, onDonateClick }) => {
    const { ngos, favorites } = useAppContext();
    const favoritedNgos = useMemo(() => ngos.filter(ngo => favorites.includes(ngo.id)), [ngos, favorites]);

    return (
        <div className="container" style={{paddingTop: '2rem', paddingBottom: '2rem'}}>
            <h1 className="text-3xl font-bold" style={{marginBottom: '2rem'}}>My Favorites</h1>
            {favoritedNgos.length > 0 ? (
                <NgoList ngos={favoritedNgos} setRoute={setRoute} onDonateClick={onDonateClick} />
            ) : (
                <div className="text-center rounded-lg shadow-sm" style={{padding: '2.5rem 0', backgroundColor: 'var(--card-bg-light)'}}>
                    <IconHeartOutline size="4rem" />
                    <h3 className="text-xl font-medium" style={{marginTop: '1rem'}}>No favorites yet.</h3>
                    <p style={{color: 'var(--secondary-text-light)', marginBottom: '1.5rem'}}>Click the heart on an NGO to save it here.</p>
                    <button onClick={() => setRoute({ page: 'home' })} className="button button-primary">Browse NGOs</button>
                </div>
            )}
        </div>
    );
};

const NgoDetailPage = ({ ngoId, setRoute }) => {
    const { ngos, submitFlag, favorites, toggleFavorite } = useAppContext();
    const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
    const ngo = useMemo(() => ngos.find(n => n.id === ngoId), [ngos, ngoId]);

    if (!ngo) {
        return (
            <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                <h2 className="text-2xl font-bold">NGO not found.</h2>
                <p style={{ color: 'var(--secondary-text-light)', marginBottom: '1rem' }}>The NGO you're looking for doesn't seem to exist.</p>
                <button onClick={() => setRoute({ page: 'home' })} style={{ color: 'var(--primary-color)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                    &larr; Back to Home
                </button>
            </div>
        );
    }

    const isFavorite = favorites.includes(ngo.id);
    const REPORT_THRESHOLD = 1;

    return (
        <>
            <div className="container" style={{ maxWidth: '56rem', paddingTop: '2rem', paddingBottom: '2rem' }}>
                <button onClick={() => setRoute({ page: 'home' })} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', marginBottom: '1.5rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
                    <IconArrowLeft /> Back to list
                </button>
                <div className="shadow-lg rounded-lg" style={{ backgroundColor: 'var(--card-bg-light)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem' }}>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Simplified header structure */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                <img src={ngo.logoUrl} alt={`${ngo.name} logo`} className="ngo-card-logo" style={{width: '5rem', height: '5rem'}} onError={(e) => { e.target.src = 'https://placehold.co/100x100/gray/white?text=Error'; }}/>
                                <div>
                                    <span className="ngo-card-category-badge">{ngo.category}</span>
                                    <h1 className="text-3xl font-bold" style={{marginTop: '0.25rem'}}>{ngo.name}</h1>
                                </div>
                            </div>
                             <button onClick={() => toggleFavorite(ngo.id)} className={`button ngo-card-fav-button ${isFavorite ? 'favorited' : 'button-secondary'}`} style={{ alignSelf: 'flex-start', border: '1px solid var(--border-light)', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                {isFavorite ? <IconHeart size="1rem" /> : <IconHeartOutline size="1rem" />} {isFavorite ? 'Favorited' : 'Add to Favorites'}
                             </button>
                         </div>


                        <div className="ngo-card-badges" style={{marginTop: '1rem', marginBottom: '1rem'}}>
                             {ngo.verified && <span className="ngo-card-status-badge verified"><IconCheckCircle /> Verified Partner</span>}
                             {ngo.flagCount >= REPORT_THRESHOLD && <span className="ngo-card-status-badge reported"><IconWarning /> Reported</span>}
                             <span style={{fontSize: '0.875rem', color: 'var(--secondary-text-light)'}}>{ngo.flagCount} {ngo.flagCount === 1 ? 'Report' : 'Reports'}</span>
                        </div>

                        <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-light)' }} />

                        <h2 className="text-xl font-semibold" style={{ marginBottom: '0.75rem' }}>About {ngo.name}</h2>
                        <p style={{ color: 'var(--secondary-text-light)', lineHeight: 1.6 }}>{ngo.longDescription || ngo.description}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                            <a href={ngo.donationLink} target="_blank" rel="noopener noreferrer" className="button button-primary" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                                Donate Now <IconExternalLink />
                            </a>
                            <button onClick={() => setIsFlagModalOpen(true)} className="button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                                <IconFlag /> Report NGO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <FlagModal isOpen={isFlagModalOpen} onClose={() => setIsFlagModalOpen(false)} ngo={ngo} submitFlag={submitFlag} />
        </>
    );
};


// --- (7) MAIN APP COMPONENT ---
export default function App() {
    const [route, setRoute] = useState({ page: 'home', id: null });
    const [donateModal, setDonateModal] = useState({ isOpen: false, ngo: null });
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const handleDonateClick = (ngo) => setDonateModal({ isOpen: true, ngo });
    const handleCloseDonateModal = () => setDonateModal({ isOpen: false, ngo: null });

    const renderPage = () => {
        switch (route.page) {
            case 'home': return <HomePage setRoute={setRoute} onDonateClick={handleDonateClick} />;
            case 'favorites': return <FavoritesPage setRoute={setRoute} onDonateClick={handleDonateClick} />;
            case 'detail': return <NgoDetailPage ngoId={route.id} setRoute={setRoute} />;
            default: return <HomePage setRoute={setRoute} onDonateClick={handleDonateClick} />;
        }
    };

    return (
        <AppProvider>
            <div> {/* Removed background/text classes, handled by index.css body */}
                <Header setRoute={setRoute} onRegisterClick={() => setIsRegisterModalOpen(true)} />
                <main>
                    {renderPage()}
                </main>
                <footer className="footer">
                    <p>&copy; {new Date().getFullYear()} Givify. All rights reserved.</p>
                </footer>
                <DonateModal isOpen={donateModal.isOpen} onClose={handleCloseDonateModal} ngo={donateModal.ngo} />
                <RegisterNgoModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
            </div>
        </AppProvider>
    );
}