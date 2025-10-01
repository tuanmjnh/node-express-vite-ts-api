export { };
declare global {
  namespace Models {
    interface Group {
      type: string;
      code: string;
      title: string;
      desc?: string;
      level?: number;
      color?: string;
      flag?: number;
      created?: ICreated;
    }
    interface IGroup extends Group {
      _id?: string;
    }
  }
}
