// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import './Login.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ADMIN'
  })

  const [erro, setErro] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(null)
    const body = JSON.stringify(formData)

    const request = api.post('/auth/register', body)
    request
      .then(() => {
        navigate('/login')
      })
      .catch((error) => {
        if (error.response) {
          setErro(error.response.data.message)
        } else {
          setErro('Ocorreu um erro ao registrar o usuário.')
        }
      })
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <img src="./PRODUCT-manager-logo.png" />
        <input
          type="text"
          placeholder="Usuário"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} style={{ marginBottom: '15px', borderRadius: '5px', padding: '5px', width: '100%', border: '1px solid #ccc' }}>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>
        {erro && <p className="error-message">{erro}</p>}
        <button type="submit">Registrar</button>
        <p style={{ marginTop: '10px', textAlign: 'center' }}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  )
}

export default Register