import { render, screen } from '@testing-library/react';
import App from './App';

test('renders editor navbar', () => {
  render(<App />);
  const navBrand = screen.getByText(/Markdown editor/i);
  expect(navBrand).toBeInTheDocument();
});
