import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

export function Avatar({ name = 'Acadex', color = 'violet', size = 'md' }) {
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  return <span className={`avatar avatar-${color} avatar-${size}`} aria-label={name}>{initials}</span>
}

export function Card({ children, className = '', ...props }) {
  return <section className={`card ${className}`} {...props}>{children}</section>
}

export function StatusBadge({ children, tone = 'green' }) {
  return <span className={`status-badge status-${tone}`}><i />{children}</span>
}

export function Modal({ open, onClose, title, description, children, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
          <motion.div className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}>
            <header className="modal-header"><div><h2 id="modal-title">{title}</h2>{description && <p>{description}</p>}</div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></header>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
