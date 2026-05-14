import React, { useState } from 'react'
import './CRMIntegration.css'

// ─────────────────────────────────────────────────────────────────
//  PAGE DATA — one entry per sidebar project (p1 … p6)
//  Each project has its own title + 6 tools.
//  Later, hook each tool to a backend route:
//    POST /api/<pageId>/<toolId>
// ─────────────────────────────────────────────────────────────────
const PAGE_DATA = {
  p1: {
    title: 'Project 1 — CRM Integration',
    tools: [
      { id: 't1', name: 'Tool #1', description: 'Connect and sync data seamlessly with your workflow for Project 1.', color: '#ff7a59', initial: '1' },
      { id: 't2', name: 'Tool #2', description: 'Connect and sync data seamlessly with your workflow for Project 1.', color: '#6dbc45', initial: '2' },
      { id: 't3', name: 'Tool #3', description: 'Connect and sync data seamlessly with your workflow for Project 1.', color: '#26292c', initial: '3' },
      { id: 't4', name: 'Tool #4', description: 'Connect and sync data seamlessly with your workflow for Project 1.', color: '#356ae6', initial: '4' },
      { id: 't5', name: 'Tool #5', description: 'Connect and sync data seamlessly with your workflow for Project 1.', color: '#03363d', initial: '5' },
      { id: 't6', name: 'Tool #6', description: 'Connect and sync data seamlessly with your workflow for Project 1.', color: '#e8643b', initial: '6' },
    ],
  },
  p2: {
    title: 'Project 2 — CRM Integration',
    tools: [
      { id: 't1', name: 'Tool #1', description: 'Connect and sync data seamlessly with your workflow for Project 2.', color: '#7c3aed', initial: '1' },
      { id: 't2', name: 'Tool #2', description: 'Connect and sync data seamlessly with your workflow for Project 2.', color: '#db2777', initial: '2' },
      { id: 't3', name: 'Tool #3', description: 'Connect and sync data seamlessly with your workflow for Project 2.', color: '#0891b2', initial: '3' },
      { id: 't4', name: 'Tool #4', description: 'Connect and sync data seamlessly with your workflow for Project 2.', color: '#d97706', initial: '4' },
      { id: 't5', name: 'Tool #5', description: 'Connect and sync data seamlessly with your workflow for Project 2.', color: '#059669', initial: '5' },
      { id: 't6', name: 'Tool #6', description: 'Connect and sync data seamlessly with your workflow for Project 2.', color: '#dc2626', initial: '6' },
    ],
  },
  p3: {
    title: 'Project 3 — CRM Integration',
    tools: [
      { id: 't1', name: 'Tool #1', description: 'Connect and sync data seamlessly with your workflow for Project 3.', color: '#0f766e', initial: '1' },
      { id: 't2', name: 'Tool #2', description: 'Connect and sync data seamlessly with your workflow for Project 3.', color: '#b45309', initial: '2' },
      { id: 't3', name: 'Tool #3', description: 'Connect and sync data seamlessly with your workflow for Project 3.', color: '#6d28d9', initial: '3' },
      { id: 't4', name: 'Tool #4', description: 'Connect and sync data seamlessly with your workflow for Project 3.', color: '#be185d', initial: '4' },
      { id: 't5', name: 'Tool #5', description: 'Connect and sync data seamlessly with your workflow for Project 3.', color: '#1d4ed8', initial: '5' },
      { id: 't6', name: 'Tool #6', description: 'Connect and sync data seamlessly with your workflow for Project 3.', color: '#15803d', initial: '6' },
    ],
  },
  p4: {
    title: 'Project 4 — CRM Integration',
    tools: [
      { id: 't1', name: 'Tool #1', description: 'Connect and sync data seamlessly with your workflow for Project 4.', color: '#9333ea', initial: '1' },
      { id: 't2', name: 'Tool #2', description: 'Connect and sync data seamlessly with your workflow for Project 4.', color: '#0369a1', initial: '2' },
      { id: 't3', name: 'Tool #3', description: 'Connect and sync data seamlessly with your workflow for Project 4.', color: '#b91c1c', initial: '3' },
      { id: 't4', name: 'Tool #4', description: 'Connect and sync data seamlessly with your workflow for Project 4.', color: '#047857', initial: '4' },
      { id: 't5', name: 'Tool #5', description: 'Connect and sync data seamlessly with your workflow for Project 4.', color: '#92400e', initial: '5' },
      { id: 't6', name: 'Tool #6', description: 'Connect and sync data seamlessly with your workflow for Project 4.', color: '#1e40af', initial: '6' },
    ],
  },
  p5: {
    title: 'Project 5 — CRM Integration',
    tools: [
      { id: 't1', name: 'Tool #1', description: 'Connect and sync data seamlessly with your workflow for Project 5.', color: '#c026d3', initial: '1' },
      { id: 't2', name: 'Tool #2', description: 'Connect and sync data seamlessly with your workflow for Project 5.', color: '#0284c7', initial: '2' },
      { id: 't3', name: 'Tool #3', description: 'Connect and sync data seamlessly with your workflow for Project 5.', color: '#16a34a', initial: '3' },
      { id: 't4', name: 'Tool #4', description: 'Connect and sync data seamlessly with your workflow for Project 5.', color: '#ea580c', initial: '4' },
      { id: 't5', name: 'Tool #5', description: 'Connect and sync data seamlessly with your workflow for Project 5.', color: '#7c3aed', initial: '5' },
      { id: 't6', name: 'Tool #6', description: 'Connect and sync data seamlessly with your workflow for Project 5.', color: '#0f172a', initial: '6' },
    ],
  },
  p6: {
    title: 'Project 6 — CRM Integration',
    tools: [
      { id: 't1', name: 'Tool #1', description: 'Connect and sync data seamlessly with your workflow for Project 6.', color: '#0e7490', initial: '1' },
      { id: 't2', name: 'Tool #2', description: 'Connect and sync data seamlessly with your workflow for Project 6.', color: '#4f46e5', initial: '2' },
      { id: 't3', name: 'Tool #3', description: 'Connect and sync data seamlessly with your workflow for Project 6.', color: '#b45309', initial: '3' },
      { id: 't4', name: 'Tool #4', description: 'Connect and sync data seamlessly with your workflow for Project 6.', color: '#be123c', initial: '4' },
      { id: 't5', name: 'Tool #5', description: 'Connect and sync data seamlessly with your workflow for Project 6.', color: '#166534', initial: '5' },
      { id: 't6', name: 'Tool #6', description: 'Connect and sync data seamlessly with your workflow for Project 6.', color: '#6b21a8', initial: '6' },
    ],
  },
}

export default function CRMIntegration({ pageId }) {
  // Connection state is tracked PER PAGE + PER TOOL
  // Key format: "<pageId>-<toolId>"  e.g. "p2-t3"
  // This means connecting a tool on Project 1 does NOT affect Project 2
  const [connectedTools, setConnectedTools] = useState({})
  const [loadingTool, setLoadingTool]       = useState(null)

  const { title, tools } = PAGE_DATA[pageId] || PAGE_DATA.p1

  // ── BACKEND HOOK ─────────────────────────────────────────────
  // When you're ready, replace the setTimeout below with:
  //   const res = await fetch(`/api/${pageId}/${toolId}`, { method: 'POST' })
  //   const data = await res.json()
  // ─────────────────────────────────────────────────────────────
  const handleConnect = async (toolId) => {
    const key = `${pageId}-${toolId}`
    setLoadingTool(key)

    await new Promise((r) => setTimeout(r, 1000))   // ← remove when backend is ready

    setConnectedTools((prev) => ({ ...prev, [key]: !prev[key] }))
    setLoadingTool(null)
  }

  return (
    <div className="crm-page">
      <div className="crm-container">
        <h2 className="crm-title">{title}</h2>
        <div className="crm-grid">
          {tools.map((tool) => {
            const key         = `${pageId}-${tool.id}`
            const isConnected = connectedTools[key]
            const isLoading   = loadingTool === key

            return (
              <div key={tool.id} className={`crm-card ${isConnected ? 'connected' : ''}`}>
                <div className="card-header">
                  <div
                    className="tool-badge"
                    style={{ background: tool.color }}
                    aria-label={tool.name}
                  >
                    {tool.initial}
                  </div>
                  <button
                    className={`connect-btn ${isConnected ? 'disconnect' : ''}`}
                    onClick={() => handleConnect(tool.id)}
                    disabled={isLoading}
                  >
                    <span className="btn-dot" />
                    {isLoading ? 'Connecting…' : isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
                <h3 className="tool-name">{tool.name}</h3>
                <p className="tool-desc">{tool.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
