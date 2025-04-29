'use client';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface Patient {
  id?: number;
  name: string;
  age: string;
  village: string;
}

export default function Home() {
  const [entries, setEntries] = useState<Patient[]>([]);
  const [form, setForm] = useState<Patient>({ name: '', age: '', village: '' });
  const [showData, setShowData] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/patients'); // Full URL of your backend
      if (response.ok) {
        const data: Patient[] = await response.json();
        setEntries(data);
      } else {
        console.error('Failed to fetch patients:', response.status);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editIndex !== null ? 'PUT' : 'POST';
    const url = editIndex !== null && entries[editIndex]?.id ? `http://localhost:3001/api/patients/${entries[editIndex].id}` : 'http://localhost:3001/api/patients';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm({ name: '', age: '', village: '' });
        setEditIndex(null);
        fetchPatients(); // Refresh data after submission/update
      } else {
        console.error('Failed to submit/update data:', response.status);
      }
    } catch (error) {
      console.error('Error submitting/updating data:', error);
    }
  };

  const handleEdit = (index: number) => {
    setForm(entries[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEntry = async (index: number) => {
    const idToDelete = entries[index]?.id;
    if (idToDelete) {
      try {
        const response = await fetch(`http://localhost:3001/api/patients/${idToDelete}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPatients(); // Refresh data after deletion
        } else {
          console.error('Failed to delete entry:', response.status);
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries.map(entry => ({ name: entry.name, age: entry.age, village: entry.village })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Data");
    XLSX.writeFile(workbook, "Itakarlapalli_Data.xlsx");
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome to Itakarlapalli Sub Centre</h1>
      <p style={{ marginBottom: '2rem' }}>Healthcare Services for the Community</p>

      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px',
        marginBottom: '2rem'
      }}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required />
        <input type="text" name="village" placeholder="Village" value={form.village} onChange={handleChange} required />
        <button type="submit" style={{
          padding: '10px',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}>
          {editIndex !== null ? 'Update Entry' : 'Submit'}
        </button>
      </form>

      <button onClick={downloadExcel} style={{
        marginRight: '1rem',
        padding: '8px 16px',
        background: 'green',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}>
        Download Excel
      </button>

      <button onClick={() => setShowData(!showData)} style={{
        padding: '8px 16px',
        background: '#555',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}>
        {showData ? 'Hide Entered Data' : 'Entered Data'}
      </button>

      {showData && (
        <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {entries.length === 0 && <p>No entries yet.</p>}
          {entries.map((entry, index) => (
            <div key={index} style={{
              background: '#f9f9f9',
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              width: '250px',
              boxShadow: '2px 2px 10px rgba(0,0,0,0.1)'
            }}>
              <p><strong>Name:</strong> {entry.name}</p>
              <p><strong>Age:</strong> {entry.age}</p>
              <p><strong>Village:</strong> {entry.village}</p>
              <button onClick={() => handleEdit(index)} style={{
                marginRight: '10px',
                background: '#0070f3',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '5px'
              }}>
                Edit
              </button>
              <button onClick={() => deleteEntry(index)} style={{
                background: '#e00',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '5px'
              }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
