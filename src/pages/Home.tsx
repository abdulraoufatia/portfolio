import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center"
    >
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-bold mb-4 gradient-text"
      >
        Abdulraouf Atia
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
      >
        Platform Engineering Professional
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex space-x-6"
      >
        {[
          { icon: Github, href: "https://github.com/abdulraoufatia", label: "GitHub" },
          { icon: Linkedin, href: "https://www.linkedin.com/in/abdulraoufatia/", label: "LinkedIn" },
          { icon: Mail, href: "mailto:abdulraoufatia@outlook.com", label: "Email" }
        ].map((social, index) => (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="glass p-3 rounded-full hover:text-blue-400 transition-colors glow-hover"
          >
            <social.icon size={24} />
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Home;