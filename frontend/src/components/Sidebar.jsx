import React from 'react'
import './Sidebar.css'

export default function Sidebar({ pages, activePage, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        {/* <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#1a6b3c"/>
          <path d="M5 14L14 6L23 14V22H18V17H10V22H5V14Z" fill="white"/>
        </svg> */}
        <span>Script Execution</span>
      </div>
      <nav className="sidebar-nav">
        {pages.map((page) => (
          <button
            key={page.id}
            className={`sidebar-item ${activePage === page.id ? 'active' : ''}`}
            onClick={() => onSelect(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
