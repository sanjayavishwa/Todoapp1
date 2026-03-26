import { useState, useEffect } from "react"
import { CheckCircle2, Circle, Trash2, LogOut, Plus } from "lucide-react"

const API_BASE = "http://localhost:3000/api/todos"

export default function App() {
  const [activeTab, setActiveTab] = useState("personal")
  const [allTasks, setAllTasks] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch all todos once on mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()
      // Add a local 'tab' field defaulting to 'personal' if not stored
      const withTab = data.map((t) => ({ ...t, tab: t.tab || "personal" }))
      setAllTasks(withTab)
    } catch (err) {
      console.error("Failed to fetch todos:", err)
    }
  }

  // Filter tasks by active tab (frontend-only logic)
  const tasks = allTasks.filter((t) => t.tab === activeTab)

  const addTask = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim() }),
      })
      const newTask = await res.json()
      // Assign current tab locally
      setAllTasks((prev) => [...prev, { ...newTask, tab: activeTab }])
      setInput("")
    } catch (err) {
      console.error("Failed to add todo:", err)
    }
    setLoading(false)
  }

  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      })
      const updated = await res.json()
      setAllTasks((prev) =>
        prev.map((t) =>
          t._id === id ? { ...updated, tab: t.tab } : t
        )
      )
    } catch (err) {
      console.error("Failed to toggle todo:", err)
    }
  }

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" })
      setAllTasks((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      console.error("Failed to delete todo:", err)
    }
  }

  const clearCompleted = async () => {
    const completedInTab = allTasks.filter(
      (t) => t.tab === activeTab && t.completed
    )
    try {
      await Promise.all(
        completedInTab.map((t) =>
          fetch(`${API_BASE}/${t._id}`, { method: "DELETE" })
        )
      )
      setAllTasks((prev) =>
        prev.filter((t) => !(t.tab === activeTab && t.completed))
      )
    } catch (err) {
      console.error("Failed to clear completed:", err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask()
  }

  return (
    <div className="min-h-screen bg-[#f0ede6] flex flex-col items-center pt-10 px-4">
      {/* Logo */}
      {/* Logo */}
<h1 className="text-5xl font-light tracking-widest text-[#6b6b6b] mb-8 select-none flex items-center">
  TO
  <span className="text-[#d97706] font-bold">D</span>
  <span className="relative inline-flex items-center justify-center w-12 h-12">
    {/* The O circle border */}
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <circle cx="50" cy="50" r="44" stroke="#d97706" strokeWidth="8" />
      <polyline
        points="28,52 44,68 72,36"
        stroke="#d97706"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
</h1>

      {/* Tabs */}
      <div className="w-full max-w-xl flex border-b border-[#d5cfc4] mb-6">
        {["personal", "professional"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold capitalize tracking-wide transition-all duration-200
              ${
                activeTab === tab
                  ? "text-[#1a1a1a] border-b-2 border-[#d97706]"
                  : "text-[#9e9e9e] hover:text-[#555]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="w-full max-w-xl flex items-center gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you need to do?"
          className="flex-1 bg-[#e8e3da] text-[#555] placeholder-[#aaa] rounded-full px-6 py-3 text-sm outline-none focus:ring-2 focus:ring-[#d97706]/40 transition"
        />
        <button
          onClick={addTask}
          disabled={loading}
          className="bg-[#5bb8c9] hover:bg-[#4aa8b9] active:scale-95 text-white font-bold px-6 py-3 rounded-full text-sm tracking-widest transition-all duration-150 disabled:opacity-60 flex items-center gap-1"
        >
          <Plus size={16} strokeWidth={3} />
          ADD
        </button>
      </div>

      {/* Task List */}
      <div className="w-full max-w-xl bg-[#e8e3da] rounded-2xl overflow-hidden shadow-sm">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-[#bbb] text-sm">
            No tasks yet. Add one above!
          </div>
        ) : (
          <ul>
            {tasks.map((task, idx) => (
              <li
                key={task._id}
                className={`flex items-center gap-4 px-6 py-4 group transition-colors
                  ${idx !== tasks.length - 1 ? "border-b border-[#d5cfc4]" : ""}`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task._id, task.completed)}
                  className="flex-shrink-0 transition-transform active:scale-90"
                >
                  {task.completed ? (
                    <CheckCircle2
                      size={26}
                      className="text-[#d97706]"
                      strokeWidth={2}
                    />
                  ) : (
                    <Circle
                      size={26}
                      className="text-[#9e9e9e] hover:text-[#d97706] transition-colors"
                      strokeWidth={2}
                    />
                  )}
                </button>

                {/* Task text — backend uses 'text' field */}
                <span
                  className={`flex-1 text-sm transition-all duration-200 ${
                    task.completed
                      ? "line-through text-[#c4bdb2]"
                      : "text-[#2a2a2a]"
                  }`}
                >
                  {task.text}
                </span>

                {/* Delete */}
                <button
                  onClick={() => deleteTask(task._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4bdb2] hover:text-red-400 active:scale-90"
                >
                  <Trash2 size={18} strokeWidth={1.8} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Clear Completed */}
        {tasks.some((t) => t.completed) && (
          // Replace the entire clear completed block with this:
<div className="flex justify-end px-6 py-4 border-t border-[#d5cfc4]">
  <button
    onClick={clearCompleted}
    disabled={!tasks.some((t) => t.completed)}
    className="flex items-center gap-2 text-[#d97706] text-sm hover:text-[#b45309] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
  >
    <LogOut size={16} strokeWidth={2} />
    Clear Completed
  </button>
</div>
        )}
      </div>
    </div>
  )
}