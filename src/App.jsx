
import { useEffect, useRef, useState } from 'react';

export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export const TEAM = [
  'Paige Harrison',
  'Eeman Haq',
  'Safa Mustafa',
  'Elena Petrova',
  'Logan Brooks',
  'Cole Miller',
];
const TEAM_ROLES = [
  'Team Lead',
  'Software Architect',
  'Frontend Developer',
  'Backend Developer',
  'UI Designer',
  'Software Developer',
];
const DEFAULT_ROLE = 'Software Developer';

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

const INITIAL_DELIVERABLES = [
  {
    id: 'deliverable-1',
    title: 'Requirements and Planning',
    description: 'Agree on scope, requirements and priorities.',
    completed: false,
  },
  {
    id: 'deliverable-2',
    title: 'Core Implementation',
    description: 'Build the main application functionality.',
    completed: false,
  },
  {
    id: 'deliverable-3',
    title: 'Testing and Review',
    description: 'Check functionality, accessibility and usability.',
    completed: false,
  },
];

const initialTasks = [
  {
    id: '1',
    title: 'Review Kanban board layout',
    description: 'Check task-card readability and responsive layout.',
    type: 'feature',
    status: 'todo',
    assignee: 'Logan Brooks',
    dueDate: '2026-10-31',
    createdDate: '2026-10-20',
    priority: 'high',
    aiContext: '',
  },
  {
    id: '2',
    title: 'Set up the React development environment',
    description: 'Install dependencies and confirm that the application runs locally.',
    type: 'feature',
    status: 'done',
    assignee: 'Cole Miller',
    dueDate: null,
    createdDate: '2026-10-20',
    priority: 'high',
    aiContext: '',
  },
  {
    id: '3',
    title: 'Review task management functionality',
    description: 'Check that task creation, editing, deletion, filtering and stage updates work as expected.',
    type: 'feature',
    status: 'review',
    assignee: 'Eeman Haq',
    dueDate: '2026-10-29',
    createdDate: '2026-10-20',
    priority: 'low',
    aiContext: '',
  },
  {
    id: '4',
    title: 'Test core prototype features',
    description: 'Verify that the task forms, filters and team directory work correctly. Resolve issues identified during testing.',
    type: 'feature',
    status: 'done',
    assignee: 'Logan Brooks',
    dueDate: '2026-10-27',
    createdDate: '2026-10-20',
    priority: 'medium',
    aiContext: '',
  },
  {
    id: 'b4e85432-32f3-4241-83f2-7e4a8fcf2c36',
    title: 'Review visual design and accessibility',
    description: 'Check colours, keyboard focus and 200% zoom.',
    type: 'feature',
    status: 'review',
    assignee: 'Paige Harrison',
    dueDate: '2026-11-05',
    createdDate: '2026-10-28',
    priority: 'high',
    aiContext: '',
  },
  {
    id: '2651dd45-8a7c-4261-a77d-fd85300bed22',
    title: 'Deadline warning not updating',
    description: 'Overdue badge does not refresh until the page is reloaded.',
    type: 'bug',
    status: 'in-progress',
    assignee: 'Elena Petrova',
    dueDate: '2026-10-30',
    createdDate: '2026-10-28',
    priority: 'high',
    aiContext: '',
  },
  {
    id: '41ae1944-451e-4a61-a13d-0507a3532934',
    title: 'Validate team member management',
    description: 'Test adding, editing and removing team members.',
    type: 'feature',
    status: 'todo',
    assignee: 'Safa Mustafa',
    dueDate: '2026-11-15',
    createdDate: '2026-10-28',
    priority: 'medium',
    aiContext: '',
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
  todo: 'bg-[#F2EAF2] border-[#E4D7E4]',
  'in-progress': 'bg-[#EDF1F5] border-[#DDE5ED]',
  review: 'bg-[#F1EDFA] border-[#E1D9F2]',
  done: 'bg-[#E8F7EE] border-[#CCE9D8]',
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
      style: 'bg-red-100 text-red-800',
    };
  }

  if (task.dueDate === todayString) {
    return {
      label: 'Due today',
      style: 'bg-[#F5D4BD] text-[#80340F]',
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
      style: 'bg-[#F8E8AC] text-[#68500D]',
    };
  }

  return null;
}

export default function App() {
    const [recentlyDeletedTask, setRecentlyDeletedTask] = useState(null);
    useEffect(() => {
  if (!recentlyDeletedTask) return;

  const timer = setTimeout(() => {
    setRecentlyDeletedTask(null);
  }, 10000);

  return () => clearTimeout(timer);
}, [recentlyDeletedTask]);
    const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem('projectTracker.demoLogin') === 'true'
  );

  const [loginName, setLoginName] = useState('Cole');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  function signIn(event) {
    event.preventDefault();

    if (!loginName.trim() || !loginPassword.trim()) {
      setLoginError('Please enter your name and password.');
      return;
    }

    sessionStorage.setItem('projectTracker.demoLogin', 'true');
    setIsLoggedIn(true);
    setLoginError('');
  }

  function signOut() {
    sessionStorage.removeItem('projectTracker.demoLogin');
    setIsLoggedIn(false);
    setLoginPassword('');
  }
  const [tasks, setTasks] = useLocalStorage(
    'vibetracker.tasks',
    initialTasks
  );

  const [activePage, setActivePage] = useState('board');
  const [deliverables, setDeliverables] = useLocalStorage(
  'vibetracker.deliverables',
  INITIAL_DELIVERABLES
);
const [teamMembers, setTeamMembers] = useLocalStorage('vibetracker.team', TEAM);

const [memberRoles, setMemberRoles] = useLocalStorage(
  'vibetracker.memberRoles',
  {
    'Cole Miller': 'Team Lead',
    'Eeman Haq': 'Software Architect',
    'Elena Petrova': 'Frontend Developer',
    'Logan Brooks': 'UI Designer',
    'Safa Mustafa': 'Backend Developer',
    'Paige Harrison': 'Software Developer',
  }
);

const [newMemberRole, setNewMemberRole] = useState(DEFAULT_ROLE);
const [editedMemberRole, setEditedMemberRole] = useState(DEFAULT_ROLE);
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [editedMemberName, setEditedMemberName] = useState('');
  const [memberNotice, setMemberNotice] = useState('');
  const [memberToRemove, setMemberToRemove] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(null);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [copiedTaskId, setCopiedTaskId] = useState(null);
  const [copyErrorTaskId, setCopyErrorTaskId] = useState(null);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  const isModalOpen = form !== null;

useEffect(() => {
  if (!isModalOpen) return;

  previousFocusRef.current = document.activeElement;

  const titleInput = modalRef.current?.querySelector('#task-title');
  titleInput?.focus();

  return () => {
    previousFocusRef.current?.focus();
  };
}, [isModalOpen]);

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

const teamWorkload = teamMembers.map((member) => ({
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

function renameTeamMember(event) {
  event.preventDefault();

  const newName = editedMemberName.trim();

  if (!newName || editingMember === null) return;

  const duplicate = teamMembers.some(
    (member) =>
      member !== editingMember &&
      member.toLowerCase() === newName.toLowerCase()
  );

  if (duplicate) {
    alert('This team member already exists.');
    return;
  }

  setTeamMembers((current) =>
    current.map((member) =>
      member === editingMember ? newName : member
    )
  );

  setTasks((current) =>
    current.map((task) =>
      task.assignee === editingMember
        ? { ...task, assignee: newName }
        : task
    )
  );

  if (assigneeFilter === editingMember) {
    setAssigneeFilter(newName);
  }

  setMemberRoles((current) => {
  const updated = { ...current };

  if (editingMember !== newName) {
    delete updated[editingMember];
  }

  updated[newName] = editedMemberRole;

  return updated;
});

  setEditingMember(null);
  setEditedMemberName('');
}

function removeTeamMember(memberName) {
  const assignedTasks = tasks.filter(
    (task) => task.assignee === memberName
  );

if (assignedTasks.length > 0) {
  setMemberNotice(
    `${memberName} has ${assignedTasks.length} assigned ${
      assignedTasks.length === 1 ? 'task' : 'tasks'
    }. Reassign them before removing this member.`
  );
  return;
}

setMemberNotice('');

setMemberToRemove(memberName);
}

function confirmRemoveTeamMember() {
  if (memberToRemove === null) return;

  if (tasks.some((task) => task.assignee === memberToRemove)) {
    setMemberNotice(
      `${memberToRemove} still has assigned tasks. Reassign them before removing this member.`
    );
    setMemberToRemove(null);
    return;
  }

  setTeamMembers((current) =>
    current.filter((member) => member !== memberToRemove)
  );
  setMemberRoles((current) => {
  const updated = { ...current };
  delete updated[memberToRemove];
  return updated;
});

  if (editingMember === memberToRemove) {
    setEditingMember(null);
    setEditedMemberName('');
  }

  setMemberToRemove(null);
}

function addTeamMember(event) {
  event.preventDefault();

  const name = newMemberName.trim();

  if (!name) return;

  if (teamMembers.some((member) => member.toLowerCase() === name.toLowerCase())) {
    alert('This team member already exists.');
    return;
  }

setTeamMembers((current) => [...current, name]);

setMemberRoles((current) => ({
  ...current,
  [name]: newMemberRole,
}));

setNewMemberName('');
setNewMemberRole(DEFAULT_ROLE);
}

  function openNewTask(status = 'todo') {
    setEditingId(null);
    setForm({
  ...emptyTask,
  status,
  assignee: teamMembers[0] || '',
});
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

  function handleModalKeyDown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key !== 'Tab') return;

  const focusable = modalRef.current?.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
  );

  if (!focusable?.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
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

function exportTasksToCsv() {
  const columns = [
    ["Task", "title"],
    ["Description", "description"],
    ["Status", "status"],
    ["Priority", "priority"],
    ["Assignee", "assignee"],
    ["Due Date", "dueDate"],
  ];

  const escapeCsv = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const rows = [
    columns.map(([heading]) => escapeCsv(heading)).join(","),
    ...tasks.map((task) =>
      columns.map(([, key]) => escapeCsv(task[key])).join(",")
    ),
  ];

  const blob = new Blob(
    ["\uFEFF", rows.join("\r\n")],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "kanban-project-tasks.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function deleteTask() {
  const deletedTask = tasks.find((task) => task.id === editingId);

  if (deletedTask) {
    setRecentlyDeletedTask(deletedTask);
  }

  setTasks((current) =>
    current.filter((task) => task.id !== editingId)
  );

  closeModal();
}

function undoDelete() {
  if (!recentlyDeletedTask) return;

  setTasks((current) => {
    if (current.some((task) => task.id === recentlyDeletedTask.id)) {
      return current;
    }

    return [...current, recentlyDeletedTask];
  });

  setRecentlyDeletedTask(null);
}

    if (!isLoggedIn) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#102D25] px-4 py-12 text-white">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#102D25] via-[#245C49] to-[#071B16]" />
        <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-emerald-200/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-4xl shadow-lg">
              🌿
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Kanban Project Tracker
            </h1>

            <p className="mt-3 text-sm text-emerald-100">
              Plan. Track. Collaborate. Deliver.
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white p-7 text-slate-900 shadow-2xl sm:p-9">
            <h2 className="text-center text-2xl font-bold">
              Welcome Back
            </h2>

            <p className="mb-7 mt-2 text-center text-sm text-slate-500">
              Sign in to your project workspace
            </p>

            <form onSubmit={signIn} className="space-y-4">
              <div>
                <label
                  htmlFor="demo-login-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your name
                </label>

                <input
                  id="demo-login-name"
                  type="text"
                  value={loginName}
                  onChange={(event) => setLoginName(event.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
                />
              </div>

              <div>
                <label
                  htmlFor="demo-login-password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Demo password
                </label>

                <input
                  id="demo-login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="Enter any demo password"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
                />
              </div>

              {loginError && (
                <p role="alert" className="text-sm font-medium text-rose-700">
                  {loginError}
                </p>
              )}

<button
  type="submit"
  className="w-full rounded-xl bg-[#173D32] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#286B56] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
>
  Sign In
</button>
            </form>

<p className="mt-5 text-center text-xs text-slate-500">
  Demo access · No registration required
</p>
          </div>

          <p className="mt-6 text-center text-xs text-emerald-100/80">
            Software project management workspace
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#172333] lg:flex">
      <aside className="bg-[#173D32] px-6 py-8 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col">
        <div className="mb-8">
          <p className="text-lg font-bold tracking-tight">
            Project Workspace
          </p>
          <p className="mt-1 text-sm text-emerald-100">
            Software team tracker
          </p>
        </div>

<nav aria-label="Main navigation" className="space-y-2">
  <button
    type="button"
    onClick={() => setActivePage('board')}
    aria-current={activePage === 'board' ? 'page' : undefined}
className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
      activePage === 'board'
        ? 'bg-[#286B56] text-white'
        : 'text-slate-300 hover:bg-slate-700'
    }`}
  >
    Board
  </button>

  <button
    type="button"
    onClick={() => setActivePage('team')}
    aria-current={activePage === 'team' ? 'page' : undefined}
    className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
      activePage === 'team'
        ? 'bg-[#286B56] text-white'
        : 'text-slate-300 hover:bg-slate-700'
    }`}
  >
    Team
  </button>

  <p className="mt-6 border-t border-slate-700 px-4 pt-6 text-sm leading-6 text-slate-300">
    Manage tasks, track progress and collaborate with your team.
  </p>
</nav>

<div className="mt-auto border-t border-slate-700 pt-6">
  <p className="text-sm font-semibold text-slate-200">
    Project Tracker
  </p>
  <p className="mt-1 text-sm text-emerald-100">
Plan. Track. Deliver.  </p>
</div>
      </aside>

      <div className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8">

                <div className="mb-5 flex justify-end">
          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#173D32] shadow-sm hover:bg-[#F0F7F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F3EB] font-bold">
                {loginName.trim().charAt(0).toUpperCase() || 'D'}
              </span>
              {loginName.trim() || 'Demo User'}'s Workspace
              <span aria-hidden="true">⌄</span>
            </summary>

            <div className="absolute right-0 z-30 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

              <button
                type="button"
                onClick={signOut}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              >
                Log Out
              </button>
            </div>
          </details>
        </div>

          {activePage === 'board' ? (
          <>
       <header className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#216447]">
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
            className="rounded-lg bg-[#286447] px-5 py-3 text-sm font-semibold text-white hover:bg-[#174D37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
          >
            + New Task
          </button>
        </header>

        <section aria-label="Project overview" className="mb-8">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              { label: 'Total tasks', value: tasks.length, colour: 'text-slate-900' },
              { label: 'In progress', value: inProgressTasks, colour: 'text-[#216447]' },
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
  className="mb-4"
>
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-base font-bold">Project progress</h2>
    <p className="mt-2 text-3xl font-bold text-[#216447]">
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
        className="h-full rounded-full bg-[#286447]"
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

</section>
<section
  aria-label="Search and filter tasks"
  className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
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
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
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
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
      >
        <option value="all">All team members</option>
        {teamMembers.map((member) => (
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
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
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
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#216447]"
      >
        Clear filters
      </button>
    )}
  </div>
</section>

<section
  id="project-deliverables"
  aria-labelledby="deliverables-heading"
  className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
>
  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#216447]">
        Project milestones
      </p>
      <h2 id="deliverables-heading" className="mt-1 text-lg font-bold">
        Deliverables Anchor Board
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Keep the project's main outcomes visible above the task board.
      </p>
    </div>

    <span className="rounded-full bg-[#E6F3EB] px-3 py-1 text-sm font-semibold text-[#174D37]">
      {deliverables.filter((item) => item.completed).length} of {deliverables.length} complete
    </span>
  </div>

<details className="group">
  <summary className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-[#174D37] hover:bg-[#F0F7F3] focus-visible:outline-2 focus-visible:outline-[#216447]">
    <span className="group-open:hidden">Show deliverables ▼</span>
    <span className="hidden group-open:inline">Hide deliverables ▲</span>
  </summary>
  <div className="mt-4 grid gap-3 md:grid-cols-3">
    {deliverables.map((deliverable) => (
      <label
        key={deliverable.id}
        className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-violet-300"
      >
        <input
          type="checkbox"
          checked={deliverable.completed}
          onChange={(event) => {
            setDeliverables((current) =>
              current.map((item) =>
                item.id === deliverable.id
                  ? { ...item, completed: event.target.checked }
                  : item
              )
            );
          }}
          className="mt-1 h-4 w-4 accent-[#216447]"
        />

        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-900">
            {deliverable.title}
          </span>
          <span className="mt-1 block text-xs leading-5 text-slate-600">
            {deliverable.description}
          </span>
          <span className="mt-2 block text-xs font-semibold text-[#174D37]">
            {deliverable.completed ? 'Completed' : 'Not completed'}
          </span>
        </span>
      </label>
    ))}
  </div>
</details>
</section>

<div className="-mt-3 mb-4 flex justify-end">
  <button
    type="button"
    onClick={exportTasksToCsv}
    className="inline-flex items-center gap-2 rounded-xl bg-[#173D32] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#286B56] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
  >
    <span aria-hidden="true">↓</span>
    Export CSV
  </button>
</div>

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
                className={`min-h-80 rounded-xl border p-3 ${stageColours[stage.id]}`}
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
                      className="rounded-md bg-white px-2 py-1 text-sm font-bold text-[#216447] hover:bg-[#E6F3EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
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
                      className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-[#286B56] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
                      
                    >
                      <span
                        className={`inline-block rounded-md px-2 py-1 text-xs font-semibold ${task.type === 'bug'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-[#E6F3EB] text-[#174D37]'
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
        </>
      ) : (

<section aria-label="Team workspace" className="space-y-8">
  <header className="border-b border-slate-200 pb-6">
    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#216447]">
      Project Workspace / Team
    </p>
    <h1 className="text-3xl font-bold tracking-tight">
      Your development team
    </h1>
    <p className="mt-2 text-sm text-slate-600">
      People, responsibilities and active work in one place.
    </p>
  </header>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {[
      { label: 'Members', value: teamMembers.length },
      {
        label: 'Active tasks',
        value: tasks.filter((task) => task.status !== 'done').length,
      },
      {
        label: 'Unassigned',
        value: tasks.filter(
          (task) => !task.assignee || task.assignee === 'Unassigned'
        ).length,
      },
    ].map((stat) => (
      <div
        key={stat.label}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p className="text-sm text-slate-600">{stat.label}</p>
        <p className="mt-2 text-3xl font-bold">{stat.value}</p>
      </div>
    ))}
  </div>

  <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-bold">Workload overview</h2>
      <p className="text-sm text-slate-600">Unfinished tasks</p>
    </div>

    <div className="mt-6 space-y-5">
      {teamWorkload.map((member) => {
        const maximum = Math.max(
          1,
          ...teamWorkload.map((item) => item.count)
        );

        return (
          <div key={member.name}>
            <div className="mb-2 flex justify-between gap-3 text-sm">
              <span className="font-medium">{member.name}</span>
              <span className="text-slate-600">
                {member.count} {member.count === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#286447]"
                style={{
                  width: `${(member.count / maximum) * 100}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </section>

  <section>
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold">Team directory</h2>
<span className="text-sm text-slate-600">
  {teamMembers.length} members
</span>
    </div>

{memberNotice && (
  <div
    role="alert"
    className="mb-4 flex items-start justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4"
  >
    <div className="flex gap-3">
      <span aria-hidden="true" className="text-lg text-amber-700">
        ⚠
      </span>

      <div>
        <p className="text-sm font-bold text-amber-950">
          Member cannot be removed
        </p>
        <p className="mt-1 text-sm leading-6 text-amber-900">
          {memberNotice}
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={() => setMemberNotice('')}
      aria-label="Dismiss warning"
      className="rounded-md px-2 py-1 text-sm font-semibold text-amber-900 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-amber-700"
    >
      ✕
    </button>
  </div>
)}


{memberToRemove !== null && (
  <div
    role="group"
    aria-labelledby="remove-member-title"
    className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-5 shadow-sm"
  >
    <div className="flex items-start gap-3">
      <span aria-hidden="true" className="text-xl text-rose-700">
        ⚠
      </span>

      <div>
        <h3
          id="remove-member-title"
          className="text-base font-bold text-rose-950"
        >
          Remove team member?
        </h3>

        <p className="mt-2 text-sm leading-6 text-rose-900">
          Are you sure you want to remove{' '}
          <strong>{memberToRemove}</strong> from the team?
          This action cannot be undone.
        </p>
      </div>
    </div>

    <div className="mt-5 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={confirmRemoveTeamMember}
        className="rounded-lg bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-800"
      >
        Yes, remove member
      </button>

      <button
        type="button"
        onClick={() => setMemberToRemove(null)}
        className="rounded-lg border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-rose-100"
      >
        Cancel
      </button>
    </div>
  </div>
)}

    <form
  onSubmit={addTeamMember}
  className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
>
  <label htmlFor="new-member-name" className="sr-only">
    New team member name
  </label>

  <input
    id="new-member-name"
    type="text"
    value={newMemberName}
    onChange={(event) => setNewMemberName(event.target.value)}
    placeholder="Enter team member name"
    maxLength={60}
    required
    className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-[#216447]"
  />

<div className="sm:w-48">
  <label htmlFor="new-member-role" className="sr-only">
    New team member role
  </label>

  <select
    id="new-member-role"
    value={newMemberRole}
    onChange={(event) => setNewMemberRole(event.target.value)}
    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-[#216447]"
  >
    {TEAM_ROLES.map((role) => (
      <option key={role} value={role}>
        {role}
      </option>
    ))}
  </select>
</div>

  <button
    type="submit"
    className="rounded-lg bg-[#286447] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#174D37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216447]"
  >
    + Add Member
  </button>
</form>

    <div className="space-y-3">
      {teamWorkload.map((member, index) => (
        <div
          key={member.name}
          className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#302824] text-sm font-bold text-white">
            {String(index + 1).padStart(2, '0')}
          </div>

          <div className="min-w-0 flex-1">
<p className="font-semibold">{member.name}</p>
<p className="text-sm text-slate-600">
  {memberRoles[member.name] || DEFAULT_ROLE}
</p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold">{member.count}</p>
            <p className="text-xs text-slate-600">open tasks</p>
          </div>

          <button
  type="button"
onClick={() => {
  setEditingMember(member.name);
  setEditedMemberName(member.name);
  setEditedMemberRole(memberRoles[member.name] || DEFAULT_ROLE);
}}
  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#216447]"
  aria-label={`Edit ${member.name}`}
>
  Edit
</button>

<button
  type="button"
  onClick={() => removeTeamMember(member.name)}
  aria-label={`Remove ${member.name}`}
  className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-700"
>
  Remove
</button>
        </div>
      ))}
    </div>
    {editingMember !== null && (
  <form
    onSubmit={renameTeamMember}
    className="mt-4 rounded-xl border border-[#CCE9D8] bg-white p-5 shadow-sm"
  >
    <h3 className="mb-3 font-bold">
      Edit {editingMember}
    </h3>

    <label
      htmlFor="edit-member-name"
      className="mb-2 block text-sm font-semibold"
    >
      Member name
    </label>

    <input
      id="edit-member-name"
      type="text"
      required
      maxLength={60}
      value={editedMemberName}
      onChange={(event) => setEditedMemberName(event.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-[#216447]"
    />

    <label
  htmlFor="edit-member-role"
  className="mb-2 mt-4 block text-sm font-semibold"
>
  Team role
</label>

<select
  id="edit-member-role"
  value={editedMemberRole}
  onChange={(event) => setEditedMemberRole(event.target.value)}
  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-[#216447]"
>
  {TEAM_ROLES.map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))}
</select>

    <div className="mt-4 flex gap-3">
      <button
        type="submit"
        className="rounded-lg bg-[#286447] px-4 py-2 text-sm font-semibold text-white hover:bg-[#174D37]"
      >
        Save changes
      </button>

      <button
        type="button"
        onClick={() => setEditingMember(null)}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
      >
        Cancel
      </button>
    </div>
  </form>
)}

  </section>
</section>

      )}
      </div>

      {form !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            onKeyDown={handleModalKeyDown}
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-[#216447]"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-[#216447]"
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
                    {teamMembers.map((member) => (
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
    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-[#216447]"
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
  copyAiPrompt({ ...task, ...form });
}
      }}
      className="rounded-lg border border-violet-300 bg-[#F0F7F3] px-4 py-2 text-sm font-semibold text-[#174D37] hover:bg-[#E6F3EB]"
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
                    Delete this task?
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
                    className="rounded-lg bg-[#286447] px-4 py-2 text-sm font-semibold text-white hover:bg-[#174D37]"
                  >
                    {editingId ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {recentlyDeletedTask && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex max-w-xs items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900 shadow-lg"
        >
          <span aria-hidden="true" className="text-base">↩</span>

          <span className="text-sm font-medium">
            Task deleted
          </span>

          <button
            type="button"
            onClick={undoDelete}
            className="ml-2 rounded-md bg-white px-3 py-1.5 text-sm font-bold text-rose-700 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
