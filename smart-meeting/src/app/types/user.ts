// ユーザー情報
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  privilege?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
