// CSVをフェッチして表示する関数
function fetchAndDisplayCSV() {
    fetch('dance1.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("CSV file has been fetched successfully."); // ログ追加
            return response.text();
        })
        .then(csvText => {
            console.log("CSV Content:", csvText); // CSVの内容をログに表示
            displayCSV(csvText);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayCSV(csvText) {
    const rows = csvText.split('\n').map(row => row.split(','));
    const table = document.getElementById('csvTable');
    table.innerHTML = ''; // 既存のテーブルをクリア

    // 対象とする列名
    const targetColumns = ["id","チーム名", "チーム名(よみがな)"];
    let columnIndexes = [];

    // 1行目はヘッダーなので、それに基づいて表示する列のインデックスを決定
    const headerRow = rows[0];
    headerRow.forEach((columnName, index) => {
        if (targetColumns.includes(columnName)) {
            columnIndexes.push({ name: columnName, index: index });
        }
    });

    // データ行を一意にするためのセット
    const uniqueTeams = new Map();

    // データ行を作成
    rows.slice(1).forEach(row => {
        const id = row[columnIndexes.find(col => col.name === "id").index];
        const teamName = row[columnIndexes.find(col => col.name === "チーム名").index];
        const teamReading = row[columnIndexes.find(col => col.name === "チーム名(よみがな)").index];

        if (id && teamName && teamReading && !uniqueTeams.has(teamName)) {
            uniqueTeams.set(teamName, { id, teamReading });
        }
    });

    // Mapを配列に変換して、チーム名(よみがな)でソート
    const sortedTeams = Array.from(uniqueTeams.entries()).sort((a, b) => {
        return a[1].teamReading.localeCompare(b[1].teamReading, 'ja');
    });

    // テーブルのヘッダーを作成
    const headerTr = document.createElement('tr');
    columnIndexes.slice(1).forEach(({ index }) => { // idはヘッダー表示しないので除外
        const th = document.createElement('th');
        th.textContent = headerRow[index];
        headerTr.appendChild(th);
    });
    table.appendChild(headerTr);

    // ソート済みのデータ行をテーブルに追加
    sortedTeams.forEach(([teamName, { id, teamReading }]) =>  {
        const tr = document.createElement('tr');

        // チーム名
        const teamNameTd = document.createElement('td');
        const teamNameLink = document.createElement('a');
        teamNameLink.href = `YB_dance.html?id=${id}`; // idをURLに追加
        teamNameLink.textContent = teamName;
        teamNameLink.style.cursor = 'pointer';
        teamNameTd.appendChild(teamNameLink);
        tr.appendChild(teamNameTd);


        // チーム名(よみがな)
        const teamReadingTd = document.createElement('td');
        const teamReadingLink = document.createElement('a');
        teamReadingLink.href = 'YB_team.html';
        teamReadingLink.textContent = teamReading;
        teamReadingLink.style.cursor = 'pointer';
        teamReadingTd.appendChild(teamReadingLink);
        tr.appendChild(teamReadingTd);

        table.appendChild(tr);
    });
}

function isValidURL(string) {
    const res = string.match(/^(http|https):\/\/[^ "]+$/);
    return (res !== null);
}