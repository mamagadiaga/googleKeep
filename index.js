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


// Contenu
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
  let editedTitle = document.getElementById("edit-title").value;
  let editedContent = document.getElementById("edit-content").value;

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



// Content
let notesArray = [];
let archiveArray = [];
let trashArray = [];


$(document).ready(function () {

  // Edit
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

  $("#save_change").click(function () {
    saveEdit();
  });

});


function updateLocalStorageAndUI() {
  let jsonStr = JSON.stringify(notesArray);
  localStorage.setItem("notes", jsonStr);
  updateNotes();
}

// Notes
function addNewNote(id, color, title, content, labels) {
  let notes = $(".notes");
  let noteTemplate = `
  <div class="notes-content" id="${id}" style="background-color:${color}">
         <div class="card-container">
           ${imageURL ? `<img src="${imageURL}" alt="Image preview">` : ''}
           <h4 class="note-title" style="padding: 20px; padding-bottom: 0">${title}</h4>
           <p style="padding-left: 20px;">${content}</p>
           <div class="labels-container" id="labels-${id}"></div> <!-- Labels container -->
         </div>
         <div class="note-actions">
           <a href="#" class="delete-note"><i class="material-icons">delete</i></a>
           <a href="#" class="archive-note"><i class="material-icons">archive</i></a>
           <a href="#" class="edit-note"><i class="material-icons">edit</i></a>
         </div>
       </div>
  `;

  notes.append(noteTemplate);

  let labelsContainer = $(`#labels-${id}`);
  labels.forEach(label => {
    labelsContainer.append(`<span class="label clickable">${label}</span>`);
  });

  $("#" + id).find(".edit-note").click(function (event) {
    event.stopPropagation();

    openEditModal(id);
  });
}

function updateNotes() {
  let notes = $(".notes");
  notes.empty();

  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];
    addNewNote(
      note.Index,
      note.Color,
      note.Title,
      note.Content,
      note.Labels
    );
  }
}

$("#save_note").click(function () {
  let title = $("#input-title").val();
  let content = $("#input-feild").val();
  let bgColor = $("#colorPicker").val();
  let index = "colour" + Math.ceil(Math.random() * 3);

  if (title !== "" || content !== "") {
    let labels = [];
    $("#task-list li label").each(function () {
      labels.push($(this).text());
    });

    notesArray.push({
      Index: index,
      Color: bgColor,
      Title: title,
      Content: content,
      Labels: labels,
    });

    addNewNote(index, bgColor, title, content, labels);

    // Vider les champs
    $("#input-title").val("");
    $("#input-feild").val("");
    $("#colorPicker").val("#ffffff");
  }
});






// Archive
$(".notes").on("click", ".archive-note", function () {
  let note = $(this).closest(".notes-content");
  let noteIndex = note.attr("id");

  let archivedNote = notesArray.find(note => note.Index === noteIndex);
  archiveArray.push(archivedNote);

  notesArray = notesArray.filter(note => note.Index !== noteIndex);
  updateNotes();
  updateArchive(); 
});


function updateArchive() {
  let archive = $(".archive");
  archive.empty();

  for (let i = 0; i < archiveArray.length; i++) {
    let archivedNote = archiveArray[i];
    addArchivedNote(
      archivedNote.Index,
      archivedNote.Color,
      archivedNote.Title,
      archivedNote.Content,
      archivedNote.Labels
    );
  }
}

function addArchivedNote(id, color, title, content, labels) {
  let archive = $(".archive");
  let archiveTemplate = `
    <div class="notes-content" id="${id}" style="background-color:${color}">
    <div class="card-container">
      ${imageURL ? `<img src="${imageURL}" alt="Image preview">` : ''}
      <h4 class="note-title" style="padding: 20px; padding-bottom: 0">${title}</h4>
      <p style="padding-left: 20px;">${content}</p>
      <div class="labels-container" id="labels-${id}"></div> <!-- Labels container -->
    </div>
    <div class="note-actions">
    <a href="#" class="delete-archive-note"><i class="material-icons">delete</i></a>
    <a href="#" class="restore-archive-note"><i class="material-icons">restore</i></a>
    </div>
  </div>
  `;
  archive.append(archiveTemplate);

  let labelsContainer = $(`#labels-${id}`);
  labels.forEach(label => {
    labelsContainer.append(`<span class="label clickable">${label}</span>`);
  });
  
  $("#" + id).find(".delete-archive-note").click(function () {
    let noteIndex = $(this).closest(".notes-content").attr("id");
    archiveArray = archiveArray.filter(note => note.Index !== noteIndex);
    updateArchive();
  });

  $("#" + id).find(".restore-archive-note").click(function () {
    let noteIndex = $(this).closest(".notes-content").attr("id");
    let restoredNote = archiveArray.find(note => note.Index === noteIndex);
    notesArray.push(restoredNote);
    archiveArray = archiveArray.filter(note => note.Index !== noteIndex);
    updateNotes();
    updateArchive();
  });

}

function openEditModal(id) {
  let note = notesArray.find(note => note.Index === id);
  $("#edit-title").val(note.Title);
  $("#edit-content").val(note.Content);
  $("#editModal").data("note-id", id);
  $("#editModal").show();
}

function saveEdit() {
  let editedTitle = $("#edit-title").val();
  let editedContent = $("#edit-content").val();

  let id = $("#editModal").data("note-id");

  let noteIndex = notesArray.findIndex(note => note.Index === id);
  if (noteIndex !== -1) {
    notesArray[noteIndex].Title = editedTitle;
    notesArray[noteIndex].Content = editedContent;
  }

  updateLocalStorageAndUI();

  closeEditModal();
}


// Delete
$(".notes").on("click", ".delete-note", function () {
  let note = $(this).closest(".notes-content");
  let noteIndex = note.attr("id");

  let deletedNote = notesArray.find(note => note.Index === noteIndex);
  trashArray.push(deletedNote);

  notesArray = notesArray.filter(note => note.Index !== noteIndex);
  updateNotes();
  updateTrash();
});

function updateTrash() {
  let trash = $("#corbeille-notes");
  trash.empty();

  for (let i = 0; i < trashArray.length; i++) {
    let deletedNote = trashArray[i];
    addDeletedNote(deletedNote.Index, deletedNote.Color, deletedNote.Title, deletedNote.Content, deletedNote.Labels);
  }
}


function addDeletedNote(id, color, title, content, labels) {
  let trash = $("#corbeille-notes");
  let trashTemplate = `
    <div class="notes-content" id="${id}" style="background-color:${color}">
      <!-- Structure HTML pour afficher une note dans la corbeille -->
      <div class="card-container">
        <h4 class="note-title" style="padding: 20px; padding-bottom: 0">${title}</h4>
        <p style="padding-left: 20px;">${content}</p>
        <div class="labels-container" id="labels-${id}"></div>
      </div>
      <div class="note-actions">
        <a href="#" class="restore-trash-note"><i class="material-icons">restore</i></a>
        <a href="#" class="delete-trash-note"><i class="material-icons">delete</i></a>
      </div>
    </div>
  `;
  trash.append(trashTemplate);

  $("#" + id).find(".restore-trash-note").click(function () {
    restoreNoteFromTrash(id);
  });

  $("#" + id).find(".delete-trash-note").click(function () {
    deleteNoteFromTrash(id);
  });

  let labelsContainer = $(`#labels-${id}`);
  labels.forEach(label => {
    labelsContainer.append(`<span class="label clickable">${label}</span>`);
  });
}

$("#" + id).find(".delete-note").click(function () {
  let noteIndex = $(this).closest(".notes-content").attr("id");

  let deletedNote = notesArray.find(note => note.Index === noteIndex);
  trashArray.push(deletedNote);

  notesArray = notesArray.filter(note => note.Index !== noteIndex);
  updateNotes();
  updateTrash();
});


function restoreNoteFromTrash(id) {
  let restoredNote = trashArray.find(note => note.Index === id);
  notesArray.push(restoredNote);
  trashArray = trashArray.filter(note => note.Index !== id);
  updateNotes();
  updateTrash();
}

function deleteNoteFromTrash(id) {
  trashArray = trashArray.filter(note => note.Index !== id);
  updateTrash();
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
  let editButton = listItem.querySelector("button.edit");
  let label = listItem.querySelector("label");
  let containsClass = listItem.classList.contains("editMode");

  if (containsClass) {
    let originalLabelText = label.innerText;

    label.innerText = editInput.value;

    updateLabelInSidebar(originalLabelText, label.innerText);

    editButton.innerHTML = '<i class="material-icons">edit</i>';
  } else {
    editInput.value = label.innerText;

    editButton.innerHTML = '<i class="material-icons">check</i>';
  }

  listItem.classList.toggle("editMode");
}

function updateLabelInSidebar(originalLabelText, updatedLabelText) {
  let sidebarLabels = document.querySelectorAll('.sidebar-item .sidebar-text');

  sidebarLabels.forEach(function (sidebarLabel) {
    if (sidebarLabel.textContent === originalLabelText) {
      sidebarLabel.textContent = updatedLabelText;
    }
  });
}


let deleteTask = function () {
  let listItem = this.parentNode;
  let label = listItem.querySelector("label");

  let deletedLabelText = label.innerText;

  taskList.removeChild(listItem);

  removeLabelFromSidebar(deletedLabelText);

}

function removeLabelFromSidebar(deletedLabelText) {
  let sidebarLabels = document.querySelectorAll('.sidebar-item .sidebar-text');

  sidebarLabels.forEach(function (sidebarLabel) {
    if (sidebarLabel.textContent === deletedLabelText) {
      sidebarLabel.parentNode.remove();
    }
  });
}




let addTask = function () {
  let taskValue = taskInput.value.trim();

  if (taskValue !== "") {
    let listItem = createNewTaskElement(taskValue);
    taskList.appendChild(listItem);
    bindTaskEvents(listItem);

    addLabelToSidebar(taskValue);

    let activeNoteId = $(".notes-content.active").attr("id");

    if (activeNoteId) {
      let activeNote = notesArray.find(note => note.Index === activeNoteId);

      if (activeNote) {
        let activeNoteLabels = activeNote.Labels;

        if (!activeNoteLabels.includes(taskValue)) {
          let labelsContainer = $(`#labels-${activeNoteId}`);
          labelsContainer.append(`<span class="label">${taskValue}</span>`);

          activeNoteLabels.push(taskValue);
        }
      }
    }

    $("#save_note").click();

    taskInput.value = "";
  }
}

addButton.addEventListener("click", addTask);




let bindTaskEvents = function (taskListItem) {
  let deleteButton = taskListItem.querySelector("button.delete");
  let editButton = taskListItem.querySelector("button.edit");

  deleteButton.onclick = deleteTask;
  editButton.onclick = editTask;
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
  labelListItem.addEventListener('click', function () {
    openEditLabel();
  });
}



function addLabelToSidebar(labelString) {
  let sidebar = document.querySelector('.sidebar');
  let editLabelItem = sidebar.querySelector('.sidebar-item[onclick="openEditLabel(\'editLabel\')"]');

  let editInput = document.getElementById('editLabel').querySelector('input[type="text"]');
  let newLabelItem = createNewLabelElement(labelString);
  sidebar.insertBefore(newLabelItem, editLabelItem);

  newLabelItem.addEventListener('click', function () {
    showLabelPage(labelString);
  });
}




function hideAllSections() {
  let sections = document.querySelectorAll('main section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
}

// Page Label
function showLabelPage(labelString) {
  hideAllSections();

  let labelPage = document.getElementById('labelPage');
  labelPage.style.display = 'block';

  let sidebarLabels = document.querySelectorAll('.sidebar-item .sidebar-text');
  sidebarLabels.forEach(function (sidebarLabel) {
    let sidebarItem = sidebarLabel.parentNode;
    if (sidebarLabel.textContent === labelString) {
      sidebarItem.classList.add('active');
    } else {
      sidebarItem.classList.remove('active');
    }
  });

  console.log("Afficher la page du label :", labelString);
}

// Sous-menue 
document.addEventListener("click", function (event) {
  let subMenuContainer = document.querySelector('.submenu-container');
  let subMenu = document.getElementById('addNoteSubMenu');

  if (!subMenuContainer.contains(event.target) && !subMenu.contains(event.target) && event.target.id !== 'addLabelLink') {
    subMenu.style.display = 'none';
  }
});

function toggleSubMenu() {
  let subMenu = document.getElementById('addNoteSubMenu');
  subMenu.style.display = (subMenu.style.display === 'block') ? 'none' : 'block';
}

function openEditLabel() {
  let subMenu = document.getElementById('addNoteSubMenu');
  subMenu.style.display = 'none';

  let editLabelModal = document.getElementById('editLabel');
  editLabelModal.style.display = 'block';
}

$(document).on("click", ".label.clickable", function () {
  let labelString = $(this).text().trim();
  showLabelPage(labelString);
});