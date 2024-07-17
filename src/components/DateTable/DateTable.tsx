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

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [editData, setEditData] = useState<DataItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

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
      setData([]);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.post(`https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/delete/${id}`, null, {
        headers: {
          'x-auth': localStorage.getItem('authToken') || ''
        }
      });
      const updatedData = data?.filter(item => item.id !== id);
      setData(updatedData || null);
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
    }
  };

  const handleEdit = (id: number) => {
    const itemToEdit = data?.find(item => item.id === id);
    if (itemToEdit) {
      setEditData(itemToEdit);
      setOpenEditForm(true);
    }
  };

  const handleCloseEditForm = () => {
    setEditData(null);
    setOpenEditForm(false);
  };

  const updateData = () => {
    fetchData(); // Обновляем данные после изменения
  };

  const handleCreate = () => {
    setOpenEditForm(true);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!data || data.length === 0) {
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

interface EditFormProps {
  handleClose: () => void;
  dataItem: DataItem | null;
  updateData: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ handleClose, dataItem, updateData }) => {
  const [formData, setFormData] = useState<DataItem>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = formData.id
        ? `https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/set/${formData.id}`
        : 'https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/create';

      const response = await axios.post(url, formData, {
        headers: {
          'x-auth': localStorage.getItem('authToken') || ''
        }
      });

      updateData(); // Обновляем данные после сохранения
      handleClose(); // Закрываем форму
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  };

  return (
    <div>
      <TextField
        name="companySigDate"
        label="Дата подписи компанией"
        value={formData.companySigDate}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="companySignatureName"
        label="Имя подписавшего компанию"
        value={formData.companySignatureName}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="documentName"
        label="Название документа"
        value={formData.documentName}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="documentStatus"
        label="Статус документа"
        value={formData.documentStatus}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="documentType"
        label="Тип документа"
        value={formData.documentType}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="employeeNumber"
        label="Номер сотрудника"
        value={formData.employeeNumber}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="employeeSigDate"
        label="Дата подписи сотрудником"
        value={formData.employeeSigDate}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="employeeSignatureName"
        label="Имя подписавшего сотрудника"
        value={formData.employeeSignatureName}
        onChange={handleChange}
        fullWidth
      />
      <Button onClick={handleSubmit} color="primary">Сохранить</Button>
    </div>
  );
};

export default DataTable;
