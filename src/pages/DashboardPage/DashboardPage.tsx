import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBoardStore } from '../../store/boardStore'
import { useAuthStore } from '../../store/authStore'
import { UserHeader } from '../../shared/UserHeader'
import './DashboardPage.css'

export const DashboardPage = () => {
  const boards = useBoardStore((s) => s.boards)
  const createBoard = useBoardStore((s) => s.createBoard)
  const requestAdmin = useBoardStore((s) => s.requestAdmin)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [name, setName] = useState('')

  useEffect(() => {
    if (!boards.length && user) {
      // create one board owned by current user and one owned by someone else
      createBoard('Моя доска', user.email)
      createBoard('Чужая доска', 'other@example.com')
    }
  }, [])

  const handleCreate = () => {
    if (!name.trim()) return
    const b = createBoard(name.trim(), user?.email)
    setName('')
    navigate(`/board/${b.id}`)
  }

  return (
    <>
      <UserHeader />
      <div className="dashboard-wrap">
        <div className="dashboard-header">
          <h1>Мои доски</h1>
          <div>
            <input className="board-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название новой доски" />
            <button className="btn-primary" onClick={handleCreate} style={{ marginLeft: 8 }}>Создать</button>
          </div>
        </div>

        <div className="boards-grid">
          {boards.map((b) => (
            <div key={b.id} className="board-card">
              <h3 style={{ margin: 0 }}>{b.name}</h3>
              <p style={{ color: '#95999C', marginTop: 6 }}>{b.columns.length} колонок</p>
              <p style={{ color: '#95999C', marginTop: 6 }}>
                {b.ownerEmail === user?.email ? 'Вы — владелец' : b.admins.includes(user?.email || '') ? 'У вас права администратора' : 'Только просмотр'}
              </p>
              <div style={{ marginTop: 12 }}>
                <Link to={`/board/${b.id}`}>Открыть</Link>
                {user && !b.admins.includes(user.email) && b.ownerEmail !== user.email && (
                  <button className="btn-link" style={{ marginLeft: 8 }} onClick={() => { requestAdmin(b.id, user.email); }}>Запросить права</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}