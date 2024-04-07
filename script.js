let form=document.getElementById('form');
let textInput=document.getElementById('textInput')
let msg=document.getElementById('msg');
let dateInput=document.getElementById('dateInput');
let textarea=document.getElementById('textarea');
let tasks=document.getElementById('tasks');
let add=document.getElementById('add');
let CloseBtn=document.getElementById('Close-Btn');

let selectedId="add";
//submit button
form.addEventListener('submit',(e)=>{
  e.preventDefault();
  formvalidation();
});
//error handling
let formvalidation=()=>{
    if(textInput.value=== ""){
       console.log('failure') 
       msg.innerHTML="Task cannot be blank";
    }else{
        console.log('success');
        msg.innerHTML="";
        acceptedData();
        //addeddate
        addeddate();
    }
};
//collecting data from inputs and push to object
let data=[];
let todayTodos=[];
let acceptedData=()=>{
console.log(selectedId);
    let formData={
  text:textInput.value,
  date:dateInput.value,
  description:textarea.value,
  activeDate:activeDate,
  status:"pending",
  id:Math.round(Math.random()*1000),
}
//add or edit
if(selectedId=="add"){
      data.push(formData);
    }
   else{
       let index=data.findIndex((value)=>
        value.id==selectedId 
        )       
          console.log(index);
          console.log(selectedId);   
          data[index]=formData;              
   }
//Store arrays or objects in localStorage, you would have to convert them to strings.
   localStorage.setItem("datakey",JSON.stringify(data));
   fetchAllTodos();
   fetchActiveTodos();
   createTasks();
   resetForm();
 };
//create taks
//y -index value of todaytods 
let createTasks=()=>{
    tasks.innerHTML=""
    todayTodos.map((x,y)=>{
        console.log(y)
        return (tasks.innerHTML+=`
      <div id=${y} style="background-color:${x.status=="completed"? "#12372A": "#58A399"}">
        <h4 class="taskText">${x.text}</h4>
        <h4 class="taskDate">${x.date}</h4>
        <h5 class="taskDesc">${x.description}</h5>
        <span class="options">
            <i onclick="pendingTask(${x.id})" class="fa-solid fa-hourglass-half" style="display:${x.status=="pending" ? "static" :"none"}"></i>
            <i class="fa-solid fa-circle-check" style="display:${x.status=="pending" ? "none" :"static" }"></i>
            <i onclick="editTask(${x.id})"  data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onclick="deleteTask(${x.id});createTasks()" class="fas fa-trash-alt"></i>
        </span>
       </div>`);
    })
       resetForm();
};

//pending task
let pendingTask=(id)=>{
    let index=data.findIndex((value)=>
    value.id==id);
    data[index].status="completed"
    localStorage.setItem("datakey",JSON.stringify(data));
    fetchAllTodos();
    fetchActiveTodos();
    createTasks();
};

//reset form
let resetForm=()=>{
  textInput.value="";
  dateInput.value="";
  textarea.value="";
  selectedId="add";
  CloseBtn.click();
};

//delete task
let deleteTask=(id)=>{
let index=data.findIndex((value)=>
      value.id==id
);
data.splice(index,1);
localStorage.setItem("datakey",JSON.stringify(data));
fetchAllTodos();
fetchActiveTodos();
createTasks();
};

//edit task
let editTask=(id)=>{
selectedId=id;
console.log(selectedId);
//selected task - for get the object of selected index
let selectedTask=data.find((value)=>value.id==id);
console.log(selectedTask);
textInput.value=selectedTask.text;
dateInput.value=selectedTask.date;
textarea.value=selectedTask.description;
 
};
//Get data from from local storage
function getdata(){
data=JSON.parse(localStorage.getItem("datakey")) ||[];
createTasks();
console.log(data);
}
getdata();

//Weeks and months
let weekDays=[];
let weekDaysNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
let monthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let weekDaysContainer=document.getElementById("week-days");
let activeDate=dateParse(new Date())
renderWeekdays(new Date());

//fetching days for the calender
function renderWeekdays(date){
    weekDays=fetchWeekDays(date)
    insertDays()
}

//insert the calender days to weekDaysContainer
function insertDays(){
   const monthAndYear=document.getElementById("monthAndYear");
    monthAndYear.innerHTML=`${monthNames[weekDays[4].getMonth()]},${weekDays[4].getFullYear()}`
    
    weekDaysContainer.innerHTML=weekDays.map((weekDay)=>`
    <div class="todoDate" style="background-color:${dateParse(weekDay)==activeDate?"#F05941":"none"}" onclick="datePicker('${weekDay}')">
        <p class="day">${weekDaysNames[new Date(weekDay).getDay()]}</p>
        <p class="date">${new Date(weekDay).getDate()}</p>
    </div>
            `).join("")

}

//change active date on clicking the dates into the weekday calender
function datePicker(date){
    activeDate=dateParse(date)
    insertDays()
    fetchActiveTodos()
}

function nextWeek(){
    const date=new Date(weekDays[6])
    const a=date.setDate(date.getDate()+1)
    renderWeekdays(new Date(a))
}

function pastWeek(){
    const date=weekDays[6]
    const a=date.setDate(date.getDate()-7)
    renderWeekdays(new Date(a))
}


//calculating the 7 days according to the current day
function fetchWeekDays(date){
    let copy1=new Date(date);
    let copy2=new Date(date);
    const todayNumber= copy1.getDay()
    let weekDays=[]
    for(let i=todayNumber;i>0;i--)
         weekDays.push(new Date(copy1.setDate(copy1.getDate()-1)))
     weekDays.reverse()
     weekDays.push(date)
     for(let i=todayNumber;i<6;i++)
     weekDays.push(new Date(copy2.setDate(copy2.getDate()+1)))
    return weekDays
 }
 
 //return date from date object
 function dateParse(date){
     const dateObj=new Date(date)
     return dateObj.toISOString().slice(0,10)
  
 }

 let todos=[];
 let searchString="";

//Date
//filter todos from the all todos for current active date
fetchAllTodos();
fetchActiveTodos();
function fetchActiveTodos(){
    todayTodos= data.filter((todo)=>todo.activeDate==activeDate && todo.text.includes(searchString));
    createTasks();
}

//fetching all todos
function fetchAllTodos(){
    data=JSON.parse(localStorage.getItem("datakey"))||[]   
}
 
//search Handler
function searchHandler({value}){
     searchString=value;
    fetchActiveTodos();
}

//prevent default-to avoid the refresh in form submit
//
//
//If we getitem in localstorage no values it returns undefined ,if its undefined we cannot filter so we use empty []
