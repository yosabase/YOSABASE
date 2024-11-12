document.addEventListener('DOMContentLoaded', fetchAndDisplayFestivalInfo);

function fetchAndDisplayFestivalInfo() {
    const params = new URLSearchParams(window.location.search);
    const festival = params.get('festival');
    if (!festival) {
        console.log("チーム名が指定されていません。");
        return;
    }
    fetch('dance1.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("CSVファイルを正常に取得しました"); // デバッグ用
            return response.text();
        })
        .then(csvText => {
            console.log("CSVの内容:", csvText); // デバッグ用
            displayFestivalInfo(csvText, festival);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function displayFestivalInfo(csvText, festival) {
    const rows = csvText.split('\n').map(row => row.split(','));
    const headerRow = rows[0];
    
    // festival名の列インデックスを取得
    const festivalIndex = headerRow.indexOf(festival);
    if (festivalIndex === -1) {
        console.error(`${festival} 列が見つかりません。`);
        return;
    }

    // 年度列のインデックスを取得
    const yearIndex = headerRow.indexOf("年度");
    if (yearIndex === -1) {
        console.error("年度列が見つかりません。");
        return;
    }

    // festival列がNaNでない行のみ抽出
    const filteredRows = rows.slice(1).filter(row => {
        const festivalValue = row[festivalIndex];
        return festivalValue && !isNaN(festivalValue);
    });

    // 年度でソート
    filteredRows.sort((a, b) => b[yearIndex] - a[yearIndex]);

    // テーブルの要素を取得
    const table = document.getElementById('csvTable');
    table.innerHTML = ''; // 既存のテーブルをクリア

    // テーブルのヘッダーを作成
    const headerTr = document.createElement('tr');
    headerRow.forEach(columnName => {
        const th = document.createElement('th');
        th.textContent = columnName;
        headerTr.appendChild(th);
    });
    table.appendChild(headerTr);

    // 抽出したデータ行をテーブルに追加
    filteredRows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}