let count = 0;

const addTask = () => {
    let targetInput = document.querySelector('#textField');
    let targetButton = document.querySelector('#button');
    let targetTable = document.querySelector('table');

    targetButton.addEventListener('click', function () {
        count += 1;
        if (targetInput.value.trim() != '') {
            let row = document.createElement("tr");
            if (count % 2 == 0) {
                row.style.backgroundColor = 'rgb(211, 211, 211)';
            }
            let doneCell = document.createElement("td");
            let taskCell = document.createElement("td");
            let task = document.createElement('p');
            task.textContent = `${targetInput.value}`;
            targetInput.value = '';
            taskCell.appendChild(task);
            checkboxEvent(doneCell, task);
            let deleteCell = document.createElement("td");
            buttonEvent(deleteCell);
            row.append(doneCell, taskCell, deleteCell);
            targetTable.appendChild(row);
        } else {
            console.log('false');
        }
    });
};

const buttonEvent = (deleteCell) => {
    let but = document.createElement('button');
    but.textContent = 'Delete';
    deleteCell.appendChild(but);
    but.addEventListener('click', function () {
        let response = confirm('Are you sure to delete this task?');
        if (response) {
            this.parentElement.parentElement.remove();
        }
    });
};

const checkboxEvent = (doneCell, task) => {
    let check = document.createElement('input');
    check.type = 'checkbox';
    doneCell.appendChild(check);
    check.addEventListener('change', function () {
        if (this.checked) {
            task.style.textDecoration = 'line-through';
        } else {
            task.style.textDecoration = 'none';
        }
    });
};

// API fetch example
const fetchData = async () => {
    try {
        let res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        let data = await res.json();
        console.log('Fetched API Data:', data);
    } catch (error) {
        console.log('Fetch failed (offline?):', error);
    }
};

// Show/hide offline message
const offlineMessage = document.getElementById('offline-message');
window.addEventListener('online', () => offlineMessage.style.display = 'none');
window.addEventListener('offline', () => offlineMessage.style.display = 'block');

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker registered:', reg))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

window.addEventListener('load', () => {
    addTask();
    fetchData();
});
