import React, { Suspense } from 'react'
import AuthModalContent from '../auth/AuthModalContent'

// AuthModalProps same types yahan bhi chahiye
interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'register';
    redirectTo?: string;
    onSuccess?: () => void;
}

export default function AuthModal(props: AuthModalProps) {
  return (
    <Suspense fallback={null}>
      <AuthModalContent {...props} />
    </Suspense>
  )
}