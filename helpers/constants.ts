export const PROPERTY_INFO_DEFAULT_VALUE = "-";

export const PAST_YEARS_COUNT = 5;

export const CACHE_PREFIX = {
  propertyDetails: "property:details",
  propertyList: "property:list",
  propertyMaps: "property:maps",
  searchedKey: "searchedkey",
  rentEstimate: "rent:estimate",
  marketData: "market:data",
  streetViewImage: "streetViewImage",
  placeSearch: "place:search",
};

export const HTTP_ERROR_STATUS_CODES: number[] = [
  // 4xx Client Errors
  400, // Bad Request
  401, // Unauthorized
  402, // Payment Required
  403, // Forbidden
  404, // Not Found
  405, // Method Not Allowed
  406, // Not Acceptable
  407, // Proxy Authentication Required
  408, // Request Timeout
  409, // Conflict
  410, // Gone
  411, // Length Required
  412, // Precondition Failed
  413, // Payload Too Large
  414, // URI Too Long
  415, // Unsupported Media Type
  416, // Range Not Satisfiable
  417, // Expectation Failed
  418, // I'm a Teapot
  421, // Misdirected Request
  422, // Unprocessable Entity
  423, // Locked
  424, // Failed Dependency
  425, // Too Early
  426, // Upgrade Required
  428, // Precondition Required
  429, // Too Many Requests
  431, // Request Header Fields Too Large
  451, // Unavailable For Legal Reasons

  // 5xx Server Errors
  500, // Internal Server Error
  501, // Not Implemented
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
  505, // HTTP Version Not Supported
  506, // Variant Also Negotiates
  507, // Insufficient Storage
  508, // Loop Detected
  510, // Not Extended
  511, // Network Authentication Required
];

export const CACHE_EXPIRATION = {
  day: 86400,
  week: 604800,
  month: 2592000,
  year: 31536000,
};
