import React, { useState, useEffect } from "react";

const Banks = () => {
    // values
    const [amount, setAmount] = useState(0);
    const [dataBanks, setDataBanks] = useState([]);
    const [editingBank, setEditingBank] = useState(null);
    const [loading, setLoading] = useState(false);

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
    const deleteBank = async (idBank) => {
        try {
            const endpoint = "/api/banks/delete";
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: idBank }),
            });

            fetchDataFromApi('database'); // Fetch from the database after deletion
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

    return (
        <div className="container">
            <h1>Banks</h1>
            <button onClick={() => fetchDataFromApi('random')}>Add bank</button>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
            />

            <h2>List</h2>

            {loading ? (
                <h2>Loading....</h2>
            ) : dataBanks.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Bank Name</th>
                            <th>Routing Number</th>
                            <th>Swift BIC</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataBanks.map((bank) => (
                            <tr key={bank.id}>
                                {editingBank && editingBank.id === bank.id ? (
                                    <>
                                        <td>{bank.id}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingBank.bank_name}
                                                onChange={(e) =>
                                                    setEditingBank({
                                                        ...editingBank,
                                                        bank_name: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingBank.routing_number}
                                                onChange={(e) =>
                                                    setEditingBank({
                                                        ...editingBank,
                                                        routing_number: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingBank.swift_bic}
                                                onChange={(e) =>
                                                    setEditingBank({
                                                        ...editingBank,
                                                        swift_bic: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => editBankData(editingBank)}>Save</button>
                                            <button onClick={cancelEditing}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{bank.id}</td>
                                        <td>{bank.bank_name}</td>
                                        <td>{bank.routing_number}</td>
                                        <td>{bank.swift_bic}</td>
                                        <td>
                                            <button style={{ marginRight: '10px' }} onClick={() => deleteBank(bank.id)}>Delete</button>
                                            <button onClick={() => startEditing(bank)}>Edit</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No banks available</p>
            )}
        </div>
    );
};


export default Banks;