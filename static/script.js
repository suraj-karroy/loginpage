document.addEventListener('DOMContentLoaded', function () {
    initializeWebsite();
    addCardHoverEffects();
    mobileMenuToggle();
});

// ================= INIT =================
function initializeWebsite() {
    if (document.getElementById('bookingForm')) initializeBooking();
    if (document.getElementById('contactForm')) initializeContactForm();
    if (document.getElementById('feedbackForm')) initializeFeedbackForm();
    if (document.getElementById('loginForm')) initializeLoginForm();
    if (document.getElementById('signupForm')) initializeSignupForm();

    addSmoothScrolling();
    addAnimations();
}

// ================= BOOKING =================
function initializeBooking() {
    const bookingForm = document.getElementById('bookingForm');
    const destinationSelect = document.getElementById('destination');
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');
    const durationInput = document.getElementById('duration');
    const totalAmountSpan = document.getElementById('totalAmount');
    const bookingSummary = document.getElementById('bookingSummary');
    const summaryTotal = document.getElementById('summaryTotal');

    const destinations = {
        north: [
            { value: 'taj-mahal', name: 'Taj Mahal', price: 2500 },
            { value: 'jaipur', name: 'Jaipur', price: 3500 }
        ],
        south: [
            { value: 'kerala', name: 'Kerala', price: 4500 },
            { value: 'goa', name: 'Goa', price: 3200 }
        ]
    };

    const urlParams = new URLSearchParams(window.location.search);
    const region = urlParams.get('region');

    function populateDestinations() {
        if (region && destinations[region]) {
            destinationSelect.innerHTML = '<option value="">Select Destination</option>';
            destinations[region].forEach(dest => {
                const option = document.createElement('option');
                option.value = dest.value;
                option.textContent = `${dest.name} - ₹${dest.price}`;
                destinationSelect.appendChild(option);
            });
        }
    }

    function updateBookingSummary() {
        const destinationValue = destinationSelect.value;
        const adults = parseInt(adultsInput.value) || 0;
        const children = parseInt(childrenInput.value) || 0;
        const duration = parseInt(durationInput.value) || 1;

        let selected = null;
        if (region && destinations[region]) {
            selected = destinations[region].find(d => d.value === destinationValue);
        }

        if (!selected) {
            bookingSummary.innerHTML = 'Select destination';
            totalAmountSpan.textContent = '0';
            summaryTotal.textContent = '₹0';
            return;
        }

        const total = selected.price * (adults + children * 0.5) * duration;

        bookingSummary.innerHTML = `
            <p><b>${selected.name}</b></p>
            <p>${adults} Adults, ${children} Children</p>
            <p>${duration} Days</p>
        `;

        totalAmountSpan.textContent = total;
        summaryTotal.textContent = `₹${total}`;
    }

    populateDestinations();

    destinationSelect.addEventListener('change', updateBookingSummary);
    adultsInput.addEventListener('input', updateBookingSummary);
    childrenInput.addEventListener('input', updateBookingSummary);
    durationInput.addEventListener('input', updateBookingSummary);

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showAlert('Booking Confirmed ✅', 'success');
        bookingForm.reset();
        updateBookingSummary();
    });

    updateBookingSummary();
}

// ================= CONTACT =================
function initializeContactForm() {
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        showAlert('Message Sent ✅', 'success');
        this.reset();
    });
}

// ================= FEEDBACK =================
function initializeFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    const stars = document.querySelectorAll('.rating-stars i');
    const ratingInput = document.getElementById('rating');

    stars.forEach(star => {
        star.addEventListener('click', function () {
            const val = this.dataset.rating;
            ratingInput.value = val;

            stars.forEach(s => {
                s.classList.toggle('active', s.dataset.rating <= val);
            });
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (ratingInput.value == 0) {
            showAlert('Give rating ❗', 'danger');
            return;
        }
        showAlert('Feedback Submitted ⭐', 'success');
        form.reset();
    });
}

// ================= LOGIN =================
function initializeLoginForm() {
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        localStorage.setItem('userLoggedIn', 'true');
        showAlert('Login Success ✅', 'success');

        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    });
}

// ================= SIGNUP =================
function initializeSignupForm() {
    document.getElementById('signupForm').addEventListener('submit', function (e) {
        e.preventDefault();

        showAlert('Account Created ✅', 'success');

        setTimeout(() => {
            window.location.href = '/login/';
        }, 1000);
    });
}

// ================= UTIL =================
function showAlert(msg, type) {
    const div = document.createElement('div');
    div.className = `alert alert-${type}`;
    div.innerText = msg;

    document.body.prepend(div);

    setTimeout(() => div.remove(), 3000);
}

function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function addAnimations() {
    document.querySelectorAll('.card').forEach((el, i) => {
        el.style.animationDelay = `${i * 0.1}s`;
    });
}

function addCardHoverEffects() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-5px)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });
}

function mobileMenuToggle() {
    const btn = document.querySelector('.navbar-toggler');
    const nav = document.querySelector('.navbar-collapse');

    if (btn && nav) {
        btn.addEventListener('click', () => nav.classList.toggle('show'));
    }
}