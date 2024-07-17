import React, { useEffect, useState } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';

interface DataItem {
  id: number;
  companySigDate: string;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: string;
  employeeSigDate: string;
  employeeSignatureName: string;
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataItem[] | null>(null); // Используем тип DataItem[] | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/get', {
          headers: {
            'x-auth': localStorage.getItem('authToken') || ''
          }
        });
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setData([]); // Устанавливаем пустой массив в случае ошибки
        setLoading(false);
        // обработка ошибок получения данных
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.post(`https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/delete/${id}`, null, {
        headers: {
          'x-auth': localStorage.getItem('authToken') || ''
        }
      });
      
      // Обновляем данные после удаления
      const updatedData = data?.filter(item => item.id !== id); // Используем условный оператор ?
      setData(updatedData || null); // Устанавливаем null, если данные не определены
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
      // обработка ошибок удаления записи
    }
  };

  const handleEdit = (id: number) => {
    // Здесь должна быть логика для редактирования записи
    console.log(`Редактирование записи с id ${id}`);
  };

  if (loading) {
    return <CircularProgress />; // Показываем индикатор загрузки
  }

  if (!data || data.length === 0) {
    return <div>Данные не найдены или произошла ошибка загрузки.</div>; // Обработка случая, когда данных нет или ошибка
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Дата подписи компанией</TableCell>
            <TableCell>Имя подписавшего компанию</TableCell>
            <TableCell>Название документа</TableCell>
            <TableCell>Статус документа</TableCell>
            <TableCell>Тип документа</TableCell>
            <TableCell>Номер сотрудника</TableCell>
            <TableCell>Дата подписи сотрудником</TableCell>
            <TableCell>Имя подписавшего сотрудника</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.companySigDate}</TableCell>
              <TableCell>{row.companySignatureName}</TableCell>
              <TableCell>{row.documentName}</TableCell>
              <TableCell>{row.documentStatus}</TableCell>
              <TableCell>{row.documentType}</TableCell>
              <TableCell>{row.employeeNumber}</TableCell>
              <TableCell>{row.employeeSigDate}</TableCell>
              <TableCell>{row.employeeSignatureName}</TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => handleDelete(row.id)}>Удалить</Button>
                <Button variant="contained" color="primary" onClick={() => handleEdit(row.id)}>Редактировать</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;

