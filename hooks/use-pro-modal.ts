import { create } from 'zustand';
import type { Currency } from '@/constants/index';

export interface ProModalPrefill {
  tokens?: number;
  currency?: Currency;
}

interface useProModalStore {
  isOpen: boolean;
  prefill: ProModalPrefill | null;
  onOpen: () => void;
  openWithPrefill: (prefill: ProModalPrefill) => void;
  onClose: () => void;
}

export const useProModal = create<useProModalStore>((set) => ({
  isOpen: false,
  prefill: null,
  onOpen: () => set({ isOpen: true, prefill: null }),
  openWithPrefill: (prefill) => set({ isOpen: true, prefill }),
  onClose: () => set({ isOpen: false }),
}));
