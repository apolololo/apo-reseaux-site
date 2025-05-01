import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer 
      className="mt-12 text-center text-xs opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <div className="h-px w-20 bg-white/20 mx-auto mb-4" />
      <p>© {currentYear} APO • All Rights Reserved</p>
    </motion.footer>
  );
};

export default Footer;
