/**
 * Drag & Drop Reordering — #4
 * ⚙️ Interaction Agent — HTML5 Drag API, DOM mutations
 */
const DragDrop = {
    init(container, onReorder) {
        if (!container) return;
        const isTable = container.tagName === 'TBODY';
        const itemSelector = isTable ? 'tr' : '.slide-group';

        container.addEventListener('dragstart', (e) => {
            const item = e.target.closest(itemSelector);
            if (!item) return;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', item.dataset.index);
        });

        container.addEventListener('dragend', (e) => {
            const item = e.target.closest(itemSelector);
            if (item) item.classList.remove('dragging');
            container.querySelectorAll(itemSelector).forEach(el => el.classList.remove('drag-over'));
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const item = e.target.closest(itemSelector);
            if (!item || item.classList.contains('dragging')) return;
            container.querySelectorAll(itemSelector).forEach(el => el.classList.remove('drag-over'));
            item.classList.add('drag-over');
        });

        container.addEventListener('dragleave', (e) => {
            const item = e.target.closest(itemSelector);
            if (item) item.classList.remove('drag-over');
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const targetItem = e.target.closest(itemSelector);
            if (!targetItem) return;
            const toIndex = parseInt(targetItem.dataset.index);
            container.querySelectorAll(itemSelector).forEach(el => el.classList.remove('drag-over', 'dragging'));
            if (fromIndex !== toIndex && !isNaN(fromIndex) && !isNaN(toIndex)) {
                onReorder(fromIndex, toIndex);
            }
        });
    },

    reorderArray(arr, from, to) {
        const item = arr.splice(from, 1)[0];
        arr.splice(to, 0, item);
        return arr;
    }
};

export default DragDrop;
