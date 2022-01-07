// funções do modal

function abrirModal() {
  document.getElementById('modal').style.visibility = 'visible';
}

function fecharModal() {
  clearFields();
  document.getElementById('modal').style.visibility = 'hidden';
}

let excluir1 = document.querySelector('#btc1');
excluir1.addEventListener('click', function () {
  let deletaTr1 = document.querySelector('#curso1');
  deletaTr1.remove();
});

let excluir2 = document.querySelector('#btc2');
excluir2.addEventListener('click', function () {
  let deletaTr2 = document.querySelector('#curso2');
  deletaTr2.remove();
});

let excluir3 = document.querySelector('#btc3');
excluir3.addEventListener('click', function () {
  let deletaTr3 = document.querySelector('#curso3');
  deletaTr3.remove();
});

let editAction = (index) => {
  let curso = readCurso()[index];
  curso.index = index;
  fillFields(curso);
  abrirModal();
};

let updateCurso = (index, curso) => {
  let dbCurso = readCurso();
  dbCurso[index] = curso;
  setLocalStorage(dbCurso);
};

let readCurso = () => getLocalStorage();

let getLocalStorage = () => JSON.parse(localStorage.getItem('db_curso')) ?? [];
let setLocalStorage = (dbCurso) =>
  localStorage.setItem('db_curso', JSON.stringify(dbCurso));

//adc curso

function createCurso(curso) {
  let dbCurso = getLocalStorage();
  dbCurso.push(curso);
  setLocalStorage(dbCurso);
}

let clearFields = () => {
  let fields = document.querySelectorAll('.modal-field');
  fields.forEach((field) => (field.value = ''));
};

let saveCurso = () => {
  if (isValidFields()) {
    let curso = {
      nome: document.getElementById('nome').value,
      descricao: document.getElementById('descricao').value,
      imagem: img.src,
    };
    let index = document.getElementById('nome').dataset.index;
    if (index == 'new') {
      createCurso(curso);
      updateTable();
      fecharModal();
    } else {
      updateCurso(index, curso);
      updateTable();
      fecharModal();
    }
  }
};

let isValidFields = () => {
  return document.getElementById('form').reportValidity();
};

//trabalhando na imagem
let inputFile = document.querySelector('#imagem');
let img = document.createElement('img');

inputFile.addEventListener('change', (event) => {
  let url = URL.createObjectURL(event.target.files[0]);
  img.src = url;
});

let createRow = (curso, index) => {
  let newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${curso.nome}</td>
    <td><img class="img-fluid" src="${curso.imagem}" alt="Ilustração"></td>
    <td>${curso.descricao}</td>
    `;

  let BtnEditar = function () {
    let btnEditar = document.createElement('button');
    btnEditar.innerText = 'Editar';
    btnEditar.classList.add('btn1', 'b');
    btnEditar.setAttribute('id', `edit-${index}`);
    return btnEditar;
  };

  let BtnDeletar = function () {
    let btnDeletar = document.createElement('button');
    btnDeletar.innerText = 'Excluir';
    btnDeletar.classList.add('btn2');
    btnDeletar.addEventListener('click', funcaoDeletar);

    return btnDeletar;
  };

  let funcaoDeletar = function (evento) {
    let btnDeleta = evento.target;
    let DeletaCurso = btnDeleta.parentElement;
    DeletaCurso.remove();
  };

  newRow.appendChild(BtnEditar());
  newRow.appendChild(BtnDeletar());
  document.querySelector('#tableCurso>#corpo').appendChild(newRow);
};

let fillFields = (curso) => {
  (document.getElementById('nome').value = curso.nome),
    (document.getElementById('descricao').value = curso.descricao),
    (img.src = curso.imagem),
    (document.getElementById('nome').dataset.index = curso.index);
};

let editarCurso = (event) => {
  if (event.target.className == 'btn1 b') {
    let [edit, index] = event.target.id.split('-');
    editAction(index);
  }
};

document.getElementById('salvar').addEventListener('click', saveCurso);
document
  .querySelector('#tableCurso>#corpo')
  .addEventListener('click', editarCurso);

let clearTable = () => {
  let rows = document.querySelectorAll('#tableCurso>#corpo tr');
  rows.forEach((row) => row.parentNode.removeChild(row));
};

let updateTable = () => {
  let dbCurso = readCurso();
  clearTable();
  dbCurso.forEach(createRow);
};
