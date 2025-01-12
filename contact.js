// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact form script loaded');
    
    const contactForm = document.getElementById('contactForm');
    console.log('Contact form found:', !!contactForm);
    
    if(contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Get form data
            const templateParams = {
                to_name: 'Construction Company',
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                service_type: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            console.log('Sending email with params:', templateParams);

            try {
                const response = await emailjs.send(
                    'service_8ryvi07',
                    'template_q0vhup8',
                    templateParams,
                    'TvnAoLSEvDqoYWaXx'
                );

                console.log('SUCCESS!', response.status, response.text);
                showAlert('success', 'Thank you! Your message has been sent.');
                contactForm.reset();
            } catch (error) {
                console.error('FAILED...', error);
                showAlert('error', 'Failed to send message. Please try again.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

export { showAlert }; 