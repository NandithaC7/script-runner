import React, { useState } from 'react'
import './Sidebar.css'
import logo from '../assets/centillionlogo.png'

export default function Sidebar({
  pages,
  setPages,
  activePage,
  onSelect,
  isAdmin,
  isDeveloper,
  onUploadClick,
  selectedFile,
  onNewProjectClick
}) {

  const [openMenu, setOpenMenu] = useState(null)

  const [showEditModal, setShowEditModal] = useState(false)

  const [editingProject, setEditingProject] = useState(null)

  const [editedName, setEditedName] = useState('')

  // DELETE PROJECT
  const handleDeleteProject = async (projectId) => {

    try {

      await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: 'DELETE'
        }
      )

      const updatedPages = pages.filter(
        (page) => page.id !== projectId
      )

      setPages(updatedPages)

      if (
        activePage === projectId &&
        updatedPages.length > 0
      ) {
        onSelect(updatedPages[0].id)
      }

      setOpenMenu(null)

    } catch (err) {

      console.error(err)
    }
  }

  // EDIT PROJECT
  const handleEditProject = async () => {

    if (!editedName.trim()) return

    try {

      await fetch(
        `http://localhost:5000/api/projects/${editingProject.id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name: editedName
          })
        }
      )

      const updatedPages = pages.map((page) => {

        if (page.id === editingProject.id) {

          return {
            ...page,
            id: editedName,
            label: editedName
          }
        }

        return page
      })

      setPages(updatedPages)

      if (activePage === editingProject.id) {
        onSelect(editedName)
      }

      setShowEditModal(false)

      setEditingProject(null)

      setEditedName('')

      setOpenMenu(null)

    } catch (err) {

      console.error(err)
    }
  }

  return (

    <aside className="sidebar">

      <div className="sidebar-logo">

        <img
          src={logo}
          alt="Centillion Logo"
          className="header-logo"
        />

        <span></span>

      </div>

      <nav className="sidebar-nav">

        <div className="sidebar-title">
          Projects
        </div>

        {pages.map((page) => (

          <div
            key={page.id}
            className="sidebar-item-wrapper"
          >

            <button
              className={`sidebar-item ${activePage === page.id
                ? 'active'
                : ''
                }`}
              onClick={() => {

                onSelect(page.id)

                setOpenMenu(null)
              }}
            >

              <span className="sidebar-item-label">
                {page.label}
              </span>

            </button>

            {(isAdmin || isDeveloper) && (

              <div className="project-actions">

                <button
                  className={`dots-btn ${openMenu &&
                    openMenu !== page.id
                    ? 'dots-hidden'
                    : ''
                    }`}
                  onClick={(e) => {

                    e.stopPropagation()

                    setOpenMenu(
                      openMenu === page.id
                        ? null
                        : page.id
                    )
                  }}
                >
                  ⋮
                </button>

                {openMenu === page.id && (

                  <div className="project-dropdown">

                    <button
                      className="project-dropdown-btn"
                      onClick={(e) => {

                        e.stopPropagation()

                        setEditingProject(page)

                        setEditedName(page.label)

                        setShowEditModal(true)
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="project-dropdown-btn delete"
                      onClick={(e) => {

                        e.stopPropagation()

                        handleDeleteProject(
                          page.id
                        )
                      }}
                    >
                      Delete
                    </button>

                  </div>

                )}

              </div>

            )}

          </div>

        ))}

        {(isAdmin || isDeveloper) && (

          <div className="sidebar-bottom">

            <button
              className="new-project-btn"
              onClick={onNewProjectClick}
            >
              + New Project
            </button>

            <button
              className="upload-btn"
              onClick={onUploadClick}
            >
              Upload Tool
            </button>

          </div>

        )}

      </nav>
      {showEditModal && (

        <div className="edit-project-overlay">

          <div className="edit-project-modal">

            <h3>Edit Project</h3>

            <input
              type="text"
              value={editedName}
              onChange={(e) =>
                setEditedName(e.target.value)
              }
            />

            <div className="edit-project-actions">

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                Cancel
              </button>

              <button
                onClick={handleEditProject}
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}
    </aside>

  )
}