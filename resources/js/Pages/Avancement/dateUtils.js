// Fonction pour formater une date en français
export const formatDateToFrench = (dateString) => {
    if (!dateString) return 'N/A';
    
    const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

    // Gestion des différents formats possibles de date
    let date;
    if (dateString.includes('T')) {
        // Format ISO
        date = new Date(dateString);
    } else if (dateString.includes('-')) {
        // Format YYYY-MM-DD
        const [year, month, day] = dateString.split('-');
        date = new Date(year, month - 1, day);
    } else if (dateString.includes('/')) {
        // Format DD/MM/YYYY
        const [day, month, year] = dateString.split('/');
        date = new Date(year, month - 1, day);
    } else {
        return 'Format de date invalide';
    }

    // Vérification si la date est valide
    if (isNaN(date.getTime())) {
        return 'Date invalide';
    }

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Ajout du jour avec le bon suffixe
    const dayWithSuffix = day === 1 ? `1er` : day;

    return `${dayWithSuffix} ${month} ${year}`;
};

// Fonction pour obtenir l'âge ou la durée en années/mois depuis une date
export const getTimeSince = (dateString) => {
    if (!dateString) return 'N/A';

    const start = new Date(dateString);
    const now = new Date();
    
    const yearDiff = now.getFullYear() - start.getFullYear();
    const monthDiff = now.getMonth() - start.getMonth();
    
    let years = yearDiff;
    let months = monthDiff;
    
    if (monthDiff < 0) {
        years--;
        months = 12 + monthDiff;
    }
    
    if (years === 0) {
        return months === 1 ? '1 mois' : `${months} mois`;
    } else if (months === 0) {
        return years === 1 ? '1 an' : `${years} ans`;
    } else {
        return `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
    }
};