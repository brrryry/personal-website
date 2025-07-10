import moment from "moment";
import { ObjectId } from "mongodb";
import _ from "lodash";
import { BadRequestError } from "./errors";

export const isNonEmptyArray = (arr, name = "Array input") => {
  if (!arr) throw new BadRequestError(`${name} is not provided.`);
  if (!Array.isArray(arr))
    throw new BadRequestError(`${name} is not an array.`);
  if (arr.length === 0) throw new BadRequestError(`${name} is empty.`);

  return arr;
};

export const isNonEmptyObject = (obj, name = "Object input") => {
  if (!obj) throw new BadRequestError(`${name} is not provided.`);
  if (Array.isArray(obj)) throw new BadRequestError(`${name} is an array.`);
  if (typeof obj !== "object")
    throw new BadRequestError(`${name} is not an object.`);
  if (Object.keys(obj).length === 0)
    throw new BadRequestError(`${name} is empty.`);

  return obj;
};

export const isValidString = (
  input,
  name = "String input",
  allow_empty = false
) => {
  if (!input) throw new BadRequestError(`${name} is not provided.`);
  if (typeof input !== "string")
    throw new BadRequestError(`${name} is not a string.`);
  if (!allow_empty && input.trim().length === 0)
    throw new BadRequestError(`${name} is blank.`);

  return input.trim();
};

export const isValidNumber = (num, name = "Number input") => {
  if (typeof num !== "number")
    throw new BadRequestError(`${name} is not a number.`);
  if (!(!!num || num === 0))
    throw new BadRequestError(`${name} is not a valid number.`);

  return num;
};

export const isFiniteNumber = (num, name = "Number input") => {
  num = isValidNumber(num, name);
  if (!isFinite(num))
    throw new BadRequestError(`${name} is not a finite number`);

  return num;
};

export const isBool = (bool, name = "Boolean input") => {
  if (typeof bool !== "boolean")
    throw new BadRequestError(`${name} is not a boolean.`);
  return bool;
};

export const stringToOid = (id) => {
  id = isValidString(id, "ObjectId", false);
  if (!ObjectId.isValid(id)) throw new BadRequestError("Invalid ObjectId");
  return new ObjectId(id);
};

export const isValidUnix = (eventDate) => {
  if (!eventDate) throw new BadRequestError("No eventDate");
  if (typeof eventDate !== "number")
    throw new BadRequestError("eventDate not a int");
  if (!moment.unix(eventDate).isValid())
    throw new BadRequestError("eventDate not valid unix");
  return eventDate;
};