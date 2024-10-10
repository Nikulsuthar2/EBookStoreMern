const formatTimestamp = (timestamp) => {
    const formattedDate = new Date(timestamp).toLocaleString('en-GB', {
        timeZone: 'Asia/Kolkata', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    }).replace(',', '').replace(/\//g, '-');
    return formattedDate;
}

export {formatTimestamp}