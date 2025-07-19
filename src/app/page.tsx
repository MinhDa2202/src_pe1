'use client';

import { useEffect, useState, useCallback } from 'react';
import { IContact } from '@/lib/models/Contact';
import Link from 'next/link';

export default function HomePage() {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [group, setGroup] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [groups, setGroups] = useState<string[]>([]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        name: searchTerm,
        group,
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/contacts?${params.toString()}`);
      const data = await res.json();
      setContacts(data);

      const uniqueGroups = Array.from(new Set(data.map((c: IContact) => c.group).filter(Boolean))) as string[];
      setGroups(uniqueGroups);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, group, sortBy, sortOrder]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
        fetchContacts();
      } catch (error) {
        console.error('Failed to delete contact', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Link href="/add" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Contact
        </Link>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <select value={group} onChange={(e) => setGroup(e.target.value)} className="p-2 border rounded">
          <option value="">All Groups</option>
          {groups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded">
          <option value="name">Sort by Name</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="p-2 border rounded">
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div key={contact._id as string} className="p-4 border rounded-lg shadow">
              <h2 className="text-xl font-semibold">{contact.name}</h2>
              <p className="text-gray-600">{contact.email}</p>
              <p className="text-gray-600">{contact.phone}</p>
              <p className="text-gray-500 italic">{contact.group}</p>
              <div className="mt-4 flex gap-2">
                <Link href={`/edit/${contact._id}`} className="text-blue-500">Edit</Link>
                <button onClick={() => handleDelete(contact._id as string)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}