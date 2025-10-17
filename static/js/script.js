// Mobile functionality
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');
const closeSidebar = document.getElementById('closeSidebar');

if (hamburgerBtn && sidebar && mobileOverlay) {
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        mobileOverlay.classList.add('active');
    });
}

if (closeSidebar && sidebar && mobileOverlay) {
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('open');
        mobileOverlay.classList.remove('active');
    });
}

if (mobileOverlay && sidebar) {
    mobileOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        mobileOverlay.classList.remove('active');
    });
}

// User profile dropdown functionality
const userProfile = document.getElementById('userProfile');
const userDropdown = document.getElementById('userDropdown');

if (userProfile && userDropdown) {
    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        userProfile.classList.toggle('active');
        userDropdown.classList.toggle('show');
    });

    userDropdown.addEventListener('click', (e) => {
        if (e.target.classList.contains('dropdown-item')) {
            const action = e.target.textContent.trim();
            console.log('Dropdown action:', action);
            
            userProfile.classList.remove('active');
            userDropdown.classList.remove('show');
        }
    });
}

if (userProfile && userDropdown) {
    document.addEventListener('click', () => {
        userProfile.classList.remove('active');
        userDropdown.classList.remove('show');
    });
}

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// Chat input functionality
const chatInput = document.querySelector('.chat-input');
if (chatInput) {
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

// Document library functionality
const libraryBtn = document.getElementById('libraryBtn');
const libraryMainBtn = document.getElementById('libraryMainBtn');
const documentLibrary = document.getElementById('documentLibrary');
const closeLibrary = document.getElementById('closeLibrary');

function openLibrary() {
    if (documentLibrary) {
        documentLibrary.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLibraryModal() {
    if (documentLibrary) {
        documentLibrary.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (libraryBtn) {
    libraryBtn.addEventListener('click', openLibrary);
}

if (libraryMainBtn) {
    libraryMainBtn.addEventListener('click', openLibrary);
}

if (closeLibrary) {
    closeLibrary.addEventListener('click', closeLibraryModal);
}

if (documentLibrary) {
    documentLibrary.addEventListener('click', (e) => {
        if (e.target === documentLibrary) {
            closeLibraryModal();
        }
    });
}

// ============================================
// FILE UPLOAD FUNCTIONALITY - DJANGO INTEGRATION
// ============================================

const uploadBtn = document.getElementById('uploadBtn');
const uploadDocumentBtn = document.getElementById('uploadDocumentBtn');
const uploadFromLibrary = document.getElementById('uploadFromLibrary');
const uploadInterface = document.getElementById('uploadInterface');
const closeUpload = document.getElementById('closeUpload');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const uploadSuccess = document.getElementById('uploadSuccess');
const uploadForm = document.getElementById('uploadForm');
const documentNameInput = document.getElementById('documentName');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const selectedFile = document.getElementById('selectedFile');
const removeFile = document.getElementById('removeFile');

// Get CSRF token from Django template
function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Open upload interface
function openUpload() {
    if (uploadInterface) {
        uploadInterface.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

if (uploadBtn) {
    uploadBtn.addEventListener('click', openUpload);
}

if (uploadDocumentBtn) {
    uploadDocumentBtn.addEventListener('click', openUpload);
}

if (uploadFromLibrary) {
    uploadFromLibrary.addEventListener('click', () => {
        closeLibraryModal();
        openUpload();
    });
}

// Close upload interface
if (closeUpload) {
    closeUpload.addEventListener('click', () => {
        if (uploadInterface) {
            uploadInterface.classList.remove('active');
            document.body.style.overflow = '';
            resetUploadState();
        }
    });
}

if (uploadInterface) {
    uploadInterface.addEventListener('click', (e) => {
        if (e.target === uploadInterface) {
            uploadInterface.classList.remove('active');
            document.body.style.overflow = '';
            resetUploadState();
        }
    });
}

// Browse files button
if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });
}

// Dropzone click and drag-and-drop
if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
        if (e.target === dropzone || e.target.closest('.upload-icon, .upload-text, .upload-subtext')) {
            fileInput.click();
        }
    });

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (!dropzone.contains(e.relatedTarget)) {
            dropzone.classList.remove('dragover');
        }
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });
}

// File input change
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });
}

// Handle file selection - show file info, don't upload yet
function handleFileSelection(file) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type)) {
        showError('Please select a valid file type (PDF, DOC, DOCX, TXT, PPT, PPTX)');
        if (fileInput) fileInput.value = '';
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        if (fileInput) fileInput.value = '';
        return;
    }

    // Check filename length
    if (file.name.length > 100) {
        showError('File name must be less than 100 characters');
        if (fileInput) fileInput.value = '';
        return;
    }

    // Show selected file
    if (selectedFile) {
        const fileName = selectedFile.querySelector('#fileName');
        if (fileName) {
            fileName.textContent = file.name;
        }
        selectedFile.style.display = 'flex';
    }

    // Enable submit button if document name exists
    validateForm();
}

// Show error message
function showError(message) {
    const fileError = document.getElementById('fileError');
    if (fileError) {
        fileError.textContent = message;
        fileError.style.display = 'block';
    }
    alert(message);
}

// Validate form - only check if file is selected
function validateForm() {
    if (submitBtn && fileInput) {
        const hasFile = fileInput.files.length > 0;
        submitBtn.disabled = !hasFile;
    }
}

// Debug: Check initial state
console.log('Form validation debug:');
console.log('- documentNameInput:', documentNameInput);
console.log('- fileInput:', fileInput);
console.log('- submitBtn:', submitBtn);
console.log('- Initial submitBtn disabled:', submitBtn?.disabled);

// Remove file
if (removeFile && selectedFile) {
    removeFile.addEventListener('click', () => {
        if (fileInput) {
            fileInput.value = '';
        }
        selectedFile.style.display = 'none';
        if (submitBtn) {
            submitBtn.disabled = true;
        }
    });
}

// Form submission - ACTUAL UPLOAD
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!fileInput || fileInput.files.length === 0) {
            showError('Please select a file');
            return;
        }

        const file = fileInput.files[0];
        const documentName = file.name; // Use filename as document name

        console.log('Form submitted with file:', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        // Hide form and show progress
        if (selectedFile) selectedFile.style.display = 'none';
        if (uploadProgress) uploadProgress.style.display = 'block';

        // Perform actual upload
        await uploadFileToServer(file, documentName);
    });
}

// Upload file to Django server
async function uploadFileToServer(file, documentName) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_name', documentName);

    const csrfToken = getCsrfToken();
    
    // Disable all buttons during upload/embedding
    disableAllButtons();
    
    console.log('=== UPLOAD DEBUG ===');
    console.log('File object:', file);
    console.log('File name:', file.name);
    console.log('File size:', file.size);
    console.log('File type:', file.type);
    
    try {
        // Start simulated progress (while embedding happens on server)
        startProgressAnimation();

        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData,
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse JSON. Raw response:', responseText);
            throw new Error('Server returned invalid JSON');
        }

        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Upload failed');
        }

        // Complete the progress
        completeProgress();
        console.log('Upload successful:', data);
        showUploadSuccess(file);
        
        setTimeout(() => {
            // Reload page to show recent documents
            location.reload();
        }, 2000);

    } catch (error) {
        console.error('Upload error:', error);
        showError('Upload failed: ' + error.message);
        resetUploadState();
        enableAllButtons();
    }
}

// Animate progress bar
function startProgressAnimation() {
    if (!progressFill || !progressText) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        // Slow progress animation (file is being processed on server)
        progress += Math.random() * 5;
        if (progress > 95) progress = 95; // Stop at 95% until complete

        progressFill.style.width = progress + '%';
        progressText.textContent = `Processing document... ${Math.round(progress)}%`;

        if (progress >= 95) {
            clearInterval(interval);
            window.progressInterval = null;
        }
    }, 500);
    
    window.progressInterval = interval;
}

// Complete the progress to 100%
function completeProgress() {
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }
    
    if (progressFill && progressText) {
        progressFill.style.width = '100%';
        progressText.textContent = 'Processing complete! 100%';
    }
}

// Disable all buttons
function disableAllButtons() {
    const buttons = document.querySelectorAll('button, .action-btn, .nav-item');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
    });
    
    // Mark that buttons are disabled
    window.buttonsDisabled = true;
}

// Enable all buttons
function enableAllButtons() {
    const buttons = document.querySelectorAll('button, .action-btn, .nav-item');
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    });
    
    // Mark that buttons are enabled
    window.buttonsDisabled = false;
}

// Show upload success
function showUploadSuccess(file) {
    if (!uploadProgress || !uploadSuccess) return;
    
    uploadProgress.style.display = 'none';
    if (uploadSuccess) {
        uploadSuccess.style.display = 'block';
        
        const successSubtext = uploadSuccess.querySelector('.success-subtext');
        if (successSubtext) {
            successSubtext.textContent = `${file.name} has been uploaded and is ready for analysis.`;
        }
    }
}

// Success button actions
if (uploadSuccess) {
    uploadSuccess.addEventListener('click', (e) => {
        if (e.target.classList.contains('primary')) {
            // Start studying action
            if (uploadInterface) {
                uploadInterface.classList.remove('active');
                document.body.style.overflow = '';
                resetUploadState();
            }
            console.log('Starting study session...');
            // Redirect to study page
            // window.location.href = '/study/';
        } else if (e.target.classList.contains('secondary')) {
            // Upload another file
            resetUploadState();
        }
    });
}

// Reset upload state
function resetUploadState() {
    if (dropzone) {
        dropzone.style.display = 'block';
    }
    if (uploadProgress) {
        uploadProgress.style.display = 'none';
    }
    if (uploadSuccess) {
        uploadSuccess.style.display = 'none';
    }
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    if (progressText) {
        progressText.textContent = 'Uploading... 0%';
    }
    if (fileInput) {
        fileInput.value = '';
    }
    if (selectedFile) {
        selectedFile.style.display = 'none';
    }
    if (submitBtn) {
        submitBtn.disabled = true;
    }
}

// Cancel button
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        if (uploadInterface) {
            uploadInterface.classList.remove('active');
            document.body.style.overflow = '';
            resetUploadState();
        }
    });
}

// Escape key functionality
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (uploadInterface && uploadInterface.classList.contains('active')) {
            uploadInterface.classList.remove('active');
            document.body.style.overflow = '';
            resetUploadState();
        } else if (documentLibrary && documentLibrary.classList.contains('active')) {
            closeLibraryModal();
        }
    }
});