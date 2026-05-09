/**
 * Premium Custom Cursor
 */

const CustomCursor = {
    init() {
        // Only initialize on non-touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);

        // Styling
        const style = document.createElement('style');
        style.innerHTML = `
            #custom-cursor {
                position: fixed;
                top: 0;
                left: 0;
                width: 40px;
                height: 40px;
                border: 1px solid var(--primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: transform 0.15s ease-out, width 0.2s, height 0.2s, background-color 0.2s;
                mix-blend-mode: difference;
            }
            #custom-cursor::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background-color: var(--primary);
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            #custom-cursor.hover {
                width: 60px;
                height: 60px;
                background-color: rgba(240, 90, 34, 0.1);
                backdrop-filter: blur(2px);
            }
            /* Hide default cursor on body but keep it safe */
            @media (pointer: fine) {
                body, a, button, input, select, textarea {
                    cursor: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Mouse move
        window.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
        });

        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, .product-card, input, select, textarea');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // Add dynamically injected elements observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const newInteractives = document.querySelectorAll('a, button, .product-card, input, select, textarea');
                    newInteractives.forEach(el => {
                        el.removeEventListener('mouseenter', () => cursor.classList.add('hover'));
                        el.removeEventListener('mouseleave', () => cursor.classList.remove('hover'));
                        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
};

export default CustomCursor;
