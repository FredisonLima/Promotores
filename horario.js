const form = document.getElementById('user-form');
const userDataDiv = document.getElementById('user-data');

// Carregar dados do localStorage
document.addEventListener('DOMContentLoaded', () => {
    const storedData = JSON.parse(localStorage.getItem('user-data')) || [];
    console.log('Dados carregados do localStorage:', storedData);
    storedData.forEach((data, index) => displayUserData(data, index));
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const userData = {
        company: document.getElementById('company').value,
        username: document.getElementById('username').value,
        document: document.getElementById('document').value,
        userType: document.getElementById('user-type').value,
        entryTime: formatTime(new Date()),
        entryDate: formatDate(new Date()),
        exitTime: null
    };

    const storedData = JSON.parse(localStorage.getItem('user-data')) || [];
    storedData.push(userData);
    localStorage.setItem('user-data', JSON.stringify(storedData));
    console.log('Todos os dados armazenados no localStorage:', storedData);

    displayUserData(userData, storedData.length - 1);
    form.reset();
});

function displayUserData(userData, index) {
    const userEntry = document.createElement('div');
    userEntry.classList.add('user-entry');
    userEntry.innerHTML = `
        <p style="font-weight: bold; color: #201b2c; font-size: 17px; text-align: center;"><strong>
        </strong> ${userData.entryDate}</p>
        <p><strong>Empresa:</strong> ${userData.company}</p>
        <p><strong>Usuário:</strong> ${userData.username}</p>
        <p><strong>Documento:</strong> ${userData.document}</p>
        <p><strong>Tipo de Usuário:</strong> ${userData.userType}</p>
        <p><strong>Horário de Entrada:</strong> ${userData.entryTime}</p>
        <p><strong>Horário de Saída:</strong> ${userData.exitTime ? userData.exitTime : 'Não registrado'}</p>
    `;

    // Verificar se o expediente já foi finalizado
    if (!userData.exitTime) {
        const buttonEndShift = document.createElement('button');
        buttonEndShift.classList.add('end-shift');
        buttonEndShift.id = `end-shift-${index}`;
        buttonEndShift.textContent = 'Finalizar Expediente';
        buttonEndShift.onclick = () => endShift(index);
        userEntry.appendChild(buttonEndShift);
    }

    // Adicionar o botão de excluir
    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('delete-entry');
    buttonDelete.id = `delete-entry-${index}`;
    buttonDelete.textContent = 'Excluir';
    buttonDelete.style.backgroundColor = '#201b2c';
    buttonDelete.style.color = '#FFFFFF';
    buttonDelete.style.fontSize = '13px';
    buttonDelete.style.padding = '6px 8px';
    buttonDelete.style.cursor = 'pointer';
    buttonDelete.style.position = 'relative';
    buttonDelete.style.top = '0.1px';
    buttonDelete.style.border = '1px solid #00ff87';
    buttonDelete.onclick = () => deleteEntry(index);
    userEntry.appendChild(buttonDelete);

    userDataDiv.appendChild(userEntry);
}

function endShift(index) {
    const storedData = JSON.parse(localStorage.getItem('user-data')) || [];
    if (storedData[index]) {
        storedData[index].exitTime = formatTime(new Date());
        localStorage.setItem('user-data', JSON.stringify(storedData));

        // Atualizar a exibição para este usuário
        const button = document.getElementById(`end-shift-${index}`);
        if (button) {
            button.remove(); // Remove o botão após finalizar o expediente
        }

        const userEntry = userDataDiv.children[index];
        if (userEntry) {
            userEntry.querySelector('p:nth-child(7)').textContent = `Horário de Saída: ${storedData[index].exitTime}`;
            userEntry.style.fontWeight = 'bolder';
        }
    }
}

function deleteEntry(index) {
    const storedData = JSON.parse(localStorage.getItem('user-data')) || [];
    storedData.splice(index, 1);
    localStorage.setItem('user-data', JSON.stringify(storedData));

    userDataDiv.children[index].remove();

    const updatedData = JSON.parse(localStorage.getItem('user-data')) || [];
    userDataDiv.innerHTML = '';
    updatedData.forEach((data, i) => displayUserData(data, i));
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    
}


