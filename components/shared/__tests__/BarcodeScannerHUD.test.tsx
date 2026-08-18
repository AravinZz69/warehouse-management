import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarcodeScannerHUD } from '../BarcodeScannerHUD';

describe('BarcodeScannerHUD React Component Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Asserts camera permission request (navigator.mediaDevices.getUserMedia) fires on mount', async () => {
    const getUserMediaMock = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    } as unknown as MediaStream);

    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: getUserMediaMock,
      },
    });

    render(<BarcodeScannerHUD autoStartCamera={true} />);

    // Check that header title is displayed
    expect(screen.getByText(/Hardware Camera Barcode Scanner HUD/i)).toBeInTheDocument();

    // Assert navigator.mediaDevices.getUserMedia was called on component mount
    expect(getUserMediaMock).toHaveBeenCalledTimes(1);
    expect(getUserMediaMock).toHaveBeenCalledWith({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
    });
  });
});
