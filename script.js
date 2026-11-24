// SpendWise Interactive
// This application lets users enter income and expenses through forms,
// stores expenses in an array, processes them with loops,
// updates the dashboard, and responds to user events.

// =============================
// Application data
// =============================

const appName = "SpendWise";
const currency = "KES";

let monthlyIncome = 0;
let userName = "Alex";

// Expenses are stored in an array.
// Each expense is an object with a name, category, and amount.
const expenses = [];

// =============================
// DOM element references
// =============================

const budgetForm = document.querySelector("#budget-form");
const incomeInput = document.querySelector("#income-input");

const expenseForm = document.querySelector("#expense-form");
const expenseNameInput = document.querySelector("#expense-name");
const expenseCategoryInput = document.querySelector("#expense-category");
const expenseAmountInput = document.querySelector("#expense-amount");

const budgetStatus = document.querySelector("#budget-status");
const expenseList = document.querySelector("#expense-list");
const emptyExpensesMessage = document.querySelector(
    "#empty-expenses-message"
);
const clearExpensesButton = document.querySelector("#clear-expenses");

// =============================
// Reusable functions
// =============================

function formatCurrency(amount) {
    return `${currency} ${amount.toFixed(2)}`;
}

// Uses a loop to calculate the total of all expenses.
function calculateTotalExpenses() {
    let totalExpenses = 0;

    for (let index = 0; index < expenses.length; index++) {
        totalExpenses += expenses[index].amount;
    }

    return totalExpenses;
}

// Calculates the amount left after expenses.
function calculateRemainingBalance(totalExpenses) {
    return monthlyIncome - totalExpenses;
}

// Calculates the percentage of income spent.
function calculateExpensePercentage(totalExpenses) {
    if (monthlyIncome === 0) {
        return 0;
    }

    return (totalExpenses / monthlyIncome) * 100;
}

// Uses conditional statements to choose the budget message.
function getBudgetStatus(remainingBalance) {
    if (remainingBalance < 0) {
        return {
            message:
                "You are over budget. Your expenses are higher than your income.",
            className: "danger"
        };
    }

    if (remainingBalance === 0) {
        return {
            message:
                "Your income and expenses are equal. Try to save next month.",
            className: "warning"
        };
    }

    if (
        monthlyIncome > 0 &&
        remainingBalance <= monthlyIncome * 0.2
    ) {
        return {
            message:
                "Warning: You are close to spending your entire income.",
            className: "warning"
        };
    }

    return {
        message:
            "You are within budget. Great job managing your money!",
        className: ""
    };
}

// Updates the user name in the dashboard header.
function updateUserName() {
    const userNameElement = document.querySelector(
        ".user-details strong"
    );

    userNameElement.textContent = userName;
}

// Updates the main summary cards.
function updateSummaryCards(totalExpenses, remainingBalance) {
    document.getElementById("total-income").textContent =
        formatCurrency(monthlyIncome);

    document.getElementById("total-expenses").textContent =
        formatCurrency(totalExpenses);

    document.getElementById("balance").textContent =
        formatCurrency(remainingBalance);
}

// Uses an array of category names and loops
// to calculate and update each category total.
function updateCategoryCards() {
    const categoryIds = [
        "food",
        "transport",
        "rent",
        "entertainment",
        "savings",
        "utilities"
    ];

    for (let index = 0; index < categoryIds.length; index++) {
        const category = categoryIds[index];
        let categoryTotal = 0;

        for (
            let expenseIndex = 0;
            expenseIndex < expenses.length;
            expenseIndex++
        ) {
            const expense = expenses[expenseIndex];

            if (expense.category === category) {
                categoryTotal += expense.amount;
            }
        }

        const categoryElement = document.getElementById(
            `${category}-amount`
        );

        categoryElement.textContent = formatCurrency(categoryTotal);
    }
}

// Creates and displays one expense record on the page.
function createExpenseItem(expense, index) {
    const listItem = document.createElement("li");
    listItem.className = "expense-item";

    const details = document.createElement("div");
    details.className = "expense-details";

    const expenseName = document.createElement("strong");
    expenseName.textContent = expense.name;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = `Category: ${expense.category}`;

    const expenseAmount = document.createElement("span");
    expenseAmount.className = "expense-amount";
    expenseAmount.textContent = formatCurrency(expense.amount);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-expense";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.index = index;

    details.appendChild(expenseName);
    details.appendChild(expenseCategory);

    listItem.appendChild(details);
    listItem.appendChild(expenseAmount);
    listItem.appendChild(deleteButton);

    return listItem;
}

// Uses a loop to display every expense stored in the array.
function renderExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        emptyExpensesMessage.style.display = "block";
        return;
    }

    emptyExpensesMessage.style.display = "none";

    for (let index = 0; index < expenses.length; index++) {
        const expenseItem = createExpenseItem(
            expenses[index],
            index
        );

        expenseList.appendChild(expenseItem);
    }
}

// Updates all dashboard information after data changes.
function updateDashboard() {
    const totalExpenses = calculateTotalExpenses();
    const remainingBalance = calculateRemainingBalance(totalExpenses);
    const status = getBudgetStatus(remainingBalance);

    updateUserName();
    updateSummaryCards(totalExpenses, remainingBalance);
    updateCategoryCards();

    budgetStatus.textContent = status.message;
    budgetStatus.className = `budget-status ${status.className}`.trim();

    renderExpenses();
}

// =============================
// Event handlers
// =============================

// Handles the income form submission.
function handleBudgetFormSubmit(event) {
    event.preventDefault();

    const enteredIncome = Number.parseFloat(incomeInput.value);

    if (
        Number.isNaN(enteredIncome) ||
        enteredIncome <= 0
    ) {
        alert("Please enter a monthly income greater than zero.");
        return;
    }

    monthlyIncome = enteredIncome;
    incomeInput.value = "";

    updateDashboard();
}

// Handles the expense form submission.
function handleExpenseFormSubmit(event) {
    event.preventDefault();

    const expenseName = expenseNameInput.value.trim();
    const expenseCategory = expenseCategoryInput.value;
    const expenseAmount = Number.parseFloat(
        expenseAmountInput.value
    );

    if (expenseName === "") {
        alert("Please enter an expense name.");
        return;
    }

    if (
        Number.isNaN(expenseAmount) ||
        expenseAmount <= 0
    ) {
        alert("Please enter an expense amount greater than zero.");
        return;
    }

    const newExpense = {
        name: expenseName,
        category: expenseCategory,
        amount: expenseAmount
    };

    // Adds the new expense object to the expenses array.
    expenses.push(newExpense);

    expenseNameInput.value = "";
    expenseAmountInput.value = "";
    expenseCategoryInput.value = "food";

    updateDashboard();
}

// Deletes one expense when its Delete button is clicked.
function handleExpenseListClick(event) {
    const clickedButton = event.target.closest(".delete-expense");

    if (!clickedButton) {
        return;
    }

    const expenseIndex = Number.parseInt(
        clickedButton.dataset.index,
        10
    );

    if (
        expenseIndex >= 0 &&
        expenseIndex < expenses.length
    ) {
        expenses.splice(expenseIndex, 1);
        updateDashboard();
    }
}

// Clears all expenses after user confirmation.
function handleClearExpenses() {
    if (expenses.length === 0) {
        alert("There are no expenses to clear.");
        return;
    }

    const isConfirmed = confirm(
        "Are you sure you want to delete all expenses?"
    );

    if (isConfirmed) {
        expenses.length = 0;
        updateDashboard();
    }
}

// =============================
// Event listeners
// =============================

budgetForm.addEventListener("submit", handleBudgetFormSubmit);
expenseForm.addEventListener("submit", handleExpenseFormSubmit);
expenseList.addEventListener("click", handleExpenseListClick);
clearExpensesButton.addEventListener("click", handleClearExpenses);

// Shows the starting dashboard when the page loads.
updateDashboard();