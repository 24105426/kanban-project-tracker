import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Replace these placeholders with the three names from PRD §8 before M4.
// They become the only valid values for `Task.assignee`.
export const TEAM = ['Teammate A', 'Teammate B', 'Teammate C'];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  // TODO M4 data-model:
  //   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', [/* 3-4 seed tasks */]);
    const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', [
    {
      id: '1',
      title: 'Plan the project layout',
      description: 'Decide how the board should look',
      type: 'feature',
      status: 'todo',
      assignee: 'Teammate A',
      dueDate: null,
      createdDate: '2026-10-20',
    },
    {
      id: '2',
      title: 'Create task cards',
      description: 'Display tasks on the board',
      type: 'feature',
      status: 'in-progress',
      assignee: 'Teammate B',
      dueDate: null,
      createdDate: '2026-10-20',
    },
    {
      id: '3',
      title: 'Check the design',
      description: 'Review colours and layout',
      type: 'bug',
      status: 'review',
      assignee: 'Teammate C',
      dueDate: null,
      createdDate: '2026-10-20',
    },
    {
      id: '4',
      title: 'Set up React project',
      description: 'Install dependencies and run the app',
      type: 'feature',
      status: 'done',
      assignee: 'Teammate A',
      dueDate: null,
      createdDate: '2026-10-20',
    },
  ]);
  //
  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-500">
            {/* Replace this line with your team name from PRD §11. */}
            Team starter
          </p>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/*
        TODO M4 data-model:
          Render a Kanban board with the four columns from STAGES.
          Each column should display the tasks whose status matches its id.
          Pre-populate 3-4 mock tasks so the board isn't empty on first load.

        TODO M5 crud-modal:
          Add a "+" button that opens a modal with every Task field.
          Clicking a card should open the same modal in edit mode.
      */}
<main className="grid grid-cols-1 gap-4 md:grid-cols-4">
  {STAGES.map((stage) => (
    <section
      key={stage.id}
      className={`min-h-64 rounded-lg p-4 ${
        stage.id === 'todo'
          ? 'bg-column-todo'
          : stage.id === 'in-progress'
          ? 'bg-column-progress'
          : stage.id === 'review'
          ? 'bg-column-review'
          : 'bg-column-done'
      }`}
    >
      <h2 className="mb-4 font-semibold text-text-primary">
        {stage.label}
      </h2>

      {tasks
        .filter((task) => task.status === stage.id)
        .map((task) => (
          <div
            key={task.id}
            className="mb-3 rounded border border-gray-300 bg-white p-3"
          >
            <h3 className="font-medium text-text-primary">
              {task.title}
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              {task.description}
            </p>
          </div>
        ))}
    </section>
  ))}
</main>
    </div>
  );
}
