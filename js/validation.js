export const validateForm = (data) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.name || data.name.trim().length < 2) {
        errors.name = "Le nom est trop court.";
    }
    
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = "E-mail invalide.";
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.message = "Le message doit faire au moins 10 caractères.";
    }
    
    return errors;
};
