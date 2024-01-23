// Sidebar
const menuIcon = document.querySelector('.material-icons-outlined.hover');
const sidebar = document.querySelector('.sidebar');
const contenu = document.querySelector('.contenu');

menuIcon.addEventListener('click', () => {
  sidebar.classList.toggle('closed');
  contenu.classList.toggle('closed');
});

function showPage(pageId) {
  const sections = document.querySelectorAll('main section');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  const currentPage = document.getElementById(pageId);
  if (currentPage) {
    currentPage.style.display = 'block';
  }
}

function handleSidebarClick(pageId) {
  showPage(pageId);


  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    item.classList.remove('active');
  });


  const clickedItem = document.querySelector(`.sidebar-item[onclick="handleSidebarClick('${pageId}')"]`);
  if (clickedItem) {
    clickedItem.classList.add('active');
  }
}


// Refresh
const refreshIcon = document.getElementById('refreshIcon');

refreshIcon.addEventListener('click', function () {
  location.reload();
});


// List-view
const listViewIcon = document.getElementById('listViewIcon');
const notes = document.querySelector('.notes');

listViewIcon.addEventListener('click', function () {
  notes.classList.toggle('list-view');
});



function showCard() {
  document.getElementById("card-container").style.display = "block";
  document.getElementById("form-container").style.display = "none";
}

function hideCard() {
  document.getElementById("card-container").style.display = "none";
  document.getElementById("form-container").style.display = "block";
}


document.addEventListener("click", function (event) {
  let cardContainer = document.getElementById("card-container");
  let formContainer = document.getElementById("form-container");


  if (!cardContainer.contains(event.target) && !formContainer.contains(event.target)) {
    hideCard();
  }
});


//  Modal edit
function openEditModal() {
  document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

function saveEdit() {
  var editedTitle = document.getElementById("edit-title").value;
  var editedContent = document.getElementById("edit-content").value;

  closeEditModal();
}



// Hover carte
$(".notes").on("mouseenter", ".notes-content", function () {
  $(this).find(".note-actions").show();
});

$(".notes").on("mouseleave", ".notes-content", function () {
  $(this).find(".note-actions").hide();
});



// Background
function show() {
  const colorPicker = document.getElementById('colorPicker');
  colorPicker.click();
}


// Image
let imageURL = '';

document.querySelector('.icons a[href="#"] i.image').addEventListener('click', function () {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.click();

  input.addEventListener('change', function (event) {
    const file = event.target.files[0];
    imageURL = URL.createObjectURL(file);
  });
});









let notesArray = [];
let archiveArray = [];
let trashArray = [];

$("#save_note").click(function () {
  let title = $("#input-title").val();
  let content = $("#input-feild").val();
  let bgColor = $("#colorPicker").val();
  let index = "colour" + Math.ceil(Math.random() * 3);

  if (title !== "" || content !== "") {
    notesArray = JSON.parse(localStorage.getItem("notes") || "[]");

    notesArray.push({
      Index: index,
      Color: bgColor,  // Utilisez la couleur sélectionnée
      Title: title,
      Content: content,
      BackgroundColor: bgColor,
      ImageURL: imageURL,
    });

    let jsonStr = JSON.stringify(notesArray);
    localStorage.setItem("notes", jsonStr);
    addNewNote(index, bgColor, title, content, imageURL);

    // Vider les champs
    $("#input-title").val("");
    $("#input-feild").val("");
    $("#colorPicker").val("#ffffff");  // Réinitialisez le sélecteur de couleur
    imageURL = "";
  }
});



$(document).ready(function () {
  let storedNotes = localStorage.getItem("notes");
  if (storedNotes) {
    notesArray = JSON.parse(storedNotes);
  }

  let storedArchive = localStorage.getItem("archive");
  if (storedArchive) {
    archiveArray = JSON.parse(storedArchive);
  }

  let storedTrash = localStorage.getItem("trash");
  if (storedTrash) {
    trashArray = JSON.parse(storedTrash);
  }

  updateNotes();
  updateArchive();
  updateTrash();

  $(".delete-note").click(function () {
    let note = $(this).closest(".notes-content");
    let noteIndex = note.attr("id");

    let deletedNote = notesArray.find(note => note.Index === noteIndex);
    trashArray.push(deletedNote);

    notesArray = notesArray.filter(note => note.Index !== noteIndex);
    updateLocalStorageAndUI();
    updateTrash();
  });




  $("#save_change").click(function () {
    saveEdit();
  });

  $(".notes").on("click", ".delete-note", function () {
    let note = $(this).closest(".notes-content");
    let noteIndex = note.attr("id");

    let deletedNote = notesArray.find(note => note.Index === noteIndex);
    trashArray.push(deletedNote);

    notesArray = notesArray.filter(note => note.Index !== noteIndex);
    updateLocalStorageAndUI();
    updateTrash();
  });

  $(".notes").on("click", ".archive-note", function () {
    let note = $(this).closest(".notes-content");
    let noteIndex = note.attr("id");

    let archivedNote = notesArray.find(note => note.Index === noteIndex);
    archiveArray.push(archivedNote);

    notesArray = notesArray.filter(note => note.Index !== noteIndex);
    updateLocalStorageAndUI();
    updateArchive();
  });

  $(".restore-trash-note").click(function () {
    let note = $(this).closest(".notes-content");
    let noteIndex = note.attr("id");

    let restoredNote = trashArray.find(note => note.Index === noteIndex);

    notesArray.push(restoredNote);
    trashArray = trashArray.filter(note => note.Index !== noteIndex);

    updateLocalStorageAndUI();
    updateTrash();
  });
});

function updateNotes() {
  let notes = $(".notes");
  notes.empty();

  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];
    addNewNote(
      note.Index,
      note.BackgroundColor,
      note.Title,
      note.Content,
      note.ImageURL
    );
  }
}


function updateLocalStorageAndUI() {
  let jsonNotes = JSON.stringify(notesArray);
  localStorage.setItem("notes", jsonNotes);

  let jsonArchive = JSON.stringify(archiveArray);
  localStorage.setItem("archive", jsonArchive);

  let jsonTrash = JSON.stringify(trashArray);
  localStorage.setItem("trash", jsonTrash);

  updateNotes();
  updateArchive();
  updateTrash();
}

function addNewNote(id, color, title, content, imageURL) {
  let notes = $(".notes");
  let noteTemplate = `
  <div class="notes-content" id="${id}" style="background-color:${color}">
  <div class="card-container">
    ${imageURL ? `<img src="${imageURL}" alt="Image preview">` : ''}
    <h4 class="note-title" style="padding: 20px; padding-bottom: 0">${title}</h4>
    <p style="padding-left: 20px;">${content}</p>
  </div>
  <div class="note-actions">
    <a href="#" class="delete-note"><i class="material-icons">delete</i></a>
    <a href="#" class="archive-note"><i class="material-icons">archive</i></a>
    <a href="#" class="edit-note"><i class="material-icons">edit</i></a>
  </div>
</div>
  `;
  notes.append(noteTemplate);

  $("#" + id).find(".edit-note").click(function (event) {
    event.stopPropagation();

    let note = notesArray.find(note => note.Index === id);

    $("#edit-title").val(note.Title);
    $("#edit-content").val(note.Content);

    openEditModal(id);
  });


  $("#" + id).find(".edit-note").click(function (event) {
    event.stopPropagation();

    let note = notesArray.find(note => note.Index === id);

    $("#edit-title").val(note.Title);
    $("#edit-content").val(note.Content);

    openEditModal();

    $("#saveEdit").off("click").on("click", function () {
      let editedTitle = $("#edit-title").val();
      let editedContent = $("#edit-content").val();

      notesArray.push({
        Index: id,
        Color: note.BackgroundColor,
        Title: editedTitle,
        Content: editedContent,
        BackgroundColor: note.BackgroundColor,
        ImageURL: note.ImageURL,
      });

      updateLocalStorageAndUI();

      closeEditModal();
    });
  });
}

function saveEdit() {
  var editedTitle = $("#edit-title").val();
  var editedContent = $("#edit-content").val();

  var id = $("#editModal").data("note-id");

  var noteIndex = notesArray.findIndex(note => note.Index === id);
  if (noteIndex !== -1) {
    notesArray[noteIndex].Title = editedTitle;
    notesArray[noteIndex].Content = editedContent;
  }

  updateLocalStorageAndUI();

  closeEditModal();
}
function openEditModal(id) {
  $("#editModal").data("note-id", id);

  document.getElementById("editModal").style.display = "block";
}

function updateArchive() {
  let archive = $(".archive");
  archive.empty();

  for (let i = 0; i < archiveArray.length; i++) {
    let archivedNote = archiveArray[i];
    addArchivedNote(
      archivedNote.Index,
      archivedNote.BackgroundColor,
      archivedNote.Title,
      archivedNote.Content,
      archivedNote.ImageURL
    );
  }
}


function addArchivedNote(id, color, title, content, imageURL) {
  let archive = $(".archive");
  let archiveTemplate = `
    <div class="notes-content" id="${id}" style="background-color:${color}">
    <img src="${imageURL}" alt="Image preview">
      <h4 class="note-title">${title}</h4>
      <p>${content}</p>
      <div class="note-actions">
        <a href="#" class="delete-archive-note"><i class="material-icons">delete</i></a>
        <a href="#" class="restore-archive-note"><i class="material-icons">restore</i></a>
      </div>
    </div>
  `;
  archive.append(archiveTemplate);

  $("#" + id).find(".delete-archive-note").click(function () {
    let noteIndex = $(this).closest(".notes-content").attr("id");
    archiveArray = archiveArray.filter(note => note.Index !== noteIndex);
    updateLocalStorageAndUI();
    updateArchive();
  });

  $("#" + id).find(".restore-archive-note").click(function () {
    let noteIndex = $(this).closest(".notes-content").attr("id");
    let restoredNote = archiveArray.find(note => note.Index === noteIndex);
    notesArray.push(restoredNote);
    archiveArray = archiveArray.filter(note => note.Index !== noteIndex);
    updateLocalStorageAndUI();
    updateArchive();
  });
}



function updateTrash() {
  let trash = $("#trashPage");
  trash.empty();

  for (let i = 0; i < trashArray.length; i++) {
    let trashedNote = trashArray[i];
    addTrashedNote(
      trashedNote.Index,
      trashedNote.BackgroundColor,
      trashedNote.Title,
      trashedNote.Content,
      trashedNote.ImageURL
    );
  }
}


function addTrashedNote(id, color, title, content, imageURL) {
  let trash = $("#trashPage ");

  let trashTemplate = `
    <div class="notes-content" id="${id}" style="background-color:${color}">
    <img src="${imageURL}" alt="Image preview">
      <h4 class="note-title">${title}</h4>
      <p>${content}</p>
      <div class="note-actions">
        <a href="#" class="delete-trash-note"><i class="material-icons">delete</i></a>
        <a href="#" class="restore-trash-note"><i class="material-icons">restore</i></a>
      </div>
    </div>
  `;
  trash.append(trashTemplate);

  $("#" + id).find(".delete-trash-note").click(function () {
    let noteIndex = $(this).closest(".notes-content").attr("id");
    trashArray = trashArray.filter(note => note.Index !== noteIndex);
    updateLocalStorageAndUI();
    updateTrash();
  });

  $("#" + id).find(".restore-trash-note").click(function () {
    let noteIndex = $(this).closest(".notes-content").attr("id");
    let restoredNote = trashArray.find(note => note.Index === noteIndex);
    notesArray.push(restoredNote);
    trashArray = trashArray.filter(note => note.Index !== noteIndex);
    updateLocalStorageAndUI();
    updateTrash();
  });
}









// Modal label
function openEditLabel() {
  let editLabelModal = document.getElementById('editLabel');
  editLabelModal.style.display = 'block';
  editLabelModal.classList.add('edit-label-modal-open');
}

function closeEditLabel() {
  let editLabelModal = document.getElementById('editLabel');
  editLabelModal.style.display = 'none';
  editLabelModal.classList.remove('edit-label-modal-open');
}


// Label
let taskInput = document.getElementById("new-task");
let addButton = document.getElementById("add-btn");
let taskList = document.getElementById("task-list");

let createNewTaskElement = function (taskString) {
  let listItem = document.createElement("li");
  let deleteButton = document.createElement("button");
  let label = document.createElement("label");
  let editInput = document.createElement("input");
  let editButton = document.createElement("button");

  deleteButton.innerHTML = '<i class="material-icons">delete</i>';
  editButton.innerHTML = '<i class="material-icons">edit</i>';

  deleteButton.className = "delete";
  editInput.type = "text";
  editButton.className = "edit";

  label.innerText = taskString;

  listItem.appendChild(deleteButton);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);

  return listItem;
}

let editTask = function () {
  let listItem = this.parentNode;
  let editInput = listItem.querySelector("input[type=text]");
  let label = listItem.querySelector("label");
  let containsClass = listItem.classList.contains("editMode");

  if (containsClass) {
    label.innerText = editInput.value;
  } else {
    editInput.value = label.innerText;
  }

  listItem.classList.toggle("editMode");
}

let deleteTask = function () {
  let listItem = this.parentNode;
  taskList.removeChild(listItem);
}

let bindTaskEvents = function (taskListItem) {
  let deleteButton = taskListItem.querySelector("button.delete");
  let editButton = taskListItem.querySelector("button.edit");

  deleteButton.onclick = deleteTask;
  editButton.onclick = editTask;
}

addButton.addEventListener("click", addTask);

// New label dans le sidebar
function addNewLabel() {
  let labelInput = document.getElementById("new-task");
  let labelValue = labelInput.value.trim();

  if (labelValue !== "") {
    let taskList = document.getElementById("task-list");
    let newLabelItem = createNewLabelElement(labelValue);
    taskList.appendChild(newLabelItem);
    bindLabelEvents(newLabelItem);

    addLabelToSidebar(labelValue);

    labelInput.value = "";
  }
}

function createNewLabelElement(labelString) {
  let labelItem = document.createElement("div");
  labelItem.classList.add("sidebar-item", "hover");

  let labelIcon = document.createElement("span");
  labelIcon.classList.add("material-icons-outlined", "hover");
  labelIcon.textContent = "label";

  let labelTextSpan = document.createElement("span");
  labelTextSpan.classList.add("sidebar-text");
  labelTextSpan.textContent = labelString;

  labelItem.appendChild(labelIcon);
  labelItem.appendChild(labelTextSpan);

  return labelItem;
}

function bindLabelEvents(labelListItem) {
  // Evénements liés au label 
}

function addLabelToSidebar(labelString) {
  let sidebar = document.querySelector('.sidebar');
  let newLabelItem = createNewLabelElement(labelString);
  let editLabelItem = sidebar.querySelector('.sidebar-item[onclick="openEditLabel(\'editLabel\')"]');
  sidebar.insertBefore(newLabelItem, editLabelItem);
  
  newLabelItem.addEventListener('click', function () {
    showLabelPage(labelString);
  });
}


function showLabelPage(labelString) {
  hideAllSections();

  let labelPage = document.getElementById('labelPage');
  labelPage.style.display = 'block';

  console.log("Afficher la page du label :", labelString);
}
function hideAllSections() {
  let sections = document.querySelectorAll('main section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
}

