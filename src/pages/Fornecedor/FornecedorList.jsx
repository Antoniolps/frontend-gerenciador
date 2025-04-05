// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useState, useEffect } from 'react';
import axios from '../../api';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle, FaQuestionCircle, FaAddressCard } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import Modal from 'react-modal';

const FornecedorList = () => {
    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalSucessoAberto, setModalSucessoAberto] = useState(false);
    const [modalEnderecoAberto, setModalEnderecoAberto] = useState(false);
    const [tooltipAberto, setTooltipAberto] = useState(false);

    useEffect(() => {
        axios.get('/fornecedores')
            .then((response) => {
                setFornecedores(response.data);
            }).catch((error) => {
                console.error("Erro ao carregar fornecedores.", error);
            });
    }, []);

    const abrirModal = (fornecedor) => {
        setFornecedorSelecionado(fornecedor);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setFornecedorSelecionado(null);
        setModalAberto(false);
    };

    const abrirModalEndereco = (fornecedor) => {
        setFornecedorSelecionado(fornecedor);
        setModalEnderecoAberto(true);
    }

    const fecharModalEndereco = () => {
        setFornecedorSelecionado(null);
        setModalEnderecoAberto(false);
    }

    const abrirModalSucesso = () => {
        setModalSucessoAberto(true);
        setTimeout(() => setModalSucessoAberto(false), 2000);
    };

    const removerFornecedor = () => {
        axios.delete(`/fornecedores/${fornecedorSelecionado.id}`)
            .then(() => {
                setFornecedores(prevFornecedores => prevFornecedores.filter(fornecedor => fornecedor.id !== fornecedorSelecionado.id));
                fecharModal();
                abrirModalSucesso();
            }).catch((error) => {
                console.error("Erro ao excluir fornecedor.", error);
            });
    };

    const toggleTooltip = () => {
        setTooltipAberto(!tooltipAberto);
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4" style={{ position: 'relative' }}>Lista de Fornecedores
                <FaQuestionCircle
                    className='tooltip-icon'
                    onMouseEnter={toggleTooltip}
                    onMouseLeave={toggleTooltip}
                />
                {tooltipAberto && (<div className='tooltip'>
                    Aqui você pode visualizar, editar e excluir os fornecedores cadastrados no sistema.
                </div>)}
            </h2>
            <Link to="/add-fornecedores" className="btn btn-primary mb-2">
                <FaPlus className="icon" /> Adicionar Fornecedor
            </Link>

            <table className="table">
                <thead>
                    <th>Nome:</th>
                    <th>Email:</th>
                    <th>CNPJ:</th>
                    <th>Tipo:</th>
                    <th>Ações:</th>
                </thead>
                <tbody>
                    {
                        fornecedores.map((fornecedor) => {
                            return (
                                <tr key={fornecedor.id}>
                                    <td>{fornecedor.nome}</td>
                                    <td>{fornecedor.email}</td>
                                    <td>{fornecedor.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}</td>
                                    <td>{fornecedor.tipoFornecedor}</td>
                                    <td>
                                        <button onClick={() => abrirModalEndereco(fornecedor)} className="btn btn-sm btn-primary">
                                            <FaAddressCard className="icon icon-btn" /> Info.
                                        </button>
                                        <Link to={`/edit-fornecedores/${fornecedor.id}`} className="btn btn-sm btn-warning">
                                            <FaEdit className="icon icon-btn" /> Editar
                                        </Link>
                                        <button className="btn btn-sm btn-danger" onClick={() => { abrirModal(fornecedor) }}>
                                            <FaTrash className="icon icon-btn" /> Excluir
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
                    <FaExclamationTriangle className="icon" />
                    <h2>Confirmar Exclusão</h2>
                    <p>
                        Tem certeza que deseja excluir o fornecedor
                        <br />
                        {fornecedorSelecionado && fornecedorSelecionado.nome}?
                    </p>
                    <div className="modalButtons">
                        <button onClick={fecharModal} className="btn btn-secondary">Cancelar</button>
                        <button onClick={removerFornecedor} className="btn btn-danger">Excluir</button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modalEnderecoAberto}
                onRequestClose={fecharModalEndereco}
                className="modal"
                overlayClassName="overlay"
                style={{
                    content: {
                        width: '50%',
                        maxWidth: '500px',
                        textAlign: 'left'
                    }
                }}
            >
                <div className='modalContent'>
                    <FaLocationDot className="icon"/>
                    <h2>Endereço</h2>
                    <div style={{ textAlign: 'center' }}>
                        <p>
                            <strong>Logradouro:</strong> <br />{fornecedorSelecionado && fornecedorSelecionado.endereco.logradouro}
                        </p>
                        <p>
                        <strong>CEP:</strong> {fornecedorSelecionado && fornecedorSelecionado.endereco.cep}
                            <strong>  Número:</strong> {fornecedorSelecionado && fornecedorSelecionado.endereco.numero}
                            <strong>  Complemento:</strong> {fornecedorSelecionado && fornecedorSelecionado.endereco.complemento}
                        </p>
                        <p>
                            <strong>Bairro:</strong> {fornecedorSelecionado && fornecedorSelecionado.endereco.bairro}
                            <strong>  Cidade:</strong> {fornecedorSelecionado && fornecedorSelecionado.endereco.cidade}
                        </p>
                        <p>
                            <strong>Estado:</strong> {fornecedorSelecionado && fornecedorSelecionado.endereco.estado}
                            <strong>  País:</strong> {fornecedorSelecionado && fornecedorSelecionado.endereco.pais}
                        </p>
                    </div>
                    <div className='modalButtons' style={{ justifyContent: 'right' }}>
                        <button onClick={fecharModalEndereco} className='btn btn-secondary'>Fechar</button>
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
                    <FaCheckCircle className="icon successIcon" />
                    <h2>Fornecedor excluído com sucesso!</h2>
                </div>
            </Modal>
        </div>
    )
}

export default FornecedorList