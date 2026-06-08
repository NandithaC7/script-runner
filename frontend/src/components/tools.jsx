import React, { useState, useEffect, useRef } from 'react'
import './tools.css'
import keycloak from '../keycloak'
import { Trash } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────
// DETAILS MODAL
// ─────────────────────────────────────────────────────────────────
function DetailsModal({ tool, onClose, fetchTools, setModalTool, isAdmin, isDeveloper }) {

  const versionFileRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    ticketId: '',
    department: '',
    creatorEmail: '',
    developerEmail: ''
  })

  useEffect(() => {

    if (!tool) return

    setFormData({
      name: tool.name || '',
      ticketId: tool.ticketId || '',
      department: tool.department || '',
      creatorEmail: tool.creatorEmail || '',
      developerEmail: tool.developerEmail || ''
    })

  }, [tool])

  if (!tool) return null

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {

    try {

      await keycloak.updateToken(30)

      const res = await fetch(
        `http://localhost:5000/api/tools/${tool.id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`
          },

          body: JSON.stringify(formData)
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      fetchTools()

      setModalTool({
        ...tool,
        ...formData
      })

      setIsEditing(false)

    } catch (err) {

      console.error(err)

      toast.error('Failed to update tool')
    }
  }

  return (

    <div className="overlay" onClick={onClose}>

      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="modal-header">

          <div
            className="modal-badge"
            style={{ background: '#ff7a59' }}
          >
            {tool.name?.charAt(0)}
          </div>

          <button
            className="icon-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="modal-details">

          <div className="detail-row">

            <span className="detail-label">
              Tool Name:
            </span>

            {isEditing ? (

              <input
                className="edit-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

            ) : (

              <span className="detail-value">
                {tool.name}
              </span>

            )}

          </div>

          <div className="detail-row">

            <span className="detail-label">
              Ticket ID:
            </span>

            {isEditing ? (

              <input
                className="edit-input"
                name="ticketId"
                value={formData.ticketId}
                onChange={handleChange}
              />

            ) : (

              <span className="detail-value">
                {tool.ticketId}
              </span>

            )}

          </div>

          <div className="detail-row">

            <span className="detail-label">
              Department:
            </span>

            {isEditing ? (

              <input
                className="edit-input"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />

            ) : (

              <span className="detail-value">
                {tool.department}
              </span>

            )}

          </div>

          <div className="detail-row">

            <span className="detail-label">
              Creator Email:
            </span>

            {isEditing ? (

              <input
                className="edit-input"
                name="creatorEmail"
                value={formData.creatorEmail}
                onChange={handleChange}
              />

            ) : (

              <span className="detail-value">
                {tool.creatorEmail}
              </span>

            )}

          </div>

          <div className="detail-row">

            <span className="detail-label">
              Developer Email:
            </span>

            {isEditing ? (

              <input
                className="edit-input"
                name="developerEmail"
                value={formData.developerEmail}
                onChange={handleChange}
              />

            ) : (

              <span className="detail-value">
                {tool.developerEmail}
              </span>

            )}

          </div>

          <div className="detail-row">

            <span className="detail-label">
              Created At:
            </span>

            <span className="detail-value">
              {tool.createdAt}
            </span>

          </div>

        </div>

        <div className="modal-edit-actions">

          {!isEditing ? (

            <>

              {(isAdmin || isDeveloper) && (

                <button
                  className="add-version-btn"
                  onClick={() => {
                    versionFileRef.current?.click()
                  }}
                >
                  + Add New .exe
                </button>

              )}

              <input
                type="file"
                accept=".exe"
                ref={versionFileRef}
                style={{ display: 'none' }}
                onChange={async (e) => {

                  const file = e.target.files[0]

                  if (!file) return

                  try {

                    const formData = new FormData()

                    formData.append('tool', file)

                    await keycloak.updateToken(30)

                    const res = await fetch(
                      `http://localhost:5000/api/tools/${tool.id}/version`,
                      {
                        method: 'POST',

                        headers: {
                          Authorization: `Bearer ${keycloak.token}`
                        },

                        body: formData
                      }
                    )

                    const data = await res.json()

                    if (!res.ok) {
                      throw new Error(data.message)
                    }

                    await fetchTools()

                    toast.success(
                      'Tool updated. Previous version recorded in history.'
                    )

                    setModalTool(prev => ({
                      ...prev,
                      filename: file.name
                    }))

                  } catch (err) {

                    console.error(err)

                    toast.error(
                      err.message || 'Version upload failed'
                    )
                  }
                }}
              />

              {(isAdmin || isDeveloper) && (

                <button
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>

              )}



            </>

          ) : (

            <>

              <button
                className="cancel-edit-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button
                className="save-edit-btn"
                onClick={handleSave}
              >
                Save
              </button>

            </>

          )}

        </div>

      </div>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// HISTORY DRAWER
// ─────────────────────────────────────────────────────────────────
function HistoryDrawer({ tool, open, onClose, onDeleteHistory, isAdmin, isDeveloper }) {
  console.log(tool)

  return (
    <>
      <div
        className={`drawer-overlay ${open ? 'drawer-overlay--visible' : ''}`}
        onClick={onClose}
      />

      <div className={`history-drawer ${open ? 'history-drawer--open' : ''}`}>

        <div className="drawer-header">

          <div>
            <p className="drawer-label">
              Run History
            </p>

            <h3 className="drawer-tool-name">
              {tool?.name || ''}
            </h3>
          </div>

          <button
            className="icon-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="history-list">

          {tool?.history?.length > 0 ? (

            tool.history
              .slice()
              .reverse()
              .map((item, index) => (

                <div
                  key={index}
                  className="history-item"
                >

                  <div className="history-info">

                    <h4>
                      Version {tool.history.length - index}
                    </h4>

                    <p className="history-file">
                      {item.filename}
                    </p>

                    <span className="history-date">
                      {new Date(item.uploadedAt)
                        .toLocaleString()}
                    </span>

                  </div>

                  {(isAdmin || isDeveloper) && (

                    <button
                      className="history-delete-btn"
                      onClick={() =>
                        onDeleteHistory(
                          tool.id,
                          item.id
                        )
                      }
                    >
                      <Trash size={18} />
                    </button>

                  )}

                </div>

              ))

          ) : (

            <div className="empty-history">
              No previous versions
            </div>

          )}

        </div>

      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function Tools({
  activePage,
  searchTerm,
  tools,
  isAdmin,
  isDeveloper,
  fetchTools
}) {

  const title = 'Tools'

  // FILTER
  const filteredTools = tools.filter((tool) => {

    const search = searchTerm.toLowerCase()

    const matchesSearch =
      tool.name?.toLowerCase().includes(search) ||
      title.toLowerCase().includes(search)

    const matchesProject =
      tool.project === activePage

    return matchesSearch && matchesProject
  })

  const [connectedTools, setConnectedTools] = useState({})

  const [loadingTool, setLoadingTool] = useState(null)

  const [modalTool, setModalTool] = useState(null)

  const [drawerTool, setDrawerTool] = useState(null)

  const [drawerOpen, setDrawerOpen] = useState(false)

  const [deleteToolId, setDeleteToolId] = useState(null)

  const [infoTool, setInfoTool] = useState(null)

  // CONNECT
  const handleConnect = async (tool) => {

    const key = `${activePage}-${tool.id}`

    // already connected → disconnect UI only
    if (connectedTools[key]) {

      setConnectedTools(prev => ({
        ...prev,
        [key]: false
      }))

      toast('Tool already running, please wait...   ')

      return
    }

    setLoadingTool(key)

    try {

      await keycloak.updateToken(30)

      const res = await fetch(
        'http://localhost:5000/api/run',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`
          },

          body: JSON.stringify({
            page: activePage,
            tool: tool.id,
            exe: tool.filename
          })
        }
      )

      const data = await res.json()

      if (data.success) {

        setConnectedTools(prev => ({
          ...prev,
          [key]: true
        }))

        toast.success('Tool connected successfully')

      } else {

        toast.error(data.message)
      }

    } catch (err) {

      console.error(err)

      toast.error(
        err.message || 'Could not connect to backend'
      )

    } finally {

      setLoadingTool(null)
    }
  }

  // DELETE TOOL
  const handleDeleteTool = async (toolId) => {

    // first click -> open modal
    if (!deleteToolId) {

      setDeleteToolId(toolId)

      return
    }

    try {
      //
      await keycloak.updateToken(30)

      const res = await fetch(
        `http://localhost:5000/api/tools/${toolId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        }
      )

      const data = await res.json()
      //alert(data.message)

      if (!res.ok) {
        throw new Error(data.message)
      }
      toast.success(data.message)

      await fetchTools()

      setDeleteToolId(null)

    } catch (err) {

      console.error(err)

      toast.error(err.message || 'Failed to delete tool')
    }
  }

  // DELETE HISTORY VERSION
  const deleteHistoryVersion = async (
    toolId,
    historyId
  ) => {

    try {

      await keycloak.updateToken(30)

      const res = await fetch(
        `http://localhost:5000/api/tools/${toolId}/history/${historyId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      toast.success('Version deleted')

      await fetchTools()

      setDrawerTool(prev => ({
        ...prev,
        history: (prev?.history || []).filter(
          h => String(h.id) !== String(historyId)
        )
      }))

    } catch (err) {

      console.error(err)

      toast.error(
        err.message || 'Failed to delete version'
      )
    }
  }
  // DOWNLOAD
  const handleDownload = (tool) => {

    if (!tool.filename) {
      toast.error(
        `No executable is attached to "${tool.name}"`
      )
      return
    }

    window.location.href =
      `http://localhost:5000/api/download/${tool.filename}`
  }

  // DETAILS
  const handleViewDetails = (tool) => {
    setModalTool(tool)
  }

  // HISTORY
  const handleHistory = (tool) => {

    setDrawerTool(tool)

    setDrawerOpen(true)
  }

  const closeModal = () => {
    setModalTool(null)
  }

  const closeDrawer = () => {

    setDrawerOpen(false)

    setTimeout(() => {
      setDrawerTool(null)
    }, 300)
  }

  return (
    <div className="crm-page">

      <div className="crm-container">

        <div className="tools-header">

          <h2 className="crm-title">
            {title}
          </h2>

        </div>

        <div className="crm-grid">

          {filteredTools.map((tool) => {

            const key = `${activePage}-${tool.id}`

            const isConnected = connectedTools[key]

            const isLoading = loadingTool === key

            return (

              <div
                key={tool.id}
                className={`crm-card ${isConnected ? 'connected' : ''}`}
              >

                <div className="card-header">

                  <div
                    className="tool-badge"
                    style={{ background: '#ff7a59' }}
                  >
                    {tool.name?.charAt(0)}
                  </div>

                  <div className="card-header-actions">

                    <button
                      className={`connect-btn ${isConnected ? 'disconnect' : ''}`}
                      onClick={() => handleConnect(tool)}
                      disabled={isLoading}
                    >
                      <span className="btn-dot" />

                      {isLoading
                        ? 'Running...'
                        : isConnected
                          ? 'Connected'
                          : 'Connect'}
                    </button>

                    <div className="tool-actions">

                      <span
                        className="info-link"
                        onClick={() => setInfoTool(tool)}
                      >
                        Info
                      </span>

                      {(isAdmin || isDeveloper) && (
                        <button
                          className="delete-icon-btn"
                          onClick={() => handleDeleteTool(tool.id)}
                        >
                          <Trash size={15} strokeWidth={2.8} />
                        </button>
                      )}

                    </div>

                  </div>

                </div>

                <h3 className="tool-name">
                  {tool.name}
                </h3>

                <p className="tool-desc">
                  {tool.ticketId}
                </p>

                <div className="card-actions">

                  <button
                    className="action-btn"
                    onClick={() => handleViewDetails(tool)}
                  >
                    View Details
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => handleDownload(tool)}
                  >
                    Download
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => handleHistory(tool)}
                  >
                    History
                  </button>

                </div>

              </div>
            )
          })}

        </div>

      </div>

      <DetailsModal
        tool={modalTool}
        onClose={closeModal}
        fetchTools={fetchTools}
        setModalTool={setModalTool}
        isAdmin={isAdmin}
        isDeveloper={isDeveloper}
      />

      <HistoryDrawer
        tool={drawerTool}
        open={drawerOpen}
        onClose={closeDrawer}
        onDeleteHistory={deleteHistoryVersion}
        isAdmin={isAdmin}
        isDeveloper={isDeveloper}
      />

      {deleteToolId && (

        <div className="delete-modal-overlay">

          <div className="delete-modal">

            <div className="delete-modal-icon">
              <Trash size={20} strokeWidth={2.4} />
            </div>

            <h3>
              Delete Tool?
            </h3>

            <p>
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">

              <button
                className="cancel-delete-btn"
                onClick={() => setDeleteToolId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={() => handleDeleteTool(deleteToolId)}
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}
      {infoTool && (

        <div className="delete-modal-overlay">

          <div className="info-modal">

            <h3>Executable File</h3>

            <p className="exe-name">
              {infoTool.filename || 'No executable attached'}
            </p>

            <button
              className="close-info-btn"
              onClick={() => setInfoTool(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}
    </div>
  )
}