"use strict";

/* =========================================================
   ADMINISTRATOR CONFIGURATION
========================================================= */

/*
    GOOGLE SHEET CSV:

    Replace xxxxxxxxxxxxxxxxxx with the published Google Sheet CSV URL.

    Required columns:
    ExamNumber, Name, Class, Section, Tamil, English, Mathematics,
    Science, SocialScience, Total, Percentage, Grade
*/
const GOOGLE_SHEET_URL = "xxxxxxxxxxxxxxxxxx";

/*
    SCHOOL LOGO / DRIVE LINK:
    xxxxxxxxxxxxxxxxxx

    A normal Google Drive folder link cannot be used directly as an image.
    Use local image paths or direct, publicly accessible image URLs.
*/

/*
    IMAGE FOLDER / DRIVE LINK:
    xxxxxxxxxxxxxxxxxx

    The website currently uses local files from the images/ folder.
*/

/*
    GOOGLE DRIVE ANNOUNCEMENT LINK:
    xxxxxxxxxxxxxxxxxx

    The announcement cards below use local image files.
*/

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navigationLinks = navLinks.querySelectorAll("a");

function closeMobileMenu() {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) {
        closeMobileMenu();
    }
});

/* =========================================================
   ACTIVITY CAROUSEL DATA

   Edit titles, descriptions and local image paths here.
========================================================= */

const activities = [
    {
        title: "Annual Day",
        category: "Celebration",
        image: "images/annual-day.jpg",
        alt: "Students participating in the school annual day",
        description:
            "A joyful celebration of student talent, achievement and teamwork."
    },
    {
        title: "Sports",
        category: "Health & Fitness",
        image: "images/sports-day.jpg",
        alt: "Students taking part in school sports activities",
        description:
            "Encouraging fitness, discipline, teamwork and healthy competition."
    },
    {
        title: "Cultural Events",
        category: "Arts & Culture",
        image: "images/annual-day.jpg",
        alt: "Students performing during a cultural event",
        description:
            "Celebrating creativity through music, dance, drama and traditional arts."
    },
    {
        title: "Competitions",
        category: "Student Talent",
        image: "images/achievements.jpg",
        alt: "Students receiving awards after school competitions",
        description:
            "Building confidence through quizzes, debates, writing and public speaking."
    },
    {
        title: "Science Exhibition",
        category: "Innovation",
        image: "images/science-exhibition.jpg",
        alt: "Student projects displayed at the science exhibition",
        description:
            "Promoting scientific thinking through models, projects and experiments."
    },
    {
        title: "Field Trips",
        category: "Learning Beyond School",
        image: "images/school.jpg",
        alt: "Students participating in an educational field trip",
        description:
            "Creating meaningful learning experiences beyond the classroom."
    },
    {
        title: "Classroom Activities",
        category: "Active Learning",
        image: "images/school.jpg",
        alt: "Students participating in classroom learning activities",
        description:
            "Interactive lessons that encourage curiosity and critical thinking."
    },
    {
        title: "Achievements",
        category: "Proud Moments",
        image: "images/achievements.jpg",
        alt: "Students celebrating academic and extracurricular achievements",
        description:
            "Recognising the dedication and success of our students and teachers."
    }
];

const activityTrack = document.getElementById("activityTrack");
const activityDots = document.getElementById("activityDots");
const activityPrevious = document.getElementById("activityPrevious");
const activityNext = document.getElementById("activityNext");
const activityCarousel = document.getElementById("activityCarousel");

let currentActivityIndex = 0;
let activityTimer = null;
let touchStartX = 0;

/**
 * Creates the activity slides and carousel controls.
 */
function createActivityCarousel() {
    const slideFragment = document.createDocumentFragment();
    const dotFragment = document.createDocumentFragment();

    activities.forEach((activity, index) => {
        const slide = document.createElement("article");
        slide.className = "activity-slide";
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute(
            "aria-label",
            `${index + 1} of ${activities.length}: ${activity.title}`
        );

        const image = document.createElement("img");
        image.src = activity.image;
        image.alt = activity.alt;
        image.loading = index === 0 ? "eager" : "lazy";

        const caption = document.createElement("div");
        caption.className = "slide-caption";

        const category = document.createElement("span");
        category.textContent = activity.category;

        const title = document.createElement("h3");
        title.textContent = activity.title;

        const description = document.createElement("p");
        description.textContent = activity.description;

        caption.append(category, title, description);
        slide.append(image, caption);
        slideFragment.appendChild(slide);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Show ${activity.title}`);
        dot.addEventListener("click", () => {
            showActivity(index);
            restartActivityTimer();
        });

        dotFragment.appendChild(dot);
    });

    activityTrack.appendChild(slideFragment);
    activityDots.appendChild(dotFragment);

    showActivity(0);
}

/**
 * Displays a selected activity slide.
 */
function showActivity(index) {
    currentActivityIndex =
        (index + activities.length) % activities.length;

    activityTrack.style.transform =
        `translateX(-${currentActivityIndex * 100}%)`;

    const dots = activityDots.querySelectorAll(".carousel-dot");
    const slides = activityTrack.querySelectorAll(".activity-slide");

    dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentActivityIndex;

        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    slides.forEach((slide, slideIndex) => {
        slide.setAttribute(
            "aria-hidden",
            slideIndex === currentActivityIndex ? "false" : "true"
        );
    });
}

function showNextActivity() {
    showActivity(currentActivityIndex + 1);
}

function showPreviousActivity() {
    showActivity(currentActivityIndex - 1);
}

function startActivityTimer() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    stopActivityTimer();
    activityTimer = window.setInterval(showNextActivity, 5000);
}

function stopActivityTimer() {
    if (activityTimer) {
        window.clearInterval(activityTimer);
        activityTimer = null;
    }
}

function restartActivityTimer() {
    stopActivityTimer();
    startActivityTimer();
}

activityPrevious.addEventListener("click", () => {
    showPreviousActivity();
    restartActivityTimer();
});

activityNext.addEventListener("click", () => {
    showNextActivity();
    restartActivityTimer();
});

activityCarousel.addEventListener("mouseenter", stopActivityTimer);
activityCarousel.addEventListener("mouseleave", startActivityTimer);
activityCarousel.addEventListener("focusin", stopActivityTimer);
activityCarousel.addEventListener("focusout", startActivityTimer);

activityCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        showPreviousActivity();
        restartActivityTimer();
    }

    if (event.key === "ArrowRight") {
        showNextActivity();
        restartActivityTimer();
    }
});

activityCarousel.addEventListener(
    "touchstart",
    (event) => {
        touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
);

activityCarousel.addEventListener(
    "touchend",
    (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const distance = touchStartX - touchEndX;

        if (Math.abs(distance) < 45) {
            return;
        }

        if (distance > 0) {
            showNextActivity();
        } else {
            showPreviousActivity();
        }

        restartActivityTimer();
    },
    { passive: true }
);

createActivityCarousel();
startActivityTimer();

/* =========================================================
   ANNOUNCEMENT DATA

   Add, remove or edit announcement objects below.

   Available properties:
   type, title, date, description, image, alt
========================================================= */

const announcements = [
    {
        type: "Annual Day",
        title: "Annual Day Celebration",
        date: "15 February 2026",
        description:
            "Students, parents and staff are warmly invited to our annual day celebration featuring cultural programmes, awards and student performances.",
        image: "images/annual-day.jpg",
        alt: "Students performing during the annual day celebration"
    },
    {
        type: "PTA Meeting",
        title: "Parent-Teacher Association Meeting",
        date: "22 February 2026",
        description:
            "Parents are requested to attend the PTA meeting to discuss student progress, attendance, learning support and upcoming school activities.",
        image: "images/school.jpg",
        alt: "Government Higher Secondary School building"
    },
    {
        type: "Examinations",
        title: "Term Examination Schedule",
        date: "10 March 2026",
        description:
            "The term examination timetable will be shared with students in their classrooms. Students should prepare according to the announced schedule.",
        image: "images/achievements.jpg",
        alt: "Students preparing for school examinations"
    },
    {
        type: "Competition",
        title: "Inter-School Science Competition",
        date: "18 March 2026",
        description:
            "Interested students may register with their science teachers to participate in the inter-school science model and innovation competition.",
        image: "images/science-exhibition.jpg",
        alt: "Students presenting projects at a science exhibition"
    },
    {
        type: "Admissions",
        title: "Admissions Open",
        date: "1 April 2026",
        description:
            "Applications are invited for the new academic year. Contact the school office for eligibility, required documents and admission dates.",
        image: "images/school.jpg",
        alt: "Front view of Government Higher Secondary School"
    },
    {
        type: "Important Notice",
        title: "Sports Practice Schedule",
        date: "8 April 2026",
        description:
            "Selected students should attend sports practice in the school ground at the scheduled time with the required uniform and equipment.",
        image: "images/sports-day.jpg",
        alt: "Students participating in school sports"
    },
    {
        type: "Event",
        title: "Student Achievement Ceremony",
        date: "20 April 2026",
        description:
            "The school will honour students who have achieved distinction in academic, sporting, cultural and scientific activities.",
        image: "images/achievements.jpg",
        alt: "Students receiving achievement awards"
    }
];

const announcementGrid = document.getElementById("announcementGrid");

/**
 * Creates announcement cards.
 * Text is inserted using textContent for safer rendering.
 */
function createAnnouncements() {
    const fragment = document.createDocumentFragment();

    announcements.forEach((announcement) => {
        const card = document.createElement("article");
        card.className = "announcement-card reveal";

        const imageContainer = document.createElement("div");
        imageContainer.className = "announcement-image";

        const image = document.createElement("img");
        image.src = announcement.image;
        image.alt = announcement.alt;
        image.loading = "lazy";

        const type = document.createElement("span");
        type.className = "announcement-type";
        type.textContent = announcement.type;

        imageContainer.append(image, type);

        const body = document.createElement("div");
        body.className = "announcement-body";

        const date = document.createElement("time");
        date.className = "announcement-date";
        date.textContent = announcement.date;

        const title = document.createElement("h3");
        title.textContent = announcement.title;

        const description = document.createElement("p");
        description.className = "announcement-description";
        description.textContent = announcement.description;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "view-more";
        button.textContent = "View More";
        button.setAttribute("aria-expanded", "false");

        button.addEventListener("click", () => {
            const expanded = card.classList.toggle("expanded");

            button.textContent = expanded ? "View Less" : "View More";
            button.setAttribute("aria-expanded", String(expanded));
        });

        body.append(date, title, description, button);
        card.append(imageContainer, body);
        fragment.appendChild(card);
    });

    announcementGrid.appendChild(fragment);
}

createAnnouncements();

/* =========================================================
   GOOGLE SHEET STUDENT RESULT SEARCH
========================================================= */

const resultForm = document.getElementById("resultForm");
const examNumberInput = document.getElementById("examNumber");
const classInput = document.getElementById("studentClass");
const sectionInput = document.getElementById("studentSection");
const resultMessage = document.getElementById("resultMessage");
const resultDisplay = document.getElementById("resultDisplay");
const resultSubmitButton = resultForm.querySelector('button[type="submit"]');

let cachedStudentData = null;

/**
 * Normalizes values before comparing them.
 */
function normalizeValue(value) {
    return String(value ?? "").trim().toLowerCase();
}

/**
 * Displays a status message.
 */
function showResultMessage(message, type) {
    resultMessage.textContent = message;
    resultMessage.className = `result-message visible ${type}`;
}

/**
 * Clears the result status and table.
 */
function clearResultOutput() {
    resultMessage.textContent = "";
    resultMessage.className = "result-message";
    resultDisplay.replaceChildren();
}

/**
 * Parses CSV text, including quoted commas and escaped quotes.
 */
function parseCSV(csvText) {
    const rows = [];
    let row = [];
    let field = "";
    let insideQuotes = false;

    for (let index = 0; index < csvText.length; index += 1) {
        const character = csvText[index];
        const nextCharacter = csvText[index + 1];

        if (character === '"' && insideQuotes && nextCharacter === '"') {
            field += '"';
            index += 1;
        } else if (character === '"') {
            insideQuotes = !insideQuotes;
        } else if (character === "," && !insideQuotes) {
            row.push(field);
            field = "";
        } else if (
            (character === "\n" || character === "\r") &&
            !insideQuotes
        ) {
            if (character === "\r" && nextCharacter === "\n") {
                index += 1;
            }

            row.push(field);

            if (row.some((value) => value.trim() !== "")) {
                rows.push(row);
            }

            row = [];
            field = "";
        } else {
            field += character;
        }
    }

    row.push(field);

    if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
    }

    if (rows.length < 2) {
        return [];
    }

    const headers = rows[0].map((header) =>
        header.replace(/^\uFEFF/, "").trim()
    );

    return rows.slice(1).map((values) => {
        const record = {};

        headers.forEach((header, index) => {
            record[header] = String(values[index] ?? "").trim();
        });

        return record;
    });
}

/**
 * Fetches data from the published Google Sheet CSV.
 */
async function loadStudentData() {
    if (
        !GOOGLE_SHEET_URL ||
        GOOGLE_SHEET_URL === "xxxxxxxxxxxxxxxxxx"
    ) {
        throw new Error("Google Sheet URL has not been configured.");
    }

    if (cachedStudentData) {
        return cachedStudentData;
    }

    const response = await fetch(GOOGLE_SHEET_URL, {
        method: "GET",
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Google Sheet request failed: ${response.status}`);
    }

    const csvText = await response.text();
    const parsedData = parseCSV(csvText);

    if (!parsedData.length) {
        throw new Error("The Google Sheet contains no readable student data.");
    }

    cachedStudentData = parsedData;
    return cachedStudentData;
}

/**
 * Creates an element containing a label and a value.
 */
function createSummaryItem(labelText, valueText) {
    const container = document.createElement("div");
    const label = document.createElement("span");
    const value = document.createElement("strong");

    label.textContent = labelText;
    value.textContent = valueText || "—";

    container.append(label, value);
    return container;
}

/**
 * Adds a row to the result table.
 */
function addTableRow(tableSection, labelText, valueText) {
    const row = document.createElement("tr");
    const labelCell = document.createElement("td");
    const valueCell = document.createElement("td");

    labelCell.textContent = labelText;
    valueCell.textContent = valueText || "—";

    row.append(labelCell, valueCell);
    tableSection.appendChild(row);
}

/**
 * Displays only the matched student's result.
 */
function displayStudentResult(student) {
    resultDisplay.replaceChildren();

    const summary = document.createElement("div");
    summary.className = "student-summary";

    summary.append(
        createSummaryItem("Student Name", student.Name),
        createSummaryItem("Exam Number", student.ExamNumber),
        createSummaryItem("Class", student.Class),
        createSummaryItem("Section", student.Section)
    );

    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-wrapper";

    const table = document.createElement("table");
    table.className = "result-table";

    const caption = document.createElement("caption");
    caption.textContent = `Examination result for ${student.Name}`;
    caption.className = "visually-hidden";

    const tableHead = document.createElement("thead");
    const headingRow = document.createElement("tr");
    const subjectHeading = document.createElement("th");
    const markHeading = document.createElement("th");

    subjectHeading.scope = "col";
    markHeading.scope = "col";
    subjectHeading.textContent = "Subject";
    markHeading.textContent = "Marks";

    headingRow.append(subjectHeading, markHeading);
    tableHead.appendChild(headingRow);

    const tableBody = document.createElement("tbody");

    addTableRow(tableBody, "Tamil", student.Tamil);
    addTableRow(tableBody, "English", student.English);
    addTableRow(tableBody, "Mathematics", student.Mathematics);
    addTableRow(tableBody, "Science", student.Science);
    addTableRow(tableBody, "Social Science", student.SocialScience);

    const tableFoot = document.createElement("tfoot");

    addTableRow(tableFoot, "Total", student.Total);
    addTableRow(tableFoot, "Percentage", student.Percentage);
    addTableRow(tableFoot, "Grade", student.Grade);

    table.append(caption, tableHead, tableBody, tableFoot);
    tableWrapper.appendChild(table);
    resultDisplay.append(summary, tableWrapper);
}

resultForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearResultOutput();

    const examNumber = examNumberInput.value.trim();
    const studentClass = classInput.value.trim();
    const studentSection = sectionInput.value.trim();

    if (!examNumber || !studentClass || !studentSection) {
        showResultMessage(
            "Please enter the Examination Number, Class and Section.",
            "error"
        );
        return;
    }

    resultSubmitButton.disabled = true;
    showResultMessage("Retrieving the student result…", "loading");

    try {
        const students = await loadStudentData();

        const matchedStudent = students.find((student) => {
            return (
                normalizeValue(student.ExamNumber) ===
                    normalizeValue(examNumber) &&
                normalizeValue(student.Class) ===
                    normalizeValue(studentClass) &&
                normalizeValue(student.Section) ===
                    normalizeValue(studentSection)
            );
        });

        if (!matchedStudent) {
            resultDisplay.replaceChildren();
            showResultMessage(
                "No result found. Please check the Examination Number, Class and Section.",
                "error"
            );
            return;
        }

        showResultMessage(
            "Result found successfully.",
            "success"
        );

        displayStudentResult(matchedStudent);
    } catch (error) {
        console.error("Result retrieval error:", error);

        resultDisplay.replaceChildren();

        showResultMessage(
            "Unable to retrieve results at this time. Please try again later.",
            "error"
        );
    } finally {
        resultSubmitButton.disabled = false;
    }
});

/* =========================================================
   SCROLL REVEAL ANIMATION
========================================================= */

function initializeRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, revealObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}

initializeRevealAnimations();

/* =========================================================
   ACTIVE NAVIGATION LINK
========================================================= */

const pageSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                navigationLinks.forEach((link) => {
                    const sectionId = link.getAttribute("href");
                    link.classList.toggle(
                        "active",
                        sectionId === `#${entry.target.id}`
                    );
                });
            });
        },
        {
            threshold: 0.25,
            rootMargin: "-20% 0px -60% 0px"
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}