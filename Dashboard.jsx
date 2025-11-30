import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [updates, setUpdates] = useState([])
  const [newIssue, setNewIssue] = useState('')
  const [newUpdate, setNewUpdate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [editingIssue, setEditingIssue] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const savedIssues = JSON.parse(localStorage.getItem('civicconnect_issues') || '[]')
    const savedUpdates = JSON.parse(localStorage.getItem('civicconnect_updates') || '[]')
    setIssues(savedIssues)
    setUpdates(savedUpdates)
  }

  const saveData = (newIssues, newUpdates) => {
    if (newIssues) localStorage.setItem('civicconnect_issues', JSON.stringify(newIssues))
    if (newUpdates) localStorage.setItem('civicconnect_updates', JSON.stringify(newUpdates))
  }

  const submitIssue = async () => {
    if (!newIssue.trim()) return
    
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const issue = {
      id: Date.now(),
      text: newIssue,
      author: user.name,
      authorEmail: user.email,
      authorId: user.id,
      status: 'open',
      responses: [],
      createdAt: new Date().toISOString()
    }
    
    const updatedIssues = [...issues, issue]
    setIssues(updatedIssues)
    saveData(updatedIssues, null)
    setNewIssue('')
    setMessage('Issue submitted successfully!')
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const updateIssue = async (issueId, updatedText) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const updatedIssues = issues.map(issue => 
      issue.id === issueId ? { ...issue, text: updatedText } : issue
    )
    setIssues(updatedIssues)
    saveData(updatedIssues, null)
    setEditingIssue(null)
    setMessage('Issue updated successfully!')
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const deleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return
    
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const updatedIssues = issues.filter(issue => issue.id !== issueId)
    setIssues(updatedIssues)
    saveData(updatedIssues, null)
    setMessage('Issue deleted successfully!')
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const postUpdate = async () => {
    if (!newUpdate.trim()) return
    
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const update = {
      id: Date.now(),
      text: newUpdate,
      author: user.name,
      authorEmail: user.email,
      authorRole: user.role,
      authorId: user.id,
      timestamp: new Date().toLocaleString()
    }
    
    const updatedUpdates = [...updates, update]
    setUpdates(updatedUpdates)
    saveData(null, updatedUpdates)
    setNewUpdate('')
    setMessage('Update posted successfully!')
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const respondToIssue = async (issueId, response) => {
    if (!response.trim()) return
    
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, responses: [...issue.responses, { text: response, author: user.name, authorEmail: user.email, timestamp: new Date().toLocaleString() }] }
        : issue
    )
    setIssues(updatedIssues)
    saveData(updatedIssues, null)
    setLoading(false)
  }

  const updateIssueStatus = async (issueId, status) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const updatedIssues = issues.map(issue => 
      issue.id === issueId ? { ...issue, status } : issue
    )
    setIssues(updatedIssues)
    saveData(updatedIssues, null)
    setLoading(false)
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>CivicConnect Dashboard</h1>
        <div className="user-info">
          <span className="user-badge">{user.name} ({user.role})</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      {message && <div className="success-message">{message}</div>}

      <main className="dashboard-main">
        {user.role === 'citizen' && (
          <section className="citizen-panel">
            <h2>Report an Issue</h2>
            <div className="form-group">
              <textarea 
                value={newIssue} 
                onChange={(e) => setNewIssue(e.target.value)}
                placeholder="Describe the issue you'd like to report..."
                rows="4"
              />
              <button onClick={submitIssue} disabled={loading || !newIssue.trim()}>
                {loading ? 'Submitting...' : 'Submit Issue'}
              </button>
            </div>
          </section>
        )}

        {(user.role === 'politician' || user.role === 'admin') && (
          <section className="politician-panel">
            <h2>Post Official Update</h2>
            <div className="form-group">
              <textarea 
                value={newUpdate} 
                onChange={(e) => setNewUpdate(e.target.value)}
                placeholder="Share an update with citizens..."
                rows="4"
              />
              <button onClick={postUpdate} disabled={loading || !newUpdate.trim()}>
                {loading ? 'Posting...' : 'Post Update'}
              </button>
            </div>
          </section>
        )}

        <section className="issues-section">
          <h2>Community Issues ({issues.length})</h2>
          <div className="issues-grid">
            {issues.map(issue => (
              <div key={issue.id} className="issue-card">
                <div className="issue-header">
                  <div className="issue-author-info">
                    <strong>{issue.author}</strong>
                    <span className="issue-email">{issue.authorEmail}</span>
                    <span className="timestamp">{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="issue-actions-header">
                    <span className={`status ${issue.status}`}>{issue.status}</span>
                    {(user.role === 'moderator' || user.role === 'admin') && (
                      <select 
                        onChange={(e) => updateIssueStatus(issue.id, e.target.value)} 
                        value={issue.status}
                        disabled={loading}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    )}
                  </div>
                </div>
                
                {editingIssue === issue.id ? (
                  <div className="edit-form">
                    <textarea 
                      defaultValue={issue.text}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          updateIssue(issue.id, e.target.value)
                        }
                      }}
                    />
                    <div className="edit-actions">
                      <button onClick={(e) => {
                        const textarea = e.target.parentElement.previousElementSibling
                        updateIssue(issue.id, textarea.value)
                      }}>Save</button>
                      <button onClick={() => setEditingIssue(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="issue-text">{issue.text}</p>
                )}
                
                {issue.responses.map((response, idx) => (
                  <div key={idx} className="response">
                    <div className="response-header">
                      <div className="response-author-info">
                        <strong>{response.author}</strong>
                        <span className="response-email">{response.authorEmail}</span>
                      </div>
                      <span className="response-time">{response.timestamp}</span>
                    </div>
                    <div className="response-text">{response.text}</div>
                  </div>
                ))}
                
                <div className="issue-actions">
                  {(user.role === 'politician' || user.role === 'moderator') && (
                    <input 
                      type="text" 
                      placeholder="Type your response..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          respondToIssue(issue.id, e.target.value)
                          e.target.value = ''
                        }
                      }}
                    />
                  )}
                  
                  {(user.id === issue.authorId || user.role === 'admin') && (
                    <div className="crud-actions">
                      <button onClick={() => setEditingIssue(issue.id)} className="edit-btn">Edit</button>
                      <button onClick={() => deleteIssue(issue.id)} className="delete-btn">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="updates-section">
          <h2>Official Updates ({updates.length})</h2>
          <div className="updates-grid">
            {updates.map(update => (
              <div key={update.id} className="update-card">
                <div className="update-header">
                  <div className="author-info">
                    <strong>{update.author}</strong>
                    <span className="author-role">({update.authorRole})</span>
                    <span className="author-email">{update.authorEmail}</span>
                  </div>
                  <span className="timestamp">{update.timestamp}</span>
                </div>
                <p>{update.text}</p>
              </div>
            ))}
          </div>
        </section>

        {user.role === 'admin' && (
          <section className="admin-panel">
            <h2>Platform Analytics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{issues.length}</h3>
                <p>Total Issues</p>
              </div>
              <div className="stat-card">
                <h3>{issues.filter(i => i.status === 'open').length}</h3>
                <p>Open Issues</p>
              </div>
              <div className="stat-card">
                <h3>{updates.length}</h3>
                <p>Official Updates</p>
              </div>
              <div className="stat-card">
                <h3>{issues.reduce((acc, issue) => acc + issue.responses.length, 0)}</h3>
                <p>Total Responses</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Dashboard