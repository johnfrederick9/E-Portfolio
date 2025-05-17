// Function to handle direct CV download from Firestore
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadCV');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show loading indication
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp Downloading...';
            
            // Track the download event in analytics
            if (typeof analytics !== 'undefined') {
                analytics.logEvent('cv_download', {
                    content_type: 'resume_pdf',
                    content_id: 'john_frederick_gelay_cv'
                });
            }
    
            // Get the CV data from Firestore
            db.collection('resume').doc('cv').get()
                .then((doc) => {
                    // Reset button text
                    this.innerHTML = originalText;
                    
                    if (doc.exists && doc.data().pdfBase64) {
                        // Get base64 data from Firestore
                        const pdfBase64 = doc.data().pdfBase64;
                        
                        // Create blob from base64
                        const binaryString = window.atob(pdfBase64);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
                        
                        // Create download link
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(pdfBlob);
                        link.download = 'John_Frederick_Gelay_CV.pdf';
                        
                        // Trigger download
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // Clean up the URL object
                        setTimeout(() => URL.revokeObjectURL(link.href), 100);
                    } else {
                        alert("CV not yet uploaded. Please upload your CV through the admin panel first.");
                    }
                })
                .catch((error) => {
                    // Reset button text
                    this.innerHTML = originalText;
                    
                    console.error("Error getting CV document:", error);
                    alert("Resume download failed. Please try again later.");
                });
        });
    }
});