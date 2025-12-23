// Farmate Web App - Main JavaScript

// DOM Elements
const bookNowBtn = document.getElementById('bookNowBtn');
const loginBtn = document.getElementById('loginBtn');
const bookingModal = document.getElementById('bookingModal');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelectorAll('.close');
const bookingForm = document.getElementById('bookingForm');
const loginForm = document.getElementById('loginForm');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const verifyOtpBtn = document.getElementById('verifyOtp');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Booking button click
    bookNowBtn.addEventListener('click', openBookingModal);
    
    // Login button click
    loginBtn.addEventListener('click', openLoginModal);
    
    // Close modals
    closeModal.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Form submissions
    bookingForm.addEventListener('submit', handleBooking);
    loginForm.addEventListener('submit', handleLogin);
    
    // OTP verification
    verifyOtpBtn.addEventListener('click', verifyOTP);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', mobileMenuToggle);
});

// Open Booking Modal
function openBookingModal() {
    bookingModal.style.display = 'block';
}

// Open Login Modal
function openLoginModal() {
    loginModal.style.display = 'block';
}

// Close Modals
function closeModals() {
    bookingModal.style.display = 'none';
    loginModal.style.display = 'none';
}

// Handle Booking Form Submission
function handleBooking(e) {
    e.preventDefault();
    
    const vehicleType = document.getElementById('vehicleType').value;
    const duration = document.getElementById('duration').value;
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    
    if (!vehicleType || !duration || !location || !date) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real app, this would send data to the backend
    alert(`Booking confirmed!
Vehicle: ${vehicleType}
Duration: ${duration}
Location: ${location}
Date: ${date}`);
    
    // Reset form and close modal
    bookingForm.reset();
    bookingModal.style.display = 'none';
}

// Handle Login Form Submission
function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    
    if (!phone) {
        alert('Please enter your phone number');
        return;
    }
    
    // In a real app, this would send OTP to the phone number
    alert(`OTP sent to ${phone}`);
    
    // Show OTP form
    document.querySelector('.otp-form').style.display = 'block';
}

// Verify OTP
function verifyOTP() {
    const otp = document.getElementById('otp').value;
    
    if (!otp) {
        alert('Please enter the OTP');
        return;
    }
    
    if (otp.length !== 6) {
        alert('Please enter a 6-digit OTP');
        return;
    }
    
    // In a real app, this would verify the OTP with the backend
    alert('Login successful!');
    
    // Close modal and reset form
    loginModal.style.display = 'none';
    loginForm.reset();
    document.querySelector('.otp-form').style.display = 'none';
}

// Mobile Menu Toggle
function mobileMenuToggle() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                mobileMenuToggle();
            }
        }
    });
});

// Simulate vehicle availability data
const vehicleAvailability = {
    tractor: { available: 12, price: 500 },
    harvester: { available: 5, price: 1200 },
    'water-tanker': { available: 8, price: 400 },
    sprayer: { available: 7, price: 300 },
    rotavator: { available: 6, price: 350 },
    'mini-truck': { available: 10, price: 600 }
};

// Update vehicle availability display (would be done via API in real app)
function updateVehicleAvailability() {
    // This would fetch data from the backend in a real application
    console.log('Vehicle availability updated');
}

// Initialize the app
function initApp() {
    updateVehicleAvailability();
    
    // Set min date for booking to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Simulate real-time updates
setInterval(() => {
    // This would update live data from the backend
    console.log('Checking for real-time updates...');
}, 30000); // Check every 30 seconds