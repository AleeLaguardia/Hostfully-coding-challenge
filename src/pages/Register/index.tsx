import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, FormContainer, Title, ErrorMessage, LinkContainer } from "./style";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { theme } from "../../utils/theme";
import { registerUser } from "../../store/slice/authSlice";
import { RootState, AppDispatch } from "../../store";
import { PATH } from "../../utils/strings";
import LogoIcon from '../../assets/purple-logo-1.png';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateName = (name: string): boolean => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name) && name.trim().length >= 2;
  };

  const handleRegister = async () => {
    let hasError = false;

    if (!validateName(name)) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (password.length < 6) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      hasError = true;
    } else {
      setConfirmPasswordError(false);
    }

    if (!hasError) {
      const result = await dispatch(registerUser({ name, email, password }));
      if (registerUser.fulfilled.match(result)) {
        navigate(PATH.HOME);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <Container>
      <FormContainer as="form" onSubmit={handleSubmit}>
        <img src={LogoIcon} alt="Logo" className="logo" />
        <Title>Create Account</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          error={nameError}
        />
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
          placeholder="Password (min 6 characters)"
          error={passwordError}
          type="password"
        />
        <Input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          error={confirmPasswordError}
          type="password"
        />
        <Button
          color={theme.colors.purple}
          colorHover={theme.colors.purpleHover}
          onClick={handleRegister}
          label={isLoading ? "Loading..." : "Register"}
          width="100%"
          type="submit"
        />
        <LinkContainer>
          <span>Already have an account?</span>
          <Link to={PATH.LOGIN}>Login</Link>
        </LinkContainer>
      </FormContainer>
    </Container>
  );
};

export default Register;
