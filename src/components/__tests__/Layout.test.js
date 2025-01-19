import React from 'react';
import { render, screen } from '../../setupTests/test-utils';
import Layout from '../Layout';

// Mock the images
jest.mock('../../assets/light.png', () => 'light-logo');
jest.mock('../../assets/dark.png', () => 'dark-logo');
jest.mock('../../assets/moe.png', () => 'moe-image');

describe('Layout', () => {
  it('renders without crashing', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
}); 