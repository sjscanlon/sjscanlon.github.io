//Global variables to store the table and an index to sort through the notes.
var $TABLE = $('#table');
var index = 0

//Function to get all currently stored notes from local storage.
function getNotes() {
    var notes = localStorage.getItem("notes")
    index = parseInt(localStorage.getItem("index"))
    if ( isNaN(index) ) { //Initiate the index variable if it has not been done yet.
        index = 0
    }
    if ( !notes ) {
        notes = []
    }
    else {
        notes = JSON.parse(notes)
    }
    return notes
}

//Function to store notes, used when a note is changed or removed.
function storeNotes( notes, index ) {
    localStorage.setItem( "notes", JSON.stringify(notes) )
    localStorage.setItem("index", index.toString())
}

//Function to remove a note from storage.
function removeNote( id ) {
    var notes = getNotes()
    var noteId = parseInt(id)
    for ( var inx = 0; inx < notes.length; inx++ ) { //Loop to find the note based on its id and remove it using splice.
        if ( notes[inx].id == noteId ) {
            notes.splice(inx, 1)
            break;
        }
    }
    storeNotes(notes,index) //Update storage of the list of notes now that the note has been removed.
}

//Function to update the storage of a notes contents when they are changed.
function updateNote( id, newText ) {
    var notes = getNotes()
    var noteId = parseInt(id)
    for ( var inx = 0; inx < notes.length; inx++ ) {
        if ( notes[inx].id == noteId ) {
            notes[inx].note = newText
            break;
        }
    }
    storeNotes(notes,index) //Update storage of the list of notes now that the note has been changed.
}

//Function to maintain the state of the notes when the page is refreshed or gone back to, based on current local storage.
$(document).ready( function() {
    var notes = getNotes()

    for ( var inx=0; inx < notes.length; inx++ ) {
        var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
        $clone[0].id = notes[inx].id
        $clone.find(".note-text").text(notes[inx].note)
        $TABLE.find('table').append($clone);
    }
});

//Function to update notes when they change using the blur function. (When no longer focusing on the note)
$(".note-text").blur( function() {
    updateNote( $(this).parents('tr')[0].id, $(this).text())
});

//Function to add a note upon the click of the button labeled with the table-add class.
$('.table-add').click(function () {
    var notes = getNotes()
    var note = { id: index, note: "New Note"}
    notes.push(note)
    var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
    $clone[0].id = index
    storeNotes(notes, ++index)
    $TABLE.find('table').append($clone);

});

//Function to remove a note upon the click of a button labeled with the table-remove class.
$('.table-remove').click(function () {
    removeNote( $(this).parents('tr')[0].id )
    $(this).parents('tr').detach();
});

//Function to remove all notes from the page upon the click of the button labeled with the clear-all class.
$('.clear-all').click(function () {
    var notes = getNotes()
    for ( var inx = 0; inx < index; inx++ ) {
        removeNote( notes[inx].id )

    }
});
