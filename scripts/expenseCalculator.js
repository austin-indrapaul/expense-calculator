
function calculateMonthlyExpense(expenseList) {
    // Get current month and year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0-indexed

    // Filter and sum expenses for current month
    const monthlyExpenseSum = expenseList.reduce((total, expense) => {
        // Parse date from first array element
        const expenseDate = new Date(expense[0]);
        const expenseYear = expenseDate.getFullYear();
        const expenseMonth = expenseDate.getMonth() + 1;

        // Check if expense is in current month/year
        if (expenseYear === currentYear && expenseMonth === currentMonth) {
            const amount = parseFloat(expense[expense.length - 1]);
            return total + (isNaN(amount) ? 0 : Math.abs(amount));
        }
        return total;
    }, 0);

    console.log(monthlyExpenseSum);

    return monthlyExpenseSum;
}

function calculateOverallExpense(expenseList) {
    const totalExpenseSum = expenseList.reduce((total, expense) => {
        const amount = parseFloat(expense[expense.length - 1]);
        
        return total + (isNaN(amount) ? 0 : Math.abs(amount));
    }, 0);

    console.log(totalExpenseSum);

    return totalExpenseSum;
}

function calculateOverallCategoryExpenses(expenseList) {
    // Detailed category-wise expense calculation
    const categoryExpenses = expenseList.reduce((acc, expense) => {
        const category = expense[1]; // Category from second array element
        const amount = parseFloat(expense[expense.length - 1]);

        // Validate and process amount
        if (!isNaN(amount)) {
            // Use absolute value to handle negative expenses
            const absAmount = Math.abs(amount);
            
            // Initialize category if not exists, then add amount
            acc[category] = (acc[category] || 0) + absAmount;
        }

        return acc;
    }, {});

    console.log(categoryExpenses);

    return categoryExpenses;
}

function calculateOverallSubCategoryExpenses(expenseList) {
    // Detailed category-wise expense calculation
    const categoryExpenses = expenseList.reduce((acc, expense) => {
        const category = expense[2]; // SubCategory from second array element
        const amount = parseFloat(expense[expense.length - 1]);

        // Validate and process amount
        if (!isNaN(amount)) {
            // Use absolute value to handle negative expenses
            const absAmount = Math.abs(amount);
            
            // Initialize category if not exists, then add amount
            acc[category] = (acc[category] || 0) + absAmount;
        }

        return acc;
    }, {});

    console.log(categoryExpenses);

    return categoryExpenses;
}

