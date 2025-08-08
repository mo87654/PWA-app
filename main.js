let count = 0;

const addTask = () => {
    let targetInput = document.querySelector('#textField');
    let targetButton = document.querySelector('#button');
    let targetTable = document.querySelector('table');

    targetButton.addEventListener('click', function () {
        count += 1;
        if (targetInput.value.trim() != '') {
            createRow(targetInput.value, targetTable);
            targetInput.value = '';
        }
    });
};

// Create table row
function createRow(taskText, targetTable) {
    let row = document.createElement("tr");
    if (count % 2 == 0) row.style.backgroundColor = 'rgb(211, 211, 211)';

    let doneCell = document.createElement("td");
    let taskCell = document.createElement("td");
    let task = document.createElement('p');
    task.textContent = taskText;
    taskCell.appendChild(task);
    checkboxEvent(doneCell, task);

    let deleteCell = document.createElement("td");
    buttonEvent(deleteCell);

    row.append(doneCell, taskCell, deleteCell);
    targetTable.appendChild(row);
}

const buttonEvent = (deleteCell) => {
    let but = document.createElement('button');
    but.textContent = 'Delete';
    deleteCell.appendChild(but);
    but.addEventListener('click', function () {
        if (confirm('Are you sure to delete this task?')) {
            this.parentElement.parentElement.remove();
        }
    });
};

const checkboxEvent = (doneCell, task) => {
    let check = document.createElement('input');
    check.type = 'checkbox';
    doneCell.appendChild(check);
    check.addEventListener('change', function () {
        task.style.textDecoration = this.checked ? 'line-through' : 'none';
    });
};

// Fetch API Data
function fetchAPIData() {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
        .then(res => res.json())
        .then(data => {
            let table = document.querySelector("table");
            data.forEach(item => createRow(item.title, table));
            console.log("Fetched API Data:", data[0]); // Log first item for confirmation
        })
        .catch(() => console.log("Failed to fetch API data"));
}

// Handle online/offline UI
const offlineBanner = document.getElementById("offline-banner");

window.addEventListener("offline", () => {
    offlineBanner.classList.remove("hidden");
});

window.addEventListener("online", () => {
    offlineBanner.classList.add("hidden");
});

window.addEventListener('load', () => {
    addTask();
    fetchAPIData();

    // Register service worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Service Worker registered"));
    }
});
