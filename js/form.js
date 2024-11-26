document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const countrySelect = document.getElementById('country');
    
    function isCountryRequired() {
        const serviceSelect = document.getElementById('service');
        return serviceSelect.value === 'immigration';
    }

    function updateCountryValidation() {
        countrySelect.required = isCountryRequired();
    }

    document.getElementById('service').addEventListener('change', updateCountryValidation);

    function handleSubmit(event) {
        event.preventDefault();
        
        updateCountryValidation();

        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.id === 'country' && !isCountryRequired()) {
                return;
            }
            
            if (!input.validity.valid) {
                showError(input);
                isValid = false;
            }
        });

        if (!isValid) {
            return false;
        }

        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        submitBtn.disabled = true;
        btnText.textContent = 'Envoi en cours...';

        // Préparer les données pour EmailJS
        const templateParams = {
            to_name: "Paul World Travel",
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            phone: form.querySelector('#phone').value,
            service_type: form.querySelector('#service').value,
            country_interest: isCountryRequired() ? form.querySelector('#country').value : 'N/A',
            message: form.querySelector('#message').value
        };

        emailjs.send('service_2godl6y', 'template_mrmqx3b', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showSuccess();
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                alert('Désolé, une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
                submitBtn.disabled = false;
                btnText.textContent = originalText;
            });

        return false;
    }

    function showSuccess() {
        form.reset();
        document.getElementById('countryGroup').style.display = 'none';
        
        const successMessage = document.getElementById('form-success');
        successMessage.classList.remove('hidden');
        
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        submitBtn.disabled = false;
        btnText.textContent = 'Envoyer';

        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            showError(input);
        });
        
        input.addEventListener('input', function() {
            if (input.validity.valid) {
                clearError(input);
            }
        });
    });

    function showError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            if (input.validity.valueMissing) {
                errorElement.textContent = 'Ce champ est requis';
            } else if (input.validity.typeMismatch) {
                errorElement.textContent = 'Veuillez entrer une valeur valide';
            } else if (input.validity.patternMismatch) {
                errorElement.textContent = input.title || 'Format invalide';
            } else if (input.validity.tooShort) {
                errorElement.textContent = `Minimum ${input.minLength} caractères requis`;
            }
        }
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    form.onsubmit = handleSubmit;
});
