# ScriptExec Portal

A centralized web-based platform for managing, storing, downloading, and executing automation tools (.exe files) through a secure role-based interface.

---

## Overview

ScriptExec Portal provides a single platform where users can:

* View available automation tools
* Download executable files
* Launch automation tools directly from the portal
* Upload new tools
* Manage projects and tools
* Track tool history
* Store tool backups in AWS S3
* Authenticate securely using Keycloak

The application is designed to simplify access to internal automation utilities while maintaining centralized control and role-based security.

---

## Features

### Authentication & Authorization

* Keycloak-based authentication
* JWT token validation
* Role-based access control

Supported Roles:

| Role      | Permissions               |
| --------- | ------------------------- |
| Admin     | Full access               |
| Developer | Upload, Edit, Delete, Run |
| User      | View, Download, Run       |

---

### Tool Management

* Upload executable files (.exe)
* Download tools
* Execute tools
* Edit tool metadata
* Delete tools
* Maintain tool history

---

### Project Management

* Create projects
* Edit projects
* Delete projects
* Organize tools by project

---

### AWS S3 Integration

Uploaded executables are:

1. Stored locally for execution
2. Uploaded to AWS S3 for backup and centralized storage

Benefits:

* Disaster recovery
* Centralized storage
* Easy migration between environments

---

### Tool Execution

Users can launch automation tools directly from the portal.

Execution Flow:

```text
User
 ↓
Connect Button
 ↓
Backend API
 ↓
Locate Executable
 ↓
child_process.spawn()
 ↓
Launch EXE
```

---

## Technology Stack

### Frontend

* React.js
* Vite
* React Router
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express.js
* Multer
* JOSE
* AWS SDK v3

### Authentication

* Keycloak

### Storage

* AWS S3
* Local File System

### Containerization

* Docker

---

## Project Structure

```text
ScriptExec/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── scripts/
│   ├── server.js
│   ├── authMiddleware.js
│   ├── tools.json
│   ├── projects.json
│   └── package.json
│
├── docker-compose.yml
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd ScriptExec
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Runs on:

```text
http://localhost:5173
```

---

### Backend Setup

```bash
cd backend

npm install

node server.js
```

Runs on:

```text
http://localhost:5000
```

---

## Environment Variables

Create:

```text
backend/.env
```

```env
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY

AWS_REGION=ap-south-2

AWS_BUCKET_NAME=script-exec-tools-654
```

---

## Keycloak Configuration

### Realm

```text
rpa-launcher
```

### Client

```text
frontend-client
```

### Creating Users

1. Open Keycloak Admin Console
2. Select Realm
3. Users → Create User
4. Enter user details
5. Set password
6. Assign role

---

### Roles

```text
admin
developer
user
```

---

## AWS S3 Configuration

Bucket:

```text
script-exec-tools-654
```

Region:

```text
ap-south-2
```

Required IAM Permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::script-exec-tools-654/tools/uploads/*"
    }
  ]
}
```

---

## Deployment Notes

### Windows Deployment

Recommended deployment environment:

```text
Windows Server
```

Reason:

The application launches Windows executables directly using:

```javascript
child_process.spawn()
```

Linux deployments require additional compatibility layers such as Wine and are not recommended for production use in the current architecture.

---

## Known Issues

### spawn EFTYPE

Cause:

* Corrupted executable
* Invalid executable
* Unsupported executable format

Resolution:

* Re-upload executable
* Verify executable runs manually

---

### S3 Access Denied

Cause:

* Missing IAM permissions

Resolution:

* Verify IAM policy
* Verify bucket path permissions

---

### Invalid Token

Cause:

* Expired JWT
* Incorrect Keycloak configuration

Resolution:

* Re-login
* Verify realm and client settings

---

## Future Enhancements

* PostgreSQL integration
* Tool versioning
* Audit logging
* Execution analytics dashboard
* Remote execution agents
* Centralized monitoring

---

## Contributors

Developed as part of the Script Execution Portal project for centralized automation tool management and execution.
