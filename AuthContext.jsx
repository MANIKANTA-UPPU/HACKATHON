import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('civicconnect_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const users = JSON.parse(localStorage.getItem('civicconnect_users') || '[]')
    
    if (users.length === 0) {
      setLoading(false)
      return { success: false, error: 'No registered users found. Please register first.' }
    }
    
    const userByEmail = users.find(u => u.email === credentials.email)
    
    if (!userByEmail) {
      setLoading(false)
      return { success: false, error: 'No account found with this email address.' }
    }
    
    if (userByEmail.password !== credentials.password) {
      setLoading(false)
      return { success: false, error: 'Incorrect password. Please try again.' }
    }
    
    const { password, ...userWithoutPassword } = userByEmail
    setUser(userWithoutPassword)
    localStorage.setItem('civicconnect_user', JSON.stringify(userWithoutPassword))
    setLoading(false)
    return { success: true }
  }

  const register = async (userData) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const users = JSON.parse(localStorage.getItem('civicconnect_users') || '[]')
    
    if (users.find(u => u.email === userData.email)) {
      setLoading(false)
      return { success: false, error: 'Email already exists' }
    }
    
    const newUser = { ...userData, id: Date.now() }
    users.push(newUser)
    localStorage.setItem('civicconnect_users', JSON.stringify(users))
    
    const { password, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('civicconnect_user', JSON.stringify(userWithoutPassword))
    setLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('civicconnect_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}