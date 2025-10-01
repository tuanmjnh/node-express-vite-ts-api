export { };
declare global {
  namespace Models {
    interface ICreated {
      at: number;
      by?: string;
      ip?: string;
    }

    interface IFileAttach {
      _id?: string;
      public_id?: string;
      url: string;
      type?: string;
      size?: number;
      created_at?: number;
    }
  }
}
