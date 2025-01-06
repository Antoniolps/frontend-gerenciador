// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api'
import { FaQuestionCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import InputMask from 'react-input-mask'
import Modal from 'react-modal'

const ClienteForm = () => {
  const [cliente, setCliente] = useState({
    nome: '',
    cpf: '',
    email: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil' //País inicial
    },
  })
  const [tooltipAberto, setTooltipAberto] = useState(false);
  const [mensagensError, setMensagensError] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalErroAberto, setModalErroAberto] = useState(false);

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      axios.get(`/clientes/${id}`)
        .then(response => {
          setCliente(response.data)
        })
        .catch(error => {
          console.error("Ocorreu um erro: ", error)
        })
    } else {
      // Se não houver id, redefine o estado para adicionar um novo cliente
      setCliente({
        nome: '',
        cpf: '',
        email: '',
        endereco: {
          cep: '',
          logradouro: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
          pais: 'Brasil' //País inicial
        }
      })
    }
  }, [id])

  const toogleTooltip = () => {
    setTooltipAberto(!tooltipAberto)
  }

  const handleCepChange = (e) => {
    const cep = e.target.value.replace(/[^0-9]/g, '')

    setCliente({
      ...cliente,
      endereco: { ...cliente.endereco, cep: e.target.value }
    })

    if (cep.length !== 8) {
      return
    }

    axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => {
        if (!response.data.erro) {
          setCliente(prevCliente => ({
            ...prevCliente,
            endereco: {
              ...prevCliente.endereco,
              logradouro: response.data.logradouro,
              bairro: response.data.bairro,
              cidade: response.data.localidade,
              estado: response.data.uf
            }
          }))
        }
      })
      .catch(error => {
        console.error("Erro ao buscar CEP: ", error)
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setMensagensError([])

    const clienteData = {
      ...cliente,
      cpf: cliente.cpf.replace(/[^\d]/g, ''),
    }

    const request = id ? axios.put(`/clientes/${id}`, clienteData) : axios.post('/clientes', clienteData)

    request.then(() => setModalAberto(true))
      .catch(error => {
        if (error.response && error.response.status === 500) {
          setMensagensError(["Erro no sistema, entre em contato com o suporte."])
          setModalErroAberto(true)
        } else if (error.response && error.response.data) {
          setMensagensError(Object.values(error.response.data))
          setModalErroAberto(true)
        } else {
          console.error("Erro ao salvar cliente: ", error)
          setMensagensError(["Erro desconhecido, entre em contato com o suporte."])
          setModalErroAberto(true)
        }
      })
  }

  const fecharModal = () => {
    setModalAberto(false)
    navigate('/listar-clientes')
  }

  const fecharModalErro = () => {
    setModalErroAberto(false)
  }

  const adicionarOutroCliente = () => {
    setModalAberto(false)
    setCliente({
      nome: '',
      cpf: '',
      email: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: 'Brasil' //País inicial
      }
    })
  }

  return (
    <div className='form-container'>
      <h2 style={{ position: 'relative' }}>
        {id ? 'Editar Cliente' : 'Adicionar Cliente'}
        {' '}
        <FaQuestionCircle
          className='tooltip-icon'
          onMouseEnter={toogleTooltip}
          onMouseLeave={toogleTooltip}
        />
        {tooltipAberto && (
          <div className='tooltip'>
            {
              id ? 'Nesta tela, você pode editar as informações de um cliente existente.'
                : 'Nesta tela, você pode adicionar um novo cliente ao sistema.'
            }
          </div>)}
      </h2>
      <form onSubmit={handleSubmit} className='cliente-form'>
        <div className='form-group'>
          <label htmlFor='nome'>Nome:</label>
          <input
            type='text'
            className='form-control'
            id='nome'
            name='nome'
            value={cliente.nome}
            onChange={e => setCliente({ ...cliente, nome: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='cpf'>CPF:</label>
          <InputMask
            mask="999.999.999-99"
            className='form-control'
            id='cpf'
            name='cpf'
            value={cliente.cpf}
            onChange={e => setCliente({ ...cliente, cpf: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>E-mail:</label>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={cliente.email}
            onChange={e => setCliente({ ...cliente, email: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='cep'>CEP:</label>
          <input
            type='text'
            className='form-control'
            id='cep'
            name='cep'
            value={cliente.endereco.cep}
            onChange={handleCepChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='logradouro'>Logradouro:</label>
          <input
            type='text'
            className='form-control'
            id='logradouro'
            name='logradouro'
            value={cliente.endereco.logradouro}
            onChange={e => setCliente({
              ...cliente,
              endereco: { ...cliente.endereco, logradouro: e.target.value }
            })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='numero'>Número:</label>
          <input
            type='text'
            className='form-control'
            id='numero'
            name='numero'
            value={cliente.endereco.numero}
            onChange={e => setCliente({
              ...cliente,
              endereco: { ...cliente.endereco, numero: e.target.value }
            })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='bairro'>Bairro:</label>
          <input
            type='text'
            className='form-control'
            id='bairro'
            name='bairro'
            value={cliente.endereco.bairro}
            onChange={e => setCliente({
              ...cliente,
              endereco: { ...cliente.endereco, bairro: e.target.value }
            })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='cidade'>Cidade:</label>
          <input
            type='text'
            className='form-control'
            id='cidade'
            name='cidade'
            value={cliente.endereco.cidade}
            onChange={e => setCliente({
              ...cliente,
              endereco: { ...cliente.endereco, cidade: e.target.value }
            })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='estado'>Estado:</label>
          <input
            type='text'
            className='form-control'
            id='estado'
            name='estado'
            value={cliente.endereco.estado}
            onChange={e => setCliente({
              ...cliente,
              endereco: { ...cliente.endereco, estado: e.target.value }
            })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='pais'>País:</label>
          <input
            type="text"
            className="form-control"
            id="pais"
            name="pais"
            value={cliente.endereco.pais}
            onChange={e => setCliente({
              ...cliente,
              endereco: { ...cliente.endereco, pais: e.target.value }
            })}
            required
          />
        </div>
        <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
          {id ? 'Editar Cliente' : 'Adicionar Cliente'}
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
          <h2>{id ? 'Cliente atualizado com sucesso' : 'Cliente adicionado com sucesso'}</h2>
          <div className="modalButtons">
            <button onClick={fecharModal} className="btn btn-secondary">Fechar</button>
            {!id && (<button onClick={adicionarOutroCliente} className="btn btn-success">Adicionar outro</button>)}
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

export default ClienteForm