import { data, Form, redirect, useNavigation, useSubmit } from "react-router";
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "../.server/session";
import { validateText } from "../.server/validation";
import { addItem, getItem, removeItem, updateItem } from "../model/database";
import { useEffect, useRef } from "react";

export function meta() {
  return [
    { title: "ToDo-DB" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let action = formData.get("_action");

  switch (action) {
    case "create": {
      let task = formData.get("task");
      let fieldErrors = { task: validateText(task) };
      if (Object.values(fieldErrors).some(Boolean)) {
        return { fieldErrors };
      }
      let result = await addItem({ task });
      if (result.acknowledged) {
        setSuccessMessage(session, "Item added successfully!");
      } else {
        setErrorMessage(session, "Failed to add item. Please try again.");
      }
      return data(
        { ok: true },
        { headers: { "set-cookie": await commitSession(session) } }
      );
    }

    case "delete": {
      let id = formData.get("id");
      let deleted = await removeItem(id);
      if (deleted?.acknowledged) {
        setSuccessMessage(session, "Item deleted.");
      } else {
        setErrorMessage(session, "Failed to delete item.");
      }
      return redirect("/", {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }

    case "complete": {
      let id = formData.get("id");
      let completed = formData.get("completed") === "true";
      let updated = await updateItem(id, { completed });
      if (updated?.acknowledged) {
        setSuccessMessage(session, "Task updated.");
      } else {
        setErrorMessage(session, "Failed to update task.");
      }
      return redirect("/", {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }
  }
}

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let results = await getItem();
  let tasks = results.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
  return data(tasks);
}

export default function Home({ loaderData, actionData }) {
  let formRef = useRef(null);
  let navigation = useNavigation();
  let submit = useSubmit();

  let isSubmitting = navigation.state !== "idle";

  let optimisticText;
  let isDeleting = false;

  if (isSubmitting && navigation.formData) {
    let action = navigation.formData.get("_action");

    if (action === "create") {
      optimisticText = navigation.formData.get("task");
    }

    if (action === "delete") {
      isDeleting = true;
    }
  }

  useEffect(() => {
    formRef.current.reset();
  }, [isSubmitting]);

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4">
      {/* Hero Section */}
      <div className="bg-[url('/images/desktop-dark.jpg')] bg-cover bg-center h-48 md:h-72 flex items-center justify-center">
        <h1 className="text-2xl md:text-4xl font-bold tracking-wide uppercase text-white">
          T O D O
        </h1>
      </div>

      {/* Form */}
      <Form
        method="post"
        ref={formRef}
        className="flex flex-col sm:flex-row items-center gap-4 max-w-xl mx-auto mt-10 w-full"
      >
        <input type="hidden" name="_action" value="create" />
        <input
          className={`flex-1 p-3 rounded-md bg-gray-800 border ${
            actionData?.fieldErrors?.task ? "border-red-500" : "border-gray-600"
          } placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400`}
          type="text"
          name="task"
          id="tasks"
          placeholder="Add a new task..."
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
        >
          Add
        </button>
      </Form>

      {/* Field Error */}
      {actionData?.fieldErrors?.task && (
        <p className="text-red-500 text-sm text-center mt-2">
          {actionData.fieldErrors.task}
        </p>
      )}

      {/* Task List */}
      {loaderData.length === 0 ? (
        <div className="flex flex-col items-center gap-4 mt-8">
          <p className="text-gray-400">No tasks found. Add your first one!</p>
        </div>
      ) : (
        <ul className="max-w-xl mx-auto mt-10 space-y-4 w-full px-2">
          {loaderData.map((item) => (
            <li key={item._id}>
              <Todoitem
                tasks={item.task}
                id={item._id}
                completed={item.completed}
                hidden={isDeleting}
              />
            </li>
          ))}
          {isSubmitting && optimisticText ? (
            <Todoitem
              tasks={optimisticText}
              id="optimistic-id"
              completed={false}
            />
          ) : null}
        </ul>
      )}
    </main>
  );
}

function Todoitem({ tasks, id, completed }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-800 p-4 rounded-md shadow-md transition-all duration-200">
      <Form method="post" className="w-full sm:w-auto mb-2 sm:mb-0">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="_action" value="complete" />
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="completed"
            id={`todo-${id}`}
            value="true"
            onChange={(e) => e.target.form.requestSubmit()}
            defaultChecked={completed}
            className="accent-amber-500 w-5 h-5"
          />
          <label
            htmlFor={`todo-${id}`}
            className={`cursor-pointer ${
              completed ? "line-through text-gray-500" : ""
            }`}
          >
            {tasks}
          </label>
        </div>
      </Form>

      
      <Form method="post">
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          name="_action"
          value="delete"
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}
