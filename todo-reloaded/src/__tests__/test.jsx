import {
  render,
  fireEvent,
  screen,
  waitForElement,
  waitFor,
  act,
  cleanup,
} from "@testing-library/react";
import { Simulate } from "react-dom/test-utils";
import App from "../App";

beforeAll(cleanup);
afterAll(cleanup);

test("Testing add task", async () => {
  const { container } = render(<App />);
  const button = screen.getAllByText(/Add Task/);
  expect(button.length).toEqual(2);
  const tasks = document.querySelector(".tasks-list");
  // console.log(button);

  Simulate.click(button[0]);
  expect(container.textContent).toMatch(/Add new task/i);
  expect(tasks?.childElementCount).toEqual(0);
  const form = document.querySelector("form");

  const [textInput, dateInput] = Array.from(form.querySelectorAll("input"));
  //   console.log(dateInput);

  Simulate.change(textInput, { target: { value: "Example Task 1" } });
  Simulate.change(dateInput, { target: { value: "2021-01-01" } });

  //   textInput.value = "Example Task 1";
  //   dateInput.value = "01/01/2022";
  //   console.log(container.textContent);
    Simulate.submit(form);
  console.log(container.textContent);

    // Simulate.keyDown(container, { key: "Enter", keyCode: 13, charCode: 13 });
  expect(container.textContent).not.toMatch(/Add new task/i);

  expect(screen.queryByText("Example Task 1")).not.toBeNull();
  expect(container.textContent).toMatch(/Example Task 1/i);

  expect(tasks.childElementCount).toEqual(1);
});

test('Search functionality',()=>{
  render(<App />);
  const search=document.querySelector('#search');
  const tasks = document.querySelector(".tasks-list");


  Simulate.change(search,{target:{value:'No result'}});
  expect(tasks.childElementCount).toEqual(0);

  Simulate.change(search,{target:{value:'Exam'}});
  expect(tasks.childElementCount).toEqual(1);
  expect(tasks.textContent).toMatch(/Example Task 1/i);


});

test('Delete functionality',()=>{
  render(<App />);
  const tasks = document.querySelector(".tasks-list");

  expect(tasks.childElementCount).toEqual(1);
  screen.getByAltText('Delete').click();
  expect(tasks.childElementCount).toEqual(0);


})