import { create } from 'zustand';
import type { Slot, Service, Therapist } from '@/lib/api';

interface BookingStore {
  therapist: Therapist | null;
  service: Service | null;
  selectedSlot: Slot | null;
  step: 'select-service' | 'select-slot' | 'intake' | 'confirm' | 'done';
  setTherapist: (t: Therapist) => void;
  setService: (s: Service) => void;
  setSlot: (s: Slot) => void;
  setStep: (step: BookingStore['step']) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  therapist: null, service: null, selectedSlot: null, step: 'select-service',
  setTherapist: (therapist) => set({ therapist }),
  setService: (service) => set({ service, step: 'select-slot' }),
  setSlot: (selectedSlot) => set({ selectedSlot, step: 'intake' }),
  setStep: (step) => set({ step }),
  reset: () => set({ therapist: null, service: null, selectedSlot: null, step: 'select-service' }),
}));
