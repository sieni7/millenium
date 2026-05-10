/**
 * Image Upload — #8
 * 🖼️ Media Agent — FileReader, Base64, drag-drop zone
 */
const ImageUpload = {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED: ['image/jpeg', 'image/png', 'image/webp'],

    init(dropzoneId, fileInputId, previewId, previewImgId, removeId, textInputId) {
        const dropzone = document.getElementById(dropzoneId);
        const fileInput = document.getElementById(fileInputId);
        const preview = document.getElementById(previewId);
        const previewImg = document.getElementById(previewImgId);
        const removeBtn = document.getElementById(removeId);
        const textInput = document.getElementById(textInputId);

        if (!dropzone || !fileInput) return;

        // Drag events on dropzone
        ['dragenter', 'dragover'].forEach(evt => {
            dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        });
        ['dragleave', 'drop'].forEach(evt => {
            dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); });
        });

        dropzone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file) this.processFile(file, textInput, preview, previewImg);
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.processFile(file, textInput, preview, previewImg);
        });

        // URL input also shows preview
        if (textInput) {
            textInput.addEventListener('change', () => {
                const url = textInput.value.trim();
                if (url && (url.startsWith('http') || url.startsWith('data:'))) {
                    this.showPreview(url, preview, previewImg);
                }
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                if (textInput) textInput.value = '';
                if (preview) preview.style.display = 'none';
            });
        }

        // Show preview if URL already set
        if (textInput && textInput.value) {
            const url = textInput.value.trim();
            if (url && (url.startsWith('http') || url.startsWith('data:'))) {
                this.showPreview(url, preview, previewImg);
            }
        }
    },

    processFile(file, textInput, preview, previewImg) {
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
            if (textInput) { textInput.value = base64; textInput.dispatchEvent(new Event('input')); }
            this.showPreview(base64, preview, previewImg);
        };
        reader.readAsDataURL(file);
    },

    showPreview(url, preview, previewImg) {
        if (previewImg) previewImg.src = url;
        if (preview) preview.style.display = 'inline-block';
    }
};

export default ImageUpload;
