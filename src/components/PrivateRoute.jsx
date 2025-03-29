// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {

    const  { usuario } = useContext(AuthContext);
  
    return usuario ? children : <Navigate to="/login" />
}

export default PrivateRoute