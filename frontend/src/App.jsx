import React, { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import CRMIntegration from './components/CRMIntegration.jsx'
import './App.css'

const PAGES = [
  { id: 'p1', label: 'Project 1' },
  { id: 'p2', label: 'Project 2' },
  { id: 'p3', label: 'Project 3' },
  { id: 'p4', label: 'Project 4' },
  { id: 'p5', label: 'Project 5' },
  { id: 'p6', label: 'Project 6' },
]

export default function App() {
  const [activePage, setActivePage] = useState('p1')

  return (
    <div className="app-layout">
      <Sidebar pages={PAGES} activePage={activePage} onSelect={setActivePage} />
      <main className="main-content">
        <CRMIntegration pageId={activePage} />
        <footer className="footer">
          <div className="footer-brand">
            <Logo />
            <p>This platform can be used to runs scripts form one place.</p>
            <div className="footer-search">
              <span className="search-icon"></span>
              <input type="text" placeholder="Search zip code address" />
              <button>Search</button>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">How It Works</a>
              <a href="#">Download App</a>
              <a href="#">Testimonials</a>
              <a href="#">Contact us</a>
            </div>
            <div className="footer-col">

            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

function Logo() {
  return (
    <div className="logo">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#1a6b3c" />
        <path d="M5 14L14 6L23 14V22H18V17H10V22H5V14Z" fill="white" />
      </svg>
      <span>HouseMade</span>
    </div>
  )
}
