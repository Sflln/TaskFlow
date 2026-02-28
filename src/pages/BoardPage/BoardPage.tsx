import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useBoardStore } from '../../store/boardStore'
import { UserHeader } from '../../shared/UserHeader'
import './BoardPage.css'

export const BoardPage = () => {
  const { id } = useParams()
  const board = useBoardStore((s) => (id ? s.getBoard(id) : undefined))
  const addTask = useBoardStore((s) => s.addTask)
  const addColumn = useBoardStore((s) => s.addColumn)
  const moveTask = useBoardStore((s) => s.moveTask)
  const deleteTask = useBoardStore((s) => s.deleteTask)
  const deleteColumn = useBoardStore((s) => s.deleteColumn)
  const [newColName, setNewColName] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  if (!board) return <div className="board-page">Доска не найдена — <Link to="/dashboard">назад</Link></div>

  const handleAddColumn = () => {
    if (!newColName.trim()) return
    addColumn(board.id, newColName.trim())
    setNewColName('')
  }

  const handleAddTask = (colId: string) => {
    if (!newTaskTitle.trim()) return
    addTask(board.id, colId, newTaskTitle.trim())
    setNewTaskTitle('')
    setSelectedColumn(null)
  }

  const onDragStart = (e: React.DragEvent, taskId: string, fromColId: string) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId, fromColId }))
  }

  const onDrop = (e: React.DragEvent, toColId: string) => {
    e.preventDefault()
    setDragOverCol(null)
    try {
      const payload = JSON.parse(e.dataTransfer.getData('text/plain'))
      const { taskId, fromColId } = payload
      if (taskId && fromColId) {
        moveTask(board.id, fromColId, toColId, taskId)
      }
    } catch {}
  }

  const onDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCol(colId)
  }

  const onDragLeave = () => {
    setDragOverCol(null)
  }

  return (
    <>
      <UserHeader />
      <div className="board-page">
        <div className="board-page-header">
          <h2>{board.name}</h2>
          <Link to="/dashboard">← Назад</Link>
        </div>

        <div className="add-column-wrap">
          <input placeholder="Название новой колонки" value={newColName} onChange={(e) => setNewColName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()} />
          <button className="btn-primary" onClick={handleAddColumn}>Добавить колонку</button>
        </div>

        <div className="columns-container">
          {board.columns.map((col) => (
            <div key={col.id} className={`column ${dragOverCol === col.id ? 'drop-zone-active' : ''}`} onDrop={(e) => onDrop(e, col.id)} onDragOver={(e) => onDragOver(e, col.id)} onDragLeave={onDragLeave}>
              <div className="column-header">
                <h4>{col.name}</h4>
                <button className="column-delete-btn" onClick={() => deleteColumn(board.id, col.id)} title="Удалить колонку">×</button>
              </div>

              <div className="tasks-list">
                {col.taskIds.map((tid) => {
                  const task = board.tasks[tid]
                  if (!task) return null
                  return (
                    <div key={tid} className="task-card" draggable onDragStart={(e) => onDragStart(e, tid, col.id)}>
                      <div className="task-title">{task.title}</div>
                      <div className="task-assignee">
                        <span>{task.assignee || 'Не назначена'}</span>
                        <button className="task-delete-btn" onClick={() => deleteTask(board.id, tid)} title="Удалить задачу">×</button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="add-task-form">
                <input placeholder="Название новой задачи" value={selectedColumn === col.id ? newTaskTitle : ''} onChange={(e) => { setSelectedColumn(col.id); setNewTaskTitle(e.target.value) }} onKeyPress={(e) => e.key === 'Enter' && handleAddTask(col.id)} />
                <button onClick={() => handleAddTask(col.id)}>Добавить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
