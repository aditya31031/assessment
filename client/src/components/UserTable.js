import React from 'react';
import iconFolder from '../assets/icon-folder.png';
import iconSearch from '../assets/icon-search.png';

const UserTable = ({ users, currentPage, totalPages, onPageChange, totalUsers, loading, onClearData, onSort, sortBy, sortOrder, search, onSearchChange, onSortOrderChange }) => {
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);

    const getHeaders = () => {
        if (!users || users.length === 0) return [];
        const allKeys = new Set();
        users.forEach(user => {
            Object.keys(user).forEach(key => {
                if (key !== '_id' && key !== '__v') {
                    allKeys.add(key);
                }
            });
        });
        return Array.from(allKeys);
    };
    const headers = [
        'first_name',
        'last_name',
        'email',
        'company_name',
        'city',
        'state',
        'job_title',
        'phone'
    ];


    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        onClearData();
        setShowDeleteModal(false);
    };

    if (loading) {
        return (
            <div className="card table-wrapper" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>Loading data...</p>
            </div>
        );
    }

    return (
        <div className="card table-wrapper">
            <div className="table-header-container">
                <div className="header-top-row">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h3>Results Analysis</h3>
                        <span className="badge-count">{totalUsers || 0} Records</span>
                    </div>

                    {users.length > 0 && (
                        <button onClick={handleDeleteClick} className="btn-danger-outline">
                            Delete All Data
                        </button>
                    )}
                </div>

                <div className="header-toolbar">
                    <div className="search-field">
                        <img
                            src={iconSearch}
                            alt="Search"
                            className="search-icon-img"
                        />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="input-styled has-icon"
                        />
                    </div>

                    <div className="select-group">
                        <select
                            value={sortBy}
                            onChange={(e) => onSort(e.target.value)}
                            className="input-styled"
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="">Sort By...</option>
                            {headers.map(key => (
                                <option key={key} value={key}>{key.replace(/_/g, ' ')}</option>
                            ))}
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) => onSortOrderChange(e.target.value)}
                            className="input-styled"
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="asc">Ascending (A-Z)</option>
                            <option value="desc">Descending (Z-A)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="data-table-container">
                {users.length === 0 ? (
                    <div className="empty-state-visual">
                        <img
                            src={iconFolder}
                            alt="No Data"
                            style={{ width: '120px', height: 'auto', display: 'block', margin: '0 auto 1rem auto' }}
                        />
                        <h3>No Data Found</h3>
                        <p>Upload a CSV file to populate this table.</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                {headers.map((header) => (
                                    <th key={header} onClick={() => onSort && onSort(header)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {header.replace(/_/g, ' ')}
                                            {sortBy === header && (
                                                <span style={{ color: 'var(--primary)' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id || index}>
                                    {headers.map((header) => (
                                        <td key={`${user._id}-${header}`}>
                                            {typeof user[header] === 'object' ? JSON.stringify(user[header]) : user[header]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="pagination-footer">
                <span className="page-display">
                    Showing page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
                </span>
                <div className="pagination-btns">
                    <button
                        className="btn-page"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="btn-page"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete ALL data? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-modal-confirm" onClick={confirmDelete}>
                                Delete Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
