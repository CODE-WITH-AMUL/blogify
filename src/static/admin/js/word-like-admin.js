// MS Word-like Admin Enhancements

document.addEventListener('DOMContentLoaded', function() {
    
    // Auto-generate slug from title
    const titleField = document.querySelector('#id_title');
    const slugField = document.querySelector('#id_slug');
    
    if (titleField && slugField) {
        titleField.addEventListener('blur', function() {
            if (!slugField.value) {
                const title = this.value;
                const slug = title.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/--+/g, '-');
                slugField.value = slug;
            }
        });
    }
    
    // Add word count display for content
    setTimeout(function() {
        const editorFrame = document.querySelector('.cke iframe');
        if (editorFrame) {
            editorFrame.addEventListener('load', function() {
                const editorDoc = this.contentDocument || this.contentWindow.document;
                const editorBody = editorDoc.body;
                
                // Create word count display
                const wordCountDiv = document.createElement('div');
                wordCountDiv.className = 'word-count-display';
                wordCountDiv.innerHTML = 'Words: <span id="word-count">0</span>';
                document.body.appendChild(wordCountDiv);
                
                // Update word count
                function updateWordCount() {
                    const text = editorBody.innerText || editorBody.textContent;
                    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
                    document.getElementById('word-count').textContent = words.length;
                }
                
                // Update on input
                editorBody.addEventListener('input', updateWordCount);
                updateWordCount(); // Initial count
            });
        }
    }, 1000);
    
    // Add preview button to form
    const submitRow = document.querySelector('.submit-row');
    if (submitRow) {
        const previewButton = document.createElement('button');
        previewButton.type = 'button';
        previewButton.className = 'preview-button';
        previewButton.innerHTML = '<i class="fas fa-eye"></i> Preview';
        previewButton.onclick = function() {
            alert('Preview feature would open in a new tab. Save draft first.');
        };
        submitRow.insertBefore(previewButton, submitRow.firstChild);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const saveButton = document.querySelector('input[name="_save"]');
            if (saveButton) saveButton.click();
        }
        
        // Ctrl+P to preview
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            const previewButton = document.querySelector('.preview-button');
            if (previewButton) previewButton.click();
        }
    });
    
    // Add auto-save reminder
    const contentField = document.querySelector('.field-content textarea, .cke');
    if (contentField) {
        let saveTimeout;
        
        function showSaveReminder() {
            const reminder = document.createElement('div');
            reminder.className = 'save-reminder';
            reminder.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #ffc107;
                color: #212529;
                padding: 10px 15px;
                border-radius: 4px;
                font-weight: 500;
                z-index: 10000;
                animation: fadeIn 0.3s;
            `;
            reminder.textContent = 'Remember to save your work!';
            document.body.appendChild(reminder);
            
            setTimeout(() => {
                reminder.style.animation = 'fadeOut 0.3s';
                setTimeout(() => reminder.remove(), 300);
            }, 3000);
        }
        
        // Show reminder after 2 minutes of inactivity
        contentField.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(showSaveReminder, 120000); // 2 minutes
        });
    }
    
    // Add style for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
});