# 🚀 Docmino Frontend – Next.js Client

This is the **frontend application** for **Docmino**, a comprehensive electronic document management platform for managing **incoming, outgoing, and internal documents**, developed in compliance with Vietnam’s [Decree No. 30/2020/NĐ‑CP](https://thuvienphapluat.vn/van-ban/bo-may-hanh-chinh/Nghi-dinh-30-2020-ND-CP-cong-tac-van-thu-431077.aspx).

---

## 🌐 Project Overview

The frontend is built using **Next.js**, providing a modern, responsive, and intuitive interface that powers the key Docmino modules:

- Secure authentication for admins, clerical assistants, and approvers  
- Dashboards for managing all types of documents  
- Configurable approval workflows with signature placement  
- Archival navigation and user profile management

---

## ✨ Key Features

### 🔐 Authentication & User Roles
- Secure login/logout with JWT token handling  
- Role-based UI behavior for **Admin**, **Assistant**, and **Approver**  

### 📄 Document Management
- Full CRUD operations for incoming, outgoing, internal, and archived documents  
- Flexible approval flows with configurable approvers and digital signature placement  
- File upload, preview, and attachment management  

### 📊 Dashboards & Analytics
- Real-time reporting with charts and indicators  
- Monthly summaries, processing status, and document counts by type  

### 🗂 Archival Navigation
- Hierarchical structure: **Warehouse → Shelf → Box → Dossier**  
- Filters by retention period, creation date, and metadata  
- Fast search and navigation for large-scale storage systems  

### ⚙️ Settings & Configuration
- Manage document types, issuing authorities, fields  
- Customize approval steps and signature coordinates  
- User profile preferences and system-level settings  

---

## 🛠 Tech Stack

- **Framework**: Next.js (React)  
- **Styling**: Tailwind CSS  
- **API**: Docmino Web API (RESTful)  
- **State Management**: React Context + React Query  
- **Media Handling**: Cloudinary for file upload & preview  
- **Notifications**: `react-hot-toast`  

---

## 💻 Getting Started

### ⬇️ Clone & Install

```bash
git clone https://github.com/hugnt/NextJS-FE-Docmino-IncomingOutgoingDocumentManagement.git
cd NextJS-FE-Docmino-IncomingOutgoingDocumentManagement
npm install
```

### ⚙️ Configuration

Create a `.env.local` file and define the following environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-docmino-api-domain
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### ▶️ Run Development Server

```bash
npm run dev
```

Access the app at: [http://localhost:3000](http://localhost:3000)  
Hot reload is enabled for a smooth dev experience.

---

## 🧪 Test Account

Use the following demo credentials to explore all features:

- **Username**: `admin`  
- **Password**: `Admin@123`  
- **Role**: Full-access administrator

---

## 🚀 Deployment

To build and run in production:

```bash
npm run build
npm start
```

Make sure to configure environment variables in your hosting provider (e.g., **Vercel**, **Netlify**, **Render**).

---

## 🤝 Support & Feedback

Found a bug? Want to suggest a feature?  
👉 Please open an [issue on GitHub](https://github.com/hugnt/NextJS-FE-Docmino-IncomingOutgoingDocumentManagement/issues).

📧 Email: [support@docmino.vn](mailto:support@docmino.vn)  
📘 Facebook: [@docmino.devteam](https://facebook.com/docmino.devteam)

---

© 2025 **Docmino**