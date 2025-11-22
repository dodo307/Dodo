class Task {
  static taskCount = 0; // Temp unique ID generator before linking to backend

  constructor(
    title,
    tags = [],
    description = '',
    date = undefined,
    hasTime = true,
    id = undefined
  ) {
    this.title = title;
    this._id = id ?? Task.taskCount++;
    this.tags = [...tags];
    this.description = description;
    this.date = date;
    if (hasTime) this.date?.setSeconds(0);
    else this.date?.setSeconds(59);
    this.checked = false;
  }

  toJSON() {
    let result = "{";
    result += `"title":"${this.title}"`;
    result += `"_id":"${this._id}"`;
    result += `"tags":"${this.tags}"`;
    result += `"description":"${this.description}"`;
    result += `"date":"${this.date.toJSON()}"`;
    result += `"checked":"${this.checked}"`;
    result += "}";
    return result;
  }

  static fromJSON(json) {
    const parsedJSON = JSON.parse(json);
    const result = new Task(parsedJSON.title, parsedJSON.tags, parsedJSON.description, new Date(parsedJSON.date), parsedJSON.date.slice(17, 19) == "00", parsedJSON._id);
    result.checked = parsedJSON.checked;
  }

  getData() {
    console.log(JSON.stringify(this));
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
