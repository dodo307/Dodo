class Task {
  static taskCount = 0; // Temp unique ID generator before linking to backend

  constructor(title, tags = [], description = '', date = undefined, hasTime = true, id = undefined) {
    this.title = title;
    this._id = id ?? Task.taskCount++;
    this.tags = [...tags];
    this.description = description;
    this.date = date;
    if (hasTime) this.date?.setSeconds(0);
    this.checked = false;
  }

  getData() {
    return {
      title: this.title,
      id: this._id,
      tags: this.tags,
      description: this.description,
      date: this.date,
      checked: this.checked,
    };
  }

  applyData(data) {
    for (const key in data) this[key] = data[key];
  }
}

export default Task;
