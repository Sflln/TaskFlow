import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ProfileModal } from './ProfileModal'
import './UserHeader.css'

export const UserHeader = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [showProfile, setShowProfile] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="user-header">
        <div className="user-header-left">
          <h1 className="app-title">TaskFlow</h1>
        </div>
        <div className="user-header-right">
          <button className="user-avatar-btn" onClick={() => setShowProfile(!showProfile)} title={user?.email}>
            <img src={user?.avatar} alt={user?.name} className="avatar-img" />
          </button>
        </div>
      </header>

      {showProfile && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <img src={user?.avatar} alt={user?.name} className="profile-avatar" />
            <div className="profile-info">
              <div className="profile-name">{user?.name}</div>
              <div className="profile-email">{user?.email}</div>
            </div>
          </div>

          <div className="profile-divider" />

          <button 
            className="profile-action" 
            onClick={() => { 
              setShowProfile(false)
              setShowModal(true)
            }}
          >
            ⚙️ Редактировать профиль
          </button>

          <div className="profile-divider" />

          <button className="profile-logout" onClick={handleLogout}>
            🚪 Выйти
          </button>
        </div>
      )}

      <ProfileModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
