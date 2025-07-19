'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IContact } from '@/lib/models/Contact';

export default function EditContactPage() {
  const [contact, setContact] = useState<IContact | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchContact = async () => {
        try {
          const res = await fetch(`/api/contacts/${id}`);
          const data = await res.json();
          setContact(data);
          setName(data.name);
          setEmail(data.email);
          setPhone(data.phone || '');
          setGroup(data.group || '');
        } catch (error) {
          console.error('Failed to fetch contact', error);
        }
      };
      fetchContact();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, group }),
      });
      if (res.ok) {
        router.push('/');
      } else {
        console.error('Failed to update contact');
      }
    } catch (error) {
      console.error('Failed to update contact', error);
    }
  };

  if (!contact) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1">Phone</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="group" className="block mb-1">Group</label>
          <input
            type="text"
            id="group"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}