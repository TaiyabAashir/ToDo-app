import {
  useState,
  useRef,
  useLayoutEffect,
  FormEvent,
  MouseEvent,
} from "react";
import { uuid } from "uuidv4";
import { buttonClick } from "./App";

// let editElementId:null|string = null

interface objStorage {
  mt?: string;
  subtask?: [string, string][];
  date?: string;
  id?: string;
}

export function AddTodoModal({
  onClick,
  editElementId,
}: buttonClick & { editElementId?: string }) {
  const [mainInput, setMainInput] = useState(() =>
    editElementId && localStorage[editElementId]
      ? JSON.parse(localStorage[editElementId])["mt"]
      : ""
  );
  const [mainDate, setMainDate] = useState(() =>
    editElementId && localStorage[editElementId]
      ? JSON.parse(localStorage[editElementId])["date"]
      : ""
  );
  const [subInputs, setSubInputs] = useState<{ key: number; value: string }[]>(
    () => {
      if (editElementId && localStorage[editElementId]) {
        let arr = JSON.parse(localStorage[editElementId])["subtask"];
        return arr.map((val: [string, string]) => ({
          key: uuid(),
          value: val[0],
        }));
      }
      return [];
    }
  );
  const [subTimes, setSubTimes] = useState<string[]>(() => {
    if (editElementId && localStorage[editElementId]) {
      let arr = JSON.parse(localStorage[editElementId])["subtask"];
      return arr.map((val: [string, string]) => val[1]);
    }
    return [];
  });
  const ref = useRef<HTMLDivElement>(null);
  let actionDone = useRef("remove");

  function handleSubmit(event: FormEvent) {
    // event.preventDefault();
    let objStorage: objStorage = {};

    objStorage["subtask"] = subInputs.map((elem, index) => {
      return [elem.value, subTimes[index]];
    });
    objStorage["mt"] = mainInput;
    objStorage["date"] = mainDate;
    objStorage["id"] = editElementId || localStorage.currentId;
    localStorage[editElementId || localStorage.currentId] =
      JSON.stringify(objStorage);
    if (!editElementId) {
      localStorage.currentId = Number(localStorage.currentId) + 1;
    }
    console.log(objStorage);
    onClick({
      target: { id: "modalWindow" },
    } as unknown as MouseEvent<HTMLElement>);
    //   reloadList();
  }
  useLayoutEffect(() => {
    if (
      actionDone.current &&
      actionDone.current === "add" &&
      ref.current &&
      ref.current.lastElementChild
    ) {
      ref.current.lastElementChild.scrollIntoView();
      actionDone.current = "remove";
    }
  }, [subInputs]);
  return (
    <div className="modal" id="modalWindow" onClick={onClick}>
      <form className="create-task" onSubmit={handleSubmit}>
        <div className="modal-top">
          <h2>Add New Task</h2>
          <div className="close-button-div">
            <button type="button" id="close-modal-button">
              <img id="close-modal" src="./cross.svg" alt="Close" />
            </button>
          </div>
        </div>
        <div className="add-main-task">
          <input
            id="create-main-task"
            required
            type="text"
            placeholder="Enter the task you have to do..."
            value={mainInput}
            onChange={(event) => setMainInput(event.target.value)}
          />
          <input
            id="new-task-date"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            value={mainDate}
            onChange={(event) => setMainDate(event.target.value)}
          />
          {subInputs.length === 0 && (
            <button
              type="button"
              id="addsubtaskbutton"
              onClick={() => {
                setSubInputs([{ key: Date.now(), value: "" }]);
                setSubTimes([""]);
              }}
            >
              Add subtasks
            </button>
          )}
        </div>

        <div ref={ref} className="subtasks-container">
          {subInputs.length !== 0 &&
            subInputs.map(({ value, key }, index) => (
              <div key={key} className="add-sub-task">
                <input
                  required
                  value={value}
                  id="subtask"
                  type="text"
                  placeholder="Enter sub task and the time..."
                  onChange={(e) =>
                    setSubInputs((prev) => {
                      let newSubInputs = [...prev!];
                      newSubInputs[index].value = e.target.value;
                      return newSubInputs;
                    })
                  }
                />
                <input
                  type="time"
                  value={subTimes[index]}
                  onChange={(event) => {
                    console.log(subTimes, event.target.value);

                    setSubTimes((prev) => {
                      let newTimes = [...prev];
                      newTimes.splice(index, 1, event.target.value);
                      return newTimes;
                    });
                  }}
                />
                {index + 1 === subInputs.length && (
                  <button
                    type="button"
                    className="add-more-button"
                    onClick={() => {
                      actionDone.current = "add";
                      setSubInputs((prev) =>
                        prev!.concat({ key: Date.now(), value: "" })
                      );
                      setSubTimes((prev) => prev.concat(""));

                      // if (ref.current && ref.current.lastElementChild)
                      //   ref.current.lastElementChild.scrollIntoView();
                    }}
                  >
                    <img src="./plus.svg" alt="Add" />
                  </button>
                )}
                <button
                  type="button"
                  className="remove-more-button"
                  onClick={(e) => {
                    setSubInputs((prev) => {
                      let newSubInputs = [...prev!];
                      newSubInputs.splice(index, 1);
                      return newSubInputs;
                    });
                  }}
                >
                  <img src="./minus.svg" alt="Minus" />
                </button>
              </div>
            ))}
        </div>
        <div className="button-container">
          <button
            type="reset"
            id="reset"
            onClick={() => {
              setMainInput("");
              setMainDate("");
              setSubInputs((prev) =>
                prev.map(({ key, value }: { key: number; value: string }) => {
                  return { key, value: "" };
                })
              );
              setSubTimes((prev) => prev.map((value) => ""));
            }}
          >
            Reset
          </button>
          <button type="submit" id="done">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
