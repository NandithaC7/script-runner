const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const authMiddleware = require('./authMiddleware')
const app = express()
const PORT = 5000

const multer = require('multer')

app.use(express.json())

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174/']
}))

const projectsPath = path.join(__dirname, 'projects.json')

const SCRIPTS_DIR = path.join(__dirname, 'scripts')
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, SCRIPTS_DIR)
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }

})

const upload = multer({ storage })

// ── POST /api/upload- uploads files to scripts directory ──────────
app.post(
  '/api/upload',
  authMiddleware,
  upload.single('tool'),

  (req, res) => {

    // if (!req.file) {

    //   return res.status(400).json({
    //     success: false,
    //     message: 'No file uploaded'
    //   })
    // }

    const toolsPath = path.join(__dirname, 'tools.json')

    const tools = JSON.parse(
      fs.readFileSync(toolsPath, 'utf-8')
    )

    const newTool = {

      id: Date.now(),

      name: req.body.name,

      project: req.body.project,

      ticketId: req.body.ticketId,

      department: req.body.department,

      creatorEmail: req.body.creatorEmail,

      developerEmail: req.body.developerEmail,

      filename: req.file ? req.file.filename : null,

      createdAt: new Date(),

      history: []
    }

    tools.push(newTool)

    fs.writeFileSync(
      toolsPath,
      JSON.stringify(tools, null, 2)
    )

    return res.json({
      success: true,
      filename: req.file ? req.file.filename : null,
      message: 'Tool uploaded successfully'
    })
  }
)


//------POST /api/run  runs .exe files in windows whic clicked on connect!!1
app.post('/api/run', authMiddleware, (req, res) => {
  const { page, tool, exe } = req.body

  if (!exe) {
    return res.status(400).json({ success: false, message: 'No exe name provided.' })
  }

  if (exe.includes('..') || exe.includes('/') || exe.includes('\\')) {
    return res.status(400).json({ success: false, message: 'Invalid exe name.' })
  }

  const exePath = path.join(SCRIPTS_DIR, exe)

  if (!fs.existsSync(exePath)) {
    return res.status(404).json({
      success: false,
      message: `Script not found: ${exe}\n\nPlace your .exe files in:\n  backend/scripts/${exe}`
    })
  }

  console.log(`[RUN] page=${page} tool=${tool} exe=${exe}`)
  // prev method: execFile which was slower & sychronous
  try {
    const child = spawn(exePath, [], {
      detached: true,//.exe should continue running even if Node request finishes
      stdio: 'ignore',//ignore child process output
      cwd: SCRIPTS_DIR,
    })
    child.unref()//Node server should NOT wait for this child process
    console.log(`[LAUNCHED] ${exe}`)
    return res.json({ success: true, message: `${exe} launched successfully` })
  } catch (err) {
    console.log(`[FAIL] ${exe}`)
    return res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /api/download/:filename — sends the exe as a file download ──
// When React calls window.location.href = '/api/download/myfile.exe',
// the browser shows a Save dialog and downloads the file.
// res.download() is an Express built-in that sets Content-Disposition: attachment
// which tells the browser "save this, don't open it".
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename

  // Safety: block path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename.' })
  }

  const filePath = path.join(SCRIPTS_DIR, filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `File not found: ${filename}` })
  }

  console.log(`[DOWNLOAD] ${filename}`)

  // res.download(filePath, downloadName) — sends the file with save-dialog headers
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error(`[DOWNLOAD ERROR] ${err.message}`)
      // Only send error if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed.' })
      }
    }
  })
})

// ── GET /api/health — verify server is running ────────────────────
app.get('/api/health', (req, res) => {
  const scripts = fs.readdirSync(SCRIPTS_DIR).filter(f =>
    fs.statSync(path.join(SCRIPTS_DIR, f)).isFile()
  )
  res.json({ status: 'running', scripts_folder: SCRIPTS_DIR, scripts_found: scripts })
})

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50))
  console.log('  Script Execution Backend — Node.js + Express')
  console.log(`  Scripts folder: ${SCRIPTS_DIR}`)
  console.log(`  Running at:     http://localhost:${PORT}`)
  console.log('='.repeat(50))
})

//get api for frontend to fetch details of tools
app.get('/api/tools', authMiddleware, (req, res) => {

  const toolsPath = path.join(__dirname, 'tools.json')

  const tools = JSON.parse(
    fs.readFileSync(toolsPath, 'utf-8')
  )

  res.json(tools)
})


// delete tool
app.delete('/api/tools/:id', authMiddleware, (req, res) => {

  try {
    //security: only allow if user has admin or developer role
    const roles = req.user?.realm_access?.roles || []

    console.log(req.user)

    const allowed =
      roles.includes('admin') ||
      roles.includes('dev')

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    const toolId = req.params.id

    const toolsPath = path.join(__dirname, 'tools.json')

    const tools = JSON.parse(
      fs.readFileSync(toolsPath, 'utf-8')
    )

    const filteredTools = tools.filter(
      tool => String(tool.id) !== String(toolId)
    )

    fs.writeFileSync(
      toolsPath,
      JSON.stringify(filteredTools, null, 2)
    )

    res.json({
      success: true,
      message: 'Tool deleted successfully'
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      success: false,
      message: 'Failed to delete tool'
    })
  }
})

// UPDATE TOOL
// UPDATE TOOL
app.put('/api/tools/:id', authMiddleware, (req, res) => {

  try {

    const toolId = req.params.id

    const toolsPath =
      path.join(__dirname, 'tools.json')

    const tools = JSON.parse(
      fs.readFileSync(toolsPath, 'utf-8')
    )

    const updatedTools = tools.map(tool => {

      if (String(tool.id) === String(toolId)) {

        return {
          ...tool,

          name: req.body.name,
          ticketId: req.body.ticketId,
          department: req.body.department,
          creatorEmail: req.body.creatorEmail,
          developerEmail: req.body.developerEmail
        }
      }

      return tool
    })

    fs.writeFileSync(
      toolsPath,
      JSON.stringify(updatedTools, null, 2)
    )

    res.json({
      success: true
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      success: false,
      message: 'Failed to update tool'
    })
  }
})
// GET PROJECTS
app.get('/api/projects', (req, res) => {

  try {

    const projects = JSON.parse(
      fs.readFileSync(projectsPath, 'utf-8')
    )

    res.json(projects)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    })
  }
})
// ADD PROJECT
app.post('/api/projects', authMiddleware, (req, res) => {

  try {

    const { name } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name required'
      })
    }

    const projects = JSON.parse(
      fs.readFileSync(projectsPath, 'utf-8')
    )

    const exists = projects.find(
      p => p.id.toLowerCase() === name.toLowerCase()
    )

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Project already exists'
      })
    }

    const newProject = {
      id: name,
      label: name
    }

    projects.push(newProject)

    fs.writeFileSync(
      projectsPath,
      JSON.stringify(projects, null, 2)
    )

    res.json({
      success: true,
      message: 'Project added successfully',
      project: newProject
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      success: false,
      message: 'Failed to add project'
    })
  }
})

//edit project name
app.put('/api/projects/:id', (req, res) => {

  try {

    const { id } = req.params

    const { name } = req.body

    const projects = JSON.parse(
      fs.readFileSync(projectsPath, 'utf-8')
    )

    const updatedProjects = projects.map((project) => {

      if (project.id === id) {

        return {
          ...project,
          id: name,
          label: name
        }
      }

      return project
    })

    fs.writeFileSync(
      projectsPath,
      JSON.stringify(updatedProjects, null, 2)
    )

    res.json({
      success: true,
      message: 'Project updated'
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    })
  }
})
//delete project
app.delete('/api/projects/:id', (req, res) => {

  try {

    const { id } = req.params

    const projects = JSON.parse(
      fs.readFileSync(projectsPath, 'utf-8')
    )

    const filteredProjects = projects.filter(
      (project) => project.id !== id
    )

    fs.writeFileSync(
      projectsPath,
      JSON.stringify(filteredProjects, null, 2)
    )

    res.json({
      success: true,
      message: 'Project deleted'
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    })
  }
})
// 
app.post(
  '/api/tools/:id/version',
  authMiddleware,
  upload.single('tool'),
  (req, res) => {

    console.log('VERSION ROUTE HIT')


    const toolId = req.params.id

    const toolsPath = path.join(__dirname, 'tools.json')

    const tools = JSON.parse(
      fs.readFileSync(toolsPath, 'utf-8')
    )

    const tool = tools.find(
      t => String(t.id) === String(toolId)
    )

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      })
    }

    if (!tool.history) {
      tool.history = []
    }

    tool.history.unshift({
      id: Date.now().toString(),
      filename: tool.filename,
      uploadedAt: tool.createdAt
    })

    tool.filename = req.file.filename
    tool.createdAt = new Date()

    fs.writeFileSync(
      toolsPath,
      JSON.stringify(tools, null, 2)
    )

    res.json({
      success: true,
      message: 'New version uploaded'
    })
  }
)

app.delete(
  '/api/tools/:toolId/history/:historyId',
  (req, res) => {

    const toolsPath =
      path.join(__dirname, 'tools.json')

    const tools =
      JSON.parse(
        fs.readFileSync(
          toolsPath,
          'utf8'
        )
      )

    const tool =
      tools.find(
        t =>
          t.id === req.params.toolId
      )

    if (!tool) {

      return res.status(404)
        .json({
          message:
            'Tool not found'
        })
    }

    tool.history =
      tool.history.filter(
        h =>
          String(h.id) !==
          String(req.params.historyId)
      )
      
    fs.writeFileSync(
      toolsPath,
      JSON.stringify(
        tools,
        null,
        2
      )
    )

    res.json({
      message:
        'History version deleted'
    })
  }
)