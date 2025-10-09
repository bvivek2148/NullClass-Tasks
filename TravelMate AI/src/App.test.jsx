import { Routes, Route } from 'react-router-dom'

function TestApp() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1>Test App is Working!</h1>
      <p>If you can see this, React is working correctly.</p>
      <Routes>
        <Route path="/" element={<div>Home Route Working</div>} />
      </Routes>
    </div>
  )
}

export default TestApp