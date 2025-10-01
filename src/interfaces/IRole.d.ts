export { };
declare global {
  namespace Models {
    interface Role {
      key: string;
      name: string;
      desc?: string;
      level?: number;
      color?: string;
      routes?: string[];
      flag?: number;
      created?: ICreated;
    }
    interface IRole extends Role {
      _id?: string;
    }
  }
}