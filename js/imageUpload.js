const ImageUpload = {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED: ['image/jpeg', 'image/png', 'image/webp'],

    /**
     * Initialize an image upload zone
     * @param {Object} config - Configuration object
     */
    init({ dropzone, fileInput, preview, previewImg, removeBtn, textInput, onImageChange }) {
        const elements = {
            dropzone: typeof dropzone === 'string' ? document.getElementById(dropzone) : dropzone,
            fileInput: typeof fileInput === 'string' ? document.getElementById(fileInput) : fileInput,
            preview: typeof preview === 'string' ? document.getElementById(preview) : preview,
            previewImg: typeof previewImg === 'string' ? document.getElementById(previewImg) : previewImg,
            removeBtn: typeof removeBtn === 'string' ? document.getElementById(removeBtn) : removeBtn,
            textInput: typeof textInput === 'string' ? document.getElementById(textInput) : textInput
        };

        if (!elements.dropzone || !elements.fileInput) return;

        // Drag events
        ['dragenter', 'dragover'].forEach(evt => {
            elements.dropzone.addEventListener(evt, (e) => { 
                e.preventDefault(); 
                elements.dropzone.classList.add('dragover'); 
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            elements.dropzone.addEventListener(evt, (e) => { 
                e.preventDefault(); 
                elements.dropzone.classList.remove('dragover'); 
            });
        });

        elements.dropzone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file) this.processFile(file, elements, onImageChange);
        });

        elements.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.processFile(file, elements, onImageChange);
        });

        if (elements.textInput) {
            elements.textInput.addEventListener('input', () => {
                const url = elements.textInput.value.trim();
                if (url && (url.startsWith('http') || url.startsWith('data:'))) {
                    this.showPreview(url, elements.preview, elements.previewImg);
                    if (onImageChange) onImageChange(url);
                } else if (!url) {
                    if (elements.preview) elements.preview.style.display = 'none';
                    if (onImageChange) onImageChange('');
                }
            });
        }

        if (elements.removeBtn) {
            elements.removeBtn.addEventListener('click', () => {
                if (elements.textInput) elements.textInput.value = '';
                if (elements.preview) elements.preview.style.display = 'none';
                if (onImageChange) onImageChange('');
            });
        }

        // Initial preview if value exists
        if (elements.textInput && elements.textInput.value) {
            const url = elements.textInput.value.trim();
            if (url && (url.startsWith('http') || url.startsWith('data:'))) {
                this.showPreview(url, elements.preview, elements.previewImg);
            }
        }
    },

    processFile(file, elements, callback) {
        if (!this.ALLOWED.includes(file.type)) {
            alert('Format non supporté. Utilisez JPG, PNG ou WebP.');
            return;
        }
        if (file.size > this.MAX_SIZE) {
            alert('Image trop volumineuse (max 2 Mo).');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            if (elements.textInput) { 
                elements.textInput.value = base64; 
                elements.textInput.dispatchEvent(new Event('input')); 
            }
            this.showPreview(base64, elements.preview, elements.previewImg);
            if (callback) callback(base64);
        };
        reader.readAsDataURL(file);
    },

    showPreview(url, preview, previewImg) {
        if (previewImg) previewImg.src = url;
        if (preview) preview.style.display = 'inline-block';
    }
};

export default ImageUpload;
