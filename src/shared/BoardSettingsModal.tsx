import { useState, useEffect } from 'react'
import type { Board } from '../store/boardStore'
import { useBoardStore } from '../store/boardStore'
import './ProfileModal.css'

interface BoardSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  board: Board
}

export const BoardSettingsModal = ({ isOpen, onClose, board }: BoardSettingsModalProps) => {
  const updateBoard = useBoardStore((s) => s.updateBoard)
  const removeAdmin = useBoardStore((s) => s.removeAdmin)

  const [name, setName] = useState(board.name)
  const [color, setColor] = useState(board.color || '#FFFFFF')
  const [darkMode, setDarkMode] = useState(board.darkMode || false)

  useEffect(() => {
    if (isOpen) {
      setName(board.name)
      setColor(board.color || '#FFFFFF')
      setDarkMode(board.darkMode || false)
    }
  }, [isOpen, board])

  const handleSave = () => {
    updateBoard(board.id, { name, color, darkMode })
    onClose()
  }

  const handleRemoveUser = (email: string) => {
    removeAdmin(board.id, email)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Настройки доски</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Название</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Цвет фона</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />{' '}
              Тёмная тема
            </label>
          </div>

          <div className="form-group">
            <label>Пользователи с правами админа</label>
            <ul style={{ paddingLeft: 20 }}>
              {board.admins.map((email) => (
                <li key={email} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{email}{board.ownerEmail === email ? ' (владелец)' : ''}</span>
                  {email !== board.ownerEmail && (
                    <button className="btn-cancel" onClick={() => handleRemoveUser(email)}>Удалить</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Отмена</button>
          <button className="btn-save" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  )
}
