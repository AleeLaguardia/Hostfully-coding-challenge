import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, ProfileButton, DropdownMenu, UserName, MenuItem, AuthButtons } from "./style";
import Button from "../Button";
import { theme } from "../../utils/theme";
import { logout } from "../../store/slice/authSlice";
import { RootState } from "../../store";
import { PATH } from "../../utils/strings";
import UserIcon from '../../assets/icons/user.svg';
import BookingIcon from '../../assets/icons/booking.svg';
import useClickOutside from "../../utils/hooks/useClickOutside";

const AuthHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useClickOutside(() => setIsMenuOpen(false));

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate(PATH.LOGIN);
  };

  const handleReservation = () => {
    setIsMenuOpen(false);
    navigate(PATH.RESERVATION);
  };

  if (isAuthenticated && user) {
    return (
      <Container ref={menuRef}>
        <ProfileButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <img src={UserIcon} alt="Profile" />
        </ProfileButton>
        {isMenuOpen && (
          <DropdownMenu>
            <UserName>{user.name}</UserName>
            <MenuItem onClick={handleReservation}>
              <img src={BookingIcon} alt="Reservation" />
              <span>Reservation</span>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <img src={UserIcon} alt="Logout" />
              <span>Logout</span>
            </MenuItem>
          </DropdownMenu>
        )}
      </Container>
    );
  }

  return (
    <AuthButtons>
      <Button
        color={theme.colors.white}
        colorHover={theme.colors.galery}
        labelColor={theme.colors.purple}
        borderColor={theme.colors.purple}
        onClick={() => navigate(PATH.LOGIN)}
        label="Login"
      />
      <Button
        color={theme.colors.purple}
        colorHover={theme.colors.purpleHover}
        onClick={() => navigate(PATH.REGISTER)}
        label="Register"
      />
    </AuthButtons>
  );
};

export default AuthHeader;
