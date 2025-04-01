import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { schoolInfo } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaBars } from "react-icons/fa";

// Navigation items with dropdowns
const navigationItems = [
  { title: "Home", link: "/" },
  { 
    title: "About", 
    link: "/about",
    dropdown: [
      { title: "About Us", link: "/about" },
      { title: "Mission & Vision", link: "/about#mission" },
      { title: "History", link: "/about#history" },
      { title: "Leadership", link: "/about#leadership" }
    ]
  },
  { 
    title: "Academics", 
    link: "/academics",
    dropdown: [
      { title: "Curriculum", link: "/academics#curriculum" },
      { title: "Departments", link: "/academics#departments" },
      { title: "Academic Calendar", link: "/academics#calendar" }
    ]
  },
  { title: "Admissions", link: "/admissions" },
  // { 
  //   title: "Campus Life", 
  //   link: "/facilities",
  //   dropdown: [
  //     { title: "Facilities", link: "/facilities" },
  //     { title: "Activities & Clubs", link: "/facilities#activities" },
  //     { title: "Sports", link: "/facilities#sports" }
  //   ]
  // },
  { title: "Faculty", link: "/faculty" },
  { title: "Gallery", link: "/gallery" },
  { title: "Contact", link: "/contact" }
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
    
    // Handle scroll for sticky header effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileDropdown = (index: number) => {
    setOpenDropdowns(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <header className={`bg-white ${isScrolled ? 'shadow-md' : ''} sticky top-0 z-50 transition-shadow duration-300`}>
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          <div className="mr-3">
          <img 
              src="/images/logo/favicon.jpg" 
              alt="School Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary">
              {schoolInfo.name}
            </h1>
            <p className="text-sm md:text-base italic text-neutral-dark">
              {schoolInfo.location}
            </p>
          </div>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md text-primary hover:bg-neutral-light focus:outline-none" 
          aria-label="Menu Toggle"
        >
          <FaBars className="text-xl" />
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex font-nav items-center">
          {navigationItems.map((item, index) => (
            item.dropdown ? (
              <div key={index} className="dropdown-trigger relative px-3 py-2 font-medium text-primary hover:text-accent transition">
                <span className="cursor-pointer flex items-center">
                  {item.title} <FaChevronDown className="text-xs ml-1" />
                </span>
                <div className="nav-dropdown absolute top-full left-0 w-52 bg-white shadow-lg rounded-md py-2 z-20 invisible opacity-0 transform -translate-y-2 transition-all duration-300">
                  {item.dropdown.map((dropItem, dropIndex) => (
                    <Link 
                      key={dropIndex} 
                      href={dropItem.link} 
                      className="block px-4 py-2 hover:bg-neutral-light text-primary hover:text-accent transition"
                    >
                      {dropItem.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link 
                key={index} 
                href={item.link} 
                className={`px-3 py-2 font-medium hover:text-accent transition ${
                  location === item.link ? 'text-accent' : 'text-primary'
                }`}
              >
                {item.title}
              </Link>
            )
          ))}
          
          <Link 
            href="/admissions#inquiry" 
            className="ml-2 px-4 py-2 bg-accent text-white rounded-md shadow-sm hover:bg-accent-dark transition"
          >
            Admission Inquiry
          </Link>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col bg-white shadow-inner py-3 px-4 font-nav"
          >
            {navigationItems.map((item, index) => (
              item.dropdown ? (
                <div key={index} className="mobile-dropdown">
                  <div 
                    className="flex items-center justify-between px-3 py-2 font-medium border-b border-neutral-light"
                    onClick={() => toggleMobileDropdown(index)}
                  >
                    <span>{item.title}</span>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${openDropdowns.includes(index) ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {openDropdowns.includes(index) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-neutral-light px-3 py-2"
                      >
                        {item.dropdown.map((dropItem, dropIndex) => (
                          <Link 
                            key={dropIndex} 
                            href={dropItem.link} 
                            className="block py-1 hover:text-accent transition"
                          >
                            {dropItem.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  key={index} 
                  href={item.link} 
                  className={`px-3 py-2 font-medium border-b border-neutral-light ${
                    location === item.link ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {item.title}
                </Link>
              )
            ))}
            
            <Link 
              href="/admissions#inquiry" 
              className="mt-3 px-4 py-2 bg-accent text-white rounded-md shadow-sm text-center hover:bg-accent-dark transition"
            >
              Admission Inquiry
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
      
      {/* Announcements Bar */}
      <div className="bg-accent-light py-2">
        <div className="container mx-auto px-4 flex items-center">
          <div className="font-medium mr-3 flex-shrink-0">
            <span className="mr-1">📢</span> Announcements:
          </div>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="announcement-scroll inline-block">
              Admissions open for academic year 2025-26 &nbsp;&nbsp;|&nbsp;&nbsp; Annual Sports Meet on December 15th &nbsp;&nbsp; &nbsp;&nbsp;|&nbsp;&nbsp; Parent-Teacher Meeting scheduled for October 5th
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
