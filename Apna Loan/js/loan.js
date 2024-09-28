document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanApplicationForm');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const creditScoreDiv = document.getElementById('creditScore');
    const formSections = document.querySelectorAll('.form-section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    let currentStep = 1;

    
    const savedData = JSON.parse(localStorage.getItem('mmseLoanApplication')) || {};

    
    Object.keys(savedData).forEach(key => {
        const input = form.elements[key];
        if (input) {
            input.value = savedData[key];
        }
    });

    function showStep(step) {
        formSections.forEach((section, index) => {
            section.classList.toggle('active', index + 1 === step);
        });
        timelineItems.forEach((item, index) => {
            item.classList.toggle('active', index + 1 <= step);
        });
        prevBtn.classList.toggle('hidden', step === 1);
        nextBtn.textContent = step === formSections.length ? 'Submit' : 'Next';
    }

    function validateStep(step) {
        const currentSection = document.querySelector(`.form-section[data-step="${step}"]`);
        const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim() || !input.checkValidity()) {
                isValid = false;
                input.classList.add('error');
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.classList.add('error');
                    errorMsg.textContent = input.validationMessage || 'This field is required';
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                }
            } else {
                input.classList.remove('error');
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('error')) {
                    input.nextElementSibling.remove();
                }
            }
        });

        return isValid;
    }

    function calculateCreditScore(data) {
        let score = 500; 

        
        if (data.aadhaar && data.pan) {
            score += 50;
        }

        // Years in business
        score += Math.min(parseFloat(data.yearsInBusiness) * 15, 100);

        // Annual revenue
        const revenueScore = Math.min(parseFloat(data.annualRevenue) / 50000, 100);
        score += revenueScore;

        // Profitable
        const profitMargin = (parseFloat(data.monthlyRevenue) - parseFloat(data.monthlyExpenses)) / parseFloat(data.monthlyRevenue);
        if (profitMargin > 0.2) score += 50;
        else if (profitMargin > 0.1) score += 25;

        // Debt-to-income ratio
        const dti = parseFloat(data.outstandingLoans) / parseFloat(data.annualRevenue);
        if (dti < 0.2) score += 50;
        else if (dti < 0.4) score += 25;

        // Loan amount to revenue ratio
        const loanToRevenueRatio = parseFloat(data.loanAmount) / parseFloat(data.annualRevenue);
        if (loanToRevenueRatio < 0.2) score += 50;
        else if (loanToRevenueRatio < 0.5) score += 25;

        // Business type
        if (data.businessType === 'medium') score += 30;
        else if (data.businessType === 'small') score += 20;
        else if (data.businessType === 'micro') score += 10;

        // Number of employees
        score += Math.min(parseInt(data.numEmployees) * 2, 50);

        // Max the score at 850
        return Math.min(Math.round(score), 850);
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < formSections.length) {
                currentStep++;
                showStep(currentStep);
            } else {
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                localStorage.setItem('mmseLoanApplication', JSON.stringify(data));

                const creditScore = calculateCreditScore(data);
                creditScoreDiv.textContent = `Estimated Credit Score: ${creditScore}`;
                creditScoreDiv.classList.remove('hidden');

                console.log('Form submitted:', data);
                alert('Loan application submitted successfully!');
            }
        }
    });

    
    form.addEventListener('input', function(e) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('mmseLoanApplication', JSON.stringify(data));
    });

    
    showStep(currentStep);
});



