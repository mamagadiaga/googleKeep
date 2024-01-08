 function showCard() {
    document.getElementById("card-container").style.display = "block";
    document.getElementById("form-container").style.display = "none";
  }

  function hideCard() {
    document.getElementById("card-container").style.display = "none";
    document.getElementById("form-container").style.display = "block";
  }


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

// function show() {
//   const colorPicker = document.getElementById('colorPicker');
//   colorPicker.click();
// }

// function set_color(event) {
//   const color = event.target.value;
//   const notes = document.querySelectorAll('.notes-content');

//   Array.from(notes).forEach(function (note) {
//     note.style.backgroundColor = color;
//   });
// }
document.addEventListener("DOMContentLoaded", function () {
  let storedNotes = localStorage.getItem("notes");
  if (storedNotes) {
    notesArray = JSON.parse(storedNotes);
    count = notesArray.length;

    for (let i = 0; i < count; i++) {
      let storedNote = notesArray[i];
      addNewNote(
        "color" + i,
        storedNote.BackgroundColor, 
        storedNote.Title,
        storedNote.Content
      );
    }
  }

  document.getElementById("save_note").addEventListener("click", function () {
    let title = document.getElementById("input-title").value;
    let content = document.getElementById("input-feild").value;
    let bg_color = getComputedStyle(document.getElementById("notes-content")).backgroundColor;
    let index = "colour" + Math.ceil(Math.random() * 3);

    if (title !== "" || content !== "") {
      notesArray = [];

      notesArray.push({
        Index: index,
        Color: bg_color,
        Title: title,
        Content: content,
        BackgroundColor: bg_color 
      });

      let jsonStr = JSON.stringify(notesArray);
      localStorage.setItem("notes", jsonStr);
      addNewNote(index, bg_color, title, content);
    }
  });
});

function addNewNote(id, color, title, content) {
  let notes = document.getElementsByClassName("notes")[0];
  let noteTemplate = `
  <div class="notes-content" id="notes-content" style="background-color:${color}">
    <h4 class="note-title">${title}</h4>
    <p>${content}</p>
    <a href="#" id="${id}" class="delete-note"><i class="material-icons">delete</i></a>
  </div>
`;

  notes.insertAdjacentHTML("beforeend", noteTemplate);

  document.getElementById(id).addEventListener("click", function () {
    this.closest(".notes-content").remove();
    notesArray = notesArray.filter(note => note.Index !== id);
    let jsonStr = JSON.stringify(notesArray);
    localStorage.setItem("notes", jsonStr);
  });
}

