import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { AddTodoModal } from "./AddTodoModal";
import "./App.css";

export interface buttonClick {
  onClick: MouseEventHandler<HTMLElement>;
}

function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const showTaskModal = useCallback(() => setModalVisible(true), []);
  const [keyList, setKeyList] = useState<string[]>(() =>
    Object.keys(localStorage).filter((key) => key !== "currentId")
  );
  const [searchString, setSearchString] = useState("");
  const [showAllTasks, setShowAll] = useState(true);
  const [sortingFunction, setSortingFunction] = useState(
    () => (x: string, y: string) => Number(x) - Number(y)
  );

  const closeModal = useCallback((event) => {
    const eventTarget = event.target as HTMLElement;
    console.log(event);
    if (
      eventTarget.id === "modalWindow" ||
      eventTarget.id === "close-modal" ||
      eventTarget.id === "close-modal-button"
    )
      setModalVisible(false);
  }, []);
  return (
    <div className="App">
      <TopSection
        filterKeysByDate={(dateChosen) => {
          setKeyList(
            filterHelper(
              Object.keys(localStorage).filter((key) => key !== "currentId"),
              dateChosen
            )
          );
          setShowAll(false);
        }}
        onClick={showTaskModal}
        toggleShowAll={() => setShowAll((prev) => !prev)}
        currentShowAll={showAllTasks}
        changeSortingFunction={(sortingFunctionReceived) => {
          setSortingFunction(
            (prev: (x: string, y: string) => void) => sortingFunctionReceived
          );
          console.log(keyList.sort(sortingFunction));
        }}
        changeSearchString={(searchString) => setSearchString(searchString)}
      />
      <main>
        <TasksList
          keyList={
            showAllTasks
              ? Object.keys(localStorage).filter((key) => key !== "currentId")
              : keyList
          }
          removeKey={(id) => {
            setKeyList((prev) => prev.filter((value) => value !== id));
            localStorage.removeItem(id);
          }}
          sortingFunction={sortingFunction}
          searchString={searchString}
        />
        <AddTasksButton onClick={showTaskModal} />
      </main>
      {isModalVisible && <AddTodoModal onClick={closeModal} />}
    </div>
  );
}

function filterHelper(keyList: string[], dateChosen: string) {
  console.log(
    "Filtering by date",
    keyList.filter(
      (key) => JSON.parse(localStorage[key])["date"] === dateChosen
    ),
    dateChosen,
    keyList
  );
  return keyList.filter(
    (key) => JSON.parse(localStorage[key])["date"] === dateChosen
  );
}

//Single Task Component

function SingleTaskEntity({
  taskID,
  searchString,
  removeKey,
}: {
  taskID: string;
  searchString?: string;
  removeKey?: (id: string) => void;
}) {
  const [mainTask, setMainTask] = useState<string>(
    () => JSON.parse(localStorage[taskID])["mt"]
  );
  const [subTasks, setSubInputs] = useState<string[]>(() =>
    JSON.parse(localStorage[taskID])["subtask"].map(
      (val: [string, string]) => val[0]
    )
  );
  const [editing, setEditing] = useState(false);

  const closeModal = useCallback((event) => {
    const eventTarget = event.target as HTMLElement;
    console.log(event);
    if (
      eventTarget.id === "modalWindow" ||
      eventTarget.id === "close-modal" ||
      eventTarget.id === "close-modal-button"
    )
      setEditing(false);
  }, []);

  useEffect(() => {
    if (!localStorage[taskID]) return;

    setMainTask(JSON.parse(localStorage[taskID])["mt"]);
    setSubInputs(
      JSON.parse(localStorage[taskID])["subtask"].map(
        (val: [string, string]) => val[0]
      )
    );
  }, [editing, taskID]);

  if (searchString && !searchMatch(mainTask, subTasks, searchString))
    return null;

  function searchMatch(
    mainTask: string,
    subTasks: string[],
    searchString: string
  ) {
    let found = false;
    if (mainTask.indexOf(searchString) !== -1) {
      return true;
    }
    subTasks.forEach((value) => {
      if (value.indexOf(searchString) !== -1) found = true;
    });
    return found;
  }

  function highlight(str: string, searchString: string) {
    let highlightedElement = str;
    if (str.indexOf(searchString) !== -1)
      return (
        <>
          {str.split(searchString).map((value, index, array) => (
            <>
              {value}
              {index !== array.length - 1 && (
                <span style={{ backgroundColor: "yellow" }}>
                  {searchString}
                </span>
              )}
            </>
          ))}
        </>
      );
    return highlightedElement;
  }

  return (
    <>
      {editing && <AddTodoModal onClick={closeModal} editElementId={taskID} />}
      <div
        className="main-task"
        onClick={(event) => {
          if (
            (event.target as HTMLElement).tagName === "INPUT" ||
            (event.target as HTMLElement).tagName === "IMG"
          )
            return;
          setEditing(true);
        }}
      >
        <div className="task">
          <div className="task-text">
            <strong>
              {searchString ? highlight(mainTask, searchString) : mainTask}
            </strong>
          </div>
          <input
            type="checkbox"
            onClick={(event) => {
              const taskText = (event.target as HTMLElement)
                .previousElementSibling as HTMLElement;
              taskText.style.textDecoration === "line-through"
                ? (taskText.style.textDecoration = "initial")
                : (taskText.style.textDecoration = "line-through");
            }}
          />
          <div className="delete-button">
            <button
              onClick={() => {
                removeKey!(taskID);
              }}
            >
              <img alt="Delete" src="./del.svg" />
            </button>
          </div>
        </div>
        {subTasks.map((value, index) => (
          <div key={index} className="create-sub-task">
            <div className="task-text">
              {searchString ? highlight(value, searchString) : value}
            </div>
            <input
              type="checkbox"
              onClick={(event) => {
                const taskText = (event.target as HTMLElement)
                  .previousElementSibling as HTMLElement;
                taskText.style.textDecoration === "line-through"
                  ? (taskText.style.textDecoration = "initial")
                  : (taskText.style.textDecoration = "line-through");
              }}
            />
            <div className="delete-button">
              <button
                onClick={(event) => {
                  let newObj = JSON.parse(localStorage[taskID]);
                  newObj["subtask"].splice(index, 1);
                  localStorage[taskID] = JSON.stringify(newObj);
                  setSubInputs(
                    newObj["subtask"].map((val: [string, string]) => val[0])
                  );
                }}
              >
                <img alt="Delete" src="./del.svg" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

//List of tasks displayed
function TasksList({
  keyList,
  sortingFunction,
  searchString,
  removeKey,
}: {
  keyList: string[];
  sortingFunction: (x: string, y: string) => number;
  searchString?: string;
  removeKey?: (key: string) => void;
}) {
  // const sortingFunction = (a: string, b: string) => Number(a) - Number(b);
  // let keyList = Object.keys(localStorage).filter((key) => key !== "currentId");
  keyList.sort(sortingFunction);
  return (
    <div className="tasks-list">
      {keyList.map((key) => {
        return (
          <SingleTaskEntity
            searchString={searchString}
            key={key}
            taskID={key}
            removeKey={removeKey}
          />
        );
      })}
    </div>
  );
}

function AddTasksButton({ onClick }: buttonClick) {
  return (
    <button className="add-task-button" onClick={onClick}>
      <span>
        <svg width="13" height="13">
          <path
            d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z"
            fill="currentColor"
            fillRule="evenodd"
          ></path>
        </svg>
      </span>
      Add Task
    </button>
  );
}

function HeadingsRow({
  changeSearchString,
  onClick,
}: buttonClick & { changeSearchString: (searchString: string) => void }) {
  const [searchString, setSearchString] = useState("");
  return (
    <div className="top-nav-bar">
      <input
        type="text"
        id="search"
        placeholder="Search"
        value={searchString}
        onChange={(event) => {
          setSearchString(event.target.value);
          changeSearchString(event.target.value);
        }}
      />
      <div className="heading">ToDo Reloaded</div>
      <div className="add-task-div">
        <AddTasksButton onClick={onClick} />
      </div>
    </div>
  );
}
function OptionsRow({
  filterKeysByDate,
  toggleShowAll,
  currentShowAll,
  changeSortingFunction,
}: {
  filterKeysByDate: (dateChosen: string) => void;
  toggleShowAll: () => void;
  currentShowAll:boolean,
  changeSortingFunction: (
    sortingFunction: (x: string, y: string) => number
  ) => void;
}) {
  const [dateChosen, setDateChosen] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [sort, setSort] = useState("created-time");

  return (
    <div className="options-row">
      <div>
        <span className="date-filter">
          Tasks for <span id="view-date">{dateSpanValue(dateChosen)}</span>
        </span>
        <input
          id="filter-date"
          type="date"
          value={dateChosen}
          onChange={(event) => {
            filterKeysByDate(event.target.value);
            setDateChosen(event.target.value);
          }}
        />
      </div>
      <div className="right-align">
        <button
          className={
            "button-show-all " +
            (currentShowAll ? "show-all-active" : "show-all-inactive")
          }
          onClick={() => {
            console.log("Changing");
            toggleShowAll();
          }}
        >
          Show All Tasks
        </button>
        <div className="sort-button-div">
          <button>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16.854 5.146l3 3a.502.502 0 01-.708.708L17 6.707V18.5a.5.5 0 01-1 0V6.707l-2.146 2.147a.502.502 0 01-.708-.708l3-3a.502.502 0 01.708 0zM7.5 5a.5.5 0 01.5.5v11.791l2.146-2.145a.502.502 0 01.708.708l-3 3a.502.502 0 01-.708 0l-3-3a.502.502 0 01.708-.708L7 17.293V5.5a.5.5 0 01.5-.5z"
              ></path>
            </svg>
            Sort
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                // console.log(changeSortingFunction, getSortingFunction(event.target.value));

                changeSortingFunction(getSortingFunction(event.target.value));
              }}
            >
              <option value="created-time">Created Time</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="reverse-alphabetical">Reverse Alphabetical</option>
              <option value="inc-date">Increasing date</option>
              <option value="dec-date">Decreasing date</option>
            </select>
          </button>
        </div>
      </div>
    </div>
  );
}
function getSortingFunction(select: string) {
  let sortingFunction: (x: string, y: string) => number = (
    x: string,
    y: string
  ) => Number(x) - Number(y);
  if (select === "created-time")
    sortingFunction = (x: string, y: string) => Number(x) - Number(y);
  else if (select === "alphabetical")
    sortingFunction = (x: string, y: string) => {
      let x1 = JSON.parse(localStorage[x]).mt.toLowerCase(),
        y1 = JSON.parse(localStorage[y]).mt.toLowerCase();
      if (x1 > y1) return 1;
      if (x1 === y1) return 0;
      return -1;
    };
  else if (select === "reverse-alphabetical")
    sortingFunction = (x: string, y: string) => {
      let x1 = JSON.parse(localStorage[x]).mt.toLowerCase(),
        y1 = JSON.parse(localStorage[y]).mt.toLowerCase();
      if (x1 > y1) return -1;
      if (x1 === y1) return 0;
      return 1;
    };
  else if (select === "inc-date") {
    sortingFunction = (x: string, y: string) => {
      console.log(x, y);

      let x1 = JSON.parse(localStorage[x]).date,
        y1 = JSON.parse(localStorage[y]).date;
      if (x1 > y1) return 1;
      if (x1 === y1) return 0;
      return -1;
    };
  } else if (select === "dec-date") {
    sortingFunction = (x: string, y: string) => {
      let x1 = JSON.parse(localStorage[x]).date,
        y1 = JSON.parse(localStorage[y]).date;
      if (x1 > y1) return -1;
      if (x1 === y1) return 0;
      return 1;
    };
  }
  return sortingFunction;
}

function TopSection({
  onClick,
  filterKeysByDate,
  toggleShowAll,
  currentShowAll,
  changeSortingFunction,
  changeSearchString,
}: buttonClick & {
  filterKeysByDate: (dateChosen: string) => void;
  toggleShowAll: () => void;
  currentShowAll:boolean;
  changeSortingFunction: (
    sortingFunction: (x: string, y: string) => number
  ) => void;
  changeSearchString: (searchString: string) => void;
}) {
  return (
    <section className="top-section">
      <HeadingsRow changeSearchString={changeSearchString} onClick={onClick} />
      <OptionsRow
        filterKeysByDate={filterKeysByDate}
        toggleShowAll={toggleShowAll}
        currentShowAll={currentShowAll}
        changeSortingFunction={changeSortingFunction}
      />
    </section>
  );
}

function dateSpanValue(dateChosen: string) {
  if (new Date(dateChosen).toDateString() === new Date().toDateString())
    return "today";

  return `${new Date(dateChosen).toLocaleString("default", {
    month: "short",
  })} ${new Date(dateChosen).getDate()}`;
}

export default App;
