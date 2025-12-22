
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, maxWidth = 'max-w-sm' }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className={`bg-white rounded-lg shadow-xl p-6 m-4 ${maxWidth} w-full text-center transform transition-all duration-300 scale-95 opacity-0 animate-scale-in`}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
            <style>{`
                @keyframes scale-in {
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s forwards ease-out;
                }
            `}</style>
        </div>
    );
};

export default Modal;
