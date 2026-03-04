# 🚀 Deployment Guide

This guide explains how to deploy the Vibecoding Hackathon website to Vercel.

## Prerequisites

- A Vercel account (free tier is sufficient)
- GitHub repository connected to Vercel
- Node.js installed locally

## Deploying to Vercel

### Option 1: Deploy via Vercel CLI (Recommended for quick deployment)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to the web directory**
   ```bash
   cd web
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```

   Vercel will ask you to confirm settings:
   - **Link to existing project**: No
   - **Project name**: Enter your desired project name (e.g., `vibecoding-hackathon`)
   - **Scope**: Select your account
   - **Build command**: `npm run build`
   - **Output directory**: `.next`
   - **Override settings**: No

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Log in or sign up
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `npm run build` (or `yarn build`)
   - **Output Directory**: `.next`
   - **Install Command**: `npm install` (or `yarn install`)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at `https://your-project-name.vercel.app`

## Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads at the Vercel URL
- [ ] All pages are accessible (/participants, /submit, /leaderboard, /admin)
- [ ] Navigation works correctly
- [ ] Dark mode functions
- [ ] Responsive design works on mobile
- [ ] Admin panel login works (default password: `admin123`)

## Customizing the Hackathon

### Setting the Timer

The hackathon timer automatically starts at 24 hours when the website is first accessed. To set a specific start time:

1. Open the deployed website
2. Open browser DevTools (F12)
3. Go to Console
4. Run:
   ```javascript
   // Set timer to 24 hours from now
   const now = Date.now()
   localStorage.setItem("hackathonEndTime", (now + 24 * 60 * 60 * 1000).toString())

   // Or set to specific end time (Unix timestamp in milliseconds)
   localStorage.setItem("hackathonEndTime", "YOUR_TIMESTAMP_HERE")
   ```

### Setting Participant Names

Update the participant names:

1. Open the deployed website
2. Open browser DevTools (F12)
3. Go to Console
4. Run:
   ```javascript
   const participants = [
     { id: "1", name: "John Doe", githubUrl: "", status: "working" },
     { id: "2", name: "Jane Smith", githubUrl: "", status: "working" }
   ]
   localStorage.setItem("participants", JSON.stringify(participants))
   ```

### Changing Admin Password

Update the admin password:

1. Open the deployed website
2. Open browser DevTools (F12)
3. Go to Console
4. Run:
   ```javascript
   localStorage.setItem("adminPassword", "your-new-password")
   ```

## Important Notes

### Data Persistence

Currently, the website uses `localStorage` for data persistence. This means:

- Data is stored in each user's browser
- Different users see different data
- Not suitable for multiple judges accessing the same data

### Future Improvements

For production use with multiple judges, consider implementing:

1. **Backend Database**: Use Supabase, Firebase, or a traditional database
2. **Real-time Sync**: Implement real-time data synchronization
3. **Authentication**: Add proper user authentication
4. **Data Export**: Add functionality to export/import hackathon data

### Clearing Data

To reset all hackathon data:

1. Open the website
2. Open browser DevTools (F12)
3. Go to Application > Local Storage
4. Select your website
5. Click "Clear All"

Or run in Console:
```javascript
localStorage.clear()
```

## Environment Variables

Currently, no environment variables are required. Future implementations may need:

- `DATABASE_URL` - Database connection string
- `ADMIN_PASSWORD` - Default admin password
- `NEXT_PUBLIC_API_URL` - API endpoint URL

## Monitoring and Analytics

Vercel provides built-in monitoring:

- **Analytics**: View traffic and user engagement
- **Logs**: View deployment and application logs
- **Performance**: Monitor site performance metrics
- **Errors**: Track and debug errors

Access these from your Vercel project dashboard.

## Updates and Redeployments

To update the website after making changes:

### Using Vercel CLI
```bash
git add .
git commit -m "Update website"
git push
vercel --prod
```

### Automatic Deployments
If you connected your GitHub repository to Vercel, deployments are automatic:
- Push changes to GitHub
- Vercel automatically builds and deploys
- No manual intervention needed

## Troubleshooting

### Build Failures

If the build fails:

1. Check the build logs in Vercel dashboard
2. Ensure `package.json` is correct
3. Verify all dependencies are installed
4. Check for TypeScript errors

### Runtime Errors

If you encounter runtime errors:

1. Open browser DevTools Console
2. Check for JavaScript errors
3. Verify localStorage is accessible
4. Clear cache and cookies if needed

### Data Not Persisting

If data doesn't persist between sessions:

1. Check if browser blocks localStorage
2. Verify no errors in console
3. Try in incognito mode (which may have different settings)
4. Consider implementing a database for persistent storage

## Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Visit [Vercel support](https://vercel.com/support)
- Review the project's [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Happy deploying! 🚀**
