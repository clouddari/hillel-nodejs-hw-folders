# Description

A full-stack MERN web application where users can explore, review, and manage books and movies. Built with role-based access, favorites, user profiles, image upload, and admin moderation panel.

## Features

_👤 User Functionality_

- Register and login (JWT authentication)
- Browse a collection of books and movies
- Add items to Favorites
- Leave reviews for books and movies
- View and edit personal profile:
- Update name, email, and password
- Upload profile picture (via URL or from device)

_🛡️ Admin Functionality_
Role-based access (user by default, manually upgradable in DB)

Admins can:

- Create, read, update, delete items (books/movies)
- Moderate reviews (approve/delete)
- Add reviews and favorites like regular users

_🔐 Security & Validation_

- Protected routes with JWT and middleware
- Role-based access control using requireRole
- Input sanitization with sanitize-html to prevent XSS
- Basic form validation for email, username, password, etc.

_🧰 Tech Stack_
Frontend

- React.js
- React Router
- Axios
- CSS

Backend

- Node.js + Express.js
- MongoDB + Mongoose
- Multer (file upload)
- JWT (authentication)
- bcryptjs (password hashing)
- sanitize-html (input protection)

_📸 Media Upload_
Profile pictures can be uploaded from:

- User's device
- External URL
- Default image is used if none provided

## 🔧 Setup

1. Copy `.env.example` and rename it to `.env`
2. Fill in the values:
   - `MONGO_URL` – your local or cloud MongoDB URI
   - `JWT_SECRET` – a strong secret key for signing JWT tokens
   - `PORT` – optional (defaults to 3000)
3. Start the server and client:

```bash
cd client && npm i
cd ../server && npm i
cd .. && npm i
npm start
```

4. Seed the database with initial items:

```bash
cd server/scripts
node seedItems.js
```

5.In your MongoDB database, manually update a user's role to "admin" to access the admin panel.

6.Add more sample books/movies using the admin panel or extend the seed script.
