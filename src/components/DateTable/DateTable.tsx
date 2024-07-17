import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
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

const DataTable: React.FC = () => { // компонент таблицы
  const [data, setData] = useState<DataItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [editData, setEditData] = useState<DataItem | null>(null);

  useEffect(() => { // эффект для получения данных
    fetchData();
  }, []);


  const fetchData = async () => { // функция для получения данных
    try { // Запрос на получение данных
      const response = await axios.get('https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/get', {
        headers: {
          'x-auth': localStorage.getItem('authToken') || ''
        }
      }); // Обработка полученных данных
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      setData([]); // Очистка данных в случае ошибки
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try { // Запрос на удаление данных
      await axios.post(`https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/delete/${id}`, null, {
        headers: { // Обработка полученных данных
          'x-auth': localStorage.getItem('authToken') || ''
        }
      });
      const updatedData = data?.filter(item => item.id !== id);
      setData(updatedData || null);
    } catch (error) { // Очистка данных в случае ошибки
      console.error('Ошибка при удалении записи:', error);
    }
  };

  const handleEdit = (id: number) => { // функция для открытия формы редактирования
    const itemToEdit = data?.find(item => item.id === id);
    if (itemToEdit) { // Обработка полученных данных
      setEditData(itemToEdit);
      setOpenEditForm(true); 
    }
  };

  const handleCloseEditForm = () => { // функция для закрытия формы редактирования
    setEditData(null);
    setOpenEditForm(false);
  };

  const updateData = () => { // функция для обновления данных
    fetchData(); // Обновляем данные после изменения
  };

  const handleCreate = () => { // функция для открытия формы создания
    setOpenEditForm(true);
  };

  if (loading) { // Отображение индикатора загрузки
    return <CircularProgress />;
  }

  if (!data || data.length === 0) { // Отображение сообщения при отсутствии данных
    return <div>Данные не найдены или произошла ошибка загрузки.</div>;
  }

  return (
    <>
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

      <Dialog open={openEditForm} onClose={handleCloseEditForm}>
        <DialogTitle>Редактирование записи</DialogTitle>
        <DialogContent>
          <EditForm
            handleClose={handleCloseEditForm}
            dataItem={editData}
            updateData={updateData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditForm}>Отмена</Button>
        </DialogActions>
      </Dialog>

      <Button variant="contained" color="primary" onClick={handleCreate}>Создать запись</Button>
    </>
  );
};

interface EditFormProps { // интерфейс для формы редактирования
  handleClose: () => void; // функция для закрытия формы
  dataItem: DataItem | null; // данные для редактирования
  updateData: () => void; // функция для обновления данных
}

const EditForm: React.FC<EditFormProps> = ({ handleClose, dataItem, updateData }) => { // компонент формы редактирования
  const [formData, setFormData] = useState<DataItem>({ // состояние для хранения данных формы
    id: dataItem ? dataItem.id : 0,
    companySigDate: dataItem ? dataItem.companySigDate : '',
    companySignatureName: dataItem ? dataItem.companySignatureName : '',
    documentName: dataItem ? dataItem.documentName : '',
    documentStatus: dataItem ? dataItem.documentStatus : '',
    documentType: dataItem ? dataItem.documentType : '',
    employeeNumber: dataItem ? dataItem.employeeNumber : '',
    employeeSigDate: dataItem ? dataItem.employeeSigDate : '',
    employeeSignatureName: dataItem ? dataItem.employeeSignatureName : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // функция для изменения данных формы
    const { name, value } = e.target;
    setFormData(prevData => ({ // обновление данных формы
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => { // функция для сохранения данных
    try { // обработка ошибок
      const url = formData.id
        ? `https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/set/${formData.id}`
        : 'https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/create';

      const response = await axios.post(url, formData, {
        headers: { // обработка полученных данных
          'x-auth': localStorage.getItem('authToken') || ''
        }
      });

      updateData(); // Обновляем данные после сохранения
      handleClose(); // Закрываем форму
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  };

  return ( // возвращаем форму
    <div>
      <TextField id="filled-basic" variant="filled"
        name="companySigDate"
        label="Дата подписи компанией"
        value={formData.companySigDate}
        onChange={handleChange}
        fullWidth
      />
      <TextField id="filled-basic" variant="filled"
        name="companySignatureName"
        label="Имя подписавшего компанию"
        value={formData.companySignatureName}
        onChange={handleChange}
        fullWidth
      />
      <TextField id="filled-basic" variant="filled"
        name="documentName"
        label="Название документа"
        value={formData.documentName}
        onChange={handleChange}
        fullWidth
      />
      <TextField id="filled-basic" variant="filled"
        name="documentStatus"
        label="Статус документа"
        value={formData.documentStatus}
        onChange={handleChange}
        fullWidth
      />
      <TextField id="filled-basic" variant="filled"
        name="documentType"
        label="Тип документа"
        value={formData.documentType}
        onChange={handleChange}
        fullWidth
      />
      <TextField id="filled-basic" variant="filled"
        name="employeeNumber"
        label="Номер сотрудника"
        value={formData.employeeNumber}
        onChange={handleChange}
        fullWidth
      />
      <TextField id="filled-basic" variant="filled"
        name="employeeSigDate"
        label="Дата подписи сотрудником"
        value={formData.employeeSigDate}
        onChange={handleChange}
        fullWidth
      />
      <TextField id="filled-basic" variant="filled"
        name="employeeSignatureName"
        label="Имя подписавшего сотрудника"
        value={formData.employeeSignatureName}
        onChange={handleChange}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit} color="primary">Сохранить</Button>
    </div>
  );
};

export default DataTable;


