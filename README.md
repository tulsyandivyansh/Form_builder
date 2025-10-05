# Form Builder

A full-stack form builder web application that allows users to create, customize, and manage forms dynamically through an intuitive interface.  
Built with **React** on the frontend and **Node.js/Express** on the backend.

---

## 🚀 Features

- Drag-and-drop form builder interface  
- Real-time form preview  
- JSON-based form schema storage  
- REST API for saving and fetching forms  
- Responsive design for desktop and mobile  
- Modular frontend and backend architecture

---

## 🛠️ Tech Stack

**Frontend**
- React  
- JavaScript (ES6+)  
- Axios  
- Bootstrap / Material UI (if applicable)

**Backend**
- Node.js  
- Express.js  
- (Optional) MongoDB or another database (if used)

---

## 📁 Project Structure

```

Form_builder/
├── frontend/        # React app
│   ├── src/         # Components, hooks, utilities
│   ├── public/      # Static assets
│   └── package.json
│
├── backend/         # Node.js server
│   ├── server.js    # Express server entry point
│   └── package.json
│
├── .gitignore
└── README.md

````

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Form_builder.git
cd Form_builder
````

### 2. Install dependencies

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd ../frontend
npm install
```

### 3. Run the app

**Start backend**

```bash
cd backend
npm start
```

**Start frontend**

```bash
cd ../frontend
npm start
```

The frontend will run on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000).
