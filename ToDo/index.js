
document.getElementById('done').onclick=function change(){
    mt=document.querySelector("#create-main-task").value;
st1=document.querySelector("#subtask1").value;
st2=document.querySelector("#subtask2").value;
var add=`<div class="main-task">
<div class="task">
    <input type="checkbox">
    <div class="task-text">
        ${mt}
    </div>
    <div class="delete-button">
        <button>
            Delete
        </button>
    </div>
</div>
<div class="create-sub-task">
    <input type="checkbox">
    <div class="task-text">
        ${st1}
    </div>
    <div class="delete-button">
        <button>
            Delete
        </button>
    </div>
</div>
<div class="create-sub-task">
    <input type="checkbox">
    <div class="task-text">
        ${st2}
    </div>
    <div class="delete-button">
        <button>
            Delete
        </button>
    </div>
</div>
</div>
`;


    document.querySelector('.tasks-list').insertAdjacentHTML('afterend',add);
}