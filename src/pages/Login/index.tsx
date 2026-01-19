import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, FormContainer, Title, ErrorMessage, LinkContainer } from "./style";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { theme } from "../../utils/theme";
import { loginUser } from "../../store/slice/authSlice";
import { RootState, AppDispatch } from "../../store";
import { PATH } from "../../utils/strings";
import LogoIcon from '../../assets/purple-logo-1.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    let hasError = false;

    if (!validateEmail(email)) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (password.length === 0) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (!hasError) {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        const from = (location.state as any)?.from?.pathname || PATH.HOME;
        navigate(from);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Container>
      <FormContainer as="form" onSubmit={handleSubmit}>
        <img src={LogoIcon} alt="Logo" className="logo" />
        <Title>Welcome Back</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          error={emailError}
          type="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          error={passwordError}
          type="password"
        />
        <Button
          color={theme.colors.purple}
          colorHover={theme.colors.purpleHover}
          onClick={handleLogin}
          label={isLoading ? "Loading..." : "Login"}
          width="100%"
          type="submit"
        />
        <LinkContainer>
          <span>Don't have an account?</span>
          <Link to={PATH.REGISTER}>Register</Link>
        </LinkContainer>
      </FormContainer>
    </Container>
  );
};

export default Login;
