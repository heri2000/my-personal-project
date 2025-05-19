export type TMember = {
  id: string,
  regNumber: string,
  name: string,
  gender: string,
  address: string | null,
  birthDate: string | null,
  phone1: string | null,
  phone2: string | null,
  marriageDate: string | null,
  category: string | null,
  createdAt: Date | null,
  updatedAt: Date | null,
  deletedAt: Date | null,
}

export type TAuthorization = {
  sessionId: string | null,
  errorCode: number | null,
  message: string | null,
}
