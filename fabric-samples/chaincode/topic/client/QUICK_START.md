# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- API server running on `http://localhost:3000`

### Step 1: Install Dependencies (1 min)
```bash
cd fabric-samples/chaincode/topic/client
npm install
```

### Step 2: Setup Environment (1 min)
```bash
cp .env.example .env
# Default settings should work if API is on localhost:3000
```

### Step 3: Start Development Server (1 min)
```bash
npm run dev
```

### Step 4: Open in Browser (1 min)
Open `http://localhost:3001` in your browser

### Step 5: Login (1 min)
Use any of these test accounts:

**Student Account**
- ID: `SV001`
- Name: `Nguyễn Văn A`
- Role: `Sinh Viên`
- Organization: `Org1`

**Supervisor Account**
- ID: `GV001`
- Name: `Trần Thị Giáo Viên`
- Role: `Giáo Viên Hướng Dẫn`
- Organization: `Org2`

## 📱 UI Quick Tour

### 1. Login Screen
- Clean gradient design
- Language in Vietnamese
- Select organization and role

### 2. Dashboard (Home)
- View your topics
- Filter by status
- Quick action buttons

### 3. Register Topic (Student)
- Fill in topic details
- Submit to blockchain
- Get confirmation

### 4. Topic Details
- See full information
- For Students: Track progress, check status
- For Supervisors: Approve/reject, add evaluation

## 🛠️ Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Type checking
npm run lint

# Preview production build
npm run preview
```

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app with routing |
| `src/pages/` | Page components for routes |
| `src/components/topics/` | Topic-specific components |
| `src/services/apiClient.ts` | API communication |
| `src/store/authStore.ts` | Authentication state |
| `tailwind.config.js` | Styling configuration |

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
    }
  }
}
```

### Change API URL
Edit `.env`:
```
VITE_API_BASE_URL=https://your-api.com
```

### Add New Page
1. Create in `src/pages/`
2. Add route in `src/App.tsx`
3. Import and add `<Route>`

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to API" | Ensure API server runs on `:3000` |
| Port 3001 in use | Change port in `vite.config.ts` |
| Styles not loading | Clear browser cache, restart dev server |
| TypeScript errors | Run `npm run lint` to see all issues |
| npm install fails | Delete `node_modules`, clear cache, retry |

## 📦 What's Included

✅ Complete React app with:
- TypeScript for type safety
- Routing with React Router
- State management with Zustand
- Tailwind CSS styling
- Responsive design
- Form validation
- Error handling
- Loading states
- Toast notifications

✅ Documentation:
- README.md (overview)
- SETUP_GUIDE.md (detailed setup)
- UI_DESIGN.md (design specs)
- DESIGN_SUMMARY.md (complete guide)

## 🌐 Browser Testing

The app works on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## 📚 Learn More

- **React**: https://react.dev
- **TypeScript**: https://typescriptlang.org
- **Tailwind**: https://tailwindcss.com
- **Vite**: https://vitejs.dev

## 💡 Tips

1. Use browser DevTools (F12) to debug
2. Check Console tab for error messages
3. Use Network tab to inspect API calls
4. Test with both student and supervisor accounts
5. Check localStorage to see stored user data

## 🎯 Next Steps

After getting familiar:

1. **Customize**: Update colors, text, and branding
2. **Extend**: Add new features and pages
3. **Deploy**: Build and deploy to production
4. **Monitor**: Track user interactions and errors
5. **Iterate**: Gather feedback and improve

---

**Estimated Time to Production**: 2-4 hours

Need help? Check the documentation files included!
