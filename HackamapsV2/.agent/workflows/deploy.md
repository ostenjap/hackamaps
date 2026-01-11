---
description: Deploy the application to GitHub
---

This workflow helps you build and push your changes to GitHub.

1. Build the project
// turbo
npm run build

2. Add all changes
git add .

3. Commit changes
// prompt
git commit -m "deploy: update application"

4. Push to main
git push origin main
