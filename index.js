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
let notesArray = [];

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
    updateNotes();
  }

  $(".delete-note").click(function () {
    let note = $(this).closest(".notes-content");
    let noteIndex = note.attr("id");

    // Remove the note directly without moving to the Trash
    notesArray = notesArray.filter(note => note.Index !== noteIndex);
    updateLocalStorageAndUI();
  });

  $("#save_change").click(function () {
    saveEdit();
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
  let jsonStr = JSON.stringify(notesArray);
  localStorage.setItem("notes", jsonStr);
  updateNotes();
}
// ... Your existing JavaScript code ...

function addNewNote(id, color, title, content, imageURL) {
  let notes = $(".notes");
  let noteTemplate = `
    <div class="notes-content" id="${id}" style="background-color:${color}">
    <img src="${imageURL}" alt="Image preview">
      <h4 class="note-title">${title}</h4>
      <p>${content}</p>
      <div class="note-actions">
        <a href="#" class="edit-note"><i class="material-icons">edit</i></a>
        <a href="#" class="delete-note"><i class="material-icons">delete</i></a>
      </div>
    </div>
  `;
  notes.append(noteTemplate);

  $("#" + id).find(".edit-note").click(function (event) {
    event.stopPropagation();
  
    // Handle edit functionality here
    let note = notesArray.find(note => note.Index === id);
  
    // Assuming you have an edit modal, you can populate it with the note details
    $("#edit-title").val(note.Title);
    $("#edit-content").val(note.Content);
  
    // Show the edit modal and pass the note ID
    openEditModal(id);
  });
  

  $("#" + id).find(".edit-note").click(function (event) {
    event.stopPropagation();

    // Handle edit functionality here
    let note = notesArray.find(note => note.Index === id);

    // Assuming you have an edit modal, you can populate it with the note details
    $("#edit-title").val(note.Title);
    $("#edit-content").val(note.Content);

    // Show the edit modal
    openEditModal();

    // Save edited note when the save button in the modal is clicked
    $("#saveEdit").off("click").on("click", function () {
      let editedTitle = $("#edit-title").val();
      let editedContent = $("#edit-content").val();

      // Update the edited note in the array
      notesArray.push({
        Index: id,
        Color: note.BackgroundColor,
        Title: editedTitle,
        Content: editedContent,
        BackgroundColor: note.BackgroundColor,
        ImageURL: note.ImageURL,
      });

      // Update local storage and UI
      updateLocalStorageAndUI();

      // Close the edit modal
      closeEditModal();
    });
  });
}

function saveEdit() {
  // Get the edited values from the modal
  var editedTitle = $("#edit-title").val();
  var editedContent = $("#edit-content").val();

  // Get the note index from the modal's data attribute
  var id = $("#editModal").data("note-id");

  // Update the note in the array
  var noteIndex = notesArray.findIndex(note => note.Index === id);
  if (noteIndex !== -1) {
    notesArray[noteIndex].Title = editedTitle;
    notesArray[noteIndex].Content = editedContent;
  }

  // Update local storage and UI
  updateLocalStorageAndUI();

  // Close the edit modal
  closeEditModal();
}
function openEditModal(id) {
  // Set the note ID in the modal's data attribute
  $("#editModal").data("note-id", id);

  // Show the edit modal
  document.getElementById("editModal").style.display = "block";
}


