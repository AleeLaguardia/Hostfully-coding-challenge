import styled from "styled-components";

export const Container = styled.div<{ error: boolean; width?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: ${(props) => props.width ? props.width : '160px'};
  height: fit-content;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 5px;
  border: ${(props) => props.error ? `1px solid ${props.theme.colors.radicalRed}` : 'none'};
  margin-top: 10px;
`;

export const Item = styled.div<{ isOpen: boolean }>`
  display: flex;
  min-height: 40px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.white};
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;

  &:hover {
    background-color: ${(props) => props.isOpen ? props.theme.colors.galery : 'transparent'};
  }

  span {
    color: ${(props) => props.theme.colors.purple};
    font-family: ${(props) => props.theme.fonts.poppins};
    font-size: ${(props) => props.theme.sizes.xs};
  }
`;

export const Icon = styled.img<{ isDropdownOpen: boolean }>`
  height: 20px;
  width: 20px;
  transition: 0.3s ease-in-out;
  transform: rotate(${(props) => props.isDropdownOpen ? '180deg' : 0});
`;

export const OptionsContainer = styled.div<{ isDropdownOpen: boolean; width?: string }>`
  @keyframes changeOpacityOpen {
    0% { opacity: 0 },
    100% { opacity: 1 },
  };

  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: ${(props) => props.width ? props.width : '160px'};
  max-height: 170px;
  background-color: ${(props) => props.theme.colors.white};
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border: none;
  overflow-y: auto;
  margin-top: 40px;
  animation: changeOpacityOpen 0.3s;
  box-shadow: 0px 10px 5px 0px rgba(0,0,0,0.2);
`;