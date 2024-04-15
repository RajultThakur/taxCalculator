const taxFreeRange = 800000;
const NEGATIVE_INCOME_ERROR = "deduction amount cannot be less then OR equal to total income"
const INVALID_INPUT_VALUE_ERROR = "*error require all fields with numeric value."

const taxForm = document.querySelector('form');
const resultModal = document.getElementsByClassName("result")[0];
const customError = document.getElementsByClassName("error")[0];
const closeModalButton = document.getElementsByClassName("closeBtn")[0];
const taxFormSubContainer = document.getElementsByClassName("taxFormSubContainer")

const errorElement = document.createElement("span");
errorElement.setAttribute("title", INVALID_INPUT_VALUE_ERROR);
errorElement.textContent = "!"
errorElement.classList.add("error");

taxForm.addEventListener("submit", (e) => {
    e.preventDefault();
    removeErrorChild()

    const data = getFormData()
    let incomeData = validateInput(data)

    if (!incomeData) return;

    let { grossIncome, extraIncome, age, deduction } = incomeData;
    let overallIncome = grossIncome + extraIncome - deduction;

    const incomeAfterTax = calculatingIncomeAfterTex(overallIncome, age);
    if (incomeAfterTax === 0) return;

    let totalIncome = document.getElementsByClassName("totalIncome")[0];
    totalIncome.innerHTML = incomeAfterTax;
    resultModal.classList.add('active');
});

function closeModal () {
    resultModal.classList.remove('active')
}

closeModalButton.addEventListener("click", closeModal);

function getFormData () {
    return Object.fromEntries(new FormData(taxForm).entries());
}

function validateInput (data) {
    let formattedData = {};
    let i = 0;
    for (const key in data) {
        let containsCharOrSymbols = /[^\d\s]/.test(data[key]);
        if (containsCharOrSymbols || !data[key]) {
            createAndAppendChild(i, INVALID_INPUT_VALUE_ERROR)
            return null
        };
        formattedData[key] = parseInt(data[key])
        i = i + 1;
    }
    return formattedData
}

function calculatingIncomeAfterTex (overallIncome, age) {
    let taxPercentage = age == 40 ? 0.30 : age == 60 ? 0.40 : 0.10;

    if (overallIncome <= 0) {
        createAndAppendChild(2, NEGATIVE_INCOME_ERROR);
        overallIncome = 0;
    }
    else if (overallIncome <= taxFreeRange) {
        taxPercentage = 0;
    }

    return parseInt(overallIncome - (overallIncome * taxPercentage));
}

function createAndAppendChild (idx, ERROR) {
    if (idx === 3) idx = 2;
    let child = taxFormSubContainer[idx].children[2]
    if (child) return;
    errorElement.setAttribute("title", ERROR);
    taxFormSubContainer[idx].appendChild(errorElement)
}

function removeErrorChild () {
    for (let i = 0; i < 3; i++) {
        let errorChild = taxFormSubContainer[i].children[2];
        if (errorChild) {
            taxFormSubContainer[i].removeChild(errorChild);
        }
    }
}