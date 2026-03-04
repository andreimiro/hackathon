# 🤝 Contributing to Vibecoding Hackathon

This repository is managed by hackathon organizers. This guide explains how to use and contribute to this repository.

## 📁 Repository Structure

```
menorca-hackthon/
├── README.md           # Hackathon overview and rules
├── STARTER.md          # Participant setup guide
├── JUDGING.md          # Detailed judging rubric
├── CONTRIBUTING.md     # This file
└── web/                # Hackathon website (Next.js app)
    ├── src/
    │   ├── app/       # Next.js pages
    │   ├── components/ # React components
    │   └── lib/       # Utility functions
    └── package.json   # Dependencies
```

## 🚀 Getting Started as a Participant

### 1. Clone the Repository

```bash
git clone <repository-url>
cd menorca-hackthon
```

### 2. Read the Documentation

- **README.md** - Understand the hackathon overview, rules, and timeline
- **STARTER.md** - Follow the setup guide for your project
- **JUDGING.md** - Understand how your submission will be evaluated

### 3. Create Your Own Repository

For the hackathon, you should:

1. **Create a new GitHub repository** for your submission
2. **Choose your tech stack** and initialize your project
3. **Implement the iOS app** based on the selected target
4. **Document your setup** in your own README.md
5. **Make your repository public** before submission
6. **Submit your repository URL** via the hackathon website

> **Note**: Do not push your submission to this repository. Each participant should create their own repository.

## 🌐 Setting Up the Website (for Organizers)

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd web
npm install
# or
yarn install
```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🛠️ Technology Stack

### Website

- **Framework**: Next.js 14+ (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

### Participant Projects

Participants can choose any technology stack. Common choices:
- React Native
- Flutter
- Swift/SwiftUI
- Next.js (web)
- Vue.js (web)
- And more!

## 📝 Code Style Guidelines

When contributing to the website codebase:

- Follow TypeScript best practices
- Use functional components with React hooks
- Keep components small and focused
- Use Tailwind CSS for styling
- Write clear, descriptive variable names
- Add comments for complex logic

## 🔄 How to Contribute to the Website

### Reporting Issues

If you find bugs or issues with the website:

1. Check existing issues
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

### Submitting Changes

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
   ```bash
   npm run dev
   npm run lint
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**
   - Clear title
   - Detailed description
   - Reference related issues
   - Screenshots for UI changes

### Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
- `feat(admin): add password reset functionality`
- `fix(submission): prevent duplicate submissions`
- `docs(readme): update deployment instructions`

## 🚀 Deployment

### Deploying to Vercel

The website is designed for easy Vercel deployment:

1. **Connect your GitHub repository** to Vercel
2. **Configure build settings**:
   - Framework: Next.js
   - Root Directory: `web`
   - Build Command: `npm run build` (or `yarn build`)
   - Output Directory: `.next`
3. **Deploy**

Vercel will automatically deploy on every push to the main branch.

### Environment Variables

Currently, the website uses localStorage for data persistence. No environment variables are required.

## 🧪 Testing

### Manual Testing Checklist

Before submitting changes, verify:

- [ ] All pages load correctly
- [ ] Navigation works between pages
- [ ] Forms submit properly
- [ ] Countdown timer updates correctly
- [ ] Responsive design works on mobile
- [ ] Dark mode functions properly
- [ ] Admin login works
- [ ] Judging ratings save correctly
- [ ] Results publish to leaderboard

## 📊 Data Management

The website currently uses localStorage for:

- Participants data
- Submissions
- Ratings
- Results status
- Hackathon timer

Data persists in the user's browser. For production use with multiple judges, consider:
- Implementing a backend database
- Using a real-time sync solution
- Adding proper authentication

## 🔒 Admin Access

The admin panel has a default password: `admin123`

To change the admin password:

1. Open browser DevTools (F12)
2. Go to Console
3. Run: `localStorage.setItem('adminPassword', 'your-new-password')`

## 🎨 Adding New Features

### Adding a New Page

1. Create a new directory in `src/app/`
2. Add `page.tsx` with your component
3. Update `Navigation` component to include link
4. Test the new route

### Adding a New Component

1. Create component in `src/components/` or `src/components/ui/`
2. Follow existing component patterns
3. Use shadcn/ui components where possible
4. Export from component file
5. Import and use in pages

### Adding New State

1. Define TypeScript interfaces
2. Use React hooks for state management
3. Persist to localStorage if needed
4. Update type definitions

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 💬 Communication

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact organizers directly for sensitive matters

## 📄 License

This project is for internal hackathon use. Participants retain ownership of their submissions.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- All hackathon participants for their creativity and effort

---

**Happy hacking!** 🚀
