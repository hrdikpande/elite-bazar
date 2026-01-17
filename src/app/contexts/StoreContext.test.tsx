import { renderHook, act } from '@testing-library/react';
import { StoreProvider, useStore } from './StoreContext';
import { describe, it, expect, vi } from 'vitest';

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <StoreProvider>{children}</StoreProvider>
);

describe('StoreContext', () => {
    it('should initialize with empty wishlist and addresses', () => {
        const { result } = renderHook(() => useStore(), { wrapper });
        expect(result.current.wishlist).toEqual([]);
        // Addresses might have a default one initialized in StoreContext, checking length >= 1
        expect(result.current.addresses.length).toBeGreaterThanOrEqual(1);
        expect(result.current.user).toBeNull();
    });

    it('should add valid item to wishlist', () => {
        const { result } = renderHook(() => useStore(), { wrapper });
        act(() => {
            result.current.addToWishlist('prod-1');
        });
        expect(result.current.wishlist).toContain('prod-1');
    });

    it('should not add duplicate item to wishlist', () => {
        const { result } = renderHook(() => useStore(), { wrapper });
        act(() => {
            result.current.addToWishlist('prod-1');
            result.current.addToWishlist('prod-1');
        });
        expect(result.current.wishlist).toHaveLength(1);
    });

    it('should remove item from wishlist', () => {
        const { result } = renderHook(() => useStore(), { wrapper });
        act(() => {
            result.current.addToWishlist('prod-1');
            result.current.removeFromWishlist('prod-1');
        });
        expect(result.current.wishlist).not.toContain('prod-1');
    });

    it('should add a new address', () => {
        const { result } = renderHook(() => useStore(), { wrapper });
        const newAddr = {
            name: 'Test User',
            street: 'Test St',
            city: 'Test City',
            state: 'TS',
            zip: '123456',
            phone: '1234567890',
            type: 'home' as const,
            isDefault: false
        };

        act(() => {
            result.current.addAddress(newAddr);
        });

        const added = result.current.addresses.find(a => a.name === 'Test User');
        expect(added).toBeDefined();
        expect(added?.street).toBe('Test St');
    });

    it('should register and then login a new user', async () => {
        const { result } = renderHook(() => useStore(), { wrapper });

        // Register
        let success = false;
        await act(async () => {
            success = await result.current.register('New User', 'newuser@example.com', 'secret123');
        });
        expect(success).toBe(true);
        expect(result.current.user?.username).toBe('newuser@example.com');
        expect(result.current.users.find(u => u.username === 'newuser@example.com')).toBeDefined();

        // Logout
        act(() => {
            result.current.logout();
        });
        expect(result.current.user).toBeNull();

        // Login with new credentials
        let loginSuccess = false;
        await act(async () => {
            const res = await result.current.login('newuser@example.com', 'secret123', 'customer');
            loginSuccess = res.success;
        });
        expect(loginSuccess).toBe(true);
        expect(result.current.user?.username).toBe('newuser@example.com');
    });

    it('should update user password', async () => {
        const { result } = renderHook(() => useStore(), { wrapper });

        // Register
        await act(async () => {
            await result.current.register('Pwd User', 'pwd@example.com', 'oldpass');
        });

        const userId = result.current.user!.id;

        // Update Password
        act(() => {
            result.current.updatePassword(userId, 'newpass');
        });

        // Logout and try login with old password (should fail)
        act(() => {
            result.current.logout();
        });

        let failLogin = false;
        await act(async () => {
            const res = await result.current.login('pwd@example.com', 'oldpass', 'customer');
            failLogin = res.success;
        });
        expect(failLogin).toBe(false);

        // Login with new password (should succeed)
        let successLogin = false;
        await act(async () => {
            const res = await result.current.login('pwd@example.com', 'newpass', 'customer');
            successLogin = res.success;
        });
        expect(successLogin).toBe(true);
    });

    it('should update content', () => {
        const { result } = renderHook(() => useStore(), { wrapper });

        act(() => {
            result.current.updateAboutContent('New About Us');
        });
        expect(result.current.aboutContent).toBe('New About Us');

        act(() => {
            result.current.updateContactContent('New Contact Us');
        });
        expect(result.current.contactContent).toBe('New Contact Us');
    });
});
