import React from 'react';
import { fireEvent, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dropdown from '..';
import { theme } from '../../../utils/theme';
import { ThemeProvider } from 'styled-components';

describe('Dropdown Component', () => {
  const example = ['Place 1', 'Place 2', 'Place 3', 'Place 4', 'Place 5', 'Place 6'];

  const isDropdownOpenMock = false;
    const optionSelectedMock = 'test'
    const setIsDropdownOpen = jest.fn();
    const setOptionSelectedMock = jest.fn();

  it('renders Dropdown with the default style', () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <Dropdown
          data-testid='testid'
          options={example}
          isDropdownOpen={isDropdownOpenMock}
          optionSelected={optionSelectedMock}
          setIsDropdownOpen={setIsDropdownOpen}
          setOptionSelected={setOptionSelectedMock}
          placeholder='test'
        />
      </ThemeProvider>
    );

    expect(asFragment).toMatchSnapshot();
  });

  it('Opens dropdown when clicked', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Dropdown
          data-testid='testid'
          placeholder='test'
          options={example}
          isDropdownOpen={isDropdownOpenMock}
          optionSelected={optionSelectedMock}
          setIsDropdownOpen={setIsDropdownOpen}
          setOptionSelected={setOptionSelectedMock}
        />
      </ThemeProvider>
    );

    const dropdown = getByText(container, 'test');
    fireEvent.click(dropdown);
    expect(setIsDropdownOpen).toHaveBeenCalled();
    expect(isDropdownOpenMock).toBeTruthy;
  })

  it('Selects an option when clicking an item', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Dropdown
          data-testid='testid'
          placeholder='test'
          options={example}
          isDropdownOpen={true}
          optionSelected={example[0]}
          setIsDropdownOpen={setIsDropdownOpen}
          setOptionSelected={setOptionSelectedMock}
        />
      </ThemeProvider>
    );

    const dropdownOption = getByText(container, 'Place 2');
    fireEvent.click(dropdownOption);
    expect(setOptionSelectedMock).toHaveBeenCalledWith('Place 2');
    expect(setIsDropdownOpen).toHaveBeenCalled();
  })
});
