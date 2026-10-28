
import { useEffect, useState } from 'react';

export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export const TEAM = ['Teammate A', 'Teammate B', 'Teammate C'];

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The app can still run if browser storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue];
}

const initialTasks = [
  {
    id: '1',
    title: 'Plan the project layout',
    description: 'Decide how the board should look',
    type: 'feature',
    status: 'todo',
    priority: 'high',
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
    priority: 'medium',
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
    priority: 'low',
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
    priority: 'high',
    assignee: 'Teammate A',
    dueDate: null,
    createdDate: '2026-10-20',
  },
];

const emptyTask = {
  title: '',
  description: '',
  type: 'feature',
  status: 'todo',
  priority: 'medium',
  assignee: TEAM[0],
  dueDate: '',
  aiContext: '',
};

const stageColours = {
  todo: 'bg-slate-100 border-slate-200',
  'in-progress': 'bg-violet-50 border-violet-200',
  review: 'bg-amber-50 border-amber-200',
  done: 'bg-emerald-50 border-emerald-200',
};

function getDeadlineStatus(task) {
  if (!task.dueDate || task.status === 'done') {
    return null;
  }

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  if (task.dueDate < todayString) {
    return {
      label: 'Overdue',
      style: 'bg-rose-100 text-rose-800',
    };
  }

  if (task.dueDate === todayString) {
    return {
      label: 'Due today',
      style: 'bg-amber-100 text-amber-900',
    };
  }

  const due = new Date(`${task.dueDate}T12:00:00`);
  const now = new Date(`${todayString}T12:00:00`);
  const daysUntilDue = Math.round(
    (due - now) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue <= 3) {
    return {
      label: 'Due soon',
      style: 'bg-amber-100 text-amber-900',
    };
  }

  return null;
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage(
    'vibetracker.tasks',
    initialTasks
  );

  // editingId is null when creating a new task.
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(null);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [copiedTaskId, setCopiedTaskId] = useState(null);
  const [copyErrorTaskId, setCopyErrorTaskId] = useState(null);

  const completedTasks = tasks.filter(
    (task) => task.status === 'done'
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === 'in-progress'
  ).length;

  const reviewTasks = tasks.filter(
    (task) => task.status === 'review'
  ).length;

  const completionPercentage = tasks.length
  ? Math.round((completedTasks / tasks.length) * 100)
  : 0;

const today = new Date();
const todayString = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-');

const overdueTasks = tasks.filter(
  (task) =>
    task.status !== 'done' &&
    task.dueDate &&
    task.dueDate < todayString
).length;

const teamWorkload = TEAM.map((member) => ({
  name: member,
  count: tasks.filter(
    (task) =>
      task.assignee === member && task.status !== 'done'
  ).length,
}));

  const filteredTasks = tasks.filter((task) => {
  const searchText = search.trim().toLowerCase();

  const matchesSearch =
    task.title.toLowerCase().includes(searchText) ||
    (task.description || '').toLowerCase().includes(searchText);

  const matchesAssignee =
    assigneeFilter === 'all' ||
    task.assignee === assigneeFilter;

  const matchesPriority =
    priorityFilter === 'all' ||
    (task.priority || 'medium') === priorityFilter;

  return matchesSearch && matchesAssignee && matchesPriority;
});

const filtersActive =
  search !== '' ||
  assigneeFilter !== 'all' ||
  priorityFilter !== 'all';

function clearFilters() {
  setSearch('');
  setAssigneeFilter('all');
  setPriorityFilter('all');
}

  function openNewTask(status = 'todo') {
    setEditingId(null);
    setForm({ ...emptyTask, status });
    setDeleteRequested(false);
  }

  function openEditTask(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      type: task.type,
      status: task.status,
      priority: task.priority || 'medium',
      assignee: task.assignee,
      dueDate: task.dueDate || '',
      aiContext: task.aiContext || '',
    });
    setDeleteRequested(false);
  }

  function closeModal() {
    setForm(null);
    setEditingId(null);
    setDeleteRequested(false);
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function saveTask(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) return;

    if (editingId !== null) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId
            ? {
              ...task,
              ...form,
              title,
              description: form.description.trim(),
              dueDate: form.dueDate || null,
            }
            : task
        )
      );
    } else {
      const newTask = {
        ...form,
        id: crypto.randomUUID(),
        title,
        description: form.description.trim(),
        dueDate: form.dueDate || null,
        createdDate: new Date().toLocaleDateString('en-CA'),
      };

      setTasks((current) => [...current, newTask]);
    }

    closeModal();
  }
async function copyAiPrompt(task) {
  const stage = STAGES.find((item) => item.id === task.status);

  const prompt = [
    'Help me with this software development task.',
    '',
    `Task: ${task.title}`,
    `Description: ${task.description || 'Not provided'}`,
    `Type: ${task.type}`,
    `Priority: ${task.priority || 'medium'}`,
    `Stage: ${stage?.label || task.status}`,
    `Assigned to: ${task.assignee}`,
    `Due date: ${task.dueDate || 'Not set'}`,
    '',
    'Additional context:',
    task.aiContext || 'No additional context provided.',
    '',
    'Please explain the steps clearly and suggest a practical solution.',
  ].join('\n');

  try {
    await navigator.clipboard.writeText(prompt);
    setCopiedTaskId(task.id);
  } catch {
    setCopyErrorTaskId(task.id);
  }
}

  function deleteTask() {
    setTasks((current) =>
      current.filter((task) => task.id !== editingId)
    );
    closeModal();
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-slate-900 lg:flex">
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
            Manage your team's project tasks.
          </p>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-700">
              Team workspace / Board
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Kanban Project Tracker
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Plan, track and deliver software projects.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openNewTask()}
            className="rounded-lg bg-[#6C5CE7] px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
          >
            + New Task
          </button>
        </header>

        <section aria-label="Project overview" className="mb-8">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              { label: 'Total tasks', value: tasks.length, colour: 'text-slate-900' },
              { label: 'In progress', value: inProgressTasks, colour: 'text-violet-700' },
              { label: 'In review', value: reviewTasks, colour: 'text-amber-700' },
              { label: 'Completed', value: completedTasks, colour: 'text-emerald-700' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className={`mt-2 text-3xl font-bold ${stat.colour}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>
<section
  aria-label="Project insights"
  className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2"
>
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-base font-bold">Project progress</h2>
    <p className="mt-2 text-3xl font-bold text-violet-700">
      {completionPercentage}%
    </p>
    <p className="mt-1 text-sm text-slate-600">
      {completedTasks} of {tasks.length} tasks completed
    </p>

    <div
      role="progressbar"
      aria-label="Project completion"
      aria-valuenow={completionPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200"
    >
      <div
        className="h-full rounded-full bg-[#6C5CE7]"
        style={{ width: `${completionPercentage}%` }}
      />
    </div>

    <p className="mt-5 text-sm text-slate-600">
      <span className="font-bold text-rose-700">
        {overdueTasks}
      </span>{' '}
      overdue {overdueTasks === 1 ? 'task' : 'tasks'}
    </p>
  </div>

  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-base font-bold">Team workload</h2>
    <p className="mt-1 text-sm text-slate-600">
      Tasks still in progress across the team
    </p>

    <div className="mt-4 space-y-3">
      {teamWorkload.map((member) => (
        <div
          key={member.name}
          className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
        >
          <span className="text-sm font-medium">
            {member.name}
          </span>
          <span className="text-sm font-semibold text-violet-700">
            {member.count}{' '}
            {member.count === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>
<section
  aria-label="Search and filter tasks"
  className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
>
  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
    <div>
      <label
        htmlFor="task-search"
        className="mb-1 block text-sm font-semibold text-slate-700"
      >
        Search tasks
      </label>
      <input
        id="task-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search title or description"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-violet-700"
      />
    </div>

    <div>
      <label
        htmlFor="assignee-filter"
        className="mb-1 block text-sm font-semibold text-slate-700"
      >
        Assigned to
      </label>
      <select
        id="assignee-filter"
        value={assigneeFilter}
        onChange={(event) => setAssigneeFilter(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-violet-700"
      >
        <option value="all">All team members</option>
        {TEAM.map((member) => (
          <option key={member} value={member}>
            {member}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label
        htmlFor="priority-filter"
        className="mb-1 block text-sm font-semibold text-slate-700"
      >
        Priority
      </label>
      <select
        id="priority-filter"
        value={priorityFilter}
        onChange={(event) => setPriorityFilter(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-violet-700"
      >
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  </div>

  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
    <p className="text-sm text-slate-600" aria-live="polite">
      Showing {filteredTasks.length} of {tasks.length} tasks
    </p>

    {filtersActive && (
      <button
        type="button"
        onClick={clearFilters}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-violet-700"
      >
        Clear filters
      </button>
    )}
  </div>
</section>

        <main
          aria-label="Project task board"
          className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 2xl:grid-cols-4"
        >
          {STAGES.map((stage) => {
            const stageTasks = filteredTasks.filter(
              (task) => task.status === stage.id
            );

            return (
              <section
                key={stage.id}
                aria-label={`${stage.label} tasks`}
                className={`min-h-80 rounded-xl border p-4 ${stageColours[stage.id]}`}
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-bold">
                    {stage.label}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {stageTasks.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => openNewTask(stage.id)}
                      aria-label={`Add task to ${stage.label}`}
                      className="rounded-md bg-white px-2 py-1 text-sm font-bold text-violet-700 hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-violet-700"
                    >
                      +
                    </button>
                  </div>
                </div>

{stageTasks.length === 0 && (
  <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
    {tasks.some((task) => task.status === stage.id)
      ? 'No tasks match your search or filters.'
      : 'No tasks in this stage yet.'}
  </p>
)}

                <div className="space-y-3">
                  {stageTasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => openEditTask(task)}
                      aria-label={`Edit task: ${task.title}`}
                      className="block w-full rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                    >
                      <span
                        className={`inline-block rounded-md px-2 py-1 text-xs font-semibold ${task.type === 'bug'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-violet-100 text-violet-800'
                          }`}
                      >
                        {task.type === 'bug' ? 'Bug' : 'Feature'}
                      </span>

                      <span
                        className={`ml-2 inline-block rounded-md px-2 py-1 text-xs font-semibold ${(task.priority || 'medium') === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : (task.priority || 'medium') === 'medium'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                      >
                        {(task.priority || 'medium').charAt(0).toUpperCase() +
                          (task.priority || 'medium').slice(1)} priority
                      </span>

                      <h3 className="mt-3 text-sm font-semibold leading-5">
                        {task.title}
                      </h3>

                      <p className="mt-2 text-sm leading-5 text-slate-600">
                        {task.description}
                      </p>

                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                        <p>
                          <span className="font-semibold">Owner:</span>{' '}
                          {task.assignee}
                        </p>
                        <p>
                          <span className="font-semibold">Due:</span>{' '}
                          {task.dueDate
                            ? task.dueDate.split('-').reverse().join('/')
                            : 'Not set'}
                        </p>

                        {getDeadlineStatus(task) && (
                          <p>
                            <span
                              className={`inline-block rounded-md px-2 py-1 font-semibold ${getDeadlineStatus(task).style
                                }`}
                            >
                              {getDeadlineStatus(task).label}
                            </span>
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {form !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="task-modal-title"
                className="text-xl font-bold text-slate-900"
              >
                {editingId ? 'Edit Task' : 'New Task'}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close task form"
                className="rounded-md px-2 py-1 text-xl text-slate-600 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveTask} className="space-y-4">
              <div>
                <label htmlFor="task-title" className="mb-1 block text-sm font-semibold">
                  Task title *
                </label>
                <input
                  id="task-title"
                  required
                  maxLength={100}
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-violet-700"
                  placeholder="e.g. Fix navigation bug"
                />
              </div>

              <div>
                <label htmlFor="task-description" className="mb-1 block text-sm font-semibold">
                  Description
                </label>
                <textarea
                  id="task-description"
                  rows={3}
                  value={form.description}
                  onChange={(event) => updateForm('description', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-violet-700"
                  placeholder="Describe the work needed"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="task-type" className="mb-1 block text-sm font-semibold">
                    Task type
                  </label>
                  <select
                    id="task-type"
                    value={form.type}
                    onChange={(event) => updateForm('type', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  >
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="task-priority"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    value={form.priority}
                    onChange={(event) =>
                      updateForm('priority', event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="task-status" className="mb-1 block text-sm font-semibold">
                    Stage
                  </label>
                  <select
                    id="task-status"
                    value={form.status}
                    onChange={(event) => updateForm('status', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="task-assignee" className="mb-1 block text-sm font-semibold">
                    Assigned to
                  </label>
                  <select
                    id="task-assignee"
                    value={form.assignee}
                    onChange={(event) => updateForm('assignee', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  >
                    {TEAM.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="task-due" className="mb-1 block text-sm font-semibold">
                    Due date
                  </label>
                  <input
                    id="task-due"
                    type="date"
                    value={form.dueDate}
                    onChange={(event) => updateForm('dueDate', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  />
                </div>
              </div>
<div>
  <label
    htmlFor="task-ai-context"
    className="mb-1 block text-sm font-semibold"
  >
    AI prompt context
  </label>

  <p className="mb-2 text-xs text-slate-600">
    Add technical details or instructions for an AI coding assistant.
  </p>

  <textarea
    id="task-ai-context"
    rows={3}
    value={form.aiContext || ''}
    onChange={(event) =>
      updateForm('aiContext', event.target.value)
    }
    placeholder="e.g. Check Login.jsx, keep the existing design, and include validation."
    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-violet-700"
  />
</div>  
{editingId !== null && (
  <div>
    <button
      type="button"
      onClick={() => {
        const task = tasks.find((item) => item.id === editingId);
        if (task) {
          setCopiedTaskId(null);
          setCopyErrorTaskId(null);
          copyAiPrompt(task);
        }
      }}
      className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
    >
      Copy AI Prompt
    </button>

    {copiedTaskId === editingId && (
      <p role="status" className="mt-2 text-sm text-emerald-700">
        Prompt copied!
      </p>
    )}

    {copyErrorTaskId === editingId && (
      <p role="alert" className="mt-2 text-sm text-rose-700">
        Couldn't copy the prompt. Please try again.
      </p>
    )}
  </div>
)}
              {deleteRequested && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 p-3"
                >
                  <p className="mb-3 text-sm text-rose-900">
                    Delete this task permanently?
                  </p>
                  <button
                    type="button"
                    onClick={deleteTask}
                    className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Yes, delete task
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteRequested(false)}
                    className="ml-3 text-sm font-semibold text-slate-700"
                  >
                    Keep task
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                <div>
                  {editingId !== null && !deleteRequested && (
                    <button
                      type="button"
                      onClick={() => setDeleteRequested(true)}
                      className="text-sm font-semibold text-rose-700 hover:underline"
                    >
                      Delete task
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
                  >
                    {editingId ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
