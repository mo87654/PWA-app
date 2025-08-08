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
            targetInput.value = ''; // clear the input field
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
}

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
}

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
}


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered:', reg))
            .catch(err => console.log('Service Worker not registered:', err));
    });
}

function fetchSampleData() {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(data => console.log('Fetched API Data:', data))
        .catch(err => console.log('Error fetching API data:', err));
}

window.addEventListener('load', () => {
    addTask();
    fetchSampleData();
});

window.addEventListener('offline', () => {
    let offlineBanner = document.createElement('div');
    offlineBanner.id = 'offline-banner';
    offlineBanner.textContent = '⚠ You are offline. Some features may not work.';
    offlineBanner.style.position = 'fixed';
    offlineBanner.style.top = '0';
    offlineBanner.style.left = '0';
    offlineBanner.style.width = '100%';
    offlineBanner.style.backgroundColor = 'red';
    offlineBanner.style.color = 'white';
    offlineBanner.style.padding = '10px';
    offlineBanner.style.textAlign = 'center';
    offlineBanner.style.fontWeight = 'bold';
    document.body.prepend(offlineBanner);
});

window.addEventListener('online', () => {
    let banner = document.getElementById('offline-banner');
    if (banner) banner.remove();
});
