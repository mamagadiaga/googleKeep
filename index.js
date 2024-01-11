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

function addNewNote(id, color, title, content, imageURL) {
  let notes = $(".notes");
  let noteTemplate = `
    <div class="notes-content" id="${id}" style="background-color:${color}">
    <img src="${imageURL}" alt="Image preview">
      <h4 class="note-title">${title}</h4>
      <p>${content}</p>
      <a href="#" class="delete-note"><i class="material-icons">delete</i></a>
    </div>
  `;
  notes.append(noteTemplate);

  $("#" + id).click(function () {
    $(this).closest(".notes-content").remove();
    notesArray = notesArray.filter(note => note.Index !== id);
    updateLocalStorageAndUI();
  });
}
