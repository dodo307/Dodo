import TaskList from './taskList.jsx';

function UndatedList(props) {
  return (
    <div id="undatedListWrapper">
      <div id="undatedList">
        <h3>Undated</h3>
        <TaskList
          list={props.list}
          filter={props.filter}
          createTask={props.createTask}
          updateList={props.updateList}
          setPage={props.setPage}
        />
      </div>
    </div>
  );
}

export default UndatedList;
