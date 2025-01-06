// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api'
import { FaQuestionCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import Modal from 'react-modal'

const ProdutoForm = () => {
  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    descricao: '',
    quantidadeEstoque: 0,
  })
  const [tooltipAberto, setTooltipAberto] = useState(false);
  const [mensagensError, setMensagensError] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalErroAberto, setModalErroAberto] = useState(false);

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      axios.get(`/produto/${id}`).then(response => {
        setProduto(response.data)
      })
    } else {
      setProduto({
        nome: '',
        preco: '',
        descricao: '',
        quantidadeEstoque: 0,
      })
    }
  }, [id])

  const toogleTooltip = () => {
    setTooltipAberto(!tooltipAberto)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setMensagensError([])

    const request = id ? axios.put(`/produtos/${id}`, produto) : axios.post('/produtos', produto)

    request.then(() => setModalAberto(true))
      .catch(error => {
        if (error.response && error.response.status === 500) {
          setMensagensError(["Erro no sistema, entre em contato com o suporte."])
          setModalErroAberto(true)
        } else if (error.response && error.response.data) {
          setMensagensError(Object.values(error.response.data))
          setModalErroAberto(true)
        } else {
          console.error("Erro ao salvar o produto: ", error)
          setMensagensError(["Erro desconhecido, entre em contato com o suporte."])
          setModalErroAberto(true)
        }
      })
  }

  const fecharModal = () => {
    setModalAberto(false)
    navigate('/listar-produtos')
  }

  const fecharModalErro = () => {
    setModalErroAberto(false)
  }

  const adicionarOutroProduto = () => {
    setModalAberto(false)
    setProduto({
      nome: '',
      preco: '',
      descricao: '',
      quantidadeEstoque: 0,
    })
  }

  return (
    <div className='form-container'>
      <h2 style={{ position: 'relative' }}>
        {id ? 'Editar Produto' : 'Adicionar Produto'}
        {' '}
        <FaQuestionCircle
          className='tooltip-icon'
          onMouseEnter={toogleTooltip}
          onMouseLeave={toogleTooltip}
        />
        {tooltipAberto && (
          <div className='tooltip'>
            {
              id ? 'Nesta tela, você pode editar as informações de um produto existente.'
                : 'Nesta tela, você pode adicionar um novo produto ao sistema.'
            }
          </div>)}
      </h2>
      <form onSubmit={handleSubmit} className='produto-form'>
        <div className='form-group'>
          <label htmlFor='nome'>Nome do Produto:</label>
          <input
            type='text'
            className='form-control'
            id='nome'
            name='nome'
            value={produto.nome}
            onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='preco'>Preço:</label>
          <input 
            className='form-control'
            type='text'
            id='preco'
            name='preco'
            value={produto.preco}
            onChange={(e) => setProduto({ ...produto, preco: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='descricao'>Descrição:</label>
          <input
            type='text'
            className='form-control'
            id='descricao'
            name='descricao'
            value={produto.descricao}
            onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='quantidadeEstoque'>Quantidade em Estoque:</label>
          <input
            type='number'
            className='form-control'
            id='quantidadeEstoque'
            name='quantidadeEstoque'
            value={produto.quantidadeEstoque}
            onChange={(e) => setProduto({ ...produto, quantidadeEstoque: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
          {id ? 'Editar Produto' : 'Adicionar Produto'}
        </button>
      </form>

      {/* Modal de sucesso */}
      <Modal
        isOpen={modalAberto}
        onRequestClose={fecharModal}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modalContent">
          <FaCheckCircle className="icon successIcon" />
          <h2>{id ? 'Produto atualizado com sucesso' : 'Produto adicionado com sucesso'}</h2>
          <div className="modalButtons">
            <button onClick={fecharModal} className="btn btn-secondary">Fechar</button>
            {!id && (<button onClick={adicionarOutroProduto} className="btn btn-success">Adicionar outro</button>)}
          </div>
        </div>
      </Modal>

      {/* Modal de erro */}
      <Modal
        isOpen={modalErroAberto}
        onRequestClose={fecharModalErro}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modalContent">
          <FaExclamationTriangle className="icon errorIcon" />
          <h2>Ocorreu um ou mais erros: </h2>
          {
            mensagensError.map((mensagem, index) => (
              <p key={index}>{mensagem}</p>
            ))
          }
          <br />
          <button onClick={fecharModalErro} className="btn btn-secondary">Fechar</button>
        </div>
      </Modal>
    </div>
  )
}

export default ProdutoForm