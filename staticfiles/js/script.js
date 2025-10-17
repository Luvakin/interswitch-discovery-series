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

    // Dropdown item clicks
    userDropdown.addEventListener('click', (e) => {
        if (e.target.classList.contains('dropdown-item')) {
            const action = e.target.textContent.trim();
            console.log('Dropdown action:', action);
            
            // Close dropdown
            userProfile.classList.remove('active');
            userDropdown.classList.remove('show');
        }
    });
}

// Close dropdown when clicking outside (only if elements exist)
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

// Close library on backdrop click
if (documentLibrary) {
    documentLibrary.addEventListener('click', (e) => {
        if (e.target === documentLibrary) {
            closeLibraryModal();
        }
    });
}

// Upload interface functionality
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

// Open upload interface
function openUpload() {
    if (uploadInterface) {
        uploadInterface.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Add event listeners only if elements exist
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

// Close on backdrop click
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

// Dropzone click
if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
        if (e.target === dropzone || e.target.closest('.upload-icon, .upload-text, .upload-subtext')) {
            fileInput.click();
        }
    });

    // Drag and drop functionality
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
            handleFileUpload(files[0]);
        }
    });
}

// File input change
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

// Handle file upload
function handleFileUpload(file) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (PDF, DOC, DOCX, TXT, PPT, PPTX)');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
    }

    // Hide dropzone and show progress (only if elements exist)
    if (dropzone && uploadProgress) {
        dropzone.style.display = 'none';
        uploadProgress.style.display = 'block';
        simulateUpload(file);
    }
}

// Simulate upload progress
function simulateUpload(file) {
    if (!progressFill || !progressText) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading ${file.name}... ${Math.round(progress)}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showUploadSuccess(file);
            }, 500);
        }
    }, 200);
}

// Show upload success
function showUploadSuccess(file) {
    if (!uploadProgress || !uploadSuccess) return;
    
    uploadProgress.style.display = 'none';
    uploadSuccess.style.display = 'block';
    
    const successSubtext = uploadSuccess.querySelector('.success-subtext');
    if (successSubtext) {
        successSubtext.textContent = `${file.name} has been uploaded and is ready for analysis.`;
    }
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
        } else if (e.target.classList.contains('secondary')) {
            // Upload another file
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

// Form validation functionality (if form elements exist)
const uploadForm = document.getElementById('uploadForm');
const documentNameInput = document.getElementById('documentName');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const selectedFile = document.getElementById('selectedFile');
const removeFile = document.getElementById('removeFile');

if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted');
    });
}

if (documentNameInput && submitBtn) {
    documentNameInput.addEventListener('input', () => {
        const hasName = documentNameInput.value.trim() !== '';
        const hasFile = fileInput && fileInput.files.length > 0;
        submitBtn.disabled = !(hasName && hasFile);
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        if (uploadInterface) {
            uploadInterface.classList.remove('active');
            document.body.style.overflow = '';
            resetUploadState();
        }
    });
}

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