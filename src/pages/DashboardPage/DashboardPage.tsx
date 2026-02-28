import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBoardStore } from '../../store/boardStore'
import { useAuthStore } from '../../store/authStore'
import './DashboardPage.css'

export const DashboardPage = () => {
  const boards = useBoardStore((s) => s.boards)
  const createBoard = useBoardStore((s) => s.createBoard)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [name, setName] = useState('')

  useEffect(() => {
    if (!boards.length && user) {
      createBoard('General', user.email)
    }
  }, [])

  const handleCreate = () => {
    if (!name.trim()) return
    const b = createBoard(name.trim(), user?.email)
    setName('')
    navigate(`/board/${b.id}`)
  }

  return (
    <div className="dashboard-wrap">
      <div className="dashboard-header">
        <h1>Boards</h1>
        <div>
          <input className="board-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="New board name" />
          <button className="btn-primary" onClick={handleCreate} style={{ marginLeft: 8 }}>Create</button>
        </div>
      </div>

      <div className="boards-grid">
        {boards.map((b) => (
          <div key={b.id} className="board-card">
            <h3 style={{ margin: 0 }}>{b.name}</h3>
            <p style={{ color: '#95999C', marginTop: 6 }}>{b.columns.length} columns</p>
            <div style={{ marginTop: 12 }}>
              <Link to={`/board/${b.id}`}>Open</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}