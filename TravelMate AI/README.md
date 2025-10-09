# TravelMate AI 🌍✈️

A modern, AI-powered travel companion application built with React, Vite, and Tailwind CSS. TravelMate AI helps users plan their trips, discover destinations, and get personalized travel recommendations through an intelligent chat interface.

## 🚀 Live Demo

**[🌐 Experience TravelMate AI Live →](https://travel-mate-ai-ed357304.base44.app)**

*Try the AI-powered travel companion with intelligent chat interface, trip planning, and personalized recommendations.*

## 🚀 Features

- **AI-Powered Chat Interface**: Interactive chat with intelligent travel recommendations
- **Trip Planning**: Comprehensive trip planning with itinerary management
- **Destination Discovery**: Explore destinations with detailed information and suggestions
- **Route Management**: Plan and manage travel routes with real-time updates
- **Responsive Design**: Modern, mobile-first design with Tailwind CSS
- **Real-time Interactions**: Smooth animations with Framer Motion
- **File Upload Support**: Upload documents and images for travel planning

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Development**: Hot Module Replacement (HMR)

## 📁 Project Structure

```
TravelMate AI/
├── public/
│   └── vite.svg
├── src/
│   ├── Components/
│   │   ├── chat/
│   │   │   ├── ChatWidget.js         # Main chat interface
│   │   │   └── MessageBubble.js      # Individual message components
│   │   ├── ui/
│   │   │   ├── Avatar.js             # User avatar component
│   │   │   ├── Button.js             # Reusable button component
│   │   │   ├── Card.js               # Card layout component
│   │   │   └── Input.js              # Input field component
│   │   └── layout/
│   │       ├── Header.js             # Application header
│   │       └── Footer.js             # Application footer
│   ├── Pages/
│   │   ├── Home.js                   # Landing page
│   │   ├── Trip.js                   # Trip planning page
│   │   ├── Routes.js                 # Route management page
│   │   └── About.js                  # About page
│   ├── integrations/
│   │   └── Core.js                   # Core integration functions
│   ├── agents/
│   │   └── index.js                  # AI agent SDK
│   ├── Entities/
│   │   └── Route.js                  # Route data models
│   ├── App.js                        # Main application component
│   ├── index.js                      # Application entry point
│   └── index.css                     # Global styles
├── package.json                      # Dependencies and scripts
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
└── README.md                         # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "TravelMate AI"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎨 Key Components

### Chat Interface
- **ChatWidget**: Main chat interface with message history and input
- **MessageBubble**: Individual message components with user/bot differentiation
- **File Upload**: Support for uploading travel documents and images

### UI Components
- **Avatar**: User profile pictures with fallback initials
- **Button**: Customizable buttons with multiple variants
- **Card**: Content containers with consistent styling
- **Input**: Form input fields with validation support

### Pages
- **Home**: Landing page with hero section and testimonials
- **Trip**: Trip planning interface with itinerary management
- **Routes**: Route planning and management
- **About**: Information about the application

## 🔧 Configuration

### Vite Configuration
The project uses Vite with React plugin and path aliases:
- `@/` maps to `src/` directory for clean imports
- Hot Module Replacement enabled for fast development

### Tailwind CSS
Custom Tailwind configuration with:
- Custom color palette for travel themes
- Responsive breakpoints
- Animation utilities

### PostCSS
Configured with Tailwind CSS and Autoprefixer for optimal CSS processing.

## 🌟 Features in Detail

### AI Chat Interface
- Real-time messaging with AI travel assistant
- Message history persistence
- File attachment support
- Copy message functionality
- Typing indicators

### Trip Planning
- Interactive itinerary builder
- Destination recommendations
- Budget planning tools
- Weather integration
- Local attractions discovery

### Route Management
- Interactive route planning
- Multiple transportation options
- Real-time traffic updates
- Waypoint management
- Distance and time calculations

## 🎯 Development Guidelines

### Code Style
- Use ES6+ syntax and modern React patterns
- Implement responsive design with Tailwind CSS
- Follow component-based architecture
- Use proper file extensions (.js, .jsx) for ES modules

### File Naming
- Components use PascalCase (e.g., `ChatWidget.js`)
- Pages use PascalCase (e.g., `Home.js`)
- Utilities use camelCase
- Constants use UPPER_SNAKE_CASE

### Import Standards
- Use explicit file extensions for local imports
- Utilize path aliases (@/) for cleaner imports
- Group imports: external libraries, internal components, relative imports

## 🐛 Troubleshooting

### Common Issues

1. **White Screen / Build Errors**:
   - Clear Vite cache: `rm -rf node_modules/.vite`
   - Restart development server: `npm run dev`

2. **PostCSS Plugin Errors**:
   - Ensure `@tailwindcss/postcss` is installed
   - Check PostCSS configuration syntax

3. **Module Resolution Issues**:
   - Verify file extensions in imports
   - Check path aliases in `vite.config.js`

### Cache Clearing
If you encounter persistent issues:
```bash
# Stop development server
# Clear cache
rm -rf node_modules/.vite
# Restart
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for lightning-fast development experience
- Tailwind CSS for utility-first styling
- Lucide for beautiful icons
- Framer Motion for smooth animations

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the project documentation

---

**Happy Traveling with TravelMate AI! 🌍✈️**