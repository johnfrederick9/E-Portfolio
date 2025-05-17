// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate required fields
            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.style.color = 'red';
                return;
            }
            
            try {
                // Send data to Firebase
                await db.collection('messages').add({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Show success message
                formStatus.textContent = 'Message sent successfully!';
                formStatus.style.color = 'green';
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                console.error('Error sending message:', error);
                formStatus.textContent = 'Error sending message. Please try again.';
                formStatus.style.color = 'red';
            }
        });
    }
});