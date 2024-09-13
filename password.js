
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#Numbers");
const symbolCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton");
const symbols = "!@#$%^&*()_-+={}[]|\\:;\'<>,.?/";

// Checkboxes ko indicate kar raha hai
const allcheckBox = document.querySelectorAll("input[type=checkbox]");

// By default values
let password = "";
let passwordlength = 10;
let checkcount = 0;

handleSlider();

// Strength circle ko by default grey par karna hai...

// Set password length
function handleSlider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength; // Corrected to use passwordlength
}

// Strength indicator ka color set kar raha hai
function setindicator(color) {
    indicator.style.background = color;
    // shadow yahan add kar sakte ho agar chahein
}

// Math.random se 0 aur 1 ke beech ka random floating point number generate hoga (1 ko exclude karega)
// Math.floor se round off karke integer banayenge
function getRndInteger(min, max) {  
    return Math.floor(Math.random() * (max - min)) + min;
}

// 0 se 9 tak ka random number generate kar raha hai
function generaterandomNumber() {   
    return getRndInteger(0, 9);
}

// Lowercase character generate kar raha hai (ASCII value 97 to 122) (String.fromCharcode=> ye ek numeric number ko convert krke asscii value k hisab se uska 'alphabet return kregA)
function generatelowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));  
}

// Uppercase character generate kar raha hai (ASCII value 65 to 90)
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

// Random symbol generate kar raha hai symbols string se
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// Password ki strength calculate karta hai aur indicator ka color set karta hai
function calcStrength() {
    let hasUpper = false, hasLower = false, hasNum = false, hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setindicator('#0f0'); // Strong password
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordlength >= 6) {
        setindicator('#ff0'); // Medium strength
    } else {
        setindicator('#f00'); // Weak password
    }
}

// Password ko clipboard mein copy karta hai
async function copyContent() {        
    try {
        // Password display se value le kar clipboard mein copy karta hai
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"; // Copy success message
    } catch (e) {
        copyMsg.innerText = "Failed"; // Copy fail message
    }
    copyMsg.classList.add('active');

    // 2 sec ke baad message ko hatata hai
    setTimeout(() => copyMsg.classList.remove('active'), 2000);
}

// Password ko shuffle karta hai (Fisher-Yates method)


       //  sufflefunction=> isme 'i' last index se first ki or jayega and j koi bhi random number nikalega or uske bad dono alg alg index ko point  kr rahe honge then dono ko swaap krwa denge 
function sufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array.join(''); // Array ko string mein convert kar raha hai
}

// Checkbox change hone par track karta hai ki kitne check hue hain
function handelCheckBoxChange() {
    checkcount = 0;
    allcheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkcount++;
    });

    // Special case: agar password length selected checkboxes se kam ho, to password length ko checkbox count ke barabar kar do
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleSlider();
    }
}

// Har checkbox ke liye event listener add kar raha hai
allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handelCheckBoxChange);
});

// Slider input change hone par password length update karta hai
inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
});

// Copy button click hone par copyContent function call karta hai
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
});

// Generate password button click hone par password generate karta hai
generateBtn.addEventListener('click', () => {
    // Agar koi checkbox select nahi hai to kuch nahi karega
    if (checkcount <= 0) return;

    // Password length ko checkcount ke barabar set karta hai agar chhoti hai
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleSlider();
    }

    // Purana password clear kar do
    password = '';

    // Functions ka array banata hai checkbox ke hisaab se
    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generatelowerCase);
    if (symbolCheck.checked) funcArr.push(generateSymbol);
    if (numberCheck.checked) funcArr.push(generaterandomNumber);

    // Jo checkboxes compulsory hain, unka use karke password banata hai
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Remaining length ka password randomize karta hai
    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let rndIndex = getRndInteger(0, funcArr.length);
        password += funcArr[rndIndex]();
    }

    // Password ko shuffle karta hai
    password = sufflePassword(Array.from(password));

    // Password ko display box mein set karta hai
    passwordDisplay.value = password;

    // Password strength calculate karta hai
    calcStrength();
});
