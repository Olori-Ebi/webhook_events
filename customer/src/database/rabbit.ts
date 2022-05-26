/* eslint-disable no-import-assign */

import { AMQP_URI } from "../config";
var amqp = require('amqplib/callback_api');

export default function (cb: any) {
  amqp.connect(AMQP_URI, function (err: any, conn: any) {
    if (err) {
      throw new Error(err);
    }
    cb(conn);
  });
};