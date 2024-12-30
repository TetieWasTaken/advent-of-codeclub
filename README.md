Built with ❤️ for High Seas 2024-2025

<img src="/.github/images/highseas/banner.svg" width="100" height="100"> <img src="/.github/images/highseas/flag.svg" width="100" height="100">

<img src="https://img.shields.io/endpoint?url=https://waka.hackclub.com/api/compat/shields/v1/U078EKGQW2H/interval:all_time/project:advent-of-codeclub&label=advent-of-codeclub&color=white">

Advent of Codeclub is an advent calendar made for a (dutch!) coding club at school. It is built with <img src="/.github/images/next/logo.svg" width="20" height="20"> Next.js, <img src="/.github/images/react/logo.svg" width="20" height="20"> React, <img src="/.github/images/tailwind/logo.svg" width="20" height="20"> Tailwind CSS, and <img src="/.github/images/typescript/logo.svg" width="20" height="20"> TypeScript. It uses <img src="/.github/images/firebase/logo.svg" width="20" height="20"> Firebase for authentication and <img src="/.github/images/firebase/firestore.svg" width="20" height="20"> Firestore for the database.

Advent of Codeclub is hosted on **https://advent-of-codeclub.vercel.app/** using <img src="/.github/images/vercel/logo.png" width="20" height="20"> Vercel. Vercel provides the image storage, deployments, analytics, and logs for the project.

\[!\] **Since 26 dec, the website is redirected to /finished and cannot be accessed. This is for security and privacy reasons.** (Please see screenshots below)

<img src="/.github/images/screenshots/flow.gif" width="500">

## Pages and Features

### Main Page (/)
- Displays every day of the advent calendar up to the current day
- Shows whether the user has submitted a solution for the day
- Shows whether the solution was correct or not
- Shows the user's username in the top right corner
- An expanded view of the challenge can be opened by clicking on the challenge, which shows the full challenge description, the user's solution, if it was correct, and additionally a note from the admin

<img src="/.github/images/screenshots/home.png" width="500">
<img src="/.github/images/screenshots/expanded.png" width="500">

### Submit Page (/submit?id=)
- Allows the user to submit a solution for the selected challenge
- Submissions can be submitted as text or as a file (using Vercel glob), with an additional field for comments
- The user can only submit one solution per challenge
- The user can only submit solutions for challenges that have already been released

<img src="/.github/images/screenshots/submit.png" width="500">

### Authentication Page (/auth)
- Allows the user to sign in by email and password
- Uses Firebase authentication to sign in and sign out, with email verification
- The user can only access any of the other pages when signed in
- If already signed in, the user can return or sign out

<img src="/.github/images/screenshots/auth.png" width="500">
<img src="/.github/images/screenshots/auth_back.png" width="500">
<img src="/.github/images/screenshots/verification.png" width="500">
<img src="/.github/images/screenshots/verified.png" width="500">

### Admin Page (/admin)
- Allows the admin to view all submissions for all challenges from all users
- The admin can view the user's solution, comments, and decide whether the solution was correct with an optional note
- The admin can also view the user's firebase ID, email, verification status, and dates of creation, last sign-in and last seen
- The admin page is only accessible to users with admin privileges, provided in the environment variables and uses JWT for authentication

<img src="/.github/images/screenshots/admin.png" width="500">

## Building locally

To build the project locally, you need to have Deno installed. See the [Deno installation guide](https://docs.deno.com/runtime/getting_started/installation/) for more information.

1. Clone the repository
2. Set up the environment variables in a `.env` file in the root directory
  You need to set the following environment variables:
  - Vercel blob token
  - Firebase API key and configuation
  - Firebase service account key
  - IDs of admin accounts (separated by commas)
  - JWT secret key

3. Run `deno run dev` in the root directory
4. Open `http://localhost:3000` in your browser

All rights to brand logos belong to their respective owners. This project is not affiliated with any of the brands mentioned above.
