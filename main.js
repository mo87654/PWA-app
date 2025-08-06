
let count = 0;
const addTask = () => {
    let targetInput = document.querySelector('#textField');
    let targetButton = document.querySelector('#button');
    let targetTable = document.querySelector('table');
    targetButton.addEventListener('click', function () {
        count +=1;
        if (targetInput.value.trim() != '') {
            let row = document.createElement("tr");
            if(count % 2 ==0)
            {
                row.style.backgroundColor = 'rgb(211, 211, 211)';
            }
            let doneCell = document.createElement("td");
            // doneCell.innerHTML = '<input class="check" type="checkbox" >';
            let taskCell = document.createElement("td");
            let task = document.createElement('p');
            task.textContent = `${targetInput.value}`;
            targetInput.value = ''; // clear the input field
            taskCell.appendChild(task);
            checkboxEvent(doneCell, task);
            // taskCell.innerHTML = `<p class="task">${targetInput.value}</p>`;
            let deleteCell = document.createElement("td");
            buttonEvent(deleteCell);
            // deleteCell.innerHTML = "<button class='delete'>Delete</button>"
            row.append(doneCell, taskCell, deleteCell);
            targetTable.appendChild(row);
        } else {
            console.log('false');
        }
    });
}

const buttonEvent = (deleteCell)=>{
    let but = document.createElement('button');
    but.textContent = 'Delete';
    deleteCell.appendChild(but);
    but.addEventListener('click', function(){
        let response = confirm('Are you sure to delete this task?');
        if (response)
        {
            this.parentElement.parentElement.remove();
        }
    });
}
const checkboxEvent = (doneCell, task)=>{
    let check = document.createElement('input');
    check.type = 'checkbox';
    doneCell.appendChild(check);
    check.addEventListener('change', function(){
        if (this.checked)
        {
            task.style.textDecoration = 'line-through';
        }else
        {
            task.style.textDecoration = 'none';
        }
    });
}


window.addEventListener('load', addTask);