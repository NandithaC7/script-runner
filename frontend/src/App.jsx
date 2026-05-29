import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar.jsx'
import Tools from './components/tools.jsx'
import keycloak from './keycloak'
import banner from './assets/rpa.jpg'
import './App.css'
import toast, { Toaster } from 'react-hot-toast'

const defaultProjects = [
  { id: 'Coweta Fayette', label: 'Coweta Fayette' },
  { id: 'GoNetSpeed RIE', label: 'GoNetSpeed RIE' },
  { id: 'SVEC & Glades', label: 'SVEC & Glades' },
  { id: 'National Grid', label: 'National Grid' },
  { id: 'CenterPoint TX', label: 'CenterPoint TX' },
  { id: 'SLIC', label: 'SLIC' },
  { id: 'Kentucky Post Construction', label: 'Kentucky Post Construction' },
  { id: 'APCO Post Construction', label: 'APCO Post Construction' },
]

//const filteredTools = currentPage.tools.filter((tool) => {


export default function App() {
  const fileInputRef = useRef(null)

  //proj states
  const [pages, setPages] = useState([])

  const [showProjectModal, setShowProjectModal] = useState(false)

  const [newProjectName, setNewProjectName] = useState('')

  const roles = keycloak.tokenParsed?.realm_access?.roles || []

  const isAdmin = roles.includes('admin')
  const isDeveloper = roles.includes('dev')


  const [activePage, setActivePage] = useState('Coweta Fayette')

  const [searchTerm, setSearchTerm] = useState('')

  const [showUploadModal, setShowUploadModal] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null)

  const [toolName, setToolName] = useState('')

  //uplaod modal box states
  const [project, setProject] = useState('')

  const [ticketId, setTicketId] = useState('')

  const [department, setDepartment] = useState('')

  const [creatorEmail, setCreatorEmail] = useState('')

  const [developerEmail, setDeveloperEmail] = useState('')

  //tools
  const [tools, setTools] = useState([])

  //delete popup
  const [deleteToolId, setDeleteToolId] = useState(null)

  //add projects
  const handleAddProject = async () => {

    if (!newProjectName.trim()) {
      return
    }

    try {

      await keycloak.updateToken(30)

      const res = await fetch(
        'http://localhost:5000/api/projects',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`
          },

          body: JSON.stringify({
            name: newProjectName
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      toast.success(data.message)

      await fetchProjects()

      setNewProjectName('')

      setShowProjectModal(false)

    } catch (err) {

      console.error(err)

      toast.error(err.message || 'Failed to add project')
    }
  }
  //feth projects from backend
  const fetchProjects = async () => {

    try {

      const res = await fetch(
        'http://localhost:5000/api/projects'
      )

      const data = await res.json()

      setPages(data)

    } catch (err) {

      console.error(err)

      toast.error('Failed to fetch projects')
    }
  }
  //upload proj
  const handleUpload = async () => {

    const formData = new FormData()

    if (selectedFile) {
      formData.append('tool', selectedFile)
    }
    formData.append('name', toolName)
    formData.append('project', project)
    formData.append('ticketId', ticketId)
    formData.append('department', department)
    formData.append('creatorEmail', creatorEmail)
    formData.append('developerEmail', developerEmail)

    try {

      await keycloak.updateToken(30)

      const token = keycloak.token

      const res = await fetch(
        'http://localhost:5000/api/upload',
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${token}`
          },

          body: formData
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      await fetchTools()

      toast.success(data.message)

      setShowUploadModal(false)

      setToolName('')
      setProject('')
      setTicketId('')
      setDepartment('')
      setCreatorEmail('')
      setDeveloperEmail('')
      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (err) {

      console.error(err)

      toast.error(err.message || 'Upload failed')
    }
  }

  const fetchTools = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tools', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      })
      const data = await res.json()
      setTools(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch tools')
    }
  }

  useEffect(() => {

    fetchTools()

    fetchProjects()

  }, [])



  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#111827',
            color: '#fff',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '14px'
          }
        }}
      />
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        pages={pages}
        tools={tools}
        setActivePage={setActivePage}
      />
      <div className="app-layout">

        <Sidebar
          pages={pages}
          setPages={setPages}
          activePage={activePage}
          onSelect={setActivePage}
          isAdmin={isAdmin}
          isDeveloper={isDeveloper}
          onNewProjectClick={() => setShowProjectModal(true)}
          onUploadClick={() => {

            setToolName('')
            setProject('')
            setTicketId('')
            setDepartment('')
            setCreatorEmail('')
            setDeveloperEmail('')
            setSelectedFile(null)

            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }

            setShowUploadModal(true)
          }} />

        <main className="main-content">
          <Tools
            activePage={activePage}
            searchTerm={searchTerm}
            tools={tools}
            isAdmin={isAdmin}
            isDeveloper={isDeveloper}
            fetchTools={fetchTools}
          //fetchProjects={fetchProjects}
          />
          <footer className="footer">
            <div className="footer-brand">

              {/* <img
              src={banner}
              alt="RPA Banner"
              className="footer-banner"
            /> */}

              <Logo />

              <p>This platform can be used to runs scripts from one place.</p>
              {/* <div className="footer-search">
                <span className="search-icon"></span>
                <input
                  type="text"
                  placeholder="Search project or tool"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
               
              </div> */}
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Company</h4>
                <a href="#">How It Works</a>
                <a href="#">About Us</a>
                <a href="#">Contact us</a>
              </div>
              <div className="footer-col">

              </div>
            </div>
          </footer>
          {showUploadModal && (

            <div className="upload-modal-overlay">

              <div className="upload-modal">

                <h2>Upload Tool</h2>

                <input
                  type="text"
                  placeholder="Tool Name"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Project Name"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Ticket ID"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Creator Email"
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Developer Email"
                  value={developerEmail}
                  onChange={(e) => setDeveloperEmail(e.target.value)}
                />

                <label className="custom-file-upload">

                  <input
                    type="file"
                    accept=".exe"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />

                  <span className="file-btn">
                    Choose File
                  </span>

                  <span className="file-name">
                    {selectedFile
                      ? selectedFile.name
                      : 'No file chosen'}
                  </span>

                </label>

                <div className="upload-actions">

                  <button onClick={handleUpload}>
                    Upload
                  </button>

                  <button
                    onClick={() => {

                      setShowUploadModal(false)

                      setToolName('')
                      setProject('')
                      setTicketId('')
                      setDepartment('')
                      setCreatorEmail('')
                      setDeveloperEmail('')
                      setSelectedFile(null)

                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }

                    }}
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          )}
          {showProjectModal && (

            <div className="upload-modal-overlay">

              <div className="upload-modal">

                <h2>New Project</h2>

                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />

                <div className="upload-actions">

                  <button
                    type="button"
                    onClick={handleAddProject}
                  >
                    Add Project
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProjectModal(false)
                      setNewProjectName('')
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          )}

        </main>
      </div >
    </>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span>Centillion Networks</span>
    </div>
  )
}
