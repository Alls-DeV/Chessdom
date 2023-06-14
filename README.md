
<div align="center">
<h1 align="center">
<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
<br>
Chessdom
</h1>
<h3 align="center">📍 Rule the board with Chessdom on GitHub-checkmate the competition!</h3>
<h3 align="center">⚙️ Developed with the software and tools below:</h3>

<p align="center">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=HTML5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/Jinja-B41717.svg?style=for-the-badge&logo=Jinja&logoColor=white" alt="Jinja" />
<img src="https://img.shields.io/badge/Python-3776AB.svg?style=for-the-badge&logo=Python&logoColor=white" alt="Python" />
<img src="https://img.shields.io/badge/Flask-000000.svg?style=for-the-badge&logo=Flask&logoColor=white" alt="Flask" />
<img src="https://img.shields.io/badge/Markdown-000000.svg?style=for-the-badge&logo=Markdown&logoColor=white" alt="Markdown" />
</p>
</div>

---

## 📚 Table of Contents
- [📚 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [💫 Features](#-features)
- [📂 Project Structure](#project-structure)
- [🧩 Modules](#modules)
- [🚀 Getting Started](#-getting-started)
- [🗺 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👏 Acknowledgments](#-acknowledgments)

---


## 📍 Overview

Chessdom is a comprehensive chess web application built with Flask. It provides features such as user authentication and storage, various dynamic forms with data validation for user input, a leaderboard to display user performance, and a user-friendly interface for playing and recording chess games. Chessdom allows its users to import games, navigate through their moves, and customize their game preferences. The project's goal is to offer users a platform to improve their skillset with strong AI integration.

---

## 💫 Features

Feature | Description |
|---|---|
| **🏗 Structure and Organization** | The codebase is well-organized and follows a standard modular structure, with clear separation of concerns between the Flask app and its various components such as models and forms. The directories include "core," "static," and "templates" for keeping their respective code files, respectively. |
| **📝 Code Documentation** | The code is well-documented with elaborate file summaries providing a good understanding of the functionality of each file in the repository. However, certain essential files like "core/routes.py" failed to generate availing of the'HTTP 400 Bad Request' error. |
| **🧩 Dependency Management** | Dependencies are managed through a virtual environment separated from the central codebase and can be easily installed using the requirements.txt file available. |
| **♻️ Modularity and Reusability** | The code achieves a high level of reusability, especially with the usage of inheritance. The templates come with a "base.html" file that all other templates then extend which increases code reusability. |
| **✔️ Testing and Quality Assurance** | No specific testing code is identified or added as part of the repository available related to automated testing, increasing the risk of issues popping up with later alterations that could lead to delivery of faulty output. |
| **⚡️ Performance and Optimization** | Minimizing extraneous data usage and efficient querying through database joins are seen as efficient along with endpoints that directly serve static assets in corresponding routes add to better user experience. |
| **🔒 Security Measures** | Certain limitations linked as requesting User data triggered SQL injection, data attached with debugging has imparted security risks. Password fields are salted and hashed, transporting passwords in non-encrypted transmission renders a security breach risk in practice. |
| **🔄 Version Control and Collaboration** | Version controlled with Git that maintains record of all modifications – commits performed. Detailed commit logs provide an insight into development progress and encourages team integration. |-Only these following columns that contains the analysis needed due to lack of information on other features.

| Feature | Description |
|---|---|
| **🔌 External Integrations** | Certain code features of the

---


<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-github-open.svg" width="80" />

## 📂 Project Structure


```bash
repo
├── app.py
├── core
│   ├── forms.py
│   ├── __init__.py
│   ├── models.py
│   ├── routes.py
│   ├── static
│   │   ├── css
│   │   │   ├── dark.css
│   │   │   ├── jquery-ui.min.css
│   │   │   ├── light.css
│   │   │   └── style.css
│   │   ├── games
│   │   │   └── openings.txt
│   │   ├── images
│   │   │   └── piece_set
│   │   ├── js
│   │   │   ├── editor.js
│   │   │   ├── game.js
│   │   │   ├── home.js
│   │   │   ├── jquery.min.js
│   │   │   ├── jquery-ui.min.js
│   │   │   ├── preference.js
│   │   │   └── script.js
│   │   └── puzzles
│   └── templates
│       ├── base.html
│       ├── editor.html
│       ├── friend.html
│       ├── game.html
│       ├── home.html
│       ├── import.html
│       ├── leaderboard.html
│       ├── login.html
│       ├── preference.html
│       ├── profile.html
│       ├── register.html
│       └── search.html
├── LICENSE
├── README.md
└── requirements.txt

20 directories, 252 files
```

---

<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-src-open.svg" width="80" />

## 🧩 Modules

<details closed><summary>Core</summary>

| File      | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Module         |
|:----------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------|
| forms.py  | The provided code snippet contains various FlaskForms that define fields and validators for user input in a Flask application. The RegisterForm, LoginForm, SearchForm, GameForm, EditorForm and PreferenceForm contain a range of text inputs, select fields, password and file fields accompanied by data validation logic to ensure correct data types and input formats. The views utilizing these forms implement the backend logic required for desired website functionality.               | core/forms.py  |
| models.py | The code represents a Flask app with a database containing several tables (User, Game, Friend, Preference, Puzzle, PuzzleAttempted, PuzzleStats). The User table has methods for setting and checking password hashes. Other tables represent data about users, games, puzzles. Functions are defined for loading users, setting user avatars, and formatting model objects as strings. The code is designed to allow for user authentication and storage associated with a chess web application. | core/models.py |
| routes.py | Error generating file summary. Exception: Client error '400 Bad Request' for url 'https://api.openai.com/v1/chat/completions'                                                                                                                                                                                                                                                                                                                                                                      | core/routes.py |
|           | For more information check: https://httpstatuses.com/400                                                                                                                                                                                                                                                                                                                                                                                                                                           |                |

</details>

<details closed><summary>Root</summary>

| File   | Summary                                                                                                                                                                                                                                                                                 | Module   |
|:-------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------|
| app.py | This code initializes the Flask application from a core module and runs it in debug mode. Flask is a Python web framework used for developing web applications. The debug parameter allows for more detailed error messages to be displayed in the event of any faults within the code. | app.py   |

</details>

<details closed><summary>Templates</summary>

| File             | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                             | Module                          |
|:-----------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------|
| leaderboard.html | This is a HTML code snippet that extends a base file and defines a page with a leaderboard. It populates the leaderboard with data from a database and displays each user’s username, profile picture, ELO rating, number of solved problems, and the total number of attempts for the problems. It also generates clickable links to each user’s profile page.                                                                                     | core/templates/leaderboard.html |
| profile.html     | This code snippet extends a base HTML template and presents a user profile with a user avatar, username, and various statistics. It also displays a list of games played by the user and their outcomes. The code composition includes several conditional statements that depend on whether the current user is authenticated and various conditions that determine the visibility of information such as'Preferences','Follow' and'Played games'. | core/templates/profile.html     |
| game.html        | The provided code snippet is a HTML and JavaScript webpage that shows a chessboard with the players' names on its side, and allows the user to navigate through previous and next moves using buttons. Additionally, the script is provided with the necessary variables to represent the chess set pieces, the game's history, and the colors of each player's pieces.                                                                             | core/templates/game.html        |
| friend.html      | The code snippet extends a base HTML template and populates the'title' and'content' blocks to render a user's friend list. If no friends are detected, a message is displayed to that effect. Otherwise, a list of the user's friends is shown, including their avatars, usernames, last seen date and their individual ELO scores. Clicking on a friend's username takes the user to their profile page, as defined in the'url_for' function.      | core/templates/friend.html      |
| login.html       | The code renders a login page that extends from a base HTML file. It creates a form with fields for username and password. The form has error message display functionality if the input is invalid. It also includes a link to register for those who don't have an account and a submit button to log in.                                                                                                                                         | core/templates/login.html       |
| search.html      | This HTML code snippet extends a "base.html" template and creates a search form with a search input for a username or email. Upon submission, the resulting users are displayed in a list format, including their avatar, username, and Elo score. If no user is found, a message is displayed.                                                                                                                                                     | core/templates/search.html      |
| register.html    | This code snippet extends a base HTML file and defines a register page's content. It creates a form with fields for username, email, password, and confirmation password. User form inputs are validated, and error messages appear when necessary. Additionally, there are links provided for authentication purposes.                                                                                                                             | core/templates/register.html    |
| preference.html  | This code snippet extends a base HTML template and displays a form where users can set preferences for a chess game, including their about me text, preferred piece set, and board colors. The form posts to the server for updating the preferences. The snippet also loads JS files for configuring the preferences form.                                                                                                                         | core/templates/preference.html  |
| import.html      | The code snippet extends the base.html file and displays a form for importing Chess games. The form includes fields for players' names, moves made, and game result, and provides the option to upload a file. The submit button on the form allows users to add imported Chess games to a database.                                                                                                                                                | core/templates/import.html      |
| home.html        | The code is a Jinja template for a chess game website's home page. It includes a chessboard and a box containing information about the game, including the current player's rating and options for making a move or getting a hint. JavaScript scripts are included that utilize data about the game's state and configuration.                                                                                                                     | core/templates/home.html        |
| editor.html      | The provided code is an HTML and JavaScript based chessboard GUI editor. It uses a grid system to represent the chessboard and allows users to input and edit a chess game position using FEN (Forsyth-Edwards Notation). It also enables users to reset or clear the chessboard, and to customize the piece set, turn, and castling options for the game.                                                                                          | core/templates/editor.html      |
| base.html        | This is a code snippet for an HTML page that features responsive navigation, dynamic theme switching, message flashing, and integrated Bootstrap and jQuery libraries. It also comes with several pre-defined routing functionalities, such as home page, search, leaderboard, editor, profile, import, login, and registration.                                                                                                                    | core/templates/base.html        |

</details>

---

## 🚀 Getting Started

### ✅ Prerequisites

Before you begin, ensure that you have the following prerequisites installed:
> - [📌  PREREQUISITE-1]
> - [📌  PREREQUISITE-2]
> - ...

### 🖥 Installation

1. Clone the Chessdom repository:
```sh
git clone https://github.com/alls-cpp/Chessdom
```

2. Change to the project directory:
```sh
cd Chessdom
```

3. Install the dependencies:
```sh
[📌  INSERT-DESCRIPTION]
```

### 🤖 Using Chessdom

```sh
[📌  INSERT-DESCRIPTION]
```

### 🧪 Running Tests
```sh
[📌  INSERT-DESCRIPTION]
```

---


## 🗺 Roadmap

> - [X] [📌  Task 1: Implement X]
> - [ ] [📌  Task 2: Refactor Y]
> - [ ] [📌  Task 3: Optimize Z]
> - [ ] ...


---

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:
1. Fork the project repository. This creates a copy of the project on your account that you can modify without affecting the original project.
2. Clone the forked repository to your local machine using a Git client like Git or GitHub Desktop.
3. Create a new branch with a descriptive name (e.g., `new-feature-branch` or `bugfix-issue-123`).
```sh
git checkout -b new-feature-branch
```
4. Make changes to the project's codebase.
5. Commit your changes to your local branch with a clear commit message that explains the changes you've made.
```sh
git commit -m 'Implemented new feature.'
```
6. Push your changes to your forked repository on GitHub using the following command
```sh
git push origin new-feature-branch
```
7. Create a pull request to the original repository.
Open a new pull request to the original project repository. In the pull request, describe the changes you've made and why they're necessary.
The project maintainers will review your changes and provide feedback or merge them into the main branch.

---

## 📄 License

This project is licensed under the `[📌  INSERT-LICENSE-TYPE]` License. See the [LICENSE](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository) file for additional info.

---

## 👏 Acknowledgments

> - [📌  List any resources, contributors, inspiration, etc.]

---
