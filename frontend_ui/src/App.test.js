import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders navigation links and sections', async () => {
  render(<App />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
  // nav links
  expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();

  // sections by headings
  expect(screen.getByRole('heading', { name: /Designing delightful/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Projects/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /About & Skills/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Contact/i })).toBeInTheDocument();
});

test('theme toggle button exists and toggles', async () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /Switch to dark mode|Switch to light mode/i });
  expect(btn).toBeInTheDocument();
  await userEvent.click(btn);
});
