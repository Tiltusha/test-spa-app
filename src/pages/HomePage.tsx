import React from 'react';
import DataTable from '../components/DateTable/DateTable';
import LogOut from '../components/Buttons/LogOut';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <DataTable />
      <LogOut></LogOut>
    </div>
  );
}

export default HomePage;
