import React from 'react';
import { fireEvent, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Button from '..';
import { theme } from '../../../utils/theme';
import { ThemeProvider } from 'styled-components';

describe('Button Component', () => {
  it('renders Button with the default style', () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <Button onClick={() => {}} label='test' type='primary' />
      </ThemeProvider>
    );

    expect(asFragment).toMatchSnapshot();
  });

  it('fires an event when clicked', () => {
    const setStateMock = jest.fn();

    const { container } = render(
      <ThemeProvider theme={theme}>
        <Button onClick={() => setStateMock()} label='test' type='primary' />
      </ThemeProvider>
    );

    const button = getByText(container, 'test');
    fireEvent.click(button);
    expect(setStateMock).toHaveBeenCalled();
  })
});
