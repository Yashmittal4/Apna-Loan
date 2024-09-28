document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('collaboratorForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const formSteps = document.querySelectorAll('.form-step');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const userTypeSelect = document.getElementById('userType');
    const bankFields = document.getElementById('bankFields');
    let currentStep = 1;

    
    const savedData = JSON.parse(localStorage.getItem('collaboratorFormData')) || {};

    function showStep(step) {
        formSteps.forEach((formStep, index) => {
            formStep.style.display = index + 1 === step ? 'block' : 'none';
        });
        timelineItems.forEach((item, index) => {
            item.classList.toggle('active', index + 1 <= step);
        });

        prevBtn.style.display = step === 1 ? 'none' : 'inline-block';
        nextBtn.textContent = step === formSteps.length ? 'Submit' : 'Continue';
    }

    function validateStep(step) {
        const inputs = formSteps[step - 1].querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        return isValid;
    }

    function saveFormData() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('collaboratorFormData', JSON.stringify(data));
    }

    function loadFormData() {
        Object.keys(savedData).forEach(key => {
            const input = form.elements[key];
            if (input) {
                input.value = savedData[key];
            }
        });

        if (savedData.userType === 'bank') {
            bankFields.style.display = 'block';
        }
    }

    userTypeSelect.addEventListener('change', function() {
        bankFields.style.display = this.value === 'bank' ? 'block' : 'none';
        saveFormData();
    });

    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            saveFormData();
            if (currentStep < formSteps.length) {
                currentStep++;
                showStep(currentStep);
            } else {
                
                alert('Form submitted successfully!');
                console.log('Form data:', JSON.parse(localStorage.getItem('collaboratorFormData')));
                
                
                localStorage.removeItem('collaboratorFormData');
            }
        } else {
            alert('Please fill in all required fields before continuing.');
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            show
Step(currentStep);
        }
    });

    form.addEventListener('input', saveFormData);

    
    loadFormData();
    showStep(currentStep);
});


