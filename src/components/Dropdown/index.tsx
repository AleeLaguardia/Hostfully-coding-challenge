import React from "react";
import ArrowIcon from '../../assets/icons/arrow.svg';
import { Container, Icon, Item, OptionsContainer } from "./style";

const example = ['Place 1', 'Place 2', 'Place 3', 'Place 4', 'Place 5', 'Place 6'];

interface Props {
  isDropdownOpen: boolean;
  optionSelected: string;
  options?: string[];
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOptionSelected: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  'data-testid'?: string;
  error: boolean;
  width?: string;
}

const Dropdown: React.FC<Props> = ({
  options = example,
  isDropdownOpen,
  optionSelected,
  setIsDropdownOpen,
  setOptionSelected,
  placeholder,
  error,
  'data-testid': testId,
  width,
}) => {
  const handleOptionSelected = (option: string) => {
    setOptionSelected(option);
  }

  return (
    <Container width={width} error={error} onClick={() => setIsDropdownOpen((prevState) => !prevState)} data-testid={testId}>
      <Item isOpen={false}>
        <span>{optionSelected || placeholder}</span>
        <Icon src={ArrowIcon} alt="ArrowIcon" isDropdownOpen={isDropdownOpen} />
      </Item>
      {isDropdownOpen && (
        <OptionsContainer width={width} isDropdownOpen={isDropdownOpen}>
          {options.map((i, index) => (
            <Item isOpen key={index} onClick={() => handleOptionSelected(i)}>
              <span>{i}</span>
            </Item>
          ))}
        </OptionsContainer>
      )}
    </Container>
  );
};

export default Dropdown;
