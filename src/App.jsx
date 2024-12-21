// eslint-disable-next-line no-unused-vars
import React from 'react'
import FornecedorList from './pages/Fornecedor/FornecedorList'
import ClienteList from './pages/Cliente/ClienteList'
import { BrowserRouter } from 'react-router-dom'
import ProdutoList from './pages/Produto/ProdutoList'

const App = () => {
  return (
    <BrowserRouter>
      <FornecedorList />
      <ClienteList />
      <ProdutoList />
    </BrowserRouter>
  )
}

export default App