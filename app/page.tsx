'use client';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
type Entry = {
  name: string;
  age: string;
  village: string;
};
export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState<Entry>({ name: '', age: '', village: '' });
  const [showData, setShowData] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...entries];
      // Explicitly tell TypeScript that updated[editIndex] will be an Entry
      updated[editIndex] = form as Entry;
      setEntries(updated);
      setEditIndex(null);
    } else {
      setEntries([...entries, form]);
    }
    setForm({ name: '', age: '', village: '' });
  };
  const handleEdit = (index: number) => {
    setForm(entries[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const deleteEntry = (index: number) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Data");
    XLSX.writeFile(workbook, "Itakarlapalli_Data.xlsx");
  };
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
