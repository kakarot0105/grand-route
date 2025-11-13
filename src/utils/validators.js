import * as Yup from 'yup'

export const emailSchema = Yup.string().email('Invalid email').required('Required')
export const passwordSchema = Yup.string().min(8, 'Min 8 characters').required('Required')

