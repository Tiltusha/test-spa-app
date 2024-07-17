import { Button } from '@mui/material';

function ClearToken() {
  const handleToken = () => {
    localStorage.removeItem('authToken'); // удаление токена из localStorage
  };

  return (
    <div>
      <Button variant='contained' color='error' onClick={handleToken}>Удалить Токен</Button>
    </div>
  )
}

export default ClearToken

