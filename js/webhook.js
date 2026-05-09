export const sendToWebhook = async (data, url) => {
    console.log('Sending message to:', url);
    
    // Add CC field
    data._cc = "sieni7@gmail.com";
    // Avoid captcha for ajax
    data._captcha = "false";
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        return await response.json();
    } catch (error) {
        console.error('Webhook error:', error);
        throw error;
    }
};
