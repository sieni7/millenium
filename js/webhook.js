export const sendToWebhook = async (data, url = 'https://discord.com/api/webhooks/PLACEHOLDER') => {
    // Simulation for V1 Sprint 1
    console.log('Sending message to webhook:', data);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mocking success
            resolve({ success: true, message: "Message envoyé avec succès !" });
        }, 1500);
    });
};
