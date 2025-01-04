// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useState, useEffect } from 'react';
import axios from '../../api';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle, FaAddressCard, FaQuestionCircle } from 'react-icons/fa';
import Modal from 'react-modal';

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false);
  const [modalEnderecoAberto, setModalEnderecoAberto] = useState(false);
  const [tooltipAberto, setTooltipAberto] = useState(false);

  useEffect(() => {
    axios.get('/clientes')
    .then((response) => {
      setClientes(response.data);
    }).catch((error) => {
      console.error("Erro ao carregar clientes.", error);
    });
  }, []);

  const abrirModal = (cliente) => {
    setClienteSelecionado(cliente);
    setModalAberto(true);
  }

  const fecharModal = () => {
    setClienteSelecionado(null);
    setModalAberto(false);
  }

  const abrirModalEndereco = (cliente) => {
    setClienteSelecionado(cliente);
    setModalEnderecoAberto(true);
  }

  const fecharModalEndereco = () => {
    setClienteSelecionado(null);
    setModalEnderecoAberto(false);
  }

  const abrirModalSucesso = () => {
    setModalSucessoAberto(true);
    setTimeout(() => setModalSucessoAberto(false), 2000);
  }   

  const removerCliente = () => {
    axios.delete(`/clientes/${clienteSelecionado.id}`)
    .then(() => {
      setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== clienteSelecionado.id));
      fecharModal();
      abrirModalSucesso();
    }).catch((error) => {
      console.error("Erro ao excluir cliente.", error);
    });
  }

  const toggleTooltip = () => {
    setTooltipAberto(!tooltipAberto);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4" style={{ position: 'relative'}}>Lista de Clientes
        <FaQuestionCircle
          className='tooltip-icon'
          onMouseEnter={toggleTooltip}
          onMouseLeave={toggleTooltip}
        />
        {tooltipAberto && (<div className='tooltip'>
          Aqui você pode visualizar, editar e excluir os clientes cadastrados no sistema.
        </div>)}
      </h2>
      <Link to="/add-clientes" className="btn btn-primary mb-2">
        <FaPlus className="icon"/> Adicionar Cliente
      </Link>

      <table className="table">
        <thead>
          <th>Nome:</th>
          <th>CPF:</th>
          <th>Email:</th>
          <th>Ações:</th>
        </thead>
        <tbody>
          {
            clientes.map(cliente => {
              return(
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf}</td>
                  <td>{cliente.email}</td>
                  <td>
                    <button onClick={() => abrirModalEndereco(cliente)} className="btn btn-sm btn-primary">
                      <FaAddressCard className="icon icon-btn"/> Info.
                    </button>
                    <Link to={`/edit-clientes/${cliente.id}`} className="btn btn-sm btn-warning">
                      <FaEdit className="icon icon-btn"/> Editar
                    </Link>
                    <button onClick={() => abrirModal(cliente)} className="btn btn-sm btn-danger">
                      <FaTrash className="icon icon-btn"/> Excluir
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>

      <Modal
        isOpen={modalAberto}
        onRequestClose={fecharModal}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modalContent">
          <FaExclamationTriangle className="icon"/>
            <h2>Confirmar Exclusão</h2>
              <p>
                Tem certeza que deseja excluir o fornecedor 
                <br />  
                {clienteSelecionado && clienteSelecionado.nome}?
              </p>
              <div className="modalButtons">
                <button onClick={fecharModal} className="btn btn-secondary">Cancelar</button>
                <button onClick={removerCliente} className="btn btn-danger">Excluir</button>
              </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalEnderecoAberto}
        onRequestClose={fecharModalEndereco}
        className="modal"
        overlayClassName="overlay"
        style={{content: {
          width: '50%', 
          maxWidth: '500px',
          textAlign: 'left'
        }}}
      >
        <div className='modalContent'>
          <h2>Endereço</h2>
          <div>
            <p>
              <strong>Logradouro:</strong> {clienteSelecionado && clienteSelecionado.rua}
              <strong> Número:</strong> {clienteSelecionado && clienteSelecionado.numero}
            </p>
            <p>
              <strong>Bairro:</strong> {clienteSelecionado && clienteSelecionado.bairro}
              <strong> Cidade:</strong> {clienteSelecionado && clienteSelecionado.cidade}
            </p>
            <p>
              <strong>Estado:</strong> {clienteSelecionado && clienteSelecionado.estado}
              <strong> CEP:</strong> {clienteSelecionado && clienteSelecionado.cep}
            </p>
            <p>
              <strong>País:</strong> {clienteSelecionado && clienteSelecionado.pais}
            </p>
          </div>
          <div className='modalButtons' style={{justifyContent: 'right'}}>
            <button onClick={fecharModalEndereco} className='btn btn-secondary'>Fechar</button> 
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalSucessoAberto}
        onRequestClose={() => setModalSucessoAberto(false)}
        className="modal"
        verlayClassName="overlay"
      >
        <div className="modalContent">
          <FaCheckCircle className="icon successIcon"/>
          <h2>Cliente excluído com sucesso!</h2>
        </div>
      </Modal>
    </div>
  )
}

export default ClienteList