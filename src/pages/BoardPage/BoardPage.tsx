import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useBoardStore } from '../../store/boardStore'
import { useAuthStore } from '../../store/authStore'
import { UserHeader } from '../../shared/UserHeader'
import { InviteModal } from '../../shared/InviteModal'
import { BoardSettingsModal } from '../../shared/BoardSettingsModal'
import './BoardPage.css'

export const BoardPage = () => {
  const { id } = useParams()
  const board = useBoardStore((s) => (id ? s.getBoard(id) : undefined))
  const addTask = useBoardStore((s) => s.addTask)
  const addColumn = useBoardStore((s) => s.addColumn)
  const moveTask = useBoardStore((s) => s.moveTask)
  const deleteTask = useBoardStore((s) => s.deleteTask)
  const deleteColumn = useBoardStore((s) => s.deleteColumn)
  const requestAdmin = useBoardStore((s) => s.requestAdmin)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [newColName, setNewColName] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  if (!board) return <div className="board-page">Доска не найдена — <Link to="/dashboard">назад</Link></div>

  const isOwner = !!user && board.ownerEmail === user.email
  const isAdmin = !!user && (board.admins.includes(user.email) || isOwner)
  
  // board appearance settings
  const boardColor = board.color || '#FFFFFF'
  const boardDark = !!board.darkMode

  // handle invite link in URL: ?invite=1
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('invite') && user) {
      if (!board.admins.includes(user.email)) {
        requestAdmin(board.id, user.email)
      }
      // remove param to avoid repeating
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [location.search, user, board, requestAdmin])

  const handleAddColumn = () => {
    if (!isAdmin) return
    if (!newColName.trim()) return
    addColumn(board.id, newColName.trim())
    setNewColName('')
  }

  const handleAddTask = (colId: string) => {
    if (!isAdmin) return
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
      <div className={`board-page${boardDark ? ' dark' : ''}`} style={{ background: boardColor }}>
        <div className="board-page-header">
          <h2>{board.name}</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/dashboard">← Назад</Link>
            {isAdmin && (
              <>
                <button className="btn-link" onClick={() => { setInviteOpen(true) }}>Пригласить по ссылке</button>
                <button className="btn-link" onClick={() => setSettingsOpen(true)}>Настройки</button>
              </>
            )}
            {!isAdmin && user && (
              <button className="btn-link" onClick={() => { requestAdmin(board.id, user.email) }}>Запросить права администратора</button>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="add-column-wrap">
            <input placeholder="Название новой колонки" value={newColName} onChange={(e) => setNewColName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()} />
            <button className="btn-primary" onClick={handleAddColumn}>Добавить колонку</button>
          </div>
        )}

        <div className="columns-container">
          {board.columns.map((col) => (
            <div key={col.id} className={`column ${dragOverCol === col.id ? 'drop-zone-active' : ''}`} onDrop={(e) => onDrop(e, col.id)} onDragOver={(e) => onDragOver(e, col.id)} onDragLeave={onDragLeave}>
              <div className="column-header">
                <h4>{col.name}</h4>
                {isAdmin && <button className="column-delete-btn" onClick={() => deleteColumn(board.id, col.id)} title="Удалить колонку">×</button>}
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
                        {isAdmin && <button className="task-delete-btn" onClick={() => deleteTask(board.id, tid)} title="Удалить задачу">×</button>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {isAdmin ? (
                <div className="add-task-form">
                  <input placeholder="Название новой задачи" value={selectedColumn === col.id ? newTaskTitle : ''} onChange={(e) => { setSelectedColumn(col.id); setNewTaskTitle(e.target.value) }} onKeyPress={(e) => e.key === 'Enter' && handleAddTask(col.id)} />
                  <button onClick={() => handleAddTask(col.id)}>Добавить</button>
                </div>
              ) : (
                <div style={{ padding: 12, color: '#95999C' }}>У вас нет прав на изменение — только просмотр</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} link={`${window.location.origin}/board/${board.id}?invite=1`} />
      <BoardSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        board={board}
      />
    </>
  )
}
