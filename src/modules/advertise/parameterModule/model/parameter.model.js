import { Schema, model } from 'mongoose';

const parameterSchema = new Schema({});

const ParameterModel = model('parameter', parameterSchema);

export default ParameterModel;
