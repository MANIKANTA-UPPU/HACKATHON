import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>CivicConnect</h1>
          <p>Bridging the gap between citizens and their elected representatives</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-primary">Get Started</Link>
            <Link to="/login" className="cta-secondary">Sign In</Link>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🏛️ For Politicians</h3>
            <p>Engage directly with constituents and share important updates</p>
          </div>
          <div className="feature-card">
            <h3>👥 For Citizens</h3>
            <p>Report issues and communicate with your representatives</p>
          </div>
          <div className="feature-card">
            <h3>⚖️ For Moderators</h3>
            <p>Ensure respectful dialogue and manage community discussions</p>
          </div>
          <div className="feature-card">
            <h3>📊 For Admins</h3>
            <p>Oversee platform operations and monitor engagement</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage