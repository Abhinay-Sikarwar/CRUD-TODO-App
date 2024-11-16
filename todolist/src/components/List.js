import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Todos from './Todos';

const List = () => {

    const [listName, setListName] = useState("");
    const [list, setList] = useState([]);


    // to send the JWT token with the request (sending JWT token string as authenticated requests)
    const CONFIG_OBJECT = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }


    axios.defaults.baseURL = "http://localhost:8080";        // port number on which the database run

    // this function will get all the tasks and lists
    const getLists = async () => {
        try {
            
            const res = await axios.get("/users/lists", CONFIG_OBJECT);
           
            setList(res.data.products);
            
        } catch (error) {
            console.error(error);
        }
    };

    // this will do updation when there is any changes in the list
    useEffect(() => {
        getLists();
    }, []);



    //this function will add a list
    const addList = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`/api/list`, { name: listName }, CONFIG_OBJECT);

            if (response.data.success) {
                setListName("");                      // Set the task value to empty
                getLists();                     // Get the tasks if adding successful
            }
        } catch (error) {
            console.error(error);
        }
    };


    //this  Function will delete a list
    const deleteList = async (id) => {
        try {
            const response = await axios.delete(`/api/list/${id}`);
            if (response.data.success) {
                getLists();
            }
        } catch (error) {
            console.error(error);
        }
    };


    //this Function will update the list name
    const updateListName = async (id, newListName) => {
        try {
            const response = await axios.put(`/api/list/${id}`, { listName: newListName });
            if (response.data.success) {
                getLists();
            }
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div className='container-fluid p-5'>

            {/* form for adding a new list */}
            <form onSubmit={addList} className='m-5 d-flex align-items-center gap-2'>

                <i className="fa-solid fa-circle-plus fs-1 text-secondary"></i>

                <input
                    className='border-0 border-2 border-bottom fw-semibold fs-4'
                    style={{ outline: "none" }}
                    type="text"
                    placeholder='Enter List Name'
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    required
                />

                <button className='btn btn-secondary align-middle fw-bold' type="submit">Add New List</button>
            </form>


            <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                {list.map((item) =>
                    <div className="col" key={item._id}>
                        <div className="p-3 border rounded">
                            <div>
                                {/* Button to update/edit list name */}
                                <span
                                    onClick={() => {
                                        let currentTaskName = item.name;
                                        const newListName = prompt("Enter the updated task:", currentTaskName);
                                        if (newListName) {
                                            updateListName(item._id, newListName);
                                        }
                                    }}
                                >
                                    <i className="fa-solid fa-pen-to-square fs-3"></i>
                                </span>


                                {/* Button to delete a list */}
                                <i className="fa-solid fa-square-minus float-end fs-3" onClick={() => deleteList(item._id)}></i>
                            </div>


                            {/* Tasks component */}
                            <Todos item={item} getLists={getLists} />
                        </div>
                    </div>

                )}
            </div>

        </div>
    )
}

export default List;