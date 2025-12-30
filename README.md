# Management Frontend

A Next.js frontend application that connects to a Python (Quart) backend API.

## Features

- **Solution Search**: Fetch solutions by Code ID from the backend
- **Document Upload**: Upload documents to Azure Blob Storage via the backend
- **API Proxy**: Uses Next.js API Routes to avoid CORS issues

## Architecture

```
Frontend (Browser)
    ↓
Next.js API Routes (Proxy)
    ↓
Python Backend (Quart)
    ↓
Azure Blob Storage / Other Services
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:

```env
BACKEND_API_URL=http://localhost:5000
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## API Routes

The application uses Next.js API Routes as a proxy to the backend:

### Solution Service

- **Frontend**: `GET /api/solution/[codeId]`
- **Backend**: `GET /api/solution_service/[codeId]`

Example:
```typescript
import { getSolution } from './pages/lib/api/backend-apis';

const result = await getSolution('Lorem_Ipsum_printing');
```

### Upload Service

- **Frontend**: `POST /api/upload`
- **Backend**: `POST /api/upload_service`

Example:
```typescript
import { uploadDocument } from './pages/lib/api/backend-apis';

const file = /* File object */;
const result = await uploadDocument(file);
```

## Project Structure

```
Management_Frontend/
├── pages/
│   ├── api/                      # Next.js API Routes (proxy to backend)
│   │   ├── solution/
│   │   │   └── [codeId].ts      # GET solution by code ID
│   │   └── upload.ts            # POST file upload
│   ├── app/                      # Application pages
│   │   ├── solution/
│   │   │   └── page.tsx         # Solution search page
│   │   └── upload/
│   │       └── page.tsx         # Document upload page
│   ├── lib/
│   │   └── api/
│   │       └── backend-apis.ts  # API utility functions
│   └── index.tsx                # Home page
├── .env                          # Environment variables (not in git)
├── .env.example                 # Example environment variables
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Pages

### Home Page (`/`)
- Overview of available features
- Navigation to solution search and upload pages
- Setup instructions

### Solution Search (`/app/solution/page`)
- Input field for Code ID
- Fetches solution from backend
- Displays result in JSON format

### Document Upload (`/app/upload/page`)
- File selection interface
- Uploads file to Azure Blob Storage via backend
- Shows upload status and result

## Development

### Build for Production

```bash
npm run build
```

### Type Checking

The project uses TypeScript. Type definitions are included for:
- React and React DOM
- Next.js
- Node.js
- Formidable (file upload handling)

## Backend Requirements

The backend should expose the following endpoints:

1. **GET** `/api/solution_service/:code_id` - Returns solution data
2. **POST** `/api/upload_service` - Accepts multipart/form-data file upload

Make sure the backend server is running before starting the frontend.

## Notes

- The frontend uses Next.js API Routes as a proxy to avoid CORS issues
- All API calls from the browser go through Next.js API Routes
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- `BACKEND_API_URL` is only used server-side in API Routes

---

## Initial Project Setup (MacOS)

1. Install npm command
- Node package manager on appropriate OS environment. In this case, use MacOS.

# The easiest way to install Node.js and npm is via Homebrew :
    - brew install node
        - /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    - node -v
    - npm -v
    - npm install : this creates a file called package-lock.json
    - docker build .
