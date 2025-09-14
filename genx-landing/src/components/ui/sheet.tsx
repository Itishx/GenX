import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';

const Sheet = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <motion.div
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          initial={{ y: '-100vh', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100vh', opacity: 0 }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
            &times;
          </button>
          {children}
        </motion.div>
      </div>
    </Dialog>
  );
};

export default Sheet;