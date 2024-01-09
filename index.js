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
document.querySelector('.icons a[href="#"] i.image').addEventListener('click', function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*'; 
  input.click(); 

  input.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const imageURL = URL.createObjectURL(file);

    // Ajoutez l'image miniature à la carte
    const notesContainer = document.querySelector('.notes');
    const noteContent = document.createElement('div');
    noteContent.classList.add('notes-content');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('card-image');

    const imageElement = document.createElement('img');
    imageElement.src = imageURL;
    imageElement.alt = 'Image preview';

    // Ajoutez l'image dans le conteneur d'image de la carte
    imageContainer.appendChild(imageElement);
    noteContent.appendChild(imageContainer);

    // Ajoutez le reste du contenu de la note
    const title = document.createElement('h4');
    title.classList.add('note-title');
    title.textContent = document.getElementById('input-title').value;

    const content = document.createElement('p');
    content.textContent = document.getElementById('input-feild').value;

    noteContent.appendChild(title);
    noteContent.appendChild(content);

    // Ajoutez la note à la liste des notes
    notesContainer.appendChild(noteContent);
});
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



$(document).ready(function () {
  let storedNotes = localStorage.getItem("notes");
  if (storedNotes) {
    notesArray = JSON.parse(storedNotes);
    count = notesArray.length;

    for (let i = 0; i < count; i++) {
      let storedNote = notesArray[i];
      addNewNote(
        "color" + i,
        storedNote.BackgroundColor, 
        storedNote.Image, 
        storedNote.Title,
        storedNote.Content
      );
    }
  }

 $("#save_note").click(function () {
  let title = $("#input-title").val();
  let image = $("#image").val();
  let content = $("#input-feild").val();
  let bg_color = $("#notes-content").css("background-color"); 
  let index = "colour" + Math.ceil(Math.random() * 3);

  if (title !== "" || content !== "") {
    
    notesArray = [];

    notesArray.push({
      Index: index,
      Color: bg_color,
      Image: image,
      Title: title,
      Content: content,
      BackgroundColor: bg_color 
    });

    let jsonStr = JSON.stringify(notesArray);
    localStorage.setItem("notes", jsonStr);
    addNewNote(index, bg_color, image, title, content);
  }
});

});

function addNewNote(id, color, title, content) {
  let notes = $(".notes");
  let noteTemplate = `
  <div class="notes-content" id="notes-content" style="background-color:${color}">
  <img src="${image}" id="image" alt="">
    <h4 class="note-title">${title}</h4>
    <p>${content}</p>
    <a href="#" id="${id}" class="delete-note"><i class="material-icons">delete</i></a>
  </div>
`;


  notes.append(noteTemplate);

  $("#" + id).click(function () {
    $(this).closest(".notes-content").remove();
    notesArray = notesArray.filter(note => note.Index !== id); 
    let jsonStr = JSON.stringify(notesArray);
    localStorage.setItem("notes", jsonStr); 
  });
}
