import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api' // usa o axios com baseURL do .env e interceptor automático

// 1. Criamos o Context: uma "caixa global" para guardar e compartilhar informações (como o token e o usuário logado)
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

// 2. Criamos o Provider: componente que envolve a aplicação e fornece os dados do Context para todos os filhos
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token')) // Pega token do localStorage ao carregar
  const [usuario, setUsuario] = useState(null) // Estado para armazenar dados do usuário logado
  const navigate = useNavigate() // Para redirecionar de forma programática

  // 3. Quando o token mudar, decodifica o token e define o usuário logado
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token) // Decodifica o token JWT para obter os dados do usuário
        setUsuario(decoded)
      } catch (err) {
        console.error("Token inválido", err)
        logout() // Se o token for inválido, faz logout automático
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Função para fazer login e armazenar o token
  const login = async (username, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.post('/auth/login', { username, password }) // ✅ usando api com baseURL e interceptor
      const data = response.data
      const novoToken = data.token

      localStorage.setItem('token', novoToken) // Salva o token no navegador
      setToken(novoToken)
      navigate('/') // Redireciona para a página inicial
    } catch (error) {
      throw error // Para o componente de login tratar
    }
  }

  // Função de logout: limpa o token e o usuário, e redireciona para login
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUsuario(null)
    navigate('/login')
  }

  // 4. O Provider torna o token, usuário e funções disponíveis para toda a aplicação
  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}