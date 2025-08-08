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
            targetInput.value = ''; // clear input
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
        task.style.textDecoration = this.checked ? 'line-through' : 'none';
    });
};

async function fetchData() {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched API Data:", data);
        localStorage.setItem('apiData', JSON.stringify(data));
    } catch (error) {
        console.log("Offline: Showing cached data");
        const cached = localStorage.getItem('apiData');
        if (cached) {
            console.log("Cached API Data:", JSON.parse(cached));
        }
    }
}

window.addEventListener('offline', () => {
    alert("Connection lost. You are now offline.");
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log("New version available, refreshing...");
                            newWorker.postMessage({ action: 'skipWaiting' });
                        }
                    });
                });
            })
            .catch(err => console.log('SW registration failed:', err));
    });

    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });
}

window.addEventListener('load', () => {
    addTask();
    fetchData();
});
