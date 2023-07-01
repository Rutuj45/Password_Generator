//display
const passwordDisplay = document.querySelector(".display");

//copy password
const copyBtn = document.querySelector(".copy-btn");
const copyMsg = document.querySelector(".copy-msg");

//length
const lengthDisplay = document.querySelector(".length-display");
const lengthSlider = document.querySelector("#slider");


//checkboxes
const uppercase = document.querySelector("#check1");
const lowercase = document.querySelector("#check2");
const number = document.querySelector("#check3");
const symbol = document.querySelector("#check4");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");

//indicator
const indicator = document.querySelector(".indicator");

//generate button
const generateButton = document.querySelector("#generateButton");

const symbols = '~!@#$%^&*()_+={}[]|;:<,>.?/';

let password="";
let passwordLength = 10;

uppercase.checked = true;
let checkCount=1;

//set password length input slider background
function handSlider(){
    lengthSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min =lengthSlider.min;
    const max =lengthSlider.max;

    lengthSlider.style.backgroundSize = 
    ((passwordLength-min)*100)/(max-min) + "% 100%";

}
handSlider();

//handle input event on length slider
lengthSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handSlider();
});

allcheckbox.forEach((checkbox) =>{
    checkbox.addEventListener('change',countCheckedCb);
});

function countCheckedCb(){
    checkCount=0;

    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength =checkCount;
        handSlider();
    }

}

async function copyContent(){

    try{

        if(password === ""){
            alert("first Generate password to copy");
            throw 'Falied';
        }

        await navigator.clipboard.writeText(password);
        copyMsg.innerText = "Copied";
    }

    catch(error){
        copyMsg.innerText = error;
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

copyBtn.addEventListener("click",()=> {
    copyContent();
});


// genarate any random no. b/w min and max(exclusive)
function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min) + min);
}

// generate any random no. b/w 0- 9
function genarateNumber(){
    return getRandomInteger(1,10);
}

// The ASCII value of the lowercase alphabet is from 97 to 122. 
// generate any random lowercase b/w a - z
function genarateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function genarateUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function genarateSymbol(){
    const randomIndex = getRandomInteger(0,symbols.length);
    return symbols.charAt(randomIndex);
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

setIndicator('#ccc');

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercase.checked) hasUpper = true;
    if(lowercase.checked) hasLower = true;
    if(number.checked) hasNumber = true;
    if(symbol.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >=8){
        setIndicator('#0f0');
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

function shuffleArray(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    str = array.join("");
    return str;
}

function genaratePassword(){

    // none of the checkboxes are selected
    if(checkCount <=0){
        alert('Atleast check one checkbox');
        handSlider();
    }

    // password-length should be >= selected no. of checkbox
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handSlider();
    }

     // remove the previous password
    if(passwordLength) password="";

    let checkedCbArray = [];

     // add selected checkbox functions to an array
    if(uppercase.checked) checkedCbArray.push(genarateUppercase);
    if(lowercase.checked) checkedCbArray.push(genarateLowercase);
    if(number.checked) checkedCbArray.push(genarateNumber);
    if(symbol.checked) checkedCbArray.push(genarateSymbol);

    // add the required characters - compulsory addition
    for(let i= 0 ;i < checkedCbArray.length;i++){
        password +=checkedCbArray[i]();
    }

    // adding random characters till the password length - remaining addition
    for(let i = 0 ; i< (passwordLength - checkedCbArray.length);i++){
        let randomIndex = getRandomInteger(0,checkedCbArray.length);
        password += checkedCbArray[randomIndex]();
    }

    // shuffle the newly created pass.
    password = shuffleArray(Array.from(password));
    passwordDisplay.value = password;
    console.log('password:' , password);

     // calculate strength
    calcStrength();
}

generateButton.addEventListener('click',genaratePassword);