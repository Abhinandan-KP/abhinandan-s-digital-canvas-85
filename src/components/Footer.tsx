import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const socials = [
  { icon: Github, href: 'https://github.com/Abhinandan-KP', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/abhinandanx/', label: 'LinkedIn', color: '#0077B5' },
  { 
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
      </svg>
    ), 
    href: 'https://leetcode.com/u/Abhinandanx538/', 
    label: 'LeetCode',
    color: '#FFA116'
  },
  { 
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M4.5 7.5C5.328 7.5 6 6.828 6 6s-.672-1.5-1.5-1.5S3 5.172 3 6s.672 1.5 1.5 1.5zm0 9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5S3 14.172 3 15s.672 1.5 1.5 1.5zm0-4.5c.828 0 1.5-.672 1.5-1.5S5.328 9 4.5 9 3 9.672 3 10.5s.672 1.5 1.5 1.5zm15 0c.828 0 1.5-.672 1.5-1.5S20.328 9 19.5 9s-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 4.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0-9c.828 0 1.5-.672 1.5-1.5S20.328 4.5 19.5 4.5 18 5.172 18 6s.672 1.5 1.5 1.5zM12 7.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0-4.5c.828 0 1.5-.672 1.5-1.5S12.828 9 12 9s-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"/>
      </svg>
    ), 
    href: 'https://codeforces.com/profile/xmas123', 
    label: 'Codeforces' 
  },
  { 
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.282-.823c-.017-.08-.027-.16-.038-.24H8.22c-.01.08-.02.16-.037.24a3.568 3.568 0 0 1-.282.823 3.79 3.79 0 0 1-2.135 2.078 4.51 4.51 0 0 1-3.116.016 3.691 3.691 0 0 1-1.104-.695 2.892 2.892 0 0 1-.565-.745c-.143-.28-.22-.575-.225-.876L.75 6.572a2.4 2.4 0 0 1 .225-.876c.143-.28.334-.532.565-.744a3.69 3.69 0 0 1 1.104-.696 4.51 4.51 0 0 1 3.116-.016 3.79 3.79 0 0 1 2.135 2.078c.129.26.218.536.282.823.017.08.027.16.038.24h5.56c.01-.08.02-.16.037-.24.064-.287.153-.563.282-.823a3.79 3.79 0 0 1 2.135-2.078 4.51 4.51 0 0 1 3.116.016 3.691 3.691 0 0 1 1.104.696c.231.212.422.464.565.744.143.28.22.576.225.876l.006 6.867a2.4 2.4 0 0 1-.225.876z"/>
      </svg>
    ), 
    href: 'https://www.geeksforgeeks.org/profile/abhiroznll', 
    label: 'GFG' 
  },
];

const Footer = () => {
  return (
    <footer className="py-8 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Mobile social links */}
        <div className="flex justify-center gap-6 md:hidden mb-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              aria-label={social.label}
              style={social.color ? { color: social.color } : undefined}
            >
              <social.icon />
            </a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <a
            href="https://github.com/Abhinandan-KP"
            target="_blank"
            rel="noopener noreferrer"
          >
            Designed & Built by Abhinandan
          </a>
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
