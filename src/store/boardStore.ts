import { create } from 'zustand'

// Simple ID generator
const genId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

export type Task = {
  id: string
  title: string
  description?: string
  assignee?: string // email
}

export type Column = {
  id: string
  name: string
  color?: string
  taskIds: string[]
}

export type Board = {
  id: string
  name: string
  columns: Column[]
  tasks: Record<string, Task>
  admins: string[] // emails
}

type BoardState = {
  boards: Board[]
  createBoard: (name: string, ownerEmail?: string) => Board
  getBoard: (id: string) => Board | undefined
  updateBoard: (id: string, patch: Partial<Board>) => void
  addColumn: (boardId: string, name: string, color?: string) => void
  addTask: (boardId: string, columnId: string, title: string, assignee?: string) => void
  moveTask: (boardId: string, fromColumnId: string, toColumnId: string, taskId: string, toIndex?: number) => void
  assignAdmin: (boardId: string, email: string) => void
  deleteTask: (boardId: string, taskId: string) => void
  deleteColumn: (boardId: string, columnId: string) => void
  updateColumn: (boardId: string, columnId: string, patch: Partial<Column>) => void
  updateTask: (boardId: string, taskId: string, patch: Partial<Task>) => void
}

const STORAGE_KEY = 'taskflow_boards'

const load = (): Board[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

const save = (boards: Board[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards))
  } catch {}
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: load(),

  createBoard: (name, ownerEmail) => {
    const id = genId()
    const defaultCols: Column[] = [
      { id: genId(), name: 'To Do', color: '#F3F4F6', taskIds: [] },
      { id: genId(), name: 'In Progress', color: '#EFF6FF', taskIds: [] },
      { id: genId(), name: 'Done', color: '#ECFDF5', taskIds: [] },
    ]
    const board: Board = { id, name, columns: defaultCols, tasks: {}, admins: ownerEmail ? [ownerEmail] : [] }
    const boards = [...get().boards, board]
    set({ boards })
    save(boards)
    return board
  },

  getBoard: (id) => {
    return get().boards.find((b) => b.id === id)
  },

  updateBoard: (id, patch) => {
    const boards = get().boards.map((b) => (b.id === id ? { ...b, ...patch } : b))
    set({ boards })
    save(boards)
  },

  addColumn: (boardId, name, color) => {
    const boards = get().boards.map((b) => {
      if (b.id !== boardId) return b
      const col: Column = { id: genId(), name, color: color || '#FFFFFF', taskIds: [] }
      return { ...b, columns: [...b.columns, col] }
    })
    set({ boards })
    save(boards)
  },

  addTask: (boardId, columnId, title, assignee) => {
    const boards = get().boards.map((b) => {
      if (b.id !== boardId) return b
      const id = genId()
      const task: Task = { id, title, assignee }
      const tasks = { ...b.tasks, [id]: task }
      const columns = b.columns.map((c) => (c.id === columnId ? { ...c, taskIds: [...c.taskIds, id] } : c))
      return { ...b, tasks, columns }
    })
    set({ boards })
    save(boards)
  },

  moveTask: (boardId, fromColumnId, toColumnId, taskId, toIndex) => {
    const boards = get().boards.map((b) => {
      if (b.id !== boardId) return b
      const columns = b.columns.map((c) => ({ ...c, taskIds: [...c.taskIds] }))
      const from = columns.find((c) => c.id === fromColumnId)
      const to = columns.find((c) => c.id === toColumnId)
      if (!from || !to) return b
      // remove from source
      const idx = from.taskIds.indexOf(taskId)
      if (idx !== -1) from.taskIds.splice(idx, 1)
      // insert into target
      const insertAt = typeof toIndex === 'number' ? toIndex : to.taskIds.length
      to.taskIds.splice(insertAt, 0, taskId)
      return { ...b, columns }
    })
    set({ boards })
    save(boards)
  },

  assignAdmin: (boardId, email) => {
    const boards = get().boards.map((b) => (b.id === boardId ? { ...b, admins: Array.from(new Set([...b.admins, email])) } : b))
    set({ boards })
    save(boards)
  },

  deleteTask: (boardId: string, taskId: string) => {
    const boards = get().boards.map((b) => {
      if (b.id !== boardId) return b
      const { [taskId]: _, ...tasks } = b.tasks
      const columns = b.columns.map((c) => ({ ...c, taskIds: c.taskIds.filter((id) => id !== taskId) }))
      return { ...b, tasks, columns }
    })
    set({ boards })
    save(boards)
  },

  deleteColumn: (boardId: string, columnId: string) => {
    const boards = get().boards.map((b) => {
      if (b.id !== boardId) return b
      const col = b.columns.find((c) => c.id === columnId)
      if (!col) return b
      // remove all tasks in column
      const tasks = { ...b.tasks }
      col.taskIds.forEach((tid) => delete tasks[tid])
      const columns = b.columns.filter((c) => c.id !== columnId)
      return { ...b, tasks, columns }
    })
    set({ boards })
    save(boards)
  },

  updateColumn: (boardId: string, columnId: string, patch: Partial<Column>) => {
    const boards = get().boards.map((b) => {
      if (b.id !== boardId) return b
      const columns = b.columns.map((c) => (c.id === columnId ? { ...c, ...patch } : c))
      return { ...b, columns }
    })
    set({ boards })
    save(boards)
  },

  updateTask: (boardId: string, taskId: string, patch: Partial<Task>) => {
    const boards = get().boards.map((b) => {
      if (b.id !== boardId) return b
      const tasks = { ...b.tasks, [taskId]: { ...b.tasks[taskId], ...patch } }
      return { ...b, tasks }
    })
    set({ boards })
    save(boards)
  },
}))
