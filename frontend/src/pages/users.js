import React, { useState, useEffect } from 'react';


const Users = () => {
    /** The users component
     * designed to display and manage a list of users. 
     * It provides functionalities to fetch user data from an API, add users, edit user details, and delete users. 
     * Additionally, it includes a loading indicator to notify users while data is being fetched.
     * 
     * State:
     *  amount: Represents the number of users to fetch.
     *  dataUser: Holds an array of user data fetched from the API.
     *  editingUser: Keeps track of the user being edited.
     *  loading: Indicates whether data is currently being fetched.
    */

    // values
    const [amount, setAmount] = useState(0);
    const [dataUser, setDataUser] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // send amount, and get random data users
    const fetchDataFromApi = async () => {
        try {
            setLoading(true);

            // send
            const endpoint = "/api/users";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: amount }),
            });

            // response
            const responseData = await response.json();
            setDataUser(responseData.users || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // delete
    const delete_user = async (id_user) => {
        try {
            const endpoint = "/api/users/delete";
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id_user }),
            });

            console.log({ id: id_user })
            fetchDataFromApi();
        } catch (error) {
            console.error(error);
        }
    };

    // edit
    const startEditing = (user) => {
        setEditingUser(user);
    };

    const cancelEditing = () => {
        setEditingUser(null);
    };

    const editUserData = async (updatedUserData) => {
        try {
            const endpoint = "/api/users/edit";
            const requestData = {
                id: updatedUserData.id,
                first_name: updatedUserData.first_name,
                last_name: updatedUserData.last_name,
                username: updatedUserData.username,
                email: updatedUserData.email,
                password: updatedUserData.password,
            };
    
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
    
            fetchDataFromApi();
            setEditingUser(null);
        } catch (error) {
            console.error(error);
        }
    };
    

    useEffect(() => {
        // Fetch data when the component mounts
        fetchDataFromApi();
    }, []);

    // Fetch new data when the button is clicked
    const handleAddUsers = (event) => {
        event.preventDefault();
        fetchDataFromApi();
    };

    return (
        <div className="container">
            <h1>Users</h1>
            <button onClick={handleAddUsers}>Add users</button>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
            />

            <h2>List</h2>

            {loading ? (
                <h2>Loading....</h2>
            ) : dataUser.length  > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataUser.map((user) => (
                            <tr key={user.id}>
                                {editingUser && editingUser.id === user.id ? (
                                    <>
                                        <td>{user.id}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingUser.first_name}
                                                onChange={(e) =>
                                                    setEditingUser({
                                                        ...editingUser,
                                                        first_name: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingUser.last_name}
                                                onChange={(e) =>
                                                    setEditingUser({
                                                        ...editingUser,
                                                        last_name: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingUser.username}
                                                onChange={(e) =>
                                                    setEditingUser({
                                                        ...editingUser,
                                                        username: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingUser.email}
                                                onChange={(e) =>
                                                    setEditingUser({
                                                        ...editingUser,
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingUser.password}
                                                onChange={(e) =>
                                                    setEditingUser({
                                                        ...editingUser,
                                                        password: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => editUserData(editingUser)}>Save</button>
                                            <button onClick={cancelEditing}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{user.id}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.password}</td>
                                        <td>
                                            <button style={{ marginRight: '10px' }} onClick={() => delete_user(user.id)}>Delete</button>
                                            <button onClick={() => startEditing(user)}>Edit</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

            ) : (
                <p>No users available</p>
            )}                  
        </div>
    );
};


export default Users;