# Group Leaderboard

A dense, developer-focused competitive programming leaderboard for tracking members across Codeforces, CodeChef, and LeetCode. 

The frontend consumes normalized data from the remote `cp-rating-api.vercel.app` endpoints to provide a unified ranking and statistical overview.

## Tech Stack
- **Framework:** Vite + React
- **Styling:** Vanilla CSS (Dark developer-tool aesthetic)

## Local Development

To run this project locally, ensure you have Node.js installed, then execute:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Customizing the Group List

Currently, the leaderboard tracks a predefined list of members. You can update this list by editing the `MOCK_USERS` array located at the top of `src/App.jsx`. Add the specific platform handles for each of your group members.

```javascript
const MOCK_USERS = [
  { id: '1', displayName: 'tourist', codeforces: 'tourist', codechef: 'tourist', leetcode: 'tourist' },
  // Add your members here
];
```

## Deployment

Because this is a standard Vite static site, it can be deployed for free on platforms like Vercel, Netlify, or GitHub Pages.

### Vercel (Recommended)
Since your API is already hosted on Vercel, deploying the frontend there is extremely seamless.
1. Push this code to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect it as a Vite project (Framework Preset: Vite, Build Command: `npm run build`, Output Directory: `dist`).
5. Click **Deploy**.

### Building for Production
To generate a static build locally, run:
```bash
npm run build
```
The optimized static files will be placed in the `dist` directory.
