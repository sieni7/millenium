/**
 * EngagementCard Component - Strategic Pillars Luxury Cards
 */

const EngagementCard = {
    render: (containerSelector, data) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        // Ensure container has the grid layout
        container.className = 'engagement-grid';
        
        container.innerHTML = data.map(item => `
            <div class="card-luxe" data-aos="fade-up">
                <div class="card-luxe-icon">
                    <i class="${item.icon}"></i>
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');
    }
};

export default EngagementCard;
