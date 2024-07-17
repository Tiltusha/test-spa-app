import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
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

interface AddFormProps {
  open: boolean;
  handleClose: () => void;
  addData: (newItem: DataItem) => void;
}

const AddForm: React.FC<AddFormProps> = ({ open, handleClose, addData }) => {
  const [formData, setFormData] = useState<DataItem>({
    id: 0,
    companySigDate: '',
    companySignatureName: '',
    documentName: '',
    documentStatus: '',
    documentType: '',
    employeeNumber: '',
    employeeSigDate: '',
    employeeSignatureName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/set',
        formData,
        {
          headers: {
            'x-auth': localStorage.getItem('authToken') || '',
          }
        }
      );

      if (response.data.error_code === 0) {
        addData(response.data.data);
        handleClose();
      } else {
        console.error('Ошибка при добавлении записи:', response.data.error_message);
      }
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Добавить запись</DialogTitle>
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
        <Button onClick={handleClose} color="secondary">
          Отмена
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddForm;
