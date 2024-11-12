document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            displayCSV(text);
        };
        reader.readAsText(file);
    }
});

function displayCSV(csvText) {
    const rows = csvText.split('\n').map(row => row.split(','));
    const table = document.getElementById('csvTable');
    table.innerHTML = ''; // 既存のテーブルをクリア

    rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement(index === 0 ? 'th' : 'td'); // 1行目はヘッダー
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}