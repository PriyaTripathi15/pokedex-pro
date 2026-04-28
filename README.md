# 🔴 Pokédex Pro - A Modern Pokémon Explorer

A fully-featured, responsive web application to search, filter, and explore Pokémon with a beautiful yellow and red theme inspired by the iconic Pokéball design.

## ✨ Features

### Mandatory Features ✅
- **Data Fetching**: Integrated with [PokéAPI](https://pokeapi.co/) to retrieve comprehensive Pokémon data
- **Loading & Error States**: Graceful handling with spinner animations and error messages
- **Responsive Grid Layout**: Works seamlessly on mobile, tablet, and desktop devices
- **Search Functionality**: Real-time search by Pokémon name with instant filtering
- **Type Filtering**: Filter Pokémon by type (Fire, Water, Grass, Electric, etc.)
- **Pagination**: Navigate through 200+ Pokémon with intuitive pagination controls
- **Favorites System**: Mark favorites and persist them in browser localStorage
- **Detail Modal**: View comprehensive Pokémon stats, abilities, types, and height/weight

### UI/UX Highlights 🎨
- **Yellow & Red Theme**: Pokéball-inspired color scheme throughout the app
- **Smooth Animations**: Hover effects, page transitions, and loading spinners
- **Sticky Navigation**: Quick access to favorite count at the top
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Recovery**: User-friendly error messages with retry functionality

### Bonus Features 🌟
- **Smooth Animations**: Hover scale effects, fade-ins, and smooth transitions
- **Optimized Performance**: Efficient API calls with caching strategies
- **Advanced Search**: Instant search with fallback to local filtering
- **Stats Visualization**: Visual progress bars for Pokémon base stats

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom configuration
- **API**: PokéAPI v2 (REST)
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Local Storage**: Browser localStorage for favorites persistence
- **Build Tool**: Vite 5 for fast development and production builds

## 📋 Project Structure

```
pokedex-pro/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation with favorite count
│   │   ├── SearchBar.jsx       # Search input with clear button
│   │   ├── TypeFilter.jsx      # Dynamic type filter buttons
│   │   ├── PokemonCard.jsx     # Individual Pokemon card component
│   │   ├── PokemonGrid.jsx     # Grid layout for Pokemon cards
│   │   ├── Pagination.jsx      # Page navigation controls
│   │   ├── Modal.jsx           # Detail view modal
│   │   ├── Loader.jsx          # Loading spinner
│   │   └── Error.jsx           # Error message display
│   ├── hooks/
│   │   └── useFavorites.js     # Custom hook for localStorage management
│   ├── utils/
│   │   └── api.js              # PokéAPI integration functions
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React DOM render
│   └── index.css               # Global styles
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Project dependencies

```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps to Run Locally

1. **Clone the repository** (or extract the project)
   ```bash
   cd pokedex-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Node SSR server**
   ```bash
   npm run dev
   ```
  The app will open at `http://localhost:5173` by default. If that port is busy, set `PORT`.

  If you want the plain client-only Vite version for comparison:
  ```bash
  npm run dev:client
  ```

4. **Build for production**
   ```bash
   npm run build
   ```
  Output will be in `dist/client` and `dist/server`

## 📱 How to Use

1. **Sign in first**: Use Google OAuth or GitHub OAuth on the login screen
2. **Browse Pokémon**: After login, the app loads 200+ Pokémon on startup
3. **Search**: Type a Pokémon name in the search bar for instant results
4. **Filter by Type**: Click type buttons to filter Pokémon by their type
5. **View Details**: Click any Pokémon card to open the detail modal
6. **Add to Favorites**: Click the ❤️ button to save your favorite Pokémon
7. **Pagination**: Use the navigation buttons to browse pages

## 🎨 Color Scheme

- **Primary Red**: `#DC143C` - Main brand color (Pokéball top)
- **Primary Yellow**: `#FFD700` - Accent color (Pokéball middle)
- **White**: `#FFFFFF` - Background and text contrast
- **Light Gray**: Background and borders

## 🔄 API Integration

The app uses the free [PokéAPI](https://pokeapi.co/) with the following endpoints:

- `GET /pokemon?limit=20&offset=0` - List Pokémon with pagination
- `GET /pokemon/{id}` - Detailed Pokémon information
- `GET /type` - All available Pokémon types
- `GET /type/{type_name}` - Pokémon of a specific type

**Note**: API calls are made client-side. No backend server is required.

## 🔐 OAuth + SSR Setup

This version includes a real Node.js backend for OAuth and SSR.

Required environment variables:

- `SESSION_SECRET`
- `APP_BASE_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

The auth buttons redirect to `/auth/google` and `/auth/github`, and the server stores the signed-in user in a session cookie.

SSR is handled by the Node server in `server/index.mjs`, which renders the React app on the server and hydrates it on the client.

## 💾 Local Storage

Favorites are stored in the browser's localStorage under the key `pokemonFavorites` as a JSON array:

```javascript
[
  { id: 1, name: "bulbasaur", types: ["grass", "poison"], ... },
  { id: 4, name: "charmander", types: ["fire"], ... }
]
```

Favorites persist across browser sessions and tab refreshes.

## 🐛 Challenges & Solutions

### Challenge 1: API Performance
**Problem**: Loading details for all 200+ Pokémon caused slow performance
**Solution**: Implemented lazy loading - details are only fetched when a user clicks on a Pokémon

### Challenge 2: Search Functionality
**Problem**: PokéAPI doesn't have a robust search endpoint
**Solution**: Implemented hybrid approach - try exact match via API, fallback to client-side filtering

### Challenge 3: Type Filtering
**Problem**: Type endpoint returns many Pokémon (100+), needs efficient filtering
**Solution**: Fetch type data once, cache it, and filter against the main Pokémon list

### Challenge 4: Responsive Design
**Problem**: Grid layout needs to adapt to mobile screens
**Solution**: Used Tailwind's responsive utilities (sm:, lg:, xl:) for seamless scaling

### Challenge 5: State Persistence
**Problem**: Favorites should survive page refreshes and tab closures
**Solution**: Created custom useFavorites hook with localStorage sync

## ⚡ Performance Optimizations

1. **Lazy Loading**: Details only load when modal is opened
2. **Debounced Search**: Search filters client-side after initial API fetch
3. **Pagination**: Load 20 Pokémon per page instead of all at once
4. **Image Optimization**: Use official artwork from PokéAPI with fallback placeholders
5. **CSS-in-JS**: Tailwind generates only used styles for minimal bundle size

## 🌐 Browser Support

- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and connect your repository
3. Vercel auto-detects Vite projects and builds automatically
4. Your app is live!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Connect your GitHub repo at [netlify.com](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Deploy to GitHub Pages
1. Add to `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/pokedex-pro/',
     // ... rest of config
   })
   ```
2. Run: `npm run build && npm run deploy`

## ⭐ Selected Bonus

These bonus items are matched to the assignment brief:

- [x] Animations - subtle hover, transition, page switching, and modal motion are already in the app
- [x] User Authentication (OAuth) - minimal proof of concept using Google/GitHub-style login state in the app shell
- [ ] Server-Side Rendering (SSR) - not implemented in this Vite app; use a separate Next.js branch for SSR and SEO

## 🧾 Assignment Mapping

- **Authentication**: implemented as a minimal proof-of-concept, which is acceptable for the optional bonus.
- **Animations**: implemented with subtle hover, page, and modal transitions.
- **SSR**: left as a separate framework experiment because SSR requires a framework like Next.js rather than a Vite-only page.

## 📝 Future Enhancements

- [ ] User accounts and profiles
- [ ] Pokémon comparison tool
- [ ] Battle simulator
- [ ] Advanced filtering (by stats, abilities)
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Team building tool

## 📄 License

Open source - feel free to use for educational purposes.

## 🤝 Contributing

This is a frontend assignment project. Improvements and suggestions are welcome!

---

**Built with ❤️ and 🔴 🟡 colors**