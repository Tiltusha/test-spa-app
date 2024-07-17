import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
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

interface EditFormProps {
  open: boolean;
  handleClose: () => void;
  dataItem: DataItem;
  updateData: () => void; // Обновление данных без параметров
}

const EditForm: React.FC<EditFormProps> = ({ open, handleClose, dataItem, updateData }) => {
  const [formData, setFormData] = useState<DataItem>(dataItem); // Используем тип DataItem для formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/set/${formData.id}`, formData, {
        headers: {
          'x-auth': localStorage.getItem('authToken') || ''
        }
      });
      updateData(); // Вызываем метод обновления данных
      handleClose(); // Закрываем форму после успешного сохранения
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      // Обработка ошибки сохранения данных
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Редактирование записи</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit} color="primary">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditForm;
