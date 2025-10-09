import { Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout.js'
import Home from './Pages/Home.js'
// import Chat from './Pages/Chat.js'
// import RoutesPage from './Pages/Routes.js'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-3xl font-bold text-purple-700 mb-4">Chat Page</h2>
              <p className="text-lg text-gray-600">AI Assistant coming soon...</p>
            </div>
          </div>
        } />
        <Route path="/routes" element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-3xl font-bold text-red-700 mb-4">Routes Page</h2>
              <p className="text-lg text-gray-600">Route finder coming soon...</p>
            </div>
          </div>
        } />
      </Routes>
    </Layout>
  )
}

export default App
