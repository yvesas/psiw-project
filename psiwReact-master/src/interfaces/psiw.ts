export type PsiwType = 'presente' | 'sentimento' | 'indagacao' | 'wow';

export interface PageProps {
  formData: {
    name: string;
    psiwType: PsiwType;
    whatsapp: string;
    recipientName: string;
    recipientWhatsapp: string;
    file: File | null;
    psiwId?: string;
  };
  handleFormChange: (field: string, value: string | PsiwType | File | null) => void;
  handlePageChange: (value: number) => void;
}

export const psiwMap = {
  presente: 'blue',
  sentimento: 'pink',
  indagacao: 'yellow',
  wow: 'green',
};

export interface FormData {
  name: string;
  psiwType: PsiwType;
  whatsapp: string;
  recipientName: string;
  recipientWhatsapp: string;
  file: File | null;
}

export interface Test {
  formData: {
    psiwSent: string;
    file: File | null;
  };
  shareId?: string | null;
  handleFormChange: (field: string, value: string | PsiwType | File | null) => void;
  handlePageChange: (value: number) => void;
}


export interface MediaData {
  psiwId: string
  psiwType: PsiwType
  viewedFile: string
}

export interface IMediaData extends Test {
  mediaData: MediaData
  handleShare: (value: string) => void;
}