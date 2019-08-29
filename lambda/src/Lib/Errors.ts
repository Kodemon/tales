import * as debug from "debug";

const log = debug("cmdo:error");

/*
 |--------------------------------------------------------------------------------
 | Error
 |--------------------------------------------------------------------------------
*/

export const error = {
  /**
   * Generates a new error response instance.
   *
   * @param err
   * @param status Response status code, defaults to 500
   *
   * @returns a ErrorResponse instance
   */
  parse(err: Error, status: number = ErrorStatus.INTERNAL_SERVER_ERROR): ErrorResponse {
    return new ErrorResponse(err, status);
  },

  /**
   * Generates a new error response instance based on a axios error object.
   *
   * @param err
   *
   * @returns a ErrorResponse instance
   */
  axios(err: any): ErrorResponse {
    if (err.response) {
      return this.parse(err.response.data, err.response.status);
    } else if (err.request) {
      return this.parse(
        {
          code: "REQUEST_FAILED",
          message: "No response was received from the target server.",
          data: err.request
        },
        ErrorStatus.GATEWAY_TIMEOUT
      );
    } else {
      return this.parse(
        {
          code: "REQUEST_FAILED",
          message: err.message
        },
        ErrorStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
};

/*
 |--------------------------------------------------------------------------------
 | Error Response
 |--------------------------------------------------------------------------------
*/

export class ErrorResponse {
  public readonly status: number;
  public readonly code: string;
  public readonly message: string;
  public readonly data: any;
  public readonly stack?: string;

  /**
   * Returns a new error response instance.
   */
  constructor(err: Error, status: number = ErrorStatus.INTERNAL_SERVER_ERROR) {
    this.status = status;
    this.code = err.code;
    this.message = err.message;
    this.data = err.data;
    this.stack = err.stack;

    log(this.toJSON());
  }

  /**
   * Converts error instance to a JSON object.
   */
  public toJSON(): any {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data,
      stack: this.stack
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Error Shortcuts
 |--------------------------------------------------------------------------------
*/

/**
 * Return a temporary redirect error, used for when you need to move a client
 * from one location to another for any number of reasons.
 *
 * @param msg
 * @param data
 *
 * @returns ErrorResponse
 */
export function temporaryRedirectError(msg?: string, data?: any): ErrorResponse {
  return error.parse(
    {
      code: "TEMPORARY_REDIRECT",
      message: msg || "You are being moved to another location.",
      data
    },
    ErrorStatus.TEMPORARY_REDIRECT
  );
}

/**
 * Return a permanent redirect error, used for when the endpoint/location has
 * been moved to a new endpoint/location.
 *
 * @param msg
 * @param data
 */
export function permanentRedirectError(msg?: string, data?: any): ErrorResponse {
  return error.parse(
    {
      code: "PERMANENT_REDIRECT",
      message: msg || "Location no longer exist, you are being moved to the new location.",
      data
    },
    ErrorStatus.PERMANENT_REDIRECT
  );
}

/**
 * Return an internal error, used for when expected results are not behaving
 * as expected and need to be investigated immediately.
 *
 * @param msg
 * @param data
 *
 * @returns ErrorResponse
 */
export function internalError(msg?: string, data?: any): ErrorResponse {
  return error.parse(
    {
      code: "INTERNAL_SERVER_ERROR",
      message: msg || "Service encountered an internal error, we are looking into it.",
      data
    },
    ErrorStatus.INTERNAL_SERVER_ERROR
  );
}

/**
 * Return a shared not found error, used for reporting an issue retrieving a
 * record from the database.
 *
 * @param name Resource name.
 * @param msg Optional override error message.
 * @param data Optional data to submit with the error.
 *
 * @returns ErrorResponse
 */
export function notFoundError(name: string, msg?: string, data?: any): ErrorResponse {
  return error.parse(
    {
      code: `${name.toUpperCase()}_NOT_FOUND`,
      message: msg || `Could not find the requested ${name.toLowerCase()} in our records.`,
      data
    },
    ErrorStatus.NOT_FOUND
  );
}

/**
 * Return a version error message, used for reporting a conflict in a records
 * version against incoming data.
 *
 * @param msg Optional override error message.
 * @param data Optional data to submit with the error.
 *
 * @returns ErrorResponse
 */
export function versionError(msg?: string, data?: any): ErrorResponse {
  return error.parse(
    {
      code: "VERSION_MISSMATCH",
      message: msg || "Database version conflicts with provided record.",
      data
    },
    ErrorStatus.CONFLICT
  );
}

/**
 * Return a bad request error message, used for reporting issues with data
 * the client is sending to the api.
 *
 * @param msg Optional override error message.
 * @param data Optional data to submit with the error.
 *
 * @returns ErrorResponse
 */
export function badRequestError(msg?: string, data?: any): ErrorResponse {
  return error.parse(
    {
      code: "BAD_REQUEST",
      message: msg || "Provided data is invalid.",
      data
    },
    ErrorStatus.BAD_REQUEST
  );
}

/**
 * Return a conflict error message, used for reporting a conflict in a records
 * current state against incoming data.
 *
 * @param msg Optional override error message.
 * @param data Optional data to submit with the error.
 *
 * @returns ErrorResponse
 */
export function conflictError(msg?: string, data?: any): ErrorResponse {
  return error.parse(
    {
      code: "DATA_CONFLICT",
      message: msg || "Provided data conflicts with the current state of our records.",
      data
    },
    ErrorStatus.CONFLICT
  );
}

/**
 * Return a 401 response informing the client that they must be authorized
 * to fulfill the request.
 *
 * @param msg Optional override error message.
 * @param data Optional data to submit with the error.
 *
 * @returns ErrorResponse
 */
export function unauthorizedError(msg?: string, data?: any): ErrorResponse {
  return error.parse(
    {
      code: "UNAUTHORIZED",
      message: msg || "You must be authenticated to perform this request.",
      data
    },
    ErrorStatus.UNAUTHORIZED
  );
}

/**
 * Return a 403 response informing the client that they do not have the required
 * permissions to fulfill the request.
 *
 * @param msg Optional override error message.
 * @param data Optional data to submit with the error.
 *
 * @returns ErrorResponse
 */
export function forbiddenError(msg?: string, data?: any): ErrorResponse {
  return error.parse(
    {
      code: "FORBIDDEN",
      message: msg || "You do not have permission to perform this request.",
      data
    },
    ErrorStatus.FORBIDDEN
  );
}

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
*/

interface Error {
  id?: string;
  code: string;
  message: string;
  data?: {
    [key: string]: any;
  };
  stack?: string;
}

/*
 |--------------------------------------------------------------------------------
 | Enums
 |--------------------------------------------------------------------------------
*/

export enum ErrorStatus {
  /**
   * This interim response indicates that everything so far is OK and that the client
   * should continue with the request or ignore it if it is already finished.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100
   */
  CONTINUE = 100,

  /**
   * The request has succeeded.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
   */
  OK = 200,

  /**
   * There is no content to send for this request.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
   */
  NO_CONTENT = 204,

  /**
   * This response code is sent after accomplishing request to tell user agent
   * reset document view which sent this request.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/205
   */
  RESET_CONTENT = 205,

  /**
   * This response code means that the URI of the requested resource has been
   * changed.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301
   */
  MOVED_PERMANENTLY = 301,

  /**
   * The server sends this response to direct the client to get the requested
   * resource at another URI with same method that was used in the prior request.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307
   */
  TEMPORARY_REDIRECT = 307,

  /**
   * This means that the resource is now permanently located at another URI.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308
   */
  PERMANENT_REDIRECT = 308,

  /**
   * This response means that server could not understand the request due to
   * invalid syntax.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
   */
  BAD_REQUEST = 400,

  /**
   * Although the HTTP standard specifies "unauthorized", semantically this
   * response means "unauthenticated". That is, the client must authenticate
   * itself to get the requested response.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
   */
  UNAUTHORIZED = 401,

  /**
   * The client does not have access rights to the content, i.e. they are
   * unauthorized, so server is rejecting to give proper response. Unlike
   * UNAUTHORIZED, the client's identity is known to the server.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
   */
  FORBIDDEN = 403,

  /**
   * The server can not find requested resource, this means that the endpoint is
   * valid but the resource itself does not exist. Servers may also send this
   * response instead of 403 to hide the existence of a resource from an
   * unauthorized client.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
   */
  NOT_FOUND = 404,

  /**
   * The request method is known by the server but has been disabled and cannot
   * be used. For example, an API may forbid DELETE-ing a resource
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
   */
  METHOD_NOT_ALLOWED = 405,

  /**
   * The request method is known by the server but has been disabled and cannot
   * be used. For example, an API may forbid DELETE-ing a resource.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
   */
  NOT_ACCEPTABLE = 406,

  /**
   * This response is sent when a request conflicts with the current state of
   * the server.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
   */
  CONFLICT = 409,

  /**
   * This response would be sent when the requested content has been permanently
   * deleted from server, with no forwarding address. Clients are expected to
   * remove their caches and links to the resource.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410
   */
  GONE = 410,

  /**
   * Request entity is larger than limits defined by server.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413
   */
  PAYLOAD_TOO_LARGE = 413,

  /**
   * The media format of the requested data is not supported by the server, so
   * the server is rejecting the request.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415
   */
  UNSUPPORTED_MEDIA_TYPE = 415,

  /**
   * The server refuses to perform the request using the current protocol but
   * might be willing to do so after the client upgrades to a different
   * protocol.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426
   */
  UPGRADE_REQUIRED = 426,

  /**
   * The origin server requires the request to be conditional. Intended to
   * prevent the 'lost update' problem, where a client GETs a resource's state,
   * modifies it, and PUTs it back to the server, when meanwhile a third party
   * has modified the state on the server, leading to a conflict.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428
   */
  PRECONDITION_REQUIRED = 428,

  /**
   * The user requests an illegal resource, such as a web page censored by a
   * government.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451
   */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  /**
   * The server has encountered a situation it doesn't know how to handle.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
   */
  INTERNAL_SERVER_ERROR = 500,

  /**
   * The request method is not supported by the server and cannot be
   * handled.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
   */
  NOT_IMPLEMENTED = 501,

  /**
   * This error response means that the server, while working as a gateway to
   * get a response needed to handle the request, got an invalid response.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
   */
  BAD_GATEWAY = 502,

  /**
   * The server is not ready to handle the request. Common causes are a
   * server that is down for maintenance or that is overloaded.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
   */
  SERVICE_UNAVAILABLE = 503,

  /**
   * This error response is given when the server is acting as a gateway and
   * cannot get a response in time.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
   */
  GATEWAY_TIMEOUT = 504
}

export function generateErrorObject(message: string) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      error: message
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
}
