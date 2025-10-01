export { };
declare global {
  namespace Models {
    interface IRole {
      _id?: string;
      key: string;
      name: string;
      desc?: string;
      level?: number;
      color?: string;
      routes?: string[];
      flag?: number;
      created?: ICreated;
    }
  }
}