/**
 * Loading Screen Component
 */

const LoadingScreen = {
    render: () => {
        const loader = document.createElement('div');
        loader.id = 'loading-screen';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">MILLENIUM</div>
                <div class="loader-spinner"></div>
                <p>Innover localement pour un impact durable</p>
            </div>
        `;
        document.body.appendChild(loader);
    },

    hide: () => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 320);
        }
    }
};

export default LoadingScreen;
