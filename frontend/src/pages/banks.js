import React, { useState, useEffect } from "react";
import ItemComponent from './ItemComponent';


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
    const deleteBank = async (id_bank) => {
        try {
            const endpoint = "/api/banks/delete";
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id_bank }),
            });

            // Fetch from the database after deletion
            fetchDataFromApi('database'); 
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
        />
    );
};


export default Banks;