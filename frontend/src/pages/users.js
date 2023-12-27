import React, { useState, useEffect } from 'react';
import ItemComponent from './ItemComponent';


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
    const fetchDataFromApi = async (type) => {
        try {
            setLoading(true);

            // send
            const endpoint = type === 'random' ? "/api/users/random" : "/api/users/database"; 
            const method = type === 'random' ? "POST" : "GET";

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: type === 'random' ? JSON.stringify({ amount: amount }) : null,
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

            // Fetch from the database after deletion
            fetchDataFromApi('database');
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
    
            fetchDataFromApi('database');
            setEditingUser(null);
        } catch (error) {
            console.error(error);
        }
    };
    

    useEffect(() => {
        // Fetch data when the component mounts
        // Fetch from the database initially
        fetchDataFromApi('database');
    }, []);


    // Fetch new data when the button is clicked
    const handleAddUsers = (event) => {
        event.preventDefault();
        fetchDataFromApi('random');
    };


    return (
        <ItemComponent
          itemType="Users"
          fetchDataFromApi={fetchDataFromApi}

          deleteItem={delete_user}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          editItemData={editUserData}
          
          editingItem={editingUser}
          setEditingItem={setEditingUser} 

          data={dataUser}
          amount={amount}
          setAmount={setAmount}

          loading={loading}
          handleAddItems={handleAddUsers}
        />
    );
};


export default Users;