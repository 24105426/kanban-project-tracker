
import { useState, useEffect } from 'react';
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
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
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

  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  const completedTasks = tasks.filter(
    (task) => task.status === 'done'
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === 'in-progress'
  ).length;

  const reviewTasks = tasks.filter(
    (task) => task.status === 'review'
  ).length;

  const stageColours = {
    todo: 'bg-slate-100 border-slate-200',
    'in-progress': 'bg-violet-50 border-violet-200',
    review: 'bg-amber-50 border-amber-200',
    done: 'bg-emerald-50 border-emerald-200',
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-slate-900 lg:flex">
      {/* Sidebar */}
      <aside className="bg-[#1E2433] px-6 py-6 text-white lg:min-h-screen lg:w-60 lg:shrink-0">
        <div className="mb-8">
          <p className="text-lg font-bold tracking-tight">
            Project Workspace
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Software team tracker
          </p>
        </div>

        <nav aria-label="Main navigation">
          <div
            aria-current="page"
            className="rounded-lg bg-[#6C5CE7] px-4 py-3 text-sm font-semibold"
          >
            Board
          </div>

          <p className="mt-4 px-4 text-xs leading-5 text-slate-400">
            /
          </p>
        </nav>
      </aside>

      {/* Main workspace */}
      <div className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-700">
            Team workspace / Board
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Kanban Project Tracker
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Plan, track and deliver software projects.
          </p>
        </header>

        {/* Overview statistics */}
        <section aria-label="Project overview" className="mb-8">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              {
                label: 'Total tasks',
                value: tasks.length,
                colour: 'text-slate-900',
              },
              {
                label: 'In progress',
                value: inProgressTasks,
                colour: 'text-violet-700',
              },
              {
                label: 'In review',
                value: reviewTasks,
                colour: 'text-amber-700',
              },
              {
                label: 'Completed',
                value: completedTasks,
                colour: 'text-emerald-700',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-600">
                  {stat.label}
                </p>
                <p className={`mt-2 text-3xl font-bold ${stat.colour}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

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

        {/* Kanban board */}
        <main
          aria-label="Project task board"
          className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 2xl:grid-cols-4"
        >
          {STAGES.map((stage) => {
            const stageTasks = tasks.filter(
              (task) => task.status === stage.id
            );

            return (
              <section
                key={stage.id}
                aria-label={`${stage.label} tasks`}
                className={`min-h-80 rounded-xl border p-4 ${stageColours[stage.id]}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">
                    {stage.label}
                  </h2>

                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {stageTasks.length} tasks
                  </span>
                </div>

                {stageTasks.length === 0 && (
                  <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                    No tasks in this stage yet.
                  </p>
                )}

                <div className="space-y-3">
                  {stageTasks.map((task) => (
                    <article
                      key={task.id}
                      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            task.type === 'bug'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-violet-100 text-violet-800'
                          }`}
                        >
                          {task.type === 'bug' ? 'Bug' : 'Feature'}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold leading-5 text-slate-900">
                        {task.title}
                      </h3>

                      <p className="mt-2 text-sm leading-5 text-slate-600">
                        {task.description}
                      </p>

                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                        <p className="text-xs text-slate-600">
                          <span className="font-semibold">Owner:</span>{' '}
                          {task.assignee}
                        </p>

                        <p className="text-xs text-slate-600">
                          <span className="font-semibold">Due:</span>{' '}
                          {task.dueDate || 'Not set'}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}
