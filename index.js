function showCard() {
  document.getElementById("card-container").style.display = "block";
  document.getElementById("form-container").style.display = "none";
}

function hideCard() {
  document.getElementById("card-container").style.display = "none";
  document.getElementById("form-container").style.display = "block";
}


document.addEventListener("click", function(event) {
  let cardContainer = document.getElementById("card-container");
  let formContainer = document.getElementById("form-container");

  
  if (!cardContainer.contains(event.target) && !formContainer.contains(event.target)) {
    hideCard();
  }
});



// Background

function addNewNote() {
  noteCounter++;
  const colorPicker = document.getElementById('colorPicker');
  const newNote = document.createElement('div');
  newNote.classList.add('notes-content');
  newNote.classList.add('note-' + noteCounter);

  document.getElementById('notes').appendChild(newNote);
}

function show() {
  const colorPicker = document.getElementById('colorPicker');
  colorPicker.click();
}

function set_color(event) {
  const color = event.target.value;
  const notes = document.querySelectorAll('.notes-content');

  Array.from(notes).forEach(function (note) {
    note.style.backgroundColor = color;
  });
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
  let bg_color = $("#notes-content").css("background-color");
  let index = "colour" + Math.ceil(Math.random() * 3);

  if (title !== "" || content !== "") {
    notesArray = JSON.parse(localStorage.getItem("notes") || "[]");

    notesArray.push({
      Index: index,
      Color: bg_color,
      Title: title,
      Content: content,
      BackgroundColor: bg_color,
      ImageURL: imageURL,
    });

    let jsonStr = JSON.stringify(notesArray);
    localStorage.setItem("notes", jsonStr);
    addNewNote(index, bg_color, title, content, imageURL);
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

  let jsonTrash = JSON.stringify(trashArray); // Ajout de trashArray
  localStorage.setItem("trash", jsonTrash); // Ajout de trashArray

  updateNotes();
  updateArchive();
  updateTrash(); // Ajout de trashArray
}

function addNewNote(id, color, title, content, imageURL) {
  let notes = $(".notes");
  let noteTemplate = `
    <div class="notes-content" id="${id}" style="background-color:${color}">
    <img src="${imageURL}" alt="Image preview">
      <h4 class="note-title">${title}</h4>
      <p>${content}</p>
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
  let archive = $(".archive"); // Assurez-vous que vous avez une div avec la classe 'archive' dans votre code HTML
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

// Ajout de la fonction addTrashedNote
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
