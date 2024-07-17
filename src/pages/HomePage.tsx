import React from 'react';
import DataTable from '../components/DateTable/DateTable';
import LogOut from '../components/Buttons/LogOut';
import ClearToken from '../components/Buttons/ClearToken';

import styles from './HomePage.module.sass'

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Таблица</h1>
      <DataTable />
      <div className={styles.buttons}>
        <LogOut></LogOut>
        <ClearToken></ClearToken>
      </div>
    </div>
  );
}

export default HomePage;
