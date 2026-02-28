import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useBoardStore } from '../../store/boardStore'

export const BoardPage = () => {
  const { id } = useParams()
  const board = useBoardStore((s) => (id ? s.getBoard(id) : undefined))
  const addTask = useBoardStore((s) => s.addTask)
  const addColumn = useBoardStore((s) => s.addColumn)
  const moveTask = useBoardStore((s) => s.moveTask)
  const [newColName, setNewColName] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  if (!board) return <div style={{ padding: 24 }}>Board not found — <Link to="/dashboard">back</Link></div>

  const handleAddColumn = () => {
    if (!newColName.trim()) return
    addColumn(board.id, newColName.trim())
    setNewColName('')
  }

  const handleAddTask = (colId: string) => {
    if (!newTaskTitle.trim()) return
    addTask(board.id, colId, newTaskTitle.trim())
    setNewTaskTitle('')
  }

  const onDragStart = (e: React.DragEvent, taskId: string, fromColId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId, fromColId }))
  }

  const onDrop = (e: React.DragEvent, toColId: string) => {
    e.preventDefault()
    try {
      const payload = JSON.parse(e.dataTransfer.getData('text/plain'))
      const { taskId, fromColId } = payload
      if (taskId && fromColId) {
        moveTask(board.id, fromColId, toColId, taskId)
      }
    } catch {}
  }

  const onDragOver = (e: React.DragEvent) => e.preventDefault()

  return (
    <div style={{ padding: 16 }}>
      <h2>{board.name}</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="New column name" value={newColName} onChange={(e) => setNewColName(e.target.value)} />
        <button onClick={handleAddColumn} style={{ marginLeft: 8 }}>Add column</button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', overflowX: 'auto' }}>
        {board.columns.map((col) => (
          <div key={col.id} style={{ minWidth: 260, background: col.color || '#fff', padding: 12, borderRadius: 8 }} onDrop={(e) => onDrop(e, col.id)} onDragOver={onDragOver}>
            <h4>{col.name}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.taskIds.map((tid) => {
                const task = board.tasks[tid]
                if (!task) return null
                return (
                  <div key={tid} draggable onDragStart={(e) => onDragStart(e, tid, col.id)} style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff' }}>
                    <div style={{ fontWeight: 600 }}>{task.title}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{task.assignee || '—'}</div>
                  </div>
                )
              })}

              <div style={{ marginTop: 8 }}>
                <input placeholder="New task title" value={selectedColumn === col.id ? newTaskTitle : ''} onChange={(e) => { setSelectedColumn(col.id); setNewTaskTitle(e.target.value) }} />
                <button onClick={() => handleAddTask(col.id)} style={{ marginLeft: 6 }}>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
