import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearUserError, forgotPasswordThunk, userSelector } from '@slices';
import { Preloader } from '@ui';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector(userSelector);
  const isLoading = userState.isLoading;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    dispatch(forgotPasswordThunk({ email: email }))
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    dispatch(clearUserError());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
