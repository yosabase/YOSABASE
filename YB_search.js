/////////////////////////////
//////// 年度検索 ////////////
/////////////////////////////
// 年度検索のためのCSVデータ取得関数
function fetchAndDisplayUniqueYears() {
    fetch('dance1.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワークレスポンスに問題があります。');
            }
            return response.text();
        })
        .then(csvText => {
            displayUniqueYears(csvText);
        })
        .catch(error => {
            console.error('フェッチ操作に問題が発生しました:', error);
        });
}

// 重複のない年度を表示する関数
function displayUniqueYears(csvText) {
    const rows = csvText.split('\n').map(row => row.split(','));
    const table = document.getElementById('csvTable');
    table.innerHTML = ''; // 既存のテーブルをクリア

    // 「年度」列のインデックスを取得
    const headerRow = rows[0];
    const yearIndex = headerRow.indexOf("年度");
    if (yearIndex === -1) {
        console.error("年度列がCSVに見つかりません。");
        return;
    }

    // 重複のない年度を取得
    const uniqueYears = new Set();
    rows.slice(1).forEach(row => {
        const year = row[yearIndex];
        if (year) uniqueYears.add(year.trim());
    });

    // 年度を降順に並べ替え
    const sortedYears = Array.from(uniqueYears).sort((a, b) => b - a);

    // 各年度をクリック可能なリンクとしてテーブルに追加
    sortedYears.forEach(year => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const yearLink = document.createElement('a');

        yearLink.href = `YB_year.html?year=${year}`; // 年度をクエリパラメータとして追加
        yearLink.textContent = year;
        yearLink.style.cursor = 'pointer';

        td.appendChild(yearLink);
        tr.appendChild(td);
        table.appendChild(tr);
    });
}

////////////////////////////
/////////チーム検索//////////
////////////////////////////
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

    // 対象とする列名 (表示する列: idを除外、team_idは表示しない)
    const targetColumns = ["チーム名", "チーム名(よみがな)"];
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
        const id = row[headerRow.indexOf("id")]; // idを取得
        const team_id = row[headerRow.indexOf("team_id")]; // team_idも取得 (表示しない)
        const teamName = row[headerRow.indexOf("チーム名")];
        const teamReading = row[headerRow.indexOf("チーム名(よみがな)")];

        if (id && teamName && teamReading && !uniqueTeams.has(teamName)) {
            uniqueTeams.set(teamName, { id, team_id, teamReading });
        }
    });

    // Mapを配列に変換して、チーム名(よみがな)でソート
    const sortedTeams = Array.from(uniqueTeams.entries()).sort((a, b) => {
        return a[1].teamReading.localeCompare(b[1].teamReading, 'ja');
    });

    // テーブルのヘッダーを作成 (team_idは表示しない)
    const headerTr = document.createElement('tr');
    // columnIndexes.slice(1).forEach(({ index }) => { // idはヘッダー表示しないので除外
    columnIndexes.forEach(({ name }) => { // 修正: 全ての対象列を追加
        const th = document.createElement('th');
        th.textContent = name; // headerRow[index];
        headerTr.appendChild(th);
    });
    table.appendChild(headerTr);

    // ソート済みのデータ行をテーブルに追加
    sortedTeams.forEach(([teamName, { id, team_id, teamReading }]) =>  {
        const tr = document.createElement('tr');

        // チーム名
        const teamNameTd = document.createElement('td');
        const teamNameLink = document.createElement('a');
        teamNameLink.href = `YB_team.html?team_id=${team_id}`; // idをURLに追加
        teamNameLink.textContent = teamName;
        teamNameLink.style.cursor = 'pointer';
        teamNameTd.appendChild(teamNameLink);
        tr.appendChild(teamNameTd);

        // チーム名(よみがな)
        const teamReadingTd = document.createElement('td');
        const teamReadingLink = document.createElement('a');
        teamReadingLink.href = `YB_team.html?team_id=${team_id}`; // idをURLに追加 (team_idを除外)
        teamReadingLink.textContent = teamReading;
        teamReadingLink.style.cursor = 'pointer';
        teamReadingTd.appendChild(teamReadingLink);
        tr.appendChild(teamReadingTd);

        table.appendChild(tr);
    });
}


/////////////////////////////////
///////////祭検索////////////////
/////////////////////////////////
// 祭りの列名を表示する関数
function fetchAndDisplayfestival() {
    fetch('dance1.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワークレスポンスに問題があります。');
            }
            return response.text();
        })
        .then(csvText => {
            displayFestivalColumns(csvText);
        })
        .catch(error => {
            console.error('フェッチ操作に問題が発生しました:', error);
        });
}

// 祭りの列名を表示する処理
function displayFestivalColumns(csvText) {
    const rows = csvText.split('\n').map(row => row.split(','));
    const table = document.getElementById('csvTable');
    table.innerHTML = ''; // 既存のテーブルをクリア

    if (rows.length === 0) {
        console.error("CSVデータが空です。");
        return;
    }

    // ヘッダー行の取得
    const headerRow = rows[0];
    if (headerRow.length <= 11) {
        console.error("12列目以降の列が見つかりません。");
        return;
    }

    // 12列目以降の列名を取得
    const festivalColumns = headerRow.slice(11);

    // 各列名をクリック可能なリンクとしてテーブルに追加
    festivalColumns.forEach(columnName => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const columnLink = document.createElement('a');

        columnLink.href = `YB_festival.html?festival=${encodeURIComponent(columnName)}`; // 列名をクエリパラメータとして追加
        columnLink.textContent = columnName;
        columnLink.style.cursor = 'pointer';

        td.appendChild(columnLink);
        tr.appendChild(td);
        table.appendChild(tr);
    });
}

function isValidURL(string) {
    const res = string.match(/^(http|https):\/\/[^ "]+$/);
    return (res !== null);
}

// スクリプトの読み込みと関数実行の処理
function loadScriptAndExecute(callback) {
    if (!document.getElementById('dynamicScript')) {
        const script = document.createElement('script');
        script.src = 'YB_search.js';
        script.id = 'dynamicScript';

        script.onload = () => {
            console.log("スクリプトがロードされました。コールバックを実行します。");
            callback(); // 指定されたコールバック関数を実行
        };

        script.onerror = () => console.error("スクリプトの読み込みに失敗しました。");

        document.body.appendChild(script);
    } else {
        callback();
    }
}

// // チーム検索ボタンのイベント設定
// document.getElementById('teamSearchButton').addEventListener('click', () => {
//     loadScriptAndExecute(fetchAndDisplayCSV);
// });

// // 年度検索ボタンのイベント設定
// document.getElementById('yearSearchButton').addEventListener('click', () => {
//     loadScriptAndExecute(fetchAndDisplayUniqueYears);
// });

// // 祭り検索ボタンのイベント設定
// document.getElementById('festivalSearchButton').addEventListener('click', () => {
//     loadScriptAndExecute(fetchAndDisplayfestival);
// });
