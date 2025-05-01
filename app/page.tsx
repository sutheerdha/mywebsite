'use client';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import dynamic from 'next/dynamic';

interface Patient {
    id?: number;
    name: string;
    age: string;
    village: string;
}

const PDFDownloader = dynamic(() => import('./components/PDFDownloader'), { ssr: false });

export default function Home() {
    const [entries, setEntries] = useState<Patient[]>([]);
    const [form, setForm] = useState<Patient>({ name: '', age: '', village: '' });
    const [showData, setShowData] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [ageError, setAgeError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === 'age') {
            const ageValue = parseInt(value, 10);
            setAgeError(isNaN(ageValue) || ageValue < 0 ? 'Age must be a non-negative number' : null);
        }
    };

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3001/api/patients');
            if (!response.ok) {
                throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
            }
            const data: Patient[] = await response.json();
            setEntries(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Unknown error occurred while fetching patients.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (ageError) return;

        setLoading(true);
        setError(null);
        const method = editIndex !== null ? 'PUT' : 'POST';
        const url = editIndex !== null && entries[editIndex]?.id
            ? `http://localhost:3001/api/patients/${entries[editIndex].id}`
            : 'http://localhost:3001/api/patients';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                let errorMessage = `Failed to ${method === 'PUT' ? 'update' : 'submit'} data: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.error) {
                        errorMessage += ` - ${errorData.error}`;
                    }
                } catch {
                    // Ignore JSON parse error
                }
                throw new Error(errorMessage);
            }

            setForm({ name: '', age: '', village: '' });
            setEditIndex(null);
            await fetchPatients();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Unknown error occurred during form submission.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (index: number) => {
        setForm(entries[index]);
        setEditIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteEntry = async (index: number) => {
        const idToDelete = entries[index]?.id;
        if (!idToDelete) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3001/api/patients/${idToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete entry: ${response.status} ${response.statusText}`);
            }
            await fetchPatients();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Unknown error occurred during deletion.');
            }
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            entries.map((entry) => ({ Name: entry.name, Age: entry.age, Village: entry.village }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Data');
        XLSX.writeFile(workbook, 'Itakarlapalli_Data.xlsx');
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
                {ageError && <p style={{ color: 'red' }}>{ageError}</p>}
                <input type="text" name="village" placeholder="Village" value={form.village} onChange={handleChange} required />
                <button type="submit" disabled={ageError !== null || loading} style={{
                    padding: '10px',
                    background: ageError || loading ? '#ccc' : '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: (ageError || loading) ? 'not-allowed' : 'pointer'
                }}>
                    {editIndex !== null ? 'Update Entry' : 'Submit'}
                </button>
            </form>

            <div style={{ marginBottom: '1rem' }}>
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
                <PDFDownloader entries={entries} />
            </div>

            <button onClick={() => setShowData(!showData)} style={{
                padding: '8px 16px',
                background: '#555',
                color: 'white',
                border: 'none',
                borderRadius: '5px'
            }}>
                {showData ? 'Hide Entered Data' : 'Entered Data'}
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

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
