class NoteApp {
    constructor() {
      // Ініціалізуємо контейнери для збережених і архівованих заміток
      this.savedNotesContainer = document.getElementById('savedNotes');
      this.archiveContainer = document.getElementById('archiveNotes');
      // Вибираємо всі форми заміток
      this.noteForms = document.querySelectorAll('.note');
      // Налаштовуємо слухачі подій
      this.setupListeners();
      // Оновлюємо відображення заміток
      this.updateNotesDisplay();
    }
  
    // Налаштування слухачів подій
    setupListeners() {
      this.noteForms.forEach(noteForm => {
        const textarea = noteForm.querySelector('.noteTextarea');
        const addButton = noteForm.querySelector('.add');
        // Додаємо обробник подій для кнопки "Сохранить"
        addButton.addEventListener('click', (event) => {
          event.preventDefault();
          this.saveNoteTextarea(textarea);
        });
        // Видаляємо клас "error" при введенні тексту в textarea
        textarea.addEventListener('input', () => {
          textarea.classList.remove('error');
        });
      });
    }
  
    // Збереження тексту замітки
    saveNoteTextarea(textarea) {
      const note = textarea.value.trim();
  
      if (note === '') {
        textarea.classList.add('error');
        return;
      }
  
      const currentTime = new Date();
      const timeString = this.formatTime(currentTime);
      const noteData = {
        note: note,
        time: timeString,
        archived: false
      };
  
      // Отримуємо замітки з localStorage або створюємо порожній масив
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.push(noteData);
      // Зберігаємо оновлений масив заміток в localStorage
      localStorage.setItem('notes', JSON.stringify(notes));
  
      // Створюємо елемент замітки і додаємо його в контейнер
      const noteContainer = this.createNoteElement(noteData);
      this.savedNotesContainer.appendChild(noteContainer);
  
      // Очищаємо textarea після збереження
      textarea.value = '';
      this.updateNotesDisplay();
    }
  
    // Створення елемента замітки
    createNoteElement(noteData) {
      const noteDiv = document.createElement('div');
      noteDiv.textContent = `${noteData.note} (время: ${noteData.time})`;
  
      // Кнопка "Удалить"
      const deleteButton = this.createButton("Удалить", () => {
        this.deleteNoteFromLocalStorage(noteData);
      });
  
      // Кнопка "Архивировать"
      const archiveButton = this.createButton("Архивировать", () => {
        this.archiveNoteInLocalStorage(noteData);
      });
  
      // Кнопка "Редактировать"
      const editButton = this.createButton("Редактировать", () => {
        this.editNoteInLocalStorage(noteData);
      });
  
      // Додаємо елементи до контейнера замітки
      const noteContainer = document.createElement('div');
      noteContainer.appendChild(noteDiv);
      noteContainer.appendChild(deleteButton);
      noteContainer.appendChild(archiveButton);
      noteContainer.appendChild(editButton);
  
      return noteContainer;
    }
  
    // Створення елемента архівованої замітки
    createArchivedNoteElement(noteData) {
      const noteDiv = document.createElement('div');
      noteDiv.textContent = `${noteData.note} (время: ${noteData.time})`;
  
      // Кнопка "Удалить" для архівованої замітки
      const deleteButton = this.createButton("Удалить", () => {
        this.deleteNoteFromLocalStorage(noteData);
      });
  
      // Додаємо елементи до контейнера архівованої замітки
      const noteContainer = document.createElement('div');
      noteContainer.className = 'archived-note';
      noteContainer.appendChild(noteDiv);
      noteContainer.appendChild(deleteButton);
  
      return noteContainer;
    }
  
    // Створення кнопки
    createButton(text, onClickHandler) {
      const button = document.createElement('button');
      button.textContent = text;
      button.addEventListener('click', onClickHandler);
      return button;
    }
  
    // Видалення замітки з localStorage
    deleteNoteFromLocalStorage(noteData) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes = notes.filter(item => item.note !== noteData.note || item.time !== noteData.time);
      localStorage.setItem('notes', JSON.stringify(notes));
      this.updateNotesDisplay();
    }
  
    // Архівування замітки в localStorage
    archiveNoteInLocalStorage(noteData) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.forEach(item => {
        if (item.note === noteData.note && item.time === noteData.time) {
          item.archived = true;
        }
      });
      localStorage.setItem('notes', JSON.stringify(notes));
      this.updateNotesDisplay();
    }
  
    // Редагування замітки в localStorage
    editNoteInLocalStorage(noteData) {
      const newNote = prompt("Редактировать заметку:", noteData.note);
      if (newNote === null || newNote.trim() === "") {
        return;
      }
  
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.forEach(item => {
        if (item.note === noteData.note && item.time === noteData.time) {
          item.note = newNote;
        }
      });
      localStorage.setItem('notes', JSON.stringify(notes));
      this.updateNotesDisplay();
    }
  
    // Форматування часу
    formatTime(time) {
      return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    }
  
    // Оновлення відображення заміток
    updateNotesDisplay() {
      this.savedNotesContainer.innerHTML = '';
      this.archiveContainer.innerHTML = '';
  
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
  
      // Розподіл заміток на збережені і архівовані
      notes.forEach(noteData => {
        if (noteData.archived) {
          const archivedNoteContainer = this.createArchivedNoteElement(noteData);
          this.archiveContainer.appendChild(archivedNoteContainer);
        } else {
          const noteContainer = this.createNoteElement(noteData);
          this.savedNotesContainer.appendChild(noteContainer);
        }
      });
    }
  }
  
  // Створюємо екземпляр NoteApp при завантаженні вікна
  window.onload = function() {
    new NoteApp();
  };
