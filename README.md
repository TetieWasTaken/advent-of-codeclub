Built with ❤️ for High Seas 2024-2025

<img src="/.github/images/highseas/banner.svg" width="100" height="100"> <img src="/.github/images/highseas/flag.svg" width="100" height="100">

<img src="https://img.shields.io/endpoint?url=https://waka.hackclub.com/api/compat/shields/v1/U078EKGQW2H/interval:all_time/project:advent-of-codeclub&label=advent-of-codeclub&color=white">

Advent of Codeclub is an advent calendar made for a (dutch!) coding club at school. It is built with <img src="/.github/images/next/logo.svg" width="20" height="20"> Next.js, <img src="/.github/images/react/logo.svg" width="20" height="20"> React, <img src="/.github/images/tailwind/logo.svg" width="20" height="20"> Tailwind CSS, and <img src="/.github/images/typescript/logo.svg" width="20" height="20"> TypeScript. It uses <img src="/.github/images/firebase/logo.svg" width="20" height="20"> Firebase for authentication and <img src="/.github/images/firebase/firestore.svg" width="20" height="20"> Firestore for the database.

Advent of Codeclub is hosted on **https://advent-of-codeclub.vercel.app/** using <img src="/.github/images/vercel/logo.svg" width="20" height="20"> Vercel.

## Pages and Features



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
