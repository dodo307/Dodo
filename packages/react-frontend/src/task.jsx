class Task {
  static currUserId = undefined;

  static setUserId(userId) {
    this.currUserId = userId;
  }

  constructor(
    title,
    tags = [],
    description = '',
    date = undefined,
    hasTime = true,
    id = undefined
  ) {
    this.title = title;
    this._id = id;
    this.tags = [...tags];
    this.description = description;
    this.date = date;
    if (hasTime) this.date?.setSeconds(0);
    else this.date?.setSeconds(59);
    this.checked = false;
    this.userId = Task.currUserId;
  }

  toJSON() {
    let result = '{';
    result += `"title":"${this.title}"`;
    if (this._id) result += `,"_id":"${this._id}"`;
    result += `,"tags":${JSON.stringify(this.tags)}`;
    result += `,"description":"${this.description}"`;
    if (this.date) result += `,"date":"${this.date.toJSON()}"`;
    result += `,"completed":${this.checked}`;
    result += `,"userID":"${this.userId}"`;
    result += '}';
    return result;
  }

  static fromJSON(json) {
    const parsedJSON = JSON.parse(json);
    const result = new Task(
      parsedJSON.title,
      parsedJSON.tags,
      parsedJSON.description,
      parsedJSON.date ? new Date(parsedJSON.date) : undefined,
      parsedJSON.date?.slice(17, 19) == '00',
      parsedJSON._id
    );
    result.checked = parsedJSON.completed;
    result.userId = parsedJSON.userID;

    return result;
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
