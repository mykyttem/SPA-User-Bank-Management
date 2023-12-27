import React, { useState, useEffect } from 'react';

const Users = () => {
    // values
    const [amount, setAmount] = useState(0);
    const [dataUser, setDataUser] = useState([]);

    const fetchDataFromApi = async () => {
        try {
            const endpoint = "http://localhost:8000/api/users";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: amount }),
            });

            const responseData = await response.json();
            setDataUser(responseData.users || []);
        } catch (error) {
            console.error(error);
        }
    };

    // delete
    const delete_user = async (id_user) => {
        try {
            const endpoint = "http://localhost:8000/api/users/delete";
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id_user }),
            });
    
            fetchDataFromApi();
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

            <h2>Users List:</h2>
            {dataUser.length > 0 ? (
                dataUser.map((user, index) => (
                    <div key={index}>
                        <p>ID: {user.id}</p>
                        <p>Name: {user.first_name}</p>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Password: {user.password}</p>

                        <button
                            style={{ marginRight: '10px' }}
                            onClick={() => delete_user(user.id)}
                        >
                            Delete
                        </button>
                        <button>Edit</button>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No users available.</p>
            )}
        </div>
    );
};

export default Users;
