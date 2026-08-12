/* ============================================================
   GOVERNMENT HIGHER SECONDARY SCHOOL WEBSITE - JAVASCRIPT
   ============================================================ */

// ============================================================
// CONFIGURATION
// ============================================================

// GOOGLE SHEET CSV LINK - REPLACE WITH YOUR PUBLISHED CSV URL
// Instructions:
// 1. Create a Google Sheet with columns: ExamNumber, Name, Class, Section, Tamil, English, Mathematics, Science, SocialScience, Total, Percentage, Grade
// 2. Click "Share" > Change permissions to "Anyone with the link can view"
// 3. File > Export > Comma Separated Values
// 4. Copy the published CSV link below
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv";

// ANNOUNCEMENTS DATA - Edit here to add/modify announcements
const ANNOUNCEMENTS_DATA = [
    {
        id: 1,
        title: "Annual Day Celebration",
        date: "2026-03-15",
        icon: "fa-theater-masks",
        description: "Join us for our grand Annual Day celebration featuring student performances, cultural programs, and awards ceremony.",
        details: "Date: March 15, 2026 | Time: 4:00 PM | Venue: School Auditorium"
    },
    {
        id: 2,
        title: "PTA Meeting Notice",
        date: "2026-02-28",
        icon: "fa-users",
        description: "Important Parent-Teacher Association meeting to discuss school development and student progress.",
        details: "Date: February 28, 2026 | Time: 3:00 PM | Venue: Conference Hall"
    },
    {
        id: 3,
        title: "Board Examinations 2026",
        date: "2026-03-01",
        icon: "fa-pen-fancy",
        description: "Class XI and XII board examinations commence. Best wishes to all students for their exams.",
        details: "Exam Schedule: March 1 - April 15, 2026"
    },
    {
        id: 4,
        title: "Science Exhibition",
        date: "2026-02-20",
        icon: "fa-flask",
        description: "Showcase of innovative student projects and scientific research. Open to parents and visitors.",
        details: "Date: February 20, 2026 | Time: 10:00 AM - 3:00 PM | Venue: Science Block"
    },
    {
        id: 5,
        title: "Sports Day",
        date: "2026-03-05",
        icon: "fa-running",
        description: "Annual sports day featuring athletics, team sports, and inter-house competitions.",
        details: "Date: March 5, 2026 | Time: 8:00 AM - 12:00 PM | Venue: School Grounds"
    },
    {
        id: 6,
        title: "Admissions Open - Class XI",
        date: "2026-02-01",
        icon: "fa-user-plus",
        description: "Admissions now open for Class XI. Apply online through our school portal. Deadline: February 28, 2026.",
        details: "Application Link: www.ghss.edu.in/admissions"
    }
];

// SCHOOL DETAILS - Edit these
const SCHOOL_INFO = {
    name: "Government Higher Secondary School",
    address: "School Street, District Name, Tamil Nadu 600001",
    phone: "+91 (044) XXXX-XXXX",
    email: "info@ghss.edu.in",
    students: "1200+",
    teachers: "85",
    classes: "45",
    yearsOfService: "35"
};

// ============================================================
// NAVIGATION & HAMBURGER MENU
// ============================================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================================
// CAROUSEL / SLIDESHOW
// ============================================================

let currentSlide = 0;
const carouselItems = document.querySelectorAll('.carousel-item');
const totalSlides = carouselItems.length;

function createDots() {
    const dotsContainer = document.getElementById('dots');
    if (!dotsContainer) return;
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function updateCarousel() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    
    // Scroll carousel
    const itemWidth = carousel.children[0].offsetWidth;
    const gap = 20;
    carousel.style.transform = `translateX(-${currentSlide * (itemWidth + gap)}px)`;
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlide) dot.classList.add('active');
    });
}

function moveCarousel(direction) {
    currentSlide += direction;
    
    // Wrap around
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Auto-play carousel (optional)
function autoPlayCarousel() {
    setInterval(() => {
        moveCarousel(1);
    }, 5000); // Change slide every 5 seconds
}

// Initialize carousel
if (carouselItems.length > 0) {
    createDots();
    updateCarousel();
    autoPlayCarousel();
    
    // Update on window resize
    window.addEventListener('resize', updateCarousel);
}

// ============================================================
// RESULTS SEARCH - GOOGLE SHEETS INTEGRATION
// ============================================================

let studentsData = [];

// Fetch data from Google Sheets on page load
async function fetchStudentData() {
    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const csvText = await response.text();
        parseCSVData(csvText);
        console.log('Student data loaded successfully');
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
}

// Parse CSV data
function parseCSVData(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');
        
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j] ? currentLine[j].trim() : '';
        }
        
        if (obj.ExamNumber) {
            studentsData.push(obj);
        }
    }
}

// Search for student results
function searchResults() {
    const examNumber = document.getElementById('examNumber').value.trim().toUpperCase();
    const studentClass = document.getElementById('studentClass').value;
    const section = document.getElementById('section').value.trim().toUpperCase();
    const resultContainer = document.getElementById('resultContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    // Validation
    if (!examNumber || !studentClass || !section) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Please fill in all fields.';
        resultContainer.style.display = 'none';
        return;
    }
    
    // Search for student
    const student = studentsData.find(s => 
        s.ExamNumber === examNumber && 
        s.Class === studentClass && 
        s.Section === section
    );
    
    if (student) {
        displayResult(student);
        errorMessage.style.display = 'none';
    } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'No result found. Please check the Examination Number, Class and Section.';
        resultContainer.style.display = 'none';
    }
}

// Display student result
function displayResult(student) {
    const resultContainer = document.getElementById('resultContainer');
    const resultDisplay = document.getElementById('resultDisplay');
    
    // Determine grade color
    const percentage = parseFloat(student.Percentage) || 0;
    let gradeClass = '';
    if (percentage >= 90) gradeClass = 'grade-excellent';
    else if (percentage >= 75) gradeClass = 'grade-good';
    else gradeClass = 'grade-average';
    
    // Create result table
    const resultHTML = `
        <div class="success-message">
            <strong>Result Found!</strong> Here are the details:
        </div>
        <table class="result-table">
            <tr>
                <th>Exam Number</th>
                <td>${student.ExamNumber}</td>
            </tr>
            <tr>
                <th>Student Name</th>
                <td>${student.Name}</td>
            </tr>
            <tr>
                <th>Class</th>
                <td>${student.Class}</td>
            </tr>
            <tr>
                <th>Section</th>
                <td>${student.Section}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
                <th colspan="2" style="text-align: left; font-weight: bold;">Subject Marks</th>
            </tr>
            <tr>
                <th>Tamil</th>
                <td>${student.Tamil}</td>
            </tr>
            <tr>
                <th>English</th>
                <td>${student.English}</td>
            </tr>
            <tr>
                <th>Mathematics</th>
                <td>${student.Mathematics}</td>
            </tr>
            <tr>
                <th>Science</th>
                <td>${student.Science}</td>
            </tr>
            <tr>
                <th>Social Science</th>
                <td>${student.SocialScience}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
                <th>Total Marks</th>
                <td style="font-weight: bold;">${student.Total}</td>
            </tr>
            <tr>
                <th>Percentage</th>
                <td style="font-weight: bold;">${student.Percentage}%</td>
            </tr>
            <tr>
                <th>Grade</th>
                <td class="${gradeClass}" style="font-size: 1.1rem;">${student.Grade}</td>
            </tr>
        </table>
    `;
    
    resultDisplay.innerHTML = resultHTML;
    resultContainer.style.display = 'block';
}

// Clear search
function clearSearch() {
    document.getElementById('examNumber').value = '';
    document.getElementById('studentClass').value = '';
    document.getElementById('section').value = '';
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
}

// ============================================================
// ANNOUNCEMENTS
// ============================================================

function loadAnnouncements() {
    const announcementsGrid = document.getElementById('announcementsGrid');
    if (!announcementsGrid) return;
    
    announcementsGrid.innerHTML = '';
    
    ANNOUNCEMENTS_DATA.forEach(announcement => {
        const card = document.createElement('div');
        card.className = 'announcement-card';
        
        const date = new Date(announcement.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        card.innerHTML = `
            <div class="announcement-image">
                <i class="fas ${announcement.icon}"></i>
            </div>
            <div class="announcement-content">
                <div class="announcement-date">${formattedDate}</div>
                <h3>${announcement.title}</h3>
                <p>${announcement.description}</p>
                <button class="btn btn-secondary" onclick="showAnnouncementDetails(${announcement.id})">
                    View More
                </button>
            </div>
        `;
        
        announcementsGrid.appendChild(card);
    });
}

// Show announcement details (simple alert - can be replaced with modal)
function showAnnouncementDetails(id) {
    const announcement = ANNOUNCEMENTS_DATA.find(a => a.id === id);
    if (announcement) {
        alert(`${announcement.title}\n\n${announcement.details}`);
    }
}

// ============================================================
// SCHOOL INFO DISPLAY
// ============================================================

function loadSchoolInfo() {
    // Update statistics
    const studentCount = document.getElementById('studentCount');
    const teacherCount = document.getElementById('teacherCount');
    const classCount = document.getElementById('classCount');
    const yearsCount = document.getElementById('yearsCount');
    
    if (studentCount) studentCount.textContent = SCHOOL_INFO.students;
    if (teacherCount) teacherCount.textContent = SCHOOL_INFO.teachers;
    if (classCount) classCount.textContent = SCHOOL_INFO.classes;
    if (yearsCount) yearsCount.textContent = SCHOOL_INFO.yearsOfService;
    
    // Update contact information
    const schoolAddress = document.getElementById('schoolAddress');
    const schoolPhone = document.getElementById('schoolPhone');
    const schoolEmail = document.getElementById('schoolEmail');
    
    if (schoolAddress) schoolAddress.textContent = SCHOOL_INFO.address;
    if (schoolPhone) schoolPhone.textContent = SCHOOL_INFO.phone;
    if (schoolEmail) schoolEmail.textContent = SCHOOL_INFO.email;
    
    // Update call and email buttons
    const callButtons = document.querySelectorAll('a[href^="tel:"]');
    const emailButtons = document.querySelectorAll('a[href^="mailto:"]');
    
    callButtons.forEach(btn => {
        btn.href = `tel:${SCHOOL_INFO.phone.replace(/[^0-9+]/g, '')}`;
    });
    
    emailButtons.forEach(btn => {
        btn.href = `mailto:${SCHOOL_INFO.email}`;
    });
}

// ============================================================
// SMOOTH SCROLLING (Enhanced)
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================================
// KEYBOARD ACCESSIBILITY
// ============================================================

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Load announcements
    loadAnnouncements();
    
    // Load school info
    loadSchoolInfo();
    
    // Fetch student data from Google Sheets
    // Uncomment the line below when you have set up your Google Sheet URL
    // fetchStudentData();
    
    // Add a message if Google Sheet is not configured
    const searchCard = document.querySelector('.search-card');
    if (searchCard && studentsData.length === 0) {
        console.log('Note: Google Sheet not connected yet. Update GOOGLE_SHEET_URL in script.js');
    }
});

// ============================================================
// FORM INPUT ENHANCEMENTS
// ============================================================

// Uppercase exam number input
const examNumberInput = document.getElementById('examNumber');
if (examNumberInput) {
    examNumberInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
}

// Uppercase section input
const sectionInput = document.getElementById('section');
if (sectionInput) {
    sectionInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
}

// Enter key to search
const studentClassInput = document.getElementById('studentClass');
const searchInputs = [examNumberInput, studentClassInput, sectionInput];
searchInputs.forEach(input => {
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchResults();
            }
        });
    }
});

// ============================================================
// PERFORMANCE OPTIMIZATION
// ============================================================

// Lazy loading (Future enhancement)
if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                // Load lazy content here
                observer.unobserve(element);
            }
        });
    });
    
    lazyElements.forEach(el => imageObserver.observe(el));
}

// ============================================================
// DEBUG / HELPER FUNCTIONS
// ============================================================

// Function to test Google Sheets data
function testGoogleSheetConnection() {
    if (studentsData.length > 0) {
        console.log('✓ Google Sheet connected successfully');
        console.log(`✓ Total students loaded: ${studentsData.length}`);
        console.log('Sample record:', studentsData[0]);
        return true;
    } else {
        console.log('✗ Google Sheet not configured or empty');
        console.log('Please update GOOGLE_SHEET_URL in script.js');
        return false;
    }
}

// Expose test function to console
window.testGoogleSheetConnection = testGoogleSheetConnection;
console.log('Tip: Run testGoogleSheetConnection() in console to verify Google Sheets setup.');