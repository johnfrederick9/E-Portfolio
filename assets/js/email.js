  document.getElementById("contactForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const templateParams = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        timestamp: new Date().toLocaleString(),
        };

        emailjs.send("service_xfc9vol", "template_iitfvew", templateParams)
        .then(function (response) {
        }, function (error) {
            alert("Failed to send email. Please try again.");
            console.error("EmailJS error:", error);
        });
    });