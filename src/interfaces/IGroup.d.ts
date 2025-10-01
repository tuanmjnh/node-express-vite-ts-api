export { };
declare global {
  namespace Models {
    interface IGroup {
      _id?: string;
      type: string;
      code: string;
      title: string;
      desc?: string;
      level?: number;
      color?: string;
      flag?: number;
      created?: ICreated;
    }
  }
}
