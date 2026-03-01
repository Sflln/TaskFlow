import { useState, useEffect } from 'react'
import './ProfileModal.css'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  link: string
}

export const InviteModal = ({ isOpen, onClose, link }: InviteModalProps) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) setCopied(false)
  }, [isOpen])

  if (!isOpen) return null

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Пригласить по ссылке</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p>Скопируйте ссылку и отправьте участнику. При открытии ссылки участнику автоматически будут выданы права администратора.</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={link} readOnly style={{ flex: 1 }} />
            <button className="btn-save" onClick={doCopy}>{copied ? 'Скопировано' : 'Скопировать'}</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <a href={link} target="_blank" rel="noreferrer">Открыть ссылку в новой вкладке</a>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  )
}
