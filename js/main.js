// Mobile menu functionality
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
	navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Service form functionality
function openServiceForm(service) {
	// Store the service type for form submission
	localStorage.setItem('selectedService', service);
	window.location.href = 'service-form.html';
}

// Form submission handler
function handleFormSubmit(event) {
	event.preventDefault();
	
	// Validate all fields before submission
	const form = event.target;
	const inputs = form.querySelectorAll('input, textarea, select');
	let isValid = true;
	
	inputs.forEach(input => {
		if (!validateInput(input)) {
			isValid = false;
		}
	});
	
	if (!isValid) {
		alert('Please fill in all required fields correctly.');
		return;
	}

	const formData = new FormData(form);
	const data = Object.fromEntries(formData.entries());
	
	// Show success message
	const successMessage = document.getElementById('successMessage');
	if (successMessage) {
		successMessage.style.display = 'block';
		successMessage.classList.add('show');
		setTimeout(() => {
			successMessage.classList.remove('show');
			setTimeout(() => {
				successMessage.style.display = 'none';
			}, 300);
		}, 3000);
	}

	// Prepare email content
	const subject = encodeURIComponent(`${data.service ? `${data.service.toUpperCase()} Service Request` : 'Service Request'} from ${data.name}`);
	const body = encodeURIComponent(`
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company || 'Not specified'}
Service: ${data.service || 'General Inquiry'}
Details: ${data.details || 'No additional details provided'}
	`);

	// Open default email client with new email address
	window.location.href = `mailto:gemproservice.in@gmail.com?subject=${subject}&body=${body}`;

	// Reset form
	form.reset();
}


// Search message functionality
function showSearchMessage() {
	const message = document.createElement('div');
	message.className = 'search-message';
	message.textContent = 'Feature coming soon! We are working on making this feature available.';
	document.body.appendChild(message);

	setTimeout(() => {
		message.classList.add('show');
		setTimeout(() => {
			message.classList.remove('show');
			setTimeout(() => {
				document.body.removeChild(message);
			}, 300);
		}, 3000);
	}, 100);
}

// Input validation
function validateInput(input) {
	if (input.required && !input.value.trim()) {
		input.classList.add('error');
		return false;
	}

	if (input.type === 'email' && !validateEmail(input.value)) {
		input.classList.add('error');
		return false;
	}

	if (input.type === 'tel' && !validatePhone(input.value)) {
		input.classList.add('error');
		return false;
	}

	input.classList.remove('error');
	return true;
}

// Email validation
function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email.trim());
}

// Phone validation
function validatePhone(phone) {
	const re = /^[0-9]{10}$/;
	return re.test(phone.trim());
}

// Initialize form handlers
document.addEventListener('DOMContentLoaded', () => {
	// Set selected service if coming from service page
	const selectedService = localStorage.getItem('selectedService');
	const serviceSelect = document.querySelector('select[name="service"]');
	if (selectedService && serviceSelect) {
		serviceSelect.value = selectedService;
	}

	// Form validation
	const forms = document.querySelectorAll('form');
	forms.forEach(form => {
		const inputs = form.querySelectorAll('input, textarea, select');
		
		inputs.forEach(input => {
			input.addEventListener('blur', () => validateInput(input));
			input.addEventListener('focus', () => input.classList.remove('error'));
			input.addEventListener('input', () => {
				if (input.classList.contains('error')) {
					validateInput(input);
				}
			});
		});

		form.addEventListener('submit', handleFormSubmit);
	});

	// Clear selected service when leaving form page
	window.addEventListener('unload', () => {
		localStorage.removeItem('selectedService');
	});
});