import TripleDots from "./assets/three-dots-vertical.svg";

function UndatedList(props) { 
   return <div id="undatedListWrapper">
     <div id="undatedList">
       <h4>Undated</h4>
       <Tasks list={props.list} />
     </div>
   </div>;
 }
 
 function Tasks(props) {
   const rows = props.list.map(x => <div key={x.id}>
     <h4>{x.name}</h4>
     <input
       type="checkbox"
     ></input>
     <img className="tripleDots" src={TripleDots}></img>
   </div>)
 
   return <div className="taskListWrapper">
   <div className="addTask unselectableText">+</div>
   <div className="taskList">
     {rows}
   </div>
   </div>;
 }
export default UndatedList;
