// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useState, useEffect } from 'react';
import axios from '../../api';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Modal from 'react-modal';

const ProdutoList = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false);

  useEffect(() => {
    axios.get('/produtos')
    .then((response) => {
      setProdutos(response.data);
    }).catch((error) => {
      console.error("Erro ao carregar produtos.", error);
    });
  },[]);

  const abrirModal = (fornecedor) => {
    setProdutoSelecionado(fornecedor);
    setModalAberto(true);
  };

  const fecharModal = () => {
      setProdutoSelecionado(null);
      setModalAberto(false);
  };

  const abrirModalSucesso = () => {
      setModalSucessoAberto(true);
      setTimeout(() => setModalSucessoAberto(false), 2000);
  };

  const removerProduto = () => {
    axios.delete(`/produtos/${produtoSelecionado.id}`)
    .then(() => {
      setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== produtoSelecionado.id));
      fecharModal();
      abrirModalSucesso();
    }).catch((error) => {
      console.error("Erro ao excluir produto.", error);
    });
  };



  return (
    <div className="container mt-5">
      <h2 className="mb-4" style={{position: "relative"}}>Lista de Fornecedores</h2>
      <Link to="/add-produtos" className="btn btn-primary mb-2">
        <FaPlus className="icon"/> Adicionar Produto
      </Link>
      <table className="table">
        <thead>
          <th>Nome:</th>
          <th>Descrição:</th>
          <th>Preço:</th>
          <th>Quantidade:</th>
          <th>Ações:</th>
        </thead>
        <tbody>
          {
            produtos.map((produto) => {
              return (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>{"R$ " + produto.preco}</td>
                  <td>{produto.quantidadeEstoque}</td>
                  <td>
                    <Link to={`/edit-produtos/${produto.id}`} className="btn btn-sm btn-warning">
                      <FaEdit className="icon icon-btn"/> Editar
                    </Link>
                    <button onClick={() => abrirModal(produto)} className="btn btn-sm btn-danger">
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
                {produtoSelecionado && produtoSelecionado.nome}?
              </p>
              <div className="modalButtons">
                <button onClick={fecharModal} className="btn btn-secondary">Cancelar</button>
                <button onClick={removerProduto} className="btn btn-danger">Excluir</button>
              </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalSucessoAberto}
        onRequestClose={() => setModalSucessoAberto(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modalContent">
          <FaCheckCircle className="icon successIcon"/>
          <h2>Produto excluído com sucesso!</h2>
        </div>
      </Modal>
    </div>
  )
}

export default ProdutoList