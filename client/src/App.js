import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import UserTable from './components/UserTable';
import './App.css';
import home3dIcon from "./assets/home_3d_cartoon.png"

function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const url = "https://assessment-5xpn.onrender.com";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, sortOrder]);

  const fetchUsers = useCallback(async (page, searchQuery, sortColumn, sortDir) => {
    console.log('Fetching users:', { page, searchQuery, sortColumn, sortDir });
    setLoading(true);
    try {
      const response = await axios.get(`${url}/users`, {
        params: {
          page,
          limit: 10,
          search: searchQuery,
          sortBy: sortColumn,
          order: sortDir
        }
      });

      setUsers(response.data.users);

      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalUsers || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearch, sortBy, sortOrder);
  }, [currentPage, debouncedSearch, sortBy, sortOrder, fetchUsers]);

  const handleUploadSuccess = () => {
    fetchUsers(currentPage, debouncedSearch, sortBy, sortOrder);
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      await axios.delete(`${url}/users`);
      setSearch('');
      setDebouncedSearch('');
      setSortBy('');
      setSortOrder('asc');
      setCurrentPage(1);
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data');
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    console.log('handleSort clicked:', column);
    if (sortBy === column) {
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      console.log('Toggling order to:', newOrder);
      setSortOrder(newOrder);
    } else {
      console.log('Setting new sort column:', column);
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="app-layout">

      <header className="app-header">
        <div className="header-content">
          <a href="/" className="logo">
            <img src={home3dIcon} alt="Home" />
            Home
          </a>
        </div>
      </header>


      <main className="main-content">
        <section>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </section>

        <section>
          <UserTable
            users={users}
            currentPage={currentPage}
            totalPages={totalPages}
            totalUsers={totalUsers}
            onPageChange={setCurrentPage}
            loading={loading}
            onClearData={handleClearData}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            search={search}
            onSearchChange={setSearch}
            onSortOrderChange={setSortOrder}
          />
        </section>
      </main>



    </div>
  );
}

export default App;
