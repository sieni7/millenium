/**
 * Mobile Navigation Burger Toggle and Overlay
 */

const MobileMenu = {
    init() {
        const burger = document.querySelector('#mobile-burger');
        const nav = document.querySelector('#main-nav');
        const links = nav.querySelectorAll('a');

        if (!burger) return;

        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('mobile-active');
            document.body.style.overflow = nav.classList.contains('mobile-active') ? 'hidden' : '';
        });

        // Close on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('mobile-active');
                document.body.style.overflow = '';
            });
        });
    }
};

export default MobileMenu;
