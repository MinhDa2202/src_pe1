'use client';

import { useEffect, useState, useCallback } from 'react';
import { IContact } from '@/lib/models/Contact';
import Link from 'next/link';
import { Plus, Edit, Trash2, User, Mail, Phone, ChevronDown, Search, Users, SortAsc, SortDesc } from 'lucide-react';
import Loading from '@/components/ui/loading';

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

  const renderContactCard = (contact: IContact) => (
    <div key={contact._id as string} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
            <User className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{contact.name}</h2>
            {contact.group && <p className="text-sm font-medium text-blue-500 dark:text-blue-400">{contact.group}</p>}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {contact.email && (
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <Mail size={16} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <Phone size={16} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{contact.phone}</span>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-end items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link href={`/edit/${contact._id}`} className="flex items-center space-x-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          <Edit size={14} />
          <span>Edit</span>
        </Link>
        <button onClick={() => handleDelete(contact._id as string)} className="flex items-center space-x-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contacts</h1>
          <Link href="/add" className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <Plus size={20} />
            <span>Add Contact</span>
          </Link>
        </div>

        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full appearance-none p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                <option value="">All Groups</option>
                {groups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full appearance-none p-2 pl-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                <option value="name">Sort by Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
                <span>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading text="Fetching contacts..." />
        ) : contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {contacts.map(renderContactCard)}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Contacts Found</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {searchTerm || group ? "Try adjusting your search or filter." : "Get started by adding a new contact."}
            </p>
            <Link href="/add" className="mt-6 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <Plus size={20} />
              <span>Add First Contact</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}