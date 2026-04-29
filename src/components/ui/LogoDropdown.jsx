import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Trophy, Calendar, User } from 'lucide-react';

export default function LogoDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'constructors', label: 'Constructors Standings', icon: Flag, color: '#E8002D' },
    { id: 'drivers', label: 'Drivers Standings', icon: Trophy, color: '#E8002D' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: '#E8002D' },
    { id: 'profile', label: 'Profile', icon: User, color: '#E8002D' },
  ];

  const handleItemClick = (itemId) => {
    console.log(`Clicked: ${itemId}`);
    // Add navigation logic here
    switch(itemId) {
      case 'constructors':
        // Navigate to Constructors Standings page
        // window.location.href = '/constructors';
        break;
      case 'drivers':
        // Navigate to Drivers Standings page
        // window.location.href = '/drivers';
        break;
      case 'calendar':
        // Navigate to Calendar page
        // window.location.href = '/calendar';
        break;
      case 'profile':
        // Navigate to Profile page
        // window.location.href = '/profile';
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Logo Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
      >
        <img 
          src="/TracksideLogo.png" 
          alt="Trackside Logo" 
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain cursor-pointer"
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            className="absolute right-0 mt-2 z-20 w-56 bg-[#242832] bg-gradient-to-b from-[#242832] to-[#251c28] rounded-lg p-2 shadow-xl border border-[#42434a] origin-top-right"
          >
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#7e8590] font-semibold transition-all duration-200 hover:text-white group"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = item.color;
                        e.currentTarget.style.color = '#fff';
                        const svg = e.currentTarget.querySelector('svg');
                        if (svg) svg.style.stroke = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '#7e8590';
                        const svg = e.currentTarget.querySelector('svg');
                        if (svg) svg.style.stroke = '#7e8590';
                      }}
                    >
                      <Icon size={19} stroke="#7e8590" className="transition-all duration-200 group-hover:stroke-white" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
