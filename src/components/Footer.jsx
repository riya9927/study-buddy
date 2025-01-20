import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-soft-purple text-black py-6 mt-6">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="text-xl font-bold">Study Buddy</p>
          <p className="text-xs">Your personalized study companion</p>
        </div>
        <div className="flex space-x-6">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-soft-purple transition-all">
            <i className="fab fa-facebook-f"></i> Facebook
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-soft-purple transition-all">
            <i className="fab fa-twitter"></i> Twitter
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-soft-purple transition-all">
            <i className="fab fa-linkedin-in"></i> LinkedIn
          </a>
        </div>
      </div>
      <div className="text-center text-xs mt-3">
        <p>&copy; {new Date().getFullYear()} Study Buddy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
