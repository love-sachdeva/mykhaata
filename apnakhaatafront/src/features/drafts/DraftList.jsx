import React from 'react';
import { Link } from 'react-router-dom';
import { useDrafts } from './hook';

export default function DraftsList() {
    const { data: drafts = [], isLoading } = useDrafts();
    if (isLoading) return <div>Loading…</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-heading">Bill Drafts</h2>
                <Link to="/drafts/new" className="bg-secondary text-white px-4 py-2 rounded-lg">
                    + New Draft
                </Link>
            </div>
            <table className="min-w-full bg-white rounded shadow">
                <thead className="bg-primary text-white">
                <tr>
                    <th className="p-2">ID</th>
                    <th>Account</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {drafts.map(d => (
                    <tr key={d.id} className="border-b hover:bg-parchment">
                        <td className="p-2">
                            <Link to={`/release?draftId=${d.id}`} className="text-accent">
                                {d.id}
                            </Link>
                        </td>
                        <td>{d.accountId}</td>
                        <td>{d.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
