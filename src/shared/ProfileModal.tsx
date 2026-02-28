import { useState, useEffect } from 'react'
import { useAuthStore, type User } from '../store/authStore'
import './ProfileModal.css'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const user = useAuthStore((state) => state.user)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPassword(user.password || '')
      setBio(user.bio || '')
      setAvatar(user.avatar || '')
    }
  }, [user, isOpen])

  const handleSave = () => {
    updateProfile({
      name: name || undefined,
      email: email || undefined,
      password: password || undefined,
      bio: bio || undefined,
      avatar: avatar || undefined,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Редактировать профиль</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>URL аватара</label>
            <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." type="url" />
            {avatar && <img src={avatar} alt="preview" className="avatar-preview" />}
          </div>

          <div className="form-group">
            <label>Имя</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="your@email.com" disabled />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          </div>

          <div className="form-group">
            <label>Биография</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Расскажите о себе..." rows={4} />
          </div>

          <div className="form-group">
            <label>Участник с</label>
            <div className="read-only-field">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'N/A'}</div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Отмена</button>
          <button className="btn-save" onClick={handleSave}>Сохранить изменения</button>
        </div>
      </div>
    </div>
  )
}
