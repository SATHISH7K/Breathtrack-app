import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

export const BTBackButton = ({ onClick }) => (
    <button className="bt-back-btn" onClick={onClick}>
        <ChevronLeft size={24} />
    </button>
);

export const BTInputField = ({
    placeholder,
    icon: Icon,
    value,
    onChange,
    type = "text",
    error,
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="bt-input-wrapper">
                {Icon && (
                    <div className="input-icon">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={actualType}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <span className="validation-msg">{error}</span>}
        </div>
    );
};

export const BTPrimaryButton = ({
    title,
    icon: Icon,
    onClick,
    loading = false,
    disabled = false,
    variant = 'primary',
    className = ""
}) => {
    return (
        <motion.button
            className={`bt-primary-btn ${variant === 'doctor' ? 'doctor' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            whileTap={{ scale: 0.96 }}
        >
            {loading ? (
                <Loader2 className="spinner" />
            ) : (
                <>
                    {title}
                    {Icon && <Icon size={20} />}
                </>
            )}
        </motion.button>
    );
};

export const BTCoverImage = ({ src, alt, className = "" }) => (
    <div className={`relative overflow-hidden rounded-[32px] shadow-lg ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
);

export const BTStatusBadge = ({ type = 'info', message }) => {
    if (!message) return null;
    return (
        <div className={`bt-status-badge ${type}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {message}
        </div>
    );
};

export const BTCard = ({ children, className = "", onClick }) => (
    <motion.div
        className={`bt-card ${className}`}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={onClick ? { scale: 0.99 } : {}}
        whileTap={onClick ? { scale: 0.97 } : {}}
    >
        {children}
    </motion.div>
);
