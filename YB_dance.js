document.addEventListener('DOMContentLoaded', fetchAndDisplayTeamInfo);

function fetchAndDisplayTeamInfo() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        console.log("IDが指定されていません。");
        return;
    }
    
    fetch('dance1.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            displayTeamInfo(csvText,id);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayTeamInfo(csvText, id) {
    const rows = csvText.split('\n').map(row => row.split(','));
    const targetColumns = ["id", "チーム名", "チーム名(よみがな)", "演舞名", "演舞名(よみがな)","年度","url"];
    let columnIndexes = [];

    // 1行目はヘッダーなので、それに基づいて表示する列のインデックスを決定
    const headerRow = rows[0];
    headerRow.forEach((columnName, index) => {
        if (targetColumns.includes(columnName)) {
            columnIndexes.push({ name: columnName, index: index });
        }
    });

    // 指定されたIDの行を探す
    const matchingRow = rows.slice(1).find(row => row[columnIndexes.find(col => col.name === "id").index] === id);

    if (matchingRow) {
        const teamInfoDiv = document.getElementById('teamInfo');
        const teamData = {};

        // 必要な情報を取得して、teamDataに格納
        columnIndexes.forEach(({ name, index }) => {
            if (name !== "id") { // idは表示しないので除外
                teamData[name] = matchingRow[index];
            }
        });

        // URLが有効ならリンクを作成
        let urlHTML = '';
        if (isValidURL(teamData["url"])) {
            urlHTML = `<a href="${teamData["url"]}" target="_blank">${teamData["url"]}</a>`;
        } else {
            urlHTML = teamData["url"] || "URLが無効です";
        }

        // HTMLで情報を表示
        const teamInfoHTML = `
            <p><strong>チーム名:</strong> ${teamData["チーム名"]}</p>
            <p><strong>チーム名(よみがな):</strong> ${teamData["チーム名(よみがな)"]}</p>
            <p><strong>演舞名:</strong> ${teamData["演舞名"]}</p>
            <p><strong>演舞名(よみがな):</strong> ${teamData["演舞名(よみがな)"]}</p>
            <p><strong>年度:</strong> ${teamData["年度"]}</p>
            <p><strong>url:</strong> ${urlHTML}</p>

        `;
        teamInfoDiv.innerHTML = teamInfoHTML;
    } else {
        console.log(`IDが ${id} の行は見つかりませんでした。`);
    }
}

function isValidURL(string) {
    const res = string.match(/^(http|https):\/\/[^ "]+$/);
    return (res !== null);
}