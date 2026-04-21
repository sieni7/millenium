// Simplified WYSIWYG integration for Admin
const AdminEditor = {
    editors: {},

    init: (selectors, config) => {
        // Load Quill CSS and JS dynamically if not already present
        if (!document.getElementById('quill-css')) {
            const link = document.createElement('link');
            link.id = 'quill-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
            document.head.appendChild(link);
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
        script.onload = () => {
            selectors.forEach(selector => {
                const container = document.querySelector(selector.id);
                if (!container) return;

                // Replace textarea with a div for Quill
                const label = container.querySelector('label').outerHTML;
                const fieldId = selector.field;
                const initialValue = selector.getValue();

                container.innerHTML = `
                    ${label}
                    <div id="editor-${fieldId}" style="height: 200px; background: white; border-radius: 0 0 12px 12px;">
                        ${initialValue}
                    </div>
                `;

                const quill = new Quill(`#editor-${fieldId}`, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['clean']
                        ]
                    }
                });

                quill.on('text-change', () => {
                    selector.setValue(quill.root.innerHTML);
                    if (window.markDirty) window.markDirty();
                });

                AdminEditor.editors[fieldId] = quill;
            });
        };
        document.body.appendChild(script);
    }
};

export default AdminEditor;
