let count = 0;

const addTask = () => {
    let targetInput = document.querySelector('#textField');
    let targetButton = document.querySelector('#button');
    let targetTable = document.querySelector('table');

    targetButton.addEventListener('click', function () {
        count += 1;
        if (targetInput.value.trim() !== '') {
            let row = document.createElement("tr");
            if (count % 2 === 0) {
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

window.addEventListener('load', () => {
    addTask();

    // Fetch data from API
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(data => {
            console.log("Fetched API Data:", data);
        })
        .catch(() => {
            showOfflineMessage();
        });
});

// Show offline message
function showOfflineMessage() {
    const msg = document.createElement('div');
    msg.textContent = '⚠ Connection lost. You are viewing offline content.';
    msg.style.background = 'orange';
    msg.style.color = 'white';
    msg.style.padding = '10px';
    msg.style.position = 'fixed';
    msg.style.top = '0';
    msg.style.left = '0';
    msg.style.width = '100%';
    msg.style.textAlign = 'center';
    document.body.appendChild(msg);
}

// Service Worker registration with auto-update
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(registration => {
        console.log("Service Worker registered:", registration);

        if (registration.waiting) {
            registration.waiting.postMessage({ action: "skipWaiting" });
        }

        registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    console.log("New version available, refreshing...");
                    window.location.reload();
                }
            });
        });
    });
}
