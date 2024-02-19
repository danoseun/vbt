import { ClientSession } from "mongodb";
import { Model } from "mongoose";

interface GenericInterface<T> {
  [key: string]: T;
}

class BaseService {
  model: typeof Model;
  constructor(model: Model<any, {}, {}, {}, any, any>) {
    this.model = model;
  }

  create(resource: GenericInterface<any>, session?: { session: ClientSession; }) {
    return this.model.create(resource);
  }

  update(id: any, updateParams: any, session?: { session: ClientSession; }) {
    return this.model.findOneAndUpdate(id, updateParams, { new: true })
  }

  index(options = {}, page: number, perPage: number) {
    return this.model
      .find(options)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .exec();
  }

  find(options = {}) {
    return this.model.find(options).exec();
  }

  show(field: string, value: any) {
    return this.model.findOne({ [field]: value }).exec();
  }
}

export default BaseService;
