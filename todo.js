//Elementleri Seçme.
const container=document.getElementsByClassName("container");
const body1=document.querySelectorAll(".card-body")[0];
const form=document.querySelector("#todo-form");
const forminput=document.querySelector("#todo");
const button=document.querySelector("#submit");
//-------------------------------------------------------------
const body2=document.querySelectorAll(".card-body")[1];
const filter=document.querySelector("#filter");
const todoList=document.querySelector(".list-group");
const clear=document.querySelector("#clear-todos");
//-------------------------------------------------------------
allAddEvent();
//-------------------------------------------------------------
//Event Ekleme.
function allAddEvent()
{
    form.addEventListener("submit",addtodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI); //Sayfa yenilendiğinde çalışan event.
    body2.addEventListener("click",deleteItem);
    filter.addEventListener("keyup",filterFunction);
    clear.addEventListener("click",allClearTodos);
}
//-------------------------------------------------------------
function allClearTodos() // Tüm Taskları UI ve LOCAL'den temizleme işlemi.
{
//NOT: todoList.İnnerHTML=""; YAVAŞ SİLME İŞLEMİ olduğu için tercih edilmiyor.

if(confirm("Tüm taskları silmek istediğinize emin misiniz ?"))
{
    while(todoList.firstElementChild != null)
    {
        todoList.removeChild(todoList.firstElementChild);
    }

    localStorage.removeItem("todos"); 
    
    showAlert("success","Tüm Tasklar Temizlendi");
    }
}

//-------------------------------------------------------------
function filterFunction(e) //FİLTRELEME
{
const listItems=document.querySelectorAll(".list-group-item");
const filterValue=e.target.value.toLowerCase(); //İnputun içindeki verileri küçük harfli olarak çek.

listItems.forEach(function(todo)
{
const text=todo.textContent.toLowerCase();

if(text.indexOf(filterValue)=== -1)//indexOf() kelimeleri harf harf karşılaştırma metodu.
{
    todo.setAttribute("style","display: none !important"); //Boostrap'teki default özelliği kaldır.
}
else
{
    todo.setAttribute("style","display:block");
}
})
}
//-------------------------------------------------------------
function deleteItem(item) //UI'DEN SİLME İŞLEMİ.
{
    if(item.target.className==="fa fa-remove")
    {
        item.target.parentElement.parentElement.remove(); //li'yi siliyoruz.
        localDeleteItem(item.target.parentElement.parentElement.textContent);//li'nin Text Content'ini fonksiyonun değişkenine aktarıyoruz. 
        showAlert("success","Todo silinmiştir.");
    }

}
//-------------------------------------------------------------
function localDeleteItem(liDeleteText) //LOCAL'DEN SİLME İŞLEMİ.
{
let allTodos=getTodosFromStorage();

allTodos.forEach(function(todo,index){

    if(todo===liDeleteText)
    {
        allTodos.splice(index,1) // Array'den index numarasına göre değeri silicek.
    }
})

localStorage.setItem("todos",JSON.stringify(allTodos));

}
//-------------------------------------------------------------
function loadAllTodosToUI()
//Verileri Local'den çekip , forEach ile tek tek UI'e yazdırma fonksiyonu.
{
   let allTodos=getTodosFromStorage();

    allTodos.forEach(function(todo)  
    {
        addTodoToUI(todo);
    })
}
//-------------------------------------------------------------
function addtodo(a) //HEM UI HEM DE LOCAL'E TODO EKLEME.
{
    const newTodo=forminput.value.trim();//String metinde boşlukları dahil etme.

if(newTodo==="") //İnput içi boşsa uyarı mesajı versin , değilse ekleme fonksiyonu çalışsın.
{  
    showAlert("danger","Lütfen bir Todo girin !"); // Uyarı fonksiyonu.
}
else
{
    addTodoToUI(newTodo); //1. Modül
    showAlert("success","Eklendi.");
    addTodoToStorage(newTodo);
}
    a.preventDefault(); 
}
//-------------------------------------------------------------
function showAlert(type,message) //UYARI MESAJI OLUŞTURMA VE BODY'YE EKLEME.
{
const alert=document.createElement("div");
alert.className=`alert alert-${type}`; //Template literal özelliği.
alert.textContent=`${message}`;

body1.appendChild(alert); // Mesajı body'nin içine ekledik.

setTimeout(function(){alert.remove()},3000); //setTimeout //3 sn sonra silinsin. 

}
//-------------------------------------------------------------

function getTodosFromStorage() //LOCAL'DE VERİLER VARSA ÇEKME YOKSA BOŞ DİZİ OLUŞTURMA.
{
let todos;

if(localStorage.getItem("todos")===null)
{
todos=[];
}
else
{
todos=JSON.parse(localStorage.getItem("todos"));
}

return todos;

}
//-------------------------------------------------------------

function addTodoToStorage(newTodo) // LOCAL'E VERİ EKLEME.
{
let todos=getTodosFromStorage();
todos.push(newTodo);

localStorage.setItem("todos",JSON.stringify(todos));
}

//-------------------------------------------------------------
//Modül 1: String tipindeki veriyi List item olarak UI'e ekler.  
function addTodoToUI(newTodo)
{
//List item oluşturma.
const listItem=document.createElement("li");
listItem.classList="list-group-item d-flex justify-content-between";

//Link oluşturma.
const link=document.createElement("a");
link.className="delete-item";
link.href="#";
link.innerHTML="<i class = 'fa fa-remove'></i>";

//Text Node ekleme.
listItem.appendChild(document.createTextNode(newTodo));

//List item'ın içine Link'i ekleme.
listItem.appendChild(link);

//Ul içine List item ekleme.
todoList.appendChild(listItem);

//Ekleme işlemi bittikten sonra temizlesin.
forminput.value="";
}
//-----------------------------------------------------------------------------------------------------------------
