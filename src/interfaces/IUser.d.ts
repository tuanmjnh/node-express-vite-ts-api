export { };
declare global {
  namespace Models {
    interface User {
      account: string;
      password: string;
      salt?: string;
      name: string;
      email: string;
      phone?: string;
      group?: string;
      roles?: string[];
      avatars?: IFileAttach[];
      verified?: boolean;
      status?: 'active' | 'inactive' | 'banned';
      createdAt?: number;
      updatedAt?: number;
    }
    interface IUser extends User {
      _id?: string;
    }
  }
}