import DocumentProvider from '@/context/documentContext';
import { DocType } from '@/types/Document';
import { ReactNode } from 'react';

export default function DocumentLayout({ children }: { children: ReactNode }) {
  return <DocumentProvider documentType={DocType.InternalIncoming}>{children}</DocumentProvider>;
}