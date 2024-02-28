import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ToDo() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch('http://localhost:8080/gestortareasms/tareas')
      .then(response => response.json())
      .then(data => {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setDatos(data.data);
        } else {
          console.error('Los datos recibidos no son válidos:', data);
          setDatos([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleAdd = () => {
    setEditedData(null);
    const initialFormData = {};
    
    rows.forEach((item) => {
      console.log(item)
      if (item !== 'id') {
        initialFormData[item] = '';
      }
    });
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const editedRecord = datos.find(record => record.id === id);
    setEditedData(editedRecord);
    setFormData(editedRecord);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/gestortareasms/tareas/${id}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo eliminar el registro');
          }
          return response.json();
        })
        .then(() => {
          const updatedData = datos.filter(record => record.id !== id);
          setDatos(updatedData);
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        })
        .catch(error => {
          console.error('Error al eliminar el registro:', error);
          Swal.fire(
            'Error',
            'No se pudo eliminar el registro.',
            'error'
          );
        });
      }
    });
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = () => {
    const method = editedData ? 'PUT' : 'POST';
    const url = editedData ? 
     `http://localhost:8080/gestortareasms/tareas` :
     'http://localhost:8080/gestortareasms/tareas';
    
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo guardar el registro');
      }
      return response.json();
    })
    .then(() => {
      fetch('http://localhost:8080/gestortareasms/tareas')
        .then(response => response.json())
        .then(data => {
          if (data && Array.isArray(data.data) && data.data.length > 0) {
            setDatos(data.data);
          } else {
            console.error('Los datos recibidos no son válidos:', data);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
      setShowModal(false);
    })
    .catch(error => {
      console.error('Error al guardar el registro:', error);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const rows = ["titulo", "descripcion", "estado"];

  return (
    <>
      <h1 className=''>Tareas registradas</h1>
      <div className='divButtonAdd'>
        <Button variant="primary" onClick={handleAdd}>Agregar</Button>
      </div>
      <Table striped bordered hover className='border shadow rounded'>
        <thead>
        <tr>
          {rows.map((item, index) => (
              <th key={index}>{item.toUpperCase()}</th>
            ))}
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, index) => (
            <tr key={index}>
              {Object.keys(fila).filter(key => key !== 'id').map((key, index) => (
                <td key={index}>{fila[key]}</td>
              ))}
              <td>
                <div className='divButtonsAccion'>
                  <div className='div-button-accion-in'>
                    <Button variant="warning" onClick={() => handleEdit(fila.id)}>Editar</Button>
                  </div>
                  <div className='div-button-accion-in '>
                    <Button variant="danger" onClick={() => handleDelete(fila.id)}>Eliminar</Button>
                </div>
                </div>
              
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <Link to={"/"}>
          <button class="btn btn-outline-dark botton-g mt-5">Salir</button>
        </Link>
      </div>
      <br/>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editedData ? 'Editar Registro' : 'Agregar Registro'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(formData).map((key, index) => (
              key !== 'id' && (
                <Form.Group key={index}>
                  <Form.Label>{key.toUpperCase()}</Form.Label>
                  <Form.Control
                    type="text"
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              )
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button  className="custom-text" variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button className="custom-text" variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}