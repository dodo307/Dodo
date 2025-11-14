

class Task {
  static taskCount = 0; // Temp unique ID generator before linking to backend

  constructor(title, tags = [], description = '', date = undefined) {
    this.title = title;
    this.id = Task.taskCount++;
    this.tags = [...tags];
    this.description = description;
    this.date = date;
    this.dated = !!date;
    this.checked = false;
  }

  getData() {
    return {
      title: this.title,
      id: this.id,
      tags: this.tags,
      description: this.description,
      date: this.date,
      checked: this.checked,
    };
  }

  applyData(data) {
    for (const key in data) this[key] = data[key];
    this.dated = !!this.date;
  }
}

export default Task;