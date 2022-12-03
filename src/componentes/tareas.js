import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

function Tareas() {
    const [data, setData] = useState([])

    useEffect(() => {
        listarTareas()
    }, [])

    const listarTareas = async () => {
        const response = await axios.get('http://localhost:3000/tarea')
        response.data.tareas.forEach((x) =>{
            x.estado != 1 ? x.color = "bg-danger text-white" : x.color = "bg-success text-white"
        })
        //const tareasActualizadas = [response.data.tareas, ...response.data.tareas]
        setData(response.data.tareas)
    }

    const cambiarEstado = async (id, tipo) => {
        let mensaje = "Finalizada"
        if(tipo != 1) mensaje = "Reanudada"
        let body = {
            "estado": tipo
        }
        console.log("body",body)
        const response = await axios.put(`http://localhost:3000/tarea/update?tareaId=` + id, body)
            .then(response => {
                Swal.fire(
                    'Exito',
                    'Tarea '+mensaje+' con exito',
                    'success'
                )
                listarTareas()
            }).catch(error => {
                console.log("*****  " + error)
            })
    }

    const guardarData = (nombre) => {
        Swal.fire({
            title: 'Esta seguro de guardar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Guardar',
            cancelButtonText: 'No, cancelar',
        }).then((result) => {

            if (result.isConfirmed) {

                const body = {
                    "nombre": nombre.nombre_tarea.value,
                    "estado": 1
                }
                const response = axios.post(`http://localhost:3000/tarea/create`, body)
                    .then(response => {
                        Swal.fire(
                            'Exito',
                            'Tarea guardada con exito',
                            'success'
                        )
                        listarTareas()
                        nombre.nombre_tarea.value = ""
                    })
            }
        })
    }

    const eliminarTarea = async (id) =>{
        Swal.fire({
            title: 'Esta seguro de eliminar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar',
        }).then((result) => {

            if (result.isConfirmed) {
                const response = axios.delete(`http://localhost:3000/tarea/delete?tareaId=`+id)
                    .then(response => {
                        Swal.fire(
                            'Exito',
                            'Tarea eliminada con exito',
                            'success'
                        )
                        listarTareas()
                    })
            }
        })
    }




    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col">
                        <form className="m-4"
                            onSubmit={ev => {
                                ev.preventDefault()
                                guardarData(ev.target)
                            }}
                        >
                            <div className="mb-3">
                                <label for="exampleInputEmail1" className="form-label">Nombre de la tarea</label>
                                <input type="text" className="form-control" required name="nombre_tarea"></input>
                            </div>
                            <div className="col text-center ">
                                <button type="submit" className="btn btn-success">Agregar</button>
                            </div>

                        </form>
                    </div>
                    <div className="col">
                        <table className="table">
                            <thead>
                                <tr className="bg-dark text-white">
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col" colSpan={2}>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !data ? "Cargando" :
                                        data.map((tarea, index) => {
                                            return (
                                                <tr key={index} className={tarea.color}>
                                                    <td>{index + 1}</td>
                                                    <td>{tarea.nombre}</td>
                                                    {
                                                        tarea.estado == 0 ?
                                                            <td>Terminado</td>
                                                            :
                                                            <td>En curso</td>
                                                    }
                                                    {
                                                        tarea.estado != 0 ?
                                                            <td data-toggle="tooltip" title="TERMINAR TAREA">
                                                                <img onClick={() => { cambiarEstado(tarea._id, 0) }} src="https://img.icons8.com/sf-regular/30/null/finish-flag.png" />
                                                            </td>
                                                            :
                                                            <td data-toggle="tooltip" title="REANUDAR TAREA">
                                                                <img onClick={() => { cambiarEstado(tarea._id, 1) }} src="https://img.icons8.com/sf-regular/30/null/circled-play.png" />
                                                            </td>
                                                    }
                                                    <td data-toggle="tooltip" title="ELIMINAR TAREA">
                                                        <img onClick={() => { eliminarTarea(tarea._id) }} src="https://img.icons8.com/sf-regular/30/null/trash.png" />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tareas;