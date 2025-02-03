document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 0;
    const transactions = [];
    const formContainer = document.getElementById('transaction-form-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const doneButton = document.getElementById('done-button');
    const pageInfo = document.getElementById('page-info');
    const transactionList = document.querySelector('#transaction-list tbody');

    const form = document.createElement('form');
    form.innerHTML = `
        <label>Item Name: <input type="text" name="item_name" required></label>
        <label>Per Item Price: <input type="number" name="price" required></label>
        <label>Quantity: <input type="number" name="quantity" required></label>
        <label>Customer Name: <input type="text" name="customer_name" required></label>
    `;
    formContainer.appendChild(form);

    function initializeTransactions() {
        if (transactions.length === 0) {
            transactions.push({ item_name: '', price: '', quantity: '', customer_name: '', total: 0 });
        }
    }

    function showForm(index) {
        const transaction = transactions[index];
        form.item_name.value = transaction.item_name;
        form.price.value = transaction.price;
        form.quantity.value = transaction.quantity;
        form.customer_name.value = transaction.customer_name;
        prevButton.disabled = index === 0;
        validateForm();
    }

    function updatePageInfo() {
        pageInfo.textContent = `Page ${currentPage + 1} of ${transactions.length}`;
    }

    function validateForm() {
        const inputs = form.querySelectorAll('input');
        let allValid = true;
        inputs.forEach(input => {
            if (input.type === 'text') {
                if (!input.value.trim()) {
                    allValid = false;
                }
            } else if (input.type === 'number') {
                if (!input.value) {
                    allValid = false;
                }
            }
        });
        nextButton.disabled = !allValid;
    }

    function addInputListeners() {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateForm();
                updateTransaction(currentPage);
            });
        });
    }

    function updateTransaction(index) {
        const inputs = form.querySelectorAll('input');
        const price = parseFloat(inputs[1].value) || 0;
        const quantity = parseInt(inputs[2].value) || 0;
        const total = price * quantity;

        transactions[index] = {
            item_name: inputs[0].value.trim(),
            price: price,
            quantity: quantity,
            total: total,
            customer_name: inputs[3].value.trim()
        };
        renderTransactionList();
    }

    function renderTransactionList() {
        transactionList.innerHTML = '';
        transactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.item_name}</td>
                <td>${transaction.price.toFixed(2)}</td>
                <td>${transaction.quantity}</td>
                <td>${transaction.total.toFixed(2)}</td>
                <td>${transaction.customer_name}</td>
            `;
            transactionList.appendChild(row);
        });
    }

    function highlightTransaction(index) {
        const rows = transactionList.querySelectorAll('tr');
        const row = rows[index];
        row.classList.add('blink');
        setTimeout(() => {
            row.classList.remove('blink');
        }, 1000);
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            showForm(currentPage);
            updatePageInfo();
            highlightTransaction(currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage === transactions.length - 1) {
            transactions.push({ item_name: '', price: '', quantity: '', customer_name: '', total: 0 });
        }
        currentPage++;
        showForm(currentPage);
        updatePageInfo();
    });

    doneButton.addEventListener('click', () => {
        // Serialize transactions to a format suitable for sending via POST
        const serializedTransactions = transactions.map(transaction => {
            // console.log("Transaction Data:", transaction);
            return `${transaction.item_name},${transaction.price.toFixed(2)},${transaction.quantity},${transaction.total.toFixed(2)},${transaction.customer_name}`;
        });
    
        // Send data to server using fetch API
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ transactions: serializedTransactions })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Transactions submitted successfully!');
                // Optionally redirect or reset form here
            } else {
                alert('There was an error submitting transactions.');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Function to get CSRF token from Django cookie
    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 'csrftoken'.length + 1) === ('csrftoken' + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    initializeTransactions();
    showForm(currentPage);
    addInputListeners();
    updatePageInfo();
});