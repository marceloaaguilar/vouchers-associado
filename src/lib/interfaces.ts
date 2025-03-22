import { JWTPayload } from 'jose';

export interface FormProps {
  show: boolean
  onChange?: (updatedValue: boolean) => void
  back?: (updatedValue: boolean) => void
  data?: {
    cpfLogin: string
  }
  dataOnChange?: (updatedValue: string) => void
}

export interface DialogProps {
  show: boolean
  title: string
  description?: string
  impediment? : boolean
  onChange?: (updatedValue: boolean) => void
}

export interface CookiesProps{
  name: string
  value: string
}

export type AccessTokenPayload = JWTPayload