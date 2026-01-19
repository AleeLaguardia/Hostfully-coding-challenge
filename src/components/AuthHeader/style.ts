import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const ProfileButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.purple};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.purpleHover};
  }

  img {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  min-width: 200px;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
`;

export const UserName = styled.div`
  padding: 16px;
  font-family: ${(props) => props.theme.fonts.poppins};
  font-size: ${(props) => props.theme.sizes.xs};
  font-weight: 600;
  color: ${(props) => props.theme.colors.purple};
  border-bottom: 1px solid ${(props) => props.theme.colors.galery};
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-family: ${(props) => props.theme.fonts.poppins};
  font-size: ${(props) => props.theme.sizes.xs};
  color: ${(props) => props.theme.colors.emperor};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.alabaster};
  }

  img {
    width: 18px;
    height: 18px;
    filter: brightness(0);
  }
`;

export const AuthButtons = styled.div`
  display: flex;
  gap: 8px;
`;
