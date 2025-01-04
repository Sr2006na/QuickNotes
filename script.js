document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    const notesContainer = document.getElementById('notes-container');
    const addNoteButton = document.getElementById('add-note');
    const modal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');

    let noteToDelete = null;

    if (!notesContainer) {
        console.error('notesContainer not found!');
        return;
    }
    if (!addNoteButton) {
        console.error('addNoteButton not found!');
        return;
    }

    
    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'flex';
    }

    
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });

    
  confirmYes.addEventListener('click', () => {
    if (noteToDelete) {
        const title = noteToDelete.dataset.title;
        const content = noteToDelete.dataset.content;

        notesContainer.removeChild(noteToDelete);
        removeNoteFromLocalStorage(title, content);

        loadNotes(); 

        confirmModal.style.display = 'none';
        noteToDelete = null;
    }
});


    confirmNo.addEventListener('click', () => {
        confirmModal.style.display = 'none';
        noteToDelete = null;
    });

    addNoteButton.addEventListener('click', () => {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();

        if (title && content) {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            const isDuplicate = notes.some(note => note.title === title && note.content === content);

            if (!isDuplicate) {
                addNote(title, content);
                saveNoteToLocalStorage(title, content);
            } else {
                showModal('This note already exists.');
            }

            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
        } else {
            showModal('Please fill in both title and content.');
        }
    });

    function addNote(title, content) {
        const emptyState = notesContainer.querySelector('.empty-state');
        if (emptyState) {
            notesContainer.removeChild(emptyState);
        }
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.dataset.title = title;
        noteCard.dataset.content = content; 

        const noteTitle = document.createElement('h3');
        noteTitle.textContent = title;

        const noteContent = document.createElement('p');
        noteContent.textContent = content;

        const noteButtons = document.createElement('div');
        noteButtons.classList.add('note-buttons');

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<span class="material-symbols-outlined">edit</span>';
        editBtn.addEventListener('click', () => {
            document.getElementById('note-title').value = title;
            document.getElementById('note-content').value = content;
            notesContainer.removeChild(noteCard);
            removeNoteFromLocalStorage(title, content);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
        deleteBtn.addEventListener('click', () => {
            noteToDelete = noteCard; 
            console.log('Delete button clicked, noteToDelete:', noteToDelete);
            confirmModal.style.display = 'flex';
        });

        noteButtons.appendChild(editBtn);
        noteButtons.appendChild(deleteBtn);

        noteCard.appendChild(noteTitle);
        noteCard.appendChild(noteContent);
        noteCard.appendChild(noteButtons);

        notesContainer.appendChild(noteCard);
    }

    function saveNoteToLocalStorage(title, content) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push({ title, content });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notesContainer.innerHTML = '';
        if (notes.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.textContent = 'No notes available. Add a new note!';
            emptyState.classList.add('empty-state');
            notesContainer.appendChild(emptyState);
        } else {
            notes.forEach(note => addNote(note.title, note.content));
        }
    }

    function removeNoteFromLocalStorage(title, content) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = notes.filter(note => !(note.title === title && note.content === content));
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
}


    loadNotes(); 
});




    