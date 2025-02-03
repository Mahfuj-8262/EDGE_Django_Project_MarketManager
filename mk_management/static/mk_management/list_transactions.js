document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-button');

    downloadButton.addEventListener('click', () => {
        const rows = document.querySelectorAll('#transaction-table tbody tr');
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Item Name,Per Item Price,Quantity,Total,Customer Name,Date\n";

        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            const rowData = Array.from(cols).map(col => col.textContent.trim()).join(",");
            csvContent += rowData + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});