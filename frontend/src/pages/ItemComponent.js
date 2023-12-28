import React from 'react';
import { Link } from 'react-router-dom';


const ItemComponent = ({
  itemType,

  deleteItem,
  startEditing,
  cancelEditing,

  editItemData,
  setEditingItem,

  data,
  editingItem,

  amount,
  setAmount,

  loading,
  handleAddItems,

  openModalWindow,
  onBankSelect
}) => {
  return (
    <div className="container">
      <Link to="/users" className="link">
        Go to Users
      </Link>
      <Link to="/banks" className="link">
        Go to Banks
      </Link>

      <h1>{itemType}</h1>
      <button onClick={handleAddItems}>Add {itemType}</button>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
      />

      <h2>List</h2>

      {loading ? (
        <h2>Loading....</h2>
      ) : data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              {itemType === 'Users' ? (
                <>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Password</th>
                </>
              ) : (
                <>
                  <th>Bank Name</th>
                  <th>Routing Number</th>
                  <th>Swift BIC</th>
                </>
              )}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {editingItem && editingItem.id === item.id ? (
                  <>
                    <td>{item.id}</td>
                    {itemType === 'Users' ? (
                      <>
                        <td>
                        <input
                          type="text"
                          value={editingItem.first_name}
                          onChange={(e) =>
                            setEditingItem((prevItem) => ({
                              ...prevItem,
                              first_name: e.target.value,
                            }))
                          }
                        />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingItem.last_name}
                            onChange={(e) =>
                              setEditingItem((prevItem) => ({
                                ...prevItem,
                                last_name: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingItem.username}
                            onChange={(e) =>
                              setEditingItem((prevItem) => ({
                                ...prevItem,
                                username: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingItem.email}
                            onChange={(e) =>
                              setEditingItem((prevItem) => ({
                                ...prevItem,
                                email: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingItem.password}
                            onChange={(e) =>
                              setEditingItem((prevItem) => ({
                                ...prevItem,
                                password: e.target.value,
                              }))
                            }
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <input
                            type="text"
                            value={editingItem.bank_name}
                            onChange={(e) =>
                              setEditingItem((prevItem) => ({
                                ...prevItem,
                                bank_name: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingItem.routing_number}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                routing_number: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingItem.swift_bic}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                swift_bic: e.target.value,
                              })
                            }
                          />
                        </td>
                      </>
                    )}
                    <td>
                      <button onClick={() => editItemData(editingItem)}>Save</button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.id}</td>
                    {itemType === 'Users' ? (
                      <>
                        <td>{item.first_name}</td>
                        <td>{item.last_name}</td>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.password}</td>
                      </>
                    ) : (
                      <>
                        <td>{item.bank_name}</td>
                        <td>{item.routing_number}</td>
                        <td>{item.swift_bic}</td>
                      </>
                    )}
                    <td>
                      <button
                        style={{ marginRight: '10px' }}
                        onClick={() => deleteItem(item.id)}
                      >
                        Delete
                      </button>
                      <button onClick={() => startEditing(item)}>Edit</button>

                      {itemType === 'Banks' && (
                        <>
                          <span style={{ margin: '0 5px' }}></span>
                          <button 
                              className="add-user-btn"
                              onClick={() => {
                                  onBankSelect(item.id);
                                  openModalWindow();
                              }}
                          >
                              Associate user
                          </button>
                          
                        </>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No {itemType.toLowerCase()} available</p>
      )}
    </div>
  );
};

export default ItemComponent;
