// Get references to HTML elements
const numberInput = document.getElementById('numberInput');
const testStrongBtn = document.getElementById('testStrongBtn');
const testWeakBtn = document.getElementById('testWeakBtn');
const resultsDiv = document.getElementById('results');
const messageBox = document.getElementById('messageBox');

// Get references for new elements
const strongTabBtn = document.getElementById('strongTabBtn');
const weakTabBtn = document.getElementById('weakTabBtn');
const strongTabContent = document.getElementById('strongTabContent');
const weakTabContent = document.getElementById('weakTabContent');
const readMeToggleBtn = document.getElementById('readMeToggleBtn');
const readMeContent = document.getElementById('readMeContent');

// Define a maximum limit for prime generation to prevent RangeError for very large inputs.
// This is a practical limit for browser-based calculations to avoid memory issues.
const MAX_GENERATION_LIMIT = 1000000; // 1 million

function showMessage(message, type = 'error') {
    messageBox.textContent = message;
    messageBox.className = 'message-box show'; // Reset and show
    if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-700');
    } else {
        messageBox.classList.add('bg-blue-100', 'text-blue-700');
    }
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 5000); // Hide after 5 seconds
}

function hideMessage() {
    messageBox.classList.remove('show', 'bg-red-100', 'text-red-700', 'bg-blue-100', 'text-blue-700');
    messageBox.textContent = '';
}

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i = i + 6) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return false;
        }
    }
    return true;
}

function generatePrimesUpTo(limit) {
    if (limit > MAX_GENERATION_LIMIT) {
        console.error(`Attempted to generate primes up to ${limit}, which exceeds MAX_GENERATION_LIMIT.`);
        return [];
    }
    const primes = [];
    const sieve = new Array(limit + 1).fill(true);
    sieve[0] = false;
    sieve[1] = false;
    for (let p = 2; p * p <= limit; p++) {
        if (sieve[p]) {
            for (let i = p * p; i <= limit; i += p) {
                sieve[i] = false;
            }
        }
    }
    for (let p = 2; p <= limit; p++) {
        if (sieve[p]) {
            primes.push(p);
        }
    }
    return primes;
}

let precalculatedPrimes = [];
let maxPrimeLimit = 0;

function ensurePrimesUpTo(requiredLimit) {
    if (requiredLimit > MAX_GENERATION_LIMIT) {
        showMessage(`Cannot test numbers greater than ${MAX_GENERATION_LIMIT} due to performance and memory limitations.`, 'error');
        return false;
    }
    if (requiredLimit > maxPrimeLimit) {
        precalculatedPrimes = generatePrimesUpTo(requiredLimit);
        maxPrimeLimit = requiredLimit;
    }
    return true;
}

function testStrongConjecture(num) {
    if (num <= 2 || num % 2 !== 0) {
        return `<span class="font-semibold text-red-600">Invalid Input:</span> Strong Goldbach Conjecture applies to even numbers greater than 2.`;
    }
    if (!ensurePrimesUpTo(num)) {
        return `<span class="font-semibold text-red-600">Input too large:</span> Number exceeds testing limit of ${MAX_GENERATION_LIMIT}.`;
    }
    for (let i = 0; i < precalculatedPrimes.length; i++) {
        const p1 = precalculatedPrimes[i];
        if (p1 >= num) break;
        const p2 = num - p1;
        if (precalculatedPrimes.includes(p2)) {
            return `<span class="font-semibold text-green-600">Success:</span> ${num} = ${p1} + ${p2}`;
        }
    }
    return `<span class="font-semibold text-red-600">Failed to Verify:</span> No prime pair found for ${num}. This might indicate a counterexample or the number is too large for the current calculation limit.`;
}

function testWeakConjecture(num) {
    if (num <= 5 || num % 2 === 0) {
        return `<span class="font-semibold text-red-600">Invalid Input:</span> Weak Goldbach Conjecture applies to odd numbers greater than 5.`;
    }
    if (!ensurePrimesUpTo(num)) {
        return `<span class="font-semibold text-red-600">Input too large:</span> Number exceeds testing limit of ${MAX_GENERATION_LIMIT}.`;
    }
    for (let i = 0; i < precalculatedPrimes.length; i++) {
        const p1 = precalculatedPrimes[i];
        if (p1 >= num) break;
        for (let j = i; j < precalculatedPrimes.length; j++) {
            const p2 = precalculatedPrimes[j];
            if (p1 + p2 >= num) break;
            const p3 = num - (p1 + p2);
            if (p3 > 1 && precalculatedPrimes.includes(p3)) {
                return `<span class="font-semibold text-green-600">Success:</span> ${num} = ${p1} + ${p2} + ${p3}`;
            }
        }
    }
    return `<span class="font-semibold text-red-600">Failed to Verify:</span> No three primes found for ${num}. This might indicate a counterexample or the number is too large for the current calculation limit.`;
}

testStrongBtn.addEventListener('click', () => {
    hideMessage();
    const num = parseInt(numberInput.value);
    if (isNaN(num)) {
        showMessage('Please enter a valid integer.', 'error');
        resultsDiv.innerHTML = '<span class="text-gray-500">Enter a number and click a test button.</span>';
        return;
    }
    if (num < 1) {
        showMessage('Please enter a positive integer.', 'error');
        resultsDiv.innerHTML = '<span class="text-gray-500">Enter a number and click a test button.</span>';
        return;
    }
    resultsDiv.innerHTML = `<p class="text-gray-600">Testing Strong Conjecture for ${num}...</p>`;
    setTimeout(() => {
        resultsDiv.innerHTML = testStrongConjecture(num);
    }, 10);
});

testWeakBtn.addEventListener('click', () => {
    hideMessage();
    const num = parseInt(numberInput.value);
    if (isNaN(num)) {
        showMessage('Please enter a valid integer.', 'error');
        resultsDiv.innerHTML = '<span class="text-gray-500">Enter a number and click a test button.</span>';
        return;
    }
    if (num < 1) {
        showMessage('Please enter a positive integer.', 'error');
        resultsDiv.innerHTML = '<span class="text-gray-500">Enter a number and click a test button.</span>';
        return;
    }
    resultsDiv.innerHTML = `<p class="text-gray-600">Testing Weak Conjecture for ${num}...</p>`;
    setTimeout(() => {
        resultsDiv.innerHTML = testWeakConjecture(num);
    }, 10);
});

function switchTab(activeTabButton, activeTabContent) {
    document.querySelectorAll('.tabs button').forEach(btn => {
        btn.classList.remove('active-tab-btn');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('active-tab-content');
    });
    activeTabButton.classList.add('active-tab-btn');
    activeTabContent.classList.remove('hidden');
    activeTabContent.classList.add('active-tab-content');
    resultsDiv.innerHTML = 'Enter a number and click a test button above.';
    hideMessage();
}

strongTabBtn.addEventListener('click', () => switchTab(strongTabBtn, strongTabContent));
weakTabBtn.addEventListener('click', () => switchTab(weakTabBtn, weakTabContent));

readMeToggleBtn.addEventListener('click', () => {
    readMeContent.classList.toggle('hidden');
    if (readMeContent.classList.contains('hidden')) {
        readMeToggleBtn.textContent = 'Read Me (Detailed Explanation)';
    } else {
        readMeToggleBtn.textContent = 'Hide Detailed Explanation';
    }
});

// Helper: Validate input and enable/disable test buttons
function validateInput() {
    const value = numberInput.value.trim();
    const num = Number(value);
    let valid = false;
    let strongValid = false;
    let weakValid = false;
    if (/^\d+$/.test(value) && num >= 1 && num <= 1000000) {
        valid = true;
        strongValid = num > 2 && num % 2 === 0;
        weakValid = num > 5 && num % 2 === 1;
    }
    testStrongBtn.disabled = !strongValid;
    testWeakBtn.disabled = !weakValid;
    if (!valid && value !== "") {
        messageBox.textContent = "Please enter a valid positive integer (1 to 1,000,000).";
        messageBox.className = 'message-box show bg-red-100 text-red-700';
    } else {
        messageBox.className = 'message-box';
        messageBox.textContent = '';
    }
}

numberInput.addEventListener('input', validateInput);
window.addEventListener('DOMContentLoaded', validateInput);

switchTab(strongTabBtn, strongTabContent);
ensurePrimesUpTo(1000);
