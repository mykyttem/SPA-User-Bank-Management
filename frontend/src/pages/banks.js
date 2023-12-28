import React, { useState, useEffect } from "react";

import ItemComponent from './ItemComponent';


const Banks = () => {
    // values
    const [amount, setAmount] = useState(0);
    const [dataBanks, setDataBanks] = useState([]);
    const [editingBank, setEditingBank] = useState(null);
    const [loading, setLoading] = useState(false);

    // state for modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [listUsers, setListUsers] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [notification, setNotification] = useState();


    // open and close modal winodw
    const openModal = async () => {
        setModalOpen(true);

        try {
            setLoading(true);

            // get users from database
            const usersEndpoint = "/api/users/database";
            const usersResponse = await fetch(usersEndpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            
            const usersData = await usersResponse.json();
            setListUsers(usersData.users || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => setModalOpen(false);

    // associate user with bank
    const associate_user = async (id_user) => {
        try {
            const endpoint = "/api/banks/associate_user";
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id_user: id_user, id_bank: selectedBank })
            });
        } catch (error) {
            console.error(error);
        } 
    };


    // send amount or fetch from the database based on the type
    const fetchDataFromApi = async (type) => {
        try {
            setLoading(true);

            // send
            const endpoint = type === 'random' ? "/api/banks/random" : "/api/banks/database";
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
            setDataBanks(responseData.banks || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // delete
    const deleteBank = async (id_bank) => {
        try {
            const endpoint = "/api/banks/delete";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id_bank }),
            });

            const responseData = await response.json();
            
            if (responseData && responseData.error) {
                setNotification('Fail! Not allowed delete bank, because association users');
            } else {
                fetchDataFromApi('database');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // edit
    const startEditing = (bank) => {
        setEditingBank(bank);
    };

    const cancelEditing = () => {
        setEditingBank(null);
    };

    const editBankData = async (updatedBankData) => {
        try {
            const endpoint = "/api/banks/edit";
            const requestData = {
                id: updatedBankData.id,
                bank_name: updatedBankData.bank_name,
                routing_number: updatedBankData.routing_number,
                swift_bic: updatedBankData.swift_bic,
            };

            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });


            fetchDataFromApi('database'); 
            setEditingBank(null);
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
    const handleAddBanks = (event) => {
        event.preventDefault();
        fetchDataFromApi('random');
    };


    return (
        <>
            <ItemComponent
                itemType="Banks"
                fetchDataFromApi={fetchDataFromApi}

                deleteItem={deleteBank}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                editItemData={editBankData}
                editingItem={editingBank}
                setEditingItem={setEditingBank}

                data={dataBanks}
                amount={amount}
                setAmount={setAmount}

                loading={loading}
                handleAddItems={handleAddBanks} 

                openModalWindow={openModal}
                listUsers={listUsers}
                onBankSelect={setSelectedBank}
            />
            
            <h1 style={{ color: 'white' }}>{notification}</h1>


            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal" style={{ position: 'relative' }}>
                        <button
                            onClick={closeModal}
                            style={{ position: 'absolute', top: '10px', right: '10px' }}
                        >
                            Close
                        </button>
                        
                        <table>
                            <thead>
                                <tr style={{ color: 'white' }}>
                                    <th>ID</th>
                                    <th className="modal-td">First name</th>
                                    <th className="modal-td">Last name</th>
                                    <th className="modal-td">Username</th>
                                    <th className="modal-td">Email</th>
                                    <th className="modal-td">Password</th>
                                    <th className="modal-td">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUsers.map((user) => (
                                    <tr style={{ color: 'white' }} key={user.id}>
                                        <td className="modal-td">{user.id}</td>
                                        <td className="modal-td">{user.first_name}</td>
                                        <td className="modal-td">{user.last_name}</td>
                                        <td className="modal-td">{user.username}</td>
                                        <td className="modal-td">{user.email}</td>
                                        <td className="modal-td">{user.password}</td>
                                        <td className="modal-td">
                                            <button onClick={() => associate_user(user.id)}>+</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};


export default Banks;