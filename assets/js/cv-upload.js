// Modal functionality for admin panel
document.addEventListener('DOMContentLoaded', function() {
    const adminButton = document.getElementById('adminButton');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.getElementById('closeModal');
    const uploadStatus = document.getElementById('uploadStatus');
    
    // Open modal when admin button is clicked
    adminButton.addEventListener('click', function() {
        adminModal.style.display = 'flex';
    });
    
    // Close modal when X is clicked
    closeModal.addEventListener('click', function() {
        adminModal.style.display = 'none';
        uploadStatus.textContent = '';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === adminModal) {
            adminModal.style.display = 'none';
            uploadStatus.textContent = '';
        }
    });
});

// Function to convert PDF file to base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Get the base64 string by removing the data URL prefix
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}

// Upload CV to Firestore
async function uploadCVToFirestore() {
    const uploadStatus = document.getElementById('uploadStatus');
    const fileInput = document.getElementById('pdfFileInput');
    
    // Clear previous status
    uploadStatus.textContent = 'Processing...';
    uploadStatus.style.color = 'green';
    
    if (!fileInput.files || fileInput.files.length === 0) {
        uploadStatus.textContent = 'Please select a PDF file first';
        uploadStatus.style.color = 'red';
        return;
    }
    
    const file = fileInput.files[0];
    
    // Make sure it's a PDF
    if (file.type !== 'application/pdf') {
        uploadStatus.textContent = 'Please select a PDF file';
        uploadStatus.style.color = 'red';
        return;
    }
    
    try {
        // Convert the file to base64
        const base64Data = await convertFileToBase64(file);
        
        // Check file size - Firestore has a 1MB limit per document
        if (base64Data.length > 750000) {  // ~750KB to be safe
            uploadStatus.textContent = 'PDF file is too large. Please use a smaller file (max 750KB)';
            uploadStatus.style.color = 'red';
            return;
        }
        
        // Save to Firestore
        await db.collection('resume').doc('cv').set({
            pdfBase64: base64Data,
            fileName: file.name,
            uploadDate: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        uploadStatus.textContent = 'Resume uploaded successfully!';
        uploadStatus.style.color = 'green';
    } catch (error) {
        console.error('Error uploading Resume:', error);
        uploadStatus.textContent = 'Failed to upload Resume: ' + error.message;
        uploadStatus.style.color = 'red';
    }
}