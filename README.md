

<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/larkhiya/126-LE2-frontend">
    <img src="myapp/public/logo192.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Biblion: Let Your Books Roar </h3>

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

### Core Concepts Demonstrated

- User authentication and profile management
- Relational models (Users ↔ Books ↔ Reviews ↔ Comments)
- Form handling and validation
- Review rating system
- Dynamic views, search functionality, and pagination

---

## Features

### User Login and Registration
- Secure registration and login via Django’s auth system
- Personalized user profiles showcasing reviews and reading history

### Book Database and Search
- Add new books (title, author, genre, cover image URL)
- Browse and search books by title, author, or genre

### Add/Edit/Delete Reviews
- Create reviews with a text body, optional title, and 1–5 star rating
- Edit or delete your own reviews
- View average ratings per book

### Comment on Reviews
- Comment on any review to discuss, agree, or recommend other books
- Delete your own comments with basic moderation tools

### Trending Books & Top Reviewers
- Landing page highlights:
  - Books with the highest average ratings
  - Most reviewed books
  - Most active users (Top reviewers)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

### Built With

* [![React][React.js]][React-url]
* [![Django][Django]][Django-url]
* [![SQLite][SQLite]][SQLite-url]
* [![CSS3][CSS3]][CSS3-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

You’ll need the following installed on your system:

- Python 3.10+
- Node.js 18+
- npm (comes with Node.js)

If you don’t have Node.js and npm installed, you can install them by running:
  ```sh
  npm install npm@latest -g
  ```
Make sure you have Python and Django installed on your system. You can install Django with:
  ```sh
  pip install django
  ```

### Installation

Follow the steps below to get the project running locally:

1. Clone the Repository
* Clone the repository to your local machine:
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
2. Set up the Frontend (React)

* Navigate to the frontend directory and install the required npm packages:
   ```sh
   cd frontend
   npm install
   ```
* Start the React development server:
   ```sh
   npm start
   ```
   The React app should now be running at http://localhost:3000.
  
3. Set up the Backend (Django)
* Navigate to the backend directory and create a virtual environment:
   ```sh
   cd backend
   python -m venv venv
   ```
  * Navigate to the backend directory and create a virtual environment:
    * On macOS/Linux:
      ```sh
      source venv/bin/activate
       ```
    * On Windows:
      ```sh
      source venv/bin/activate
       ```
  * Install Django and other dependencies:
    ```sh
     pip install -r requirements.txt
     ```
  * Run database migrations to set up the database:
    ```sh
     python manage.py migrate
     ```
  * Create a superuser (optional, for admin access):
    ```sh
     python manage.py createsuperuser
     ```
  * Start the Django development server:
    ```sh
     python manage.py runserver
     ```
    The Django app should now be running at http://127.0.0.1:8000.

4. Connect React with Django
* Make sure the React app is set up to make API requests to the correct Django server URL (e.g., http://127.0.0.1:8000/api).
* You may need to update the config.js or a similar file to match the API endpoint used by the Django backend.
      
6. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>






### 👑 Top Contributors

Thanks to these amazing people for bringing **Biblion** to life!

<a href="https://github.com/larkhiya"><img src="https://avatars.githubusercontent.com/u/137350308?v=4" width="50px;" alt="Larkhiya" /></a>
<a href="https://github.com/alglenrey"><img src="https://avatars.githubusercontent.com/u/197783173?v=4&size=64" width="50px;" alt="al" /></a>
<a href="https://github.com/ethanny"><img src="https://avatars.githubusercontent.com/u/145535621?v=4" width="50px;" alt="Ethan" /></a>

---

<!-- CONTACT -->
## 📬 Contact

- **Raethan Supatan** — [rrsupatan@up.edu.com](mailto:rrsupatan@up.edu.com)
- **Larkhiya Johnnyl Wong** — [lcwong@up.edu.ph](mailto:lcwong@up.edu.ph)
- **Al Glenrey Tilacas** — [aatilacas@up.edu.ph](mailto:aatilacas@up.edu.ph)

Project Link: https://github.com/larkhiya/126-LE2-frontend

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Django]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white
[Django-url]: https://www.djangoproject.com/
[CSS3]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[CSS3-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
[SQLite]: https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white
[SQLite-url]: https://www.sqlite.org/


[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/


