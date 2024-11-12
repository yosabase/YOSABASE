document.addEventListener('DOMContentLoaded', fetchAndDisplayYearInfo);

function fetchAndDisplayYearInfo() {
    const params = new URLSearchParams(window.location.search);
    const year = params.get('year');
    if (!year) {
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
            displayYearInfo(csvText, year);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayYearInfo(csvText, year) {
    const rows = csvText.split('\n').map(row => row.split(','));
    const headerRow = rows[0];
    
    // 対象とする列名
    const targetColumns = ["チーム名","チーム名(よみがな)", "演舞名", "演舞名(よみがな)"];
    let columnIndexes = {};

    // 1行目はヘッダーなので、それに基づいて表示する列のインデックスを決定
    headerRow.forEach((columnName, index) => {
        if (targetColumns.includes(columnName)) {
            columnIndexes[columnName] = index;
        }
    });

    console.log("ヘッダーのインデックス:", columnIndexes); // デバッグ用

    // team_idのインデックスを直接取得
    const YearIndex = headerRow.indexOf("年度");

    // 指定されたteam_idと一致する行を抽出
    const matchingTeams = rows.slice(1).filter(row => {
        console.log("比較:", row[YearIndex], year); // デバッグ用
        return row[YearIndex] === year;
    });

    if (matchingTeams.length === 0) {
        console.log("一致するチームが見つかりませんでした。");
        return;
    }

    // テーブルの要素を取得
    const table = document.getElementById('csvTable');
    table.innerHTML = ''; // 既存のテーブルをクリア

    // テーブルのヘッダーを作成
    const headerTr = document.createElement('tr');
    Object.keys(columnIndexes).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerTr.appendChild(th);
    });
    table.appendChild(headerTr);

    // 抽出したデータをテーブルに表示
    matchingTeams.forEach(row => {
        const tr = document.createElement('tr');

        // 各列のデータを挿入
        Object.entries(columnIndexes).forEach(([key, index]) => {
            const td = document.createElement('td');

            // 演舞名の列をクリック可能にする
            if (key === "演舞名") {
                const link = document.createElement('a');
                link.textContent = row[index];
                link.href = `YB_dance.html?id=${row[headerRow.indexOf("id")]}`;
                td.appendChild(link);
            }else if (key === "演舞名(よみがな)") {
                const link = document.createElement('a');
                link.textContent = row[index];
                link.href = `YB_dance.html?id=${row[headerRow.indexOf("id")]}`;
                td.appendChild(link);
            } else {
                td.textContent = row[index];
            }
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });
}