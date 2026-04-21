/**
 * ActivityCard Component - Premium Luxury Presentation
 */

const ActivityCard = {
    render: (containerSelector, data) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.className = 'activities-grid';
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

export default ActivityCard;
