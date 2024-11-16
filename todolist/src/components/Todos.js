import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const Todos = ({ item, getLists }) => {

    const [task, setTask] = useState("");
    const [description, setDescription] = useState("");

    //this function is to add a task
    const addTask = async () => {

        try {
            const response = await axios.post(`/api/lists/${item._id}/tasks`, { task, description });

            if (response.data.success) {
                setTask("");
                setDescription("");
                getLists();
            }
        } catch (error) {
            console.error(error);
        }
    };


    //this  Function is to delete a task
    const deleteTask = async (id, listId) => {
        try {
            const response = await axios.delete(`/api/lists/${listId}/tasks/${id}`);
            if (response.data.success) {
                getLists();
            }
        } catch (error) {
            console.error(error);
        }
    };


    //this Function is to update a task
    const updateTask = async (id, newTask, newDesc) => {
        try {
            const response = await axios.put(`/api/lists/${item._id}/tasks/${id}`, { task: newTask, description: newDesc });
            if (response.data.success) {
                getLists();
            }
        } catch (error) {
            console.error(error);
        }
    };


    //to  mark tasks as completed
    const handleChange = async (id, check) => {
        try {
            await axios.put(`/api/lists/${item._id}/tasks/${id}/checked`, { checked: !check });
            getLists();
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <div key={item._id}>
            <div className='mb-3'>
                <p className='text-center fw-semibold text-secondary'><i className="fa-solid fa-calendar-xmark"></i> {moment(item.createdAt).calendar()} </p>
                <h2 className='text-secondary text-center'>{item.name}</h2>
            </div>

            <form onSubmit={(e) => addTask(e.preventDefault(), item._id)} className='row mb-4 '>
                <div className='col-md-8 bg-light rounded-2'>
                    <input
                        className='border-0 border-2 border-bottom fw-semibold m-2 bg-light'
                        style={{ outline: "none" }}
                        type="text"
                        placeholder='Enter Task'
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        required
                    />

                    <input
                        className='border-0 border-2 border-bottom fw-semibold w-100 m-2 bg-light'
                        style={{ outline: "none" }}
                        type="text"
                        placeholder='Enter description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    // required
                    />
                </div>

                <button className='btn btn-secondary align-middle col-4' type="submit">Add Task</button>
            </form>

            <hr />


            {item.tasks.map((task) =>
                <div key={task._id}>

                    <ul className="list-group list-group-flush p-2">
                        <div className="form-check checkbox-xl list-group-item">
                            <input className="form-check-input" type="checkbox" checked={task.checked} onChange={() => handleChange(task._id, task.checked)} />
                            <label className={task.checked ? 'text-decoration-line-through w-100 text-secondary' : 'w-100'}>
                                {/* {task.name} */}
                                <h5>{task.name}</h5>
                                <p>{task.description}</p>
                            </label>
                            <div className='d-flex justify-content-between align-items-center w-100'>
                                <span className='fw-semibold text-secondary'><i className="fa-solid fa-calendar-xmark"></i> {moment(task.updatedAt).calendar()} </span>

                                <span
                                    onClick={() => {
                                        let currentTaskName = task.name;
                                        let currentTaskDesc = task.description;
                                        const newTask = prompt("Enter the updated TASK NAME:", currentTaskName);
                                        const newDesc = prompt("Enter the updated DESCRIPTION:", currentTaskDesc);
                                        if (newTask) {
                                            updateTask(task._id, newTask, newDesc);
                                        }
                                    }}
                                >
                                    <i className="fa-solid fa-pen-to-square fs-5"></i>
                                </span>
                                <span onClick={() => deleteTask(task._id, item._id)}>
                                    <i className="fa-solid fa-trash fs-5"></i>
                                </span>
                            </div>
                            <hr />
                        </div>
                    </ul>

                </div>
            )}

        </div>
    )
}

export default Todos;