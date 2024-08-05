"use client";
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db } from './firebase';

export default function Home() {
  // States
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [newCategory, setNewCategory] = useState("");
  const [newExpirationDate, setNewExpirationDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCategory, setEditCategory] = useState("");
  const [editExpirationDate, setEditExpirationDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsList);
    };
    fetchItems();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterCategory = (e) => {
    setFilterCategory(e.target.value);
  };

  const filteredItems = items.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterCategory === "" || item.category === filterCategory)
    );
  });

  const handleNewItem = (e) => {
    setNewItem(e.target.value);
  };

  const handleNewQuantity = (e) => {
    setNewQuantity(parseInt(e.target.value));
  };

  const handleNewCategory = (e) => {
    setNewCategory(e.target.value);
  };

  const handleNewExpirationDate = (e) => {
    setNewExpirationDate(e.target.value);
  };

  const handleEditItem = (e) => {
    setEditItem(e.target.value);
  };

  const handleEditQuantity = (e) => {
    setEditQuantity(parseInt(e.target.value));
  };

  const handleEditCategory = (e) => {
    setEditCategory(e.target.value);
  };

  const handleEditExpirationDate = (e) => {
    setEditExpirationDate(e.target.value);
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.trim() === "") return;

    const newItemData = {
      name: newItem,
      quantity: newQuantity,
      category: newCategory,
      expirationDate: newExpirationDate,
    };

    const docRef = await addDoc(collection(db, "items"), newItemData);
    setItems([...items, { id: docRef.id, ...newItemData }]);
    setNewItem("");
    setNewQuantity(1);
    setNewCategory("");
    setNewExpirationDate("");
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
    setItems(items.filter(item => item.id !== id));
  };

  const startEditing = (index) => {
    const itemToEdit = items[index];
    setEditIndex(index);
    setEditItem(itemToEdit.name);
    setEditQuantity(itemToEdit.quantity);
    setEditCategory(itemToEdit.category);
    setEditExpirationDate(itemToEdit.expirationDate);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const itemToUpdate = items[editIndex];
    const updatedItemData = {
      name: editItem,
      quantity: editQuantity,
      category: editCategory,
      expirationDate: editExpirationDate,
    };

    await updateDoc(doc(db, "items", itemToUpdate.id), updatedItemData);
    const updatedItems = items.map((item, index) =>
      index === editIndex ? { ...item, ...updatedItemData } : item
    );
    setItems(updatedItems);
    setEditIndex(null);
    setEditItem("");
    setEditQuantity(1);
    setEditCategory("");
    setEditExpirationDate("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-12 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>

        <div className="bg-emerald-700 p-4 rounded-lg mb-4 text-black w-full">
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="bg-emerald-700 p-4 rounded-lg mb-4 text-black w-full">
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={filterCategory}
            onChange={handleFilterCategory}
          >
            <option value="">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        <div className="bg-emerald-700 p-4 rounded-lg mb-4 w-full">
          <form className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center text-black" onSubmit={addItem}>
            <input
              className="col-span-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="text"
              placeholder="Enter item"
              value={newItem}
              onChange={handleNewItem}
            />
            <input
              className="col-span-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="number"
              min="1"
              placeholder="Quantity"
              value={newQuantity}
              onChange={handleNewQuantity}
            />
            <select
              className="col-span-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={newCategory}
              onChange={handleNewCategory}
            >
              <option value="">Category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Beverages">Beverages</option>
            </select>
            <input
              className="col-span-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="date"
              placeholder="Expiration Date"
              value={newExpirationDate}
              onChange={handleNewExpirationDate}
            />
            <button
              className="col-span-1 text-white bg-emerald-800 hover:bg-emerald-600 p-3 text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="submit"
            >
              Add
            </button>
          </form>
        </div>

        <div className="bg-emerald-700 p-4 rounded-lg max-h-64 overflow-y-auto w-full">
          <ul className="list-disc pl-5">
            {filteredItems.map((item, index) => (
              <li key={item.id} className="mb-2 flex justify-between items-center bg-emerald-800 rounded-lg text-white p-2">
                <div className="flex flex-1 justify-between items-center">
                  <span className="font-semibold flex-1">{item.name}</span>
                  <span className="text-center flex-1">{item.quantity}</span>
                  <span className="text-center flex-1">{item.category}</span>
                  <span className="text-center flex-1">{item.expirationDate}</span>
                  <div className="flex-1 text-right">
                    <button
                      onClick={() => startEditing(index)}
                      className="mr-2 text-blue-400 hover:text-blue-600"
                    >
                      Edit
                      </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {editIndex !== null && (
          <div className="bg-emerald-700 p-4 rounded-lg mt-4 w-full">
            <form className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center text-black" onSubmit={saveEdit}>
              <input
                className="col-span-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="text"
                placeholder="Edit item"
                value={editItem}
                onChange={handleEditItem}
              />
              <input
                className="col-span-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="number"
                min="1"
                placeholder="Quantity"
                value={editQuantity}
                onChange={handleEditQuantity}
              />
              <select
                className="col-span-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={editCategory}
                onChange={handleEditCategory}
              >
                <option value="">Category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Beverages">Beverages</option>
              </select>
              <input
                className="col-span-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="date"
                placeholder="Expiration Date"
                value={editExpirationDate}
                onChange={handleEditExpirationDate}
              />
              <button
                className="col-span-1 text-white bg-emerald-800 hover:bg-emerald-600 p-3 text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="submit"
              >
                Save
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
