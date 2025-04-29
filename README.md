<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/your_username/Biblion">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Biblion: A Collaborative Book Review Platform</h3>

  <p align="center">
    A dynamic platform where book lovers can connect, share reviews, and discover trending reads!
    <br />
    <a href="https://github.com/your_username/Biblion"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/your_username/Biblion">View Demo</a>
    ·
    <a href="https://github.com/your_username/Biblion/issues">Report Bug</a>
    ·
    <a href="https://github.com/your_username/Biblion/issues">Request Feature</a>
  </p>
</div>

---


## 📖 About The Project

**Biblion** is a collaborative platform for book enthusiasts.  
It allows users to share reviews, leave comments, track their reading journey, and find trending books based on ratings and activity.

### ✨ Core Concepts Demonstrated

- User authentication and profile management
- Relational models (Users ↔ Books ↔ Reviews ↔ Comments)
- Form handling and validation
- Review rating system
- Dynamic views, search functionality, and pagination

---

## 🚀 Features

### 🔐 User Login and Registration
- Secure registration and login via Django’s auth system
- Personalized user profiles showcasing reviews and reading history

### 📚 Book Database and Search
- Add new books (title, author, genre, cover image URL)
- Browse and search books by title, author, or genre

### ✍️ Add/Edit/Delete Reviews
- Create reviews with a text body, optional title, and 1–5 star rating
- Edit or delete your own reviews
- View average ratings per book

### 💬 Comment on Reviews
- Comment on any review to discuss, agree, or recommend other books
- Delete your own comments with basic moderation tools

### 📈 Trending Books & Top Reviewers
- Landing page highlights:
  - Books with the highest average ratings
  - Most reviewed books
  - Most active users (Top reviewers)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🛠️ Built With

- [Django](https://www.djangoproject.com/) - Backend Framework
- [Django REST Framework](https://www.django-rest-framework.org/) - API Management
- [React.js](https://reactjs.org/) - Frontend UI
- [PSQLite](https://www.sqlite.org) - Database
- [CSS3] - Styling 
- [JWT Authentication](https://jwt.io/) - Token-Based Authentication

---

## 📦 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL Database

### Backend Setup (Django)

```bash
git clone https://github.com/your_username/Biblion.git
cd Biblion/backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate (Windows)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
