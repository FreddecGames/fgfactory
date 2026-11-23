import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { createHead as createHead$1 } from 'unhead/server';
import { isRef, toValue } from 'vue';
import { DeprecationsPlugin } from 'unhead/legacy';
import { PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'unhead/plugins';
import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createRouterMatcher } from 'vue-router';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE$1 = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE$1 = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE$1, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE$1, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$1(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),s&&s(),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost$1(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost$1(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$1(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
const noop = () => {
};
function writeEarlyHints(event, hints, cb = noop) {
  if (!event.node.res.socket) {
    cb();
    return;
  }
  if (typeof hints === "string" || Array.isArray(hints)) {
    hints = { link: hints };
  }
  if (hints.link) {
    hints.link = Array.isArray(hints.link) ? hints.link : hints.link.split(",");
  }
  const headers = Object.entries(hints).map(
    (e) => [e[0].toLowerCase(), e[1]]
  );
  if (headers.length === 0) {
    cb();
    return;
  }
  let hint = "HTTP/1.1 103 Early Hints";
  if (hints.link) {
    hint += `\r
Link: ${hints.link.join(", ")}`;
  }
  for (const [header, value] of headers) {
    if (header === "link") {
      continue;
    }
    hint += `\r
${header}: ${value}`;
  }
  if (event.node.res.socket) {
    event.node.res.socket.write(
      `${hint}\r
\r
`,
      "utf8",
      cb
    );
  } else {
    cb();
  }
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
const nonItemKeyProperties = /* @__PURE__ */ new Set([
  "getKeys",
  "clear",
  "mount",
  "unmount"
]);
function prefixStorage(storage, base) {
  if (base?.includes("?")) {
    throw new Error(`[unstorage] Invalid base: ${JSON.stringify(base)}`);
  }
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const itemKey = (key) => {
    if (!normalizeKey$1(key)) {
      throw new Error(`[unstorage] Invalid key: ${JSON.stringify(key)}`);
    }
    return base + key;
  };
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = nonItemKeyProperties.has(property) ? (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    ) : async (key = "", ...args) => (
      // @ts-ignore
      storage[property](itemKey(key), ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? itemKey(item) : { ...item, key: itemKey(item.key) }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: itemKey(item.key),
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function hasDotSegment(key) {
  return key.split(":").some((segment) => segment === "." || segment === "..");
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const normalizeItemKey = (key) => {
    const normalizedKey = normalizeKey$1(key);
    if (!normalizedKey || hasDotSegment(normalizedKey)) {
      throw new Error(`[unstorage] Invalid key: ${JSON.stringify(key)}`);
    }
    return normalizedKey;
  };
  const normalizeBase = (base) => {
    const normalizedBase = normalizeBaseKey(base);
    if (hasDotSegment(normalizedBase)) {
      throw new Error(`[unstorage] Invalid base: ${JSON.stringify(base)}`);
    }
    return normalizedBase;
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeItemKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    async hasItem(key, opts = {}) {
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    async getItem(key, opts = {}) {
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    async getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    async getItemRaw(key, opts = {}) {
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    async setMeta(key, value, opts = {}) {
      return this.setItem(normalizeItemKey(key) + "$", value, opts);
    },
    async removeMeta(key, opts = {}) {
      return this.removeItem(normalizeItemKey(key) + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBase(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBase(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBase(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {
  ["i18n:8b37aaa6.json"]: {
    import: () => import('../raw/8b37aaa6.mjs').then(r => r.default || r),
    meta: {"type":"application/json","etag":"\"692-2QZOyoMGAVRTNvuQsPoraPte+sI\"","mtime":"2026-11-23T13:42:59.160Z"}
  }
};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding ?? null).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage$1 = createStorage({});

storage$1.mount('/assets', assets$1);

storage$1.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage$1, base) : storage$1;
}

const fastHash = /*@__PURE__*/ (() => globalThis.process?.getBuiltinModule?.("crypto")?.hash)();
const algorithm = "sha256";
const encoding = "base64url";
function digest(data) {
	if (fastHash) return fastHash(algorithm, data, encoding);
	const h = createHash(algorithm).update(data);
	return globalThis.process?.versions?.webcontainer ? h.digest().toString(encoding) : h.digest(encoding);
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event._path = incomingEvent._path;
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "5b018163-ca00-42c9-9e5c-0e030da357b4",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/": {
        "redirect": {
          "to": "/missions",
          "statusCode": 301
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "appSecret": "",
  "public": {
    "i18n": {
      "baseUrl": "",
      "defaultLocale": "en",
      "rootRedirect": "",
      "redirectStatusCode": 302,
      "skipSettingLocaleOnNavigate": false,
      "locales": [
        {
          "code": "en",
          "language": "",
          "domains": [],
          "defaultForDomains": []
        }
      ],
      "detectBrowserLanguage": {
        "alwaysRedirect": false,
        "cookieCrossOrigin": false,
        "cookieDomain": "",
        "cookieKey": "i18n_redirected",
        "cookieSecure": false,
        "fallbackLocale": "",
        "redirectOn": "root",
        "useCookie": true
      },
      "experimental": {
        "localeDetector": "",
        "typedPages": true,
        "typedOptionsAndMessages": false,
        "alternateLinkCanonicalQueries": true,
        "devCache": false,
        "cacheLifetime": "",
        "stripMessagesPayload": false,
        "preload": false,
        "strictSeo": false,
        "nitroContextDetection": true,
        "httpCacheDuration": 10,
        "compactRoutes": false,
        "prerenderMessages": false,
        "optimizeMessageBundling": true
      },
      "domainLocales": {
        "en": {
          "domain": ""
        }
      }
    }
  },
  "icon": {
    "serverKnownCssClasses": []
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules$1(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules$1(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

//#region src/runtime/utils/event.ts
const ENC_PIPE_RE = /%7C/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_ENC_SLASH_RE = /%252F/gi;
const HASH_RE = /#/g;
const QUESTION_MARK_RE = /\?/g;
function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) return encodeVueRouterPath(path);
	return encodeVueRouterPath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function encodeVueRouterPath(path) {
	return encodeURI(path).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]").replace(HASH_RE, "%23").replace(QUESTION_MARK_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F");
}
/**
* The response headers of an h3 v1 event, in the shape the renderer writes them in.
*
* Backed by the node response rather than a copy of it, so a header the app sets through
* h3 and a header the renderer sets are the same header, and both are sent.
*/
var NodeResponseHeaders = class {
	res;
	constructor(res) {
		this.res = res;
	}
	get(name) {
		const value = this.res.getHeader(name);
		if (value === void 0) return null;
		return Array.isArray(value) ? value.join(", ") : String(value);
	}
	has(name) {
		return this.res.hasHeader(name);
	}
	set(name, value) {
		this.res.setHeader(name, value);
	}
	append(name, value) {
		const existing = this.res.getHeader(name);
		if (existing === void 0) {
			this.res.setHeader(name, value);
			return;
		}
		this.res.setHeader(name, Array.isArray(existing) ? [...existing, value] : [String(existing), value]);
	}
	delete(name) {
		this.res.removeHeader(name);
	}
	getSetCookie() {
		const value = this.res.getHeader("set-cookie");
		if (value === void 0) return [];
		return Array.isArray(value) ? value.map(String) : [String(value)];
	}
	*entries() {
		const headers = this.res.getHeaders();
		for (const name of Object.keys(headers).sort()) {
			const value = headers[name];
			if (value === void 0) continue;
			if (name === "set-cookie" && Array.isArray(value)) for (const entry of value) yield [name, entry];
			else yield [name, Array.isArray(value) ? value.join(", ") : String(value)];
		}
	}
	*keys() {
		for (const [name] of this.entries()) yield name;
	}
	*values() {
		for (const [, value] of this.entries()) yield value;
	}
	forEach(callback, thisArg) {
		for (const [name, value] of this.entries()) callback.call(thisArg, value, name, this);
	}
	[Symbol.iterator]() {
		return this.entries();
	}
};
const PAYLOAD_METHODS = /* @__PURE__ */ new Set([
	"PATCH",
	"POST",
	"PUT",
	"DELETE"
]);
const BODY_READ_METHODS = /* @__PURE__ */ new Set([
	"arrayBuffer",
	"blob",
	"bytes",
	"formData",
	"json",
	"text"
]);
/**
* The request in the web-standard shape, with every read of its body served from the bytes
* h3 v1 caches on the node request.
*
* A body read here and a `readBody(event)` elsewhere in the same request therefore resolve
* to the same bytes whichever happens first, and reading the request twice - directly, from
* a clone, or as a stream - resolves the same bytes each time rather than the second read
* finding a stream the first has drained.
*/
function toWebRequest$1(event) {
	const existing = event.web?.request;
	if (existing) return existing;
	const method = event.method;
	if (!PAYLOAD_METHODS.has(method)) return new Request(getRequestURL(event), {
		method,
		headers: event.headers
	});
	const request = new Request(getRequestURL(event), {
		method,
		headers: event.headers,
		body: toBufferedBodyStream(event),
		duplex: "half"
	});
	const read = () => readRawBody(event, false).then((body) => body ? new Uint8Array(body) : /* @__PURE__ */ new Uint8Array());
	const copy = () => read().then((body) => new Response(body, { headers: request.headers }));
	const buffered = new Proxy(request, { get(target, property) {
		if (property === "bodyUsed") return false;
		if (property === "body") return toBufferedBodyStream(event);
		if (property === "clone") return () => buffered;
		if (typeof property === "string" && BODY_READ_METHODS.has(property)) return () => copy().then((response) => response[property]());
		const value = Reflect.get(target, property, target);
		return typeof value === "function" ? value.bind(target) : value;
	} });
	return buffered;
}
function toBufferedBodyStream(event) {
	return new ReadableStream({ async pull(controller) {
		const body = await readRawBody(event, false);
		if (body) controller.enqueue(new Uint8Array(body));
		controller.close();
	} });
}
/**
* The Nuxt context a request nitro made to itself was fetched with: `node-mock-http` carries
* it on the mock request rather than in the h3 event's own context. A request that arrives
* over the network has none, whoever sent it.
*/
function getFetchedRequestContext(event) {
	return event.node.req.__unenv__?.nuxt;
}
/** The event the SSR renderer reads, which reaches the h3 v1 event itself through `~app`. */
function toRequestEvent(event) {
	const requestEvent = toWebView(event);
	const fetchedWith = getFetchedRequestContext(event);
	if (fetchedWith) event.context.nuxt = {
		...fetchedWith,
		...event.context.nuxt
	};
	return requestEvent;
}
/**
* Describe an h3 v1 event in the web-standard shape, rather than adapting it in place:
* `event.req` and `event.res` already name the node request and response, and that is the
* shape `useRequestEvent()` and the render hooks must keep seeing.
*
* Everything is resolved on access, and the response is backed by the node response rather
* than a copy of it, so a header the application sets through h3 and a header the renderer
* sets are the same header.
*/
function toWebView(event, resolveURL = () => new URL(encodeEventPath(event.path), `${getRequestProtocol(event)}://${getRequestHost$1(event)}`)) {
	const node = event.node;
	let request;
	let url;
	const res = {
		get status() {
			return node.res.statusCode;
		},
		set status(status) {
			node.res.statusCode = status;
		},
		get statusText() {
			return node.res.statusMessage;
		},
		set statusText(statusText) {
			node.res.statusMessage = statusText;
		},
		headers: new NodeResponseHeaders(node.res)
	};
	const requestEvent = {
		context: event.context,
		res,
		get req() {
			return request ??= toWebRequest$1(event);
		},
		get url() {
			return url ??= resolveURL();
		},
		set url(value) {
			url = value;
			event._path = node.req.url = value.pathname + value.search;
		}
	};
	requestEvent["~app"] = event;
	return requestEvent;
}

//#region src/runtime/utils/error.ts
/**
* Nitro internal functions extracted from https://github.com/nitrojs/nitro/blob/v2/src/runtime/internal/utils.ts
*/
function isJsonRequest(event) {
	if (hasReqHeader(event, "accept", "text/html")) return false;
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

const VueResolver = /* @__PURE__ */ Object.assign(
  (_, value) => isRef(value) ? toValue(value) : value,
  // identity for plain non-reactive values, so the SSR default init entry
  // keeps its precomputed fast path (see unhead/server createHead)
  { _static: true }
);

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const legacyPlugins = [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin];

const unheadOptions = {
  disableDefaults: true,
  plugins: legacyPlugins,
};

const renderSSRHeadOptions = {"omitLineBreaks":true};

const NUXT_PRERENDER_NO_SSR_ROUTES = ["/index.html","/200.html","/404.html"];
const NUXT_NO_SCRIPTS_PATTERNS = [];
const NUXT_PAGE_PATTERNS = ["/items","/machines","/missions","/"];
const NUXT_SSR_STREAMING = false;
const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[{"rel":"icon","type":"image/png","href":"/favicon.png"}],"style":[],"script":[],"noscript":[]};
const appRootTag = "div";
const appRootAttrs = {"id":"__nuxt","class":"isolate"};
const appTeleportTag = "div";
const appTeleportAttrs = {"id":"teleports"};
const appSpaLoaderTag = "div";
const appSpaLoaderAttrs = {"id":"__nuxt-loader"};
const appId = "nuxt-app";

//#region src/runtime/handlers/error.ts
var error_default = async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled) return;
	const isRenderingError = !!(event.context.nuxt?.["~rendering-error"] || getFetchedRequestContext(event)?.["~rendering-error"]);
	let errorCause;
	if (isJsonRequest(event)) {
		return;
	}
	const defaultRes = await defaultHandler(error, event, {
		json: true,
		silent: false
	});
	if ((error.status || error.statusCode || 500) === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		appendVary(event, "accept, sec-fetch-mode");
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	const errorObject = defaultRes.body;
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	if (!error.unhandled) errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	appendVary(event, "accept, sec-fetch-mode");
	if (!isRenderingError) event.context.nuxt = {
		...event.context.nuxt,
		"~rendering-error": true
	};
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), {
		...errorObject,
		...errorCause !== void 0
	}), {
		headers: event.headers,
		redirect: "manual",
		context: { nuxt: { "~rendering-error": true } }
	}).catch(() => null);
	if (event.handled) return;
	if (!res) {
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		const { template } = await import('./error-template.mjs');
		return send(event, template(errorObject));
	}
	let html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === ERROR_PAGE_HEADER) continue;
		if (header === "set-cookie" || header === "x-nitro-prerender") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	return send(event, html);
};
/** Set when the app's own error page could not render. */
const ERROR_PAGE_HEADER = "x-nuxt-error-page";
/**
* Add `value`'s tokens to the response `vary` header, keeping any already
* present. `*` absorbs everything else, since it means the response varies on
* all headers.
*/
function appendVary(event, value) {
	const incoming = parseVary(value);
	if (!incoming.length) return;
	const existing = parseVary(getResponseHeader(event, "vary"));
	if (existing.includes("*")) return;
	if (incoming.includes("*")) {
		setResponseHeader(event, "vary", "*");
		return;
	}
	const merged = existing.slice();
	for (const token of incoming) if (!merged.includes(token)) merged.push(token);
	setResponseHeader(event, "vary", merged.join(", "));
}
function parseVary(value) {
	return (Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : []).map((token) => token.trim().toLowerCase()).filter(Boolean);
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [error_default, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const decodeRoutePath = function decodeRoutePath(path) {
	if (!path.includes("%")) return path;
	const queryIndex = path.indexOf("?");
	const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
	try {
		return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
	} catch {
		return path;
	}
};
const normalizePath = (path, fold) => {
  if (typeof path !== 'string') { return path }
  const decoded = decodeRoutePath(path);
  return fold ? decoded.toLowerCase() : decoded
};
const normalizeRouteRulePath = path => normalizePath(path, true);

//#region src/runtime/utils/route-rules.ts
let matcher;
function getMatcher() {
	if (!matcher) {
		const routes = {};
		for (const [route, rules] of Object.entries(useRuntimeConfig().nitro?.routeRules || {})) routes[normalizeRouteRulePath(route)] = rules;
		matcher = toRouteMatcher(createRouter$1({ routes }));
	}
	return matcher;
}
/**
* Resolve the route rules for a path without the base URL. Keys and path are decoded,
* and case-folded unless routing is `sensitive`.
*/
function matchRouteRules(path) {
	return defu({}, ...getMatcher().matchAll(normalizeRouteRulePath(path)).reverse());
}
/** Resolve the route rules for a request, as {@link matchRouteRules} does for its path. */
function resolveRequestRouteRules(event) {
	return matchRouteRules(withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL));
}
/** The route rules for a request, reusing those already resolved for it. */
function getRouteRules(event) {
	const context = event.context._nitro ||= {};
	return context.routeRules ||= resolveRequestRouteRules(event);
}

//#region src/runtime/plugins/route-rules.ts
var route_rules_default = (nitroApp) => {
	nitroApp.hooks.hook("request", (event) => {
		event.context._nitro ||= {};
		event.context._nitro.routeRules = resolveRequestRouteRules(event);
	});
};

const script = "\"use strict\";(()=>{const o=window,e=document.documentElement,c=[\"dark\",\"light\"],s=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"system\";let r=s===\"system\"?f():s;const l=e.getAttribute(\"data-color-mode-forced\");l&&(r=l),i(r),o[\"__NUXT_COLOR_MODE__\"]={preference:s,value:r,getColorScheme:f,addColorScheme:i,removeColorScheme:d};function i(t){const a=\"\"+t+\"\",n=\"\";e.classList?e.classList.add(a):e.className+=\" \"+a,n&&e.setAttribute(\"data-\"+n,t)}function d(t){const a=\"\"+t+\"\",n=\"\";e.classList?e.classList.remove(a):e.className=e.className.replace(new RegExp(a,\"g\"),\"\"),n&&e.removeAttribute(\"data-\"+n)}function u(t){return o.matchMedia(\"(prefers-color-scheme\"+t+\")\")}function f(){if(o.matchMedia&&u(\"\").media!==\"not all\"){for(const t of c)if(u(\":\"+t).matches)return t}return\"light\"}})();function getStorageValue(o,e){switch(o){case\"localStorage\":try{return window.localStorage.getItem(e)}catch{return null}case\"sessionStorage\":try{return window.sessionStorage.getItem(e)}catch{return null}case\"cookie\":try{return getCookie(e)}catch{return null}default:return null}}function getCookie(o){const c=(\"; \"+window.document.cookie).split(\"; \"+o+\"=\");if(c.length===2){const s=c.pop();return s?s.split(\";\").shift():null}}";

const _qSpXMIa7i0MnDCs8yfnF7p6kOoAI1AKPrBKldgceE = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

/*!
  * shared v11.4.16
  * (c) 2026 kazuya kawaguchi
  * Released under the MIT License.
  */
/**
 * Original Utilities
 * written by kazuya kawaguchi
 */
const _create = Object.create;
const create = (obj = null) => _create(obj);
/**
 * Useful Utilities By Evan you
 * Modified by kazuya kawaguchi
 * MIT License
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/index.ts
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/codeframe.ts
 */
const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (val) => val !== null && typeof val === 'object';
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);

const isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepCopy(src, des) {
    // src and des should both be objects, and none of them can be a array.
    // des can't be `Object.prototype` either: copying into it would pollute
    // every object
    if (isNotObjectOrIsArray(src) ||
        isNotObjectOrIsArray(des) ||
        des === Object.prototype) {
        throw new Error('Invalid value');
    }
    const stack = [{ src, des }];
    while (stack.length) {
        const { src, des } = stack.pop();
        // using `Object.keys` which skips prototype properties
        Object.keys(src).forEach(key => {
            if (key === '__proto__') {
                return;
            }
            const value = src[key];
            if (isArray(value)) {
                // replace arrays instead of merging them, without retaining source references
                const copied = [];
                copied.length = value.length;
                des[key] = copied;
                stack.push({ src: value, des: copied });
            }
            else if (isObject(value)) {
                if (!isObject(des[key]) || isArray(des[key])) {
                    des[key] = create();
                }
                stack.push({ src: value, des: des[key] });
            }
            else {
                des[key] = value;
            }
        });
    }
}

const __nuxtMock = { runWithContext: async (fn) => await fn() };
function cloneDeep(value) {
  if (value == null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(cloneDeep);
  }
  const out = create(null);
  for (const key of Object.keys(value)) {
    out[key] = cloneDeep(value[key]);
  }
  return out;
}
const merger = createDefu((obj, key, value) => {
  if (key === "messages" || key === "datetimeFormats" || key === "numberFormats") {
    obj[key] ??= create(null);
    deepCopy(value, obj[key]);
    return true;
  }
});
async function loadVueI18nOptions(vueI18nConfigs) {
  const nuxtApp = __nuxtMock;
  let vueI18nOptions = { messages: create(null) };
  for (const configFile of vueI18nConfigs) {
    const resolver = await configFile().then((x) => isModule(x) ? x.default : x);
    const resolved = isFunction(resolver) ? await nuxtApp.runWithContext(() => resolver()) : resolver;
    vueI18nOptions = merger(create(null), resolved, vueI18nOptions);
  }
  vueI18nOptions.fallbackLocale ??= false;
  return vueI18nOptions;
}
const isModule = (val) => toTypeString(val) === "[object Module]";
async function getLocaleMessages(locale, loader) {
  const nuxtApp = __nuxtMock;
  try {
    const getter = await nuxtApp.runWithContext(loader.load).then((x) => isModule(x) ? x.default : x);
    return isFunction(getter) ? await nuxtApp.runWithContext(() => getter(locale)) : getter;
  } catch (e) {
    throw new Error(`Failed loading locale (${locale}): ` + e.message, { cause: e });
  }
}
async function getLocaleMessagesMerged(locale, loaders = []) {
  const nuxtApp = __nuxtMock;
  const messages = await Promise.all(
    loaders.map((loader) => nuxtApp.runWithContext(() => getLocaleMessages(locale, loader)))
  );
  const merged = {};
  for (const message of messages) {
    deepCopy(message, merged);
  }
  return merged;
}

const parsed = /* @__PURE__ */ new Map();
function readI18nAsset(key) {
  if (!parsed.has(key)) {
    const promise = useStorage("assets/i18n").getItemRaw(key).then((raw) => {
      if (raw == null) {
        throw new Error(`Missing messages asset '${key}' - the server build may be stale, try rebuilding.`);
      }
      return JSON.parse(typeof raw === "string" ? raw : new TextDecoder().decode(raw));
    });
    parsed.set(key, promise);
    promise.catch(() => parsed.delete(key));
  }
  return parsed.get(key);
}

// @ts-nocheck
const localeCodes =  [
  "en"
];
const localeLoaders = {
  en: [
    {
      key: "locale_en_46json_8b37aaa6",
      load: () => readI18nAsset("8b37aaa6.json"),
      cache: true
    }
  ]
};
const vueI18nConfigs = [];
const normalizedLocales = [
  {
    code: "en",
    language: undefined,
    domains: [],
    defaultForDomains: []
  }
];

const setupVueI18nOptions = async (defaultLocale) => {
  const options = await loadVueI18nOptions(vueI18nConfigs);
  options.locale = defaultLocale || options.locale || "en-US";
  options.defaultLocale = defaultLocale;
  options.fallbackLocale ??= false;
  options.messages ??= {};
  for (const locale of localeCodes) {
    options.messages[locale] ??= {};
  }
  return options;
};

function defineNitroPlugin(def) {
  return def;
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

function buildAssetsDir() {
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

function parseAcceptLanguage(value) {
  return value.split(",").map((tag) => tag.split(";")[0]).filter(
    (tag) => !(tag === "*" || tag === "")
  );
}
function createPathIndexLanguageParser(index = 0) {
  return (path) => {
    const rawPath = typeof path === "string" ? path : path.pathname;
    const normalizedPath = rawPath.split("?")[0];
    const parts = normalizedPath.split("/");
    if (parts[0] === "") {
      parts.shift();
    }
    return parts.length > index ? parts[index] || "" : "";
  };
}

function useRuntimeI18n(nuxtApp, event) {
  {
    const getRuntimeConfig = useRuntimeConfig;
    return getRuntimeConfig(event).public.i18n;
  }
}
function useI18nDetection(nuxtApp) {
  const detectBrowserLanguage = useRuntimeI18n().detectBrowserLanguage;
  const detect = detectBrowserLanguage || {};
  return {
    ...detect,
    enabled: !!detectBrowserLanguage,
    cookieKey: detect.cookieKey || "i18n_redirected"
  };
}
function resolveRootRedirect(config) {
  if (!config) {
    return void 0;
  }
  return {
    path: "/" + (isString(config) ? config : config.path).replace(/^\//, ""),
    code: !isString(config) && config.statusCode || 302
  };
}

const normalizeDomain = (domain = "") => domain.replace(/^https?:\/\//i, "").toLowerCase();
function isLocaleOnHost(locale, host) {
  return !!locale?.domains.some((x) => normalizeDomain(x) === host);
}
function resolveLocaleReach(locales, host, locale) {
  const target = locales.find((l) => l.code === locale);
  if (!target?.domains.length || isLocaleOnHost(target, host)) {
    return "here";
  }
  return locales.some((l) => isLocaleOnHost(l, host)) ? "other-domain" : "off-host";
}
function isLocaleServedOnHost(locales, host, locale) {
  return resolveLocaleReach(locales, host, locale) !== "other-domain";
}
function matchDomainLocale(locales, host, pathLocale) {
  const matches = locales.filter((locale) => isLocaleOnHost(locale, host));
  return (
    // match by current path locale
    (matches.find((l) => l.code === pathLocale) || matches.find((l) => l.defaultForDomains.some((domain) => normalizeDomain(domain) === host)) || matches[0])?.code
  );
}
function cookieSpansDomains(locales, cookieDomain) {
  const scope = cookieDomain.replace(/^\./, "").replace(/:\d+$/, "").toLowerCase();
  return locales.every(
    (l) => l.domains.concat(l.domain || []).every((domain) => {
      const host = normalizeDomain(domain).replace(/:\d+$/, "");
      return host === scope || host.endsWith("." + scope);
    })
  );
}
function withRuntimeDomain(locale, domainLocales) {
  if (typeof locale === "string") {
    return locale;
  }
  const properties = locale;
  const domain = domainLocales[properties.code]?.domain;
  if (!domain || domain === properties.domain) {
    return locale;
  }
  return {
    ...properties,
    domain,
    domains: [domain],
    defaultForDomains: properties.defaultForDomains.length ? [domain] : []
  };
}

function createLocaleConfigs(fallbackLocale) {
  const localeConfigs = {};
  for (const locale of localeCodes) {
    const fallbacks = getFallbackLocaleCodes(fallbackLocale, [locale]);
    const cacheable = isLocaleWithFallbacksCacheable(locale, fallbacks);
    localeConfigs[locale] = { fallbacks, cacheable };
  }
  return localeConfigs;
}
function getFallbackLocaleCodes(fallback, locales) {
  if (fallback === false) {
    return [];
  }
  if (isArray(fallback)) {
    return fallback;
  }
  let fallbackLocales = [];
  if (isString(fallback)) {
    if (locales.every((locale) => locale !== fallback)) {
      fallbackLocales.push(fallback);
    }
    return fallbackLocales;
  }
  const targets = [...locales, "default"];
  for (const locale of targets) {
    if (locale in fallback == false) {
      continue;
    }
    fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)];
  }
  return fallbackLocales;
}
function isLocaleCacheable(locale) {
  return localeLoaders[locale] != null && localeLoaders[locale].every((loader) => loader.cache !== false);
}
function isLocaleWithFallbacksCacheable(locale, fallbackLocales) {
  return isLocaleCacheable(locale) && fallbackLocales.every((fallbackLocale) => isLocaleCacheable(fallbackLocale));
}
function getDefaultLocaleForDomain(host, locales = normalizedLocales) {
  return locales.find((l) => l.defaultForDomains.some((domain) => normalizeDomain(domain) === host))?.code;
}
function resolveDefaultLocale(host, defaultLocale, locales = normalizedLocales) {
  const resolved = getDefaultLocaleForDomain(host, locales) || defaultLocale;
  if (resolved) {
    return resolved;
  }
  return (locales.some((l) => l.domains.length) ? locales[0]?.code : "") || "";
}
const isSupportedLocale = (locale) => localeCodes.includes(locale || "");

const storage = prefixStorage(useStorage(), "i18n");
function deepFreeze(value) {
  if (value == null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return Object.freeze(value);
}
function cachedFunctionI18n(fn, opts) {
  opts = { maxAge: 1, ...opts };
  const pending = {};
  async function get(key, resolver) {
    const isPending = pending[key];
    if (!isPending) {
      pending[key] = Promise.resolve(resolver());
    }
    try {
      return await pending[key];
    } finally {
      delete pending[key];
    }
  }
  return async (...args) => {
    const key = [opts.name, opts.getKey(...args)].join(":").replace(/:\/$/, ":index");
    const maxAge = opts.maxAge ?? 1;
    const isCacheable = !opts.shouldBypassCache(...args) && maxAge >= 0;
    const cache = isCacheable && await storage.getItemRaw(key);
    if (!cache || cache.ttl < Date.now()) {
      pending[key] = Promise.resolve(fn(...args));
      const value = await get(key, () => fn(...args));
      if (isCacheable) {
        deepFreeze(value);
        await storage.setItemRaw(key, { ttl: Date.now() + maxAge * 1e3, value, mtime: Date.now() });
      }
      return value;
    }
    return cache.value;
  };
}

const _getMessages = async (locale) => {
  return { [locale]: await getLocaleMessagesMerged(locale, localeLoaders[locale]) };
};
const _getMessagesCached = cachedFunctionI18n(_getMessages, {
  name: "messages",
  maxAge: 60 * 60 * 24,
  getKey: (locale) => locale,
  shouldBypassCache: (locale) => !isLocaleCacheable(locale)
});
const getMessages = _getMessagesCached;
function appContextHint(e) {
  if (!/ is not defined|Nuxt instance unavailable/.test(e.message)) {
    return "";
  }
  return ". Locale loaders run outside the Nuxt app when the server produces messages, so Nuxt app composables (`useNuxtApp`, `useState`, `useCookie`, ...) are unavailable - call them in the locale file itself to have the build keep that locale in the app instead.";
}
const _getMergedMessages = async (locale, fallbackLocales) => {
  try {
    if (fallbackLocales.length === 0) {
      return await getMessages(locale) ?? {};
    }
    const merged = {};
    const messages = await Promise.all(fallbackLocales.map(getMessages));
    for (const message of messages) {
      deepCopy(message, merged);
    }
    deepCopy(await getMessages(locale), merged);
    return merged;
  } catch (e) {
    throw new Error("Failed to merge messages: " + e.message + appContextHint(e), { cause: e });
  }
};
const getMergedMessages = cachedFunctionI18n(_getMergedMessages, {
  name: "merged-single",
  maxAge: 60 * 60 * 24,
  getKey: (locale, fallbackLocales) => `${locale}-[${[...new Set(fallbackLocales)].sort().join("-")}]`,
  shouldBypassCache: (locale, fallbackLocales) => !isLocaleWithFallbacksCacheable(locale, fallbackLocales)
});

function useI18nContext(event) {
  if (event.context.nuxtI18n == null) {
    throw new Error("Nuxt I18n server context has not been set up yet.");
  }
  return event.context.nuxtI18n;
}
function tryUseI18nContext(event) {
  return event.context.nuxtI18n;
}
const getHost = (event) => getRequestURL(event, { xForwardedHost: true }).host;
async function initializeI18nContext(event) {
  const runtimeI18n = useRuntimeI18n(void 0, event);
  const defaultLocale = runtimeI18n.defaultLocale || "";
  const options = await setupVueI18nOptions(resolveDefaultLocale(getHost(event), defaultLocale));
  const localeConfigs = createLocaleConfigs(options.fallbackLocale);
  const ctx = createI18nContext();
  ctx.vueI18nOptions = options;
  ctx.localeConfigs = localeConfigs;
  event.context.nuxtI18n = ctx;
  return ctx;
}
function createI18nContext() {
  return {
    messages: {},
    slp: {},
    localeConfigs: {},
    trackMap: {},
    vueI18nOptions: void 0,
    trackKey(key, locale) {
      this.trackMap[locale] ??= /* @__PURE__ */ new Set();
      this.trackMap[locale].add(key);
    },
    async loadMessages(locale) {
      const messages = await getMergedMessages(locale, this.localeConfigs?.[locale]?.fallbacks ?? []) ?? {};
      return this.vueI18nOptions?.flatJson ? cloneDeep(messages) : messages;
    }
  };
}

const separator = "___";
const createTrailingSlashFormatter = (trailingSlash) => trailingSlash ? withTrailingSlash : withoutTrailingSlash;
function prefixable(currentLocale, defaultLocale, options) {
  return (currentLocale !== defaultLocale || options.strategy === "prefix");
}
const pathLanguageParser = createPathIndexLanguageParser(0);
const getLocaleFromRoutePath = (path) => pathLanguageParser(path);
const getLocaleFromRouteName = (name) => name.split(separator).at(1) ?? "";
function normalizeInput(input) {
  return typeof input !== "object" ? String(input) : String(input?.name || input?.path || "");
}
function getLocaleFromRoute(route) {
  const input = normalizeInput(route);
  if (input[0] === "/") {
    return getLocaleFromRoutePath(input);
  }
  const fromName = getLocaleFromRouteName(input);
  if (fromName) {
    return fromName;
  }
  if (typeof route === "object" && route?.path) {
    return getLocaleFromRoutePath(String(route.path));
  }
  return "";
}

function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
  const matchedLocales = matchBrowserLocale(
    locales.map((l) => ({ code: l.code, language: l.language || l.code })),
    browserLocales
  );
  return matchedLocales.sort(compareBrowserLocale).at(0)?.code ?? "";
}

const getCookieLocale = (event, cookieName) => (getCookie(event, cookieName)) || void 0;
const getRouteLocale = (event, route) => getLocaleFromRoute(route);
const getHeaderLocale = (event) => findBrowserLocale(normalizedLocales, parseAcceptLanguage(getRequestHeader(event, "accept-language") || ""));
const getRequestHost = (event) => getRequestURL(event, { xForwardedHost: true }).host;
const getRefererHost = (event) => {
  const referer = getRequestHeader(event, "referer");
  try {
    return referer && new URL(referer).host || void 0;
  } catch {
    return void 0;
  }
};
const getDomainLocales = (domainLocales) => normalizedLocales.map((l) => withRuntimeDomain(l, domainLocales));
const useDetectors = (event, config, nuxtApp) => {
  if (!event) {
    throw new Error("H3Event is required for server-side locale detection");
  }
  const runtimeI18n = useRuntimeI18n();
  let host;
  let locales;
  const getHost = () => host ??= getRequestHost(event);
  const getLocales = () => locales ??= getDomainLocales(runtimeI18n.domainLocales);
  return {
    cookie: () => getCookieLocale(event, config.cookieKey),
    header: () => getHeaderLocale(event) ,
    navigator: () => void 0,
    host: (path) => matchDomainLocale(getLocales(), getHost(), getLocaleFromRoutePath(path)),
    route: (path) => getRouteLocale(event, path),
    /** Passes the locale through when the current host serves it, `undefined` otherwise */
    onHost: (locale) => !locale || isLocaleServedOnHost(getLocales(), getHost(), locale) ? locale : void 0,
    /** Whether the visitor arrived from one of the configured domains */
    fromOwnDomain: () => {
      const referer = getRefererHost(event);
      return !!referer && getLocales().some((l) => isLocaleOnHost(l, referer));
    },
    /** Whether a cookie scoped to the configured `cookieDomain` is readable on every domain */
    cookieSpans: () => !!config.cookieDomain && cookieSpansDomains(getLocales(), config.cookieDomain)
  };
};
function createLocaleDetector(config) {
  const { detection} = config;
  const isSupported = config.isSupportedLocale ?? isSupportedLocale;
  function skipDetect(path, pathLocale) {
    if (detection.redirectOn === "root" && path !== "/") {
      return true;
    }
    if (detection.redirectOn === "no prefix" && !detection.alwaysRedirect && isSupported(pathLocale)) {
      return true;
    }
    return false;
  }
  return function detectLocale(detectors, route, initial) {
    const path = isString(route) ? parsePath(route).pathname : route.path;
    const pass = (locale) => locale;
    const onHost = pass;
    function* detect() {
      const detecting = initial && detection.enabled && !skipDetect(path, detectors.route(path));
      if (detecting) {
        const cookie = onHost;
        const browser = onHost;
        yield cookie(detectors.cookie());
        yield browser(detectors.header());
        yield browser(detectors.navigator());
      }
      {
        yield detectors.route(route);
      }
      if (detecting) {
        yield onHost(detection.fallbackLocale);
      }
    }
    for (const detected of detect()) {
      if (detected && isSupported(detected)) {
        return detected;
      }
    }
    return "";
  };
}

// Generated by @nuxtjs/i18n
const localizedPaths = [
  "/items",
  "/machines",
  "/missions"
];
const pathToI18nConfig = {};
const i18nPathToPath = {};
const disabledPaths = [];

const emptyRoute = { path: "/", name: "", matched: [], params: {}, meta: {} };
function createPathMatcher(resources, config) {
  const matcher = createRouterMatcher([], {});
  for (const path of [...resources.localizedPaths, ...Object.keys(resources.i18nPathToPath)]) {
    matcher.addRoute({ path, component: () => "", meta: {} });
  }
  const disabledI18nMatcher = createRouterMatcher([], {});
  for (const path of resources.disabledPaths) {
    disabledI18nMatcher.addRoute({ path, component: () => "", meta: {} });
  }
  const formatTrailingSlash = createTrailingSlashFormatter(config.trailingSlash);
  const getI18nPathToI18nPath = (path, locale) => {
    if (!path || !locale) {
      return;
    }
    const plainPath = resources.i18nPathToPath[path] ?? path;
    const i18nConfig = resources.pathToI18nConfig[plainPath];
    if (i18nConfig == null || !(locale in i18nConfig)) {
      return plainPath;
    }
    return i18nConfig[locale] || void 0;
  };
  function isExistingNuxtRoute2(path) {
    if (path === "") {
      return;
    }
    if (path.endsWith("/__nuxt_error")) {
      return;
    }
    if (disabledI18nMatcher.resolve({ path }, emptyRoute).matched.length > 0) {
      return;
    }
    const resolvedMatch = matcher.resolve({ path }, emptyRoute);
    return resolvedMatch.matched.length > 0 ? resolvedMatch : void 0;
  }
  function matchLocalized2(path, locale, defaultLocale) {
    if (path === "") {
      return;
    }
    const parsed = parsePath(path);
    const resolvedMatch = matcher.resolve({ path: parsed.pathname || "/" }, emptyRoute);
    if (resolvedMatch.matched.length === 0) {
      return;
    }
    const alternate = getI18nPathToI18nPath(resolvedMatch.matched[0].path, locale);
    if (!alternate) {
      return;
    }
    const match = matcher.resolve({ params: resolvedMatch.params }, { ...emptyRoute, path: alternate });
    const isPrefixable = prefixable(locale, defaultLocale, config);
    return formatTrailingSlash(withLeadingSlash(joinURL(isPrefixable ? locale : "", match.path)), true);
  }
  return { isExistingNuxtRoute: isExistingNuxtRoute2, matchLocalized: matchLocalized2 };
}
const { isExistingNuxtRoute, matchLocalized } = createPathMatcher(
  { localizedPaths, i18nPathToPath, pathToI18nConfig, disabledPaths },
  { strategy: "prefix_except_default", trailingSlash: false }
);

function createRedirectResolver(config) {
  const { detection, rootRedirect, matchLocalized} = config;
  const isSupported = config.isSupportedLocale ?? isSupportedLocale;
  const detectLocale = createLocaleDetector({ detection, isSupportedLocale: isSupported});
  return function resolveRedirectPath(fullPath, path, pathLocale, defaultLocale, detectors, relocate) {
    let locale = detectLocale(detectors, fullPath, true) || defaultLocale;
    function getLocalizedMatch(locale2) {
      const res = matchLocalized(path || "/", locale2, defaultLocale);
      if (res && res !== fullPath) {
        return res;
      }
    }
    let resolvedPath = void 0;
    let redirectCode = 302;
    const pathname = parsePath(fullPath).pathname;
    if (rootRedirect && pathname === "/") {
      locale = detection.enabled && locale || defaultLocale;
      resolvedPath = isSupported(detectors.route(rootRedirect.path)) && rootRedirect.path || matchLocalized(rootRedirect.path, locale, defaultLocale);
      redirectCode = rootRedirect.code;
    } else if (config.redirectStatusCode) {
      redirectCode = config.redirectStatusCode;
    }
    switch (detection.redirectOn) {
      case "root":
        if (pathname !== "/") {
          break;
        }
      // fallthrough (root has no prefix)
      case "no prefix":
        if (pathLocale) {
          break;
        }
      // fallthrough to resolve
      case "all":
        resolvedPath ??= getLocalizedMatch(locale);
        break;
    }
    return { path: resolvedPath, code: redirectCode, locale };
  };
}

function createRedirectResponse(event, dest, code) {
  event.node.res.setHeader("location", dest);
  event.node.res.statusCode = sanitizeStatusCode(code, event.node.res.statusCode);
  return {
    headers: event.node.res.getHeaders(),
    statusCode: event.node.res.statusCode,
    body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${dest.replace(/"/g, "%22")}"></head></html>`
  };
}
const _gQc6KGLdpqge4ZJkfPAvysB5eQ2NfB3M6pdz24du9vQ = defineNitroPlugin(async (nitro) => {
  const runtimeI18n = useRuntimeI18n();
  const rootRedirect = resolveRootRedirect(runtimeI18n.rootRedirect);
  runtimeI18n.defaultLocale || "";
  try {
    const cacheStorage = useStorage("cache");
    const cachedKeys = await cacheStorage.getKeys("nitro:handlers:i18n");
    await Promise.all(cachedKeys.map((key) => cacheStorage.removeItem(key)));
  } catch {
  }
  const detection = useI18nDetection();
  const cookieOptions = {
    path: "/",
    domain: detection.cookieDomain || void 0,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: detection.cookieSecure
  };
  isFunction(runtimeI18n.baseUrl);
  const baseUrlGetter = (event) => {
    return "";
  };
  const resolveRedirectPath = createRedirectResolver({
    detection,
    rootRedirect,
    redirectStatusCode: runtimeI18n.redirectStatusCode,
    matchLocalized});
  nitro.hooks.hook("request", async (event) => {
    await initializeI18nContext(event);
  });
  nitro.hooks.hook("render:before", async (context) => {
    const { event } = context;
    const ctx = useI18nContext(event);
    const url = getRequestURL(event);
    const detector = useDetectors(event, detection);
    const localeSegment = detector.route(event.path);
    const pathLocale = isSupportedLocale(localeSegment) && localeSegment || void 0;
    const { pathname } = parsePath(event.path);
    const path = pathLocale ? pathname.slice(pathLocale.length + 1) || "/" : pathname;
    if (!url.pathname.includes("/_i18n") && !isExistingNuxtRoute(path)) {
      return;
    }
    const resolved = resolveRedirectPath(
      event.path,
      path,
      pathLocale,
      ctx.vueI18nOptions.defaultLocale,
      detector);
    if (resolved.path && (resolved.origin || resolved.path !== pathname)) {
      ctx.detectLocale = resolved.locale;
      detection.useCookie && (!resolved.origin || detection.cookieDomain) && setCookie(event, detection.cookieKey, resolved.locale, cookieOptions);
      context.response = createRedirectResponse(
        event,
        // the resolved path is base-free (matched against base-free routes), re-add `app.baseURL`
        joinURL(
          resolved.origin || baseUrlGetter(),
          useRuntimeConfig(event).app.baseURL,
          resolved.path + url.search
        ),
        resolved.code
      );
      return;
    }
  });
  nitro.hooks.hook("render:html", (htmlContext, { event }) => {
    tryUseI18nContext(event);
  });
});

const plugins = [
  route_rules_default,
_qSpXMIa7i0MnDCs8yfnF7p6kOoAI1AKPrBKldgceE,
_gQc6KGLdpqge4ZJkfPAvysB5eQ2NfB3M6pdz24du9vQ
];

const assets = {
  "/background.jpg": {
    "type": "image/jpeg",
    "etag": "\"2ded0-HKinQddJ6rjBmZeZv9uLrIkqb3c\"",
    "mtime": "2026-11-18T08:22:55.795Z",
    "size": 188112,
    "path": "../public/background.jpg"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1a-a1cIDLljyn/zLf+iveG+HSGws5Y\"",
    "mtime": "2026-11-18T08:22:55.797Z",
    "size": 26,
    "path": "../public/robots.txt"
  },
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"72b-Kl8EIzcnsxlPurMoyqrfkqKBCNo\"",
    "mtime": "2026-11-18T08:22:55.795Z",
    "size": 1835,
    "path": "../public/favicon.png"
  },
  "/flags/en.png": {
    "type": "image/png",
    "etag": "\"481-sPYVV6BlxfbyZNmAzc85n18JWq0\"",
    "mtime": "2026-11-18T08:22:55.797Z",
    "size": 1153,
    "path": "../public/flags/en.png"
  },
  "/_fonts/57NSSoFy1VLVs2gqly8Ls9awBnZMFyXGrefpmqvdqmc-zJfbBtpgM4cDmcXBsqZNW79_kFnlpPd62b48glgdydA.woff2": {
    "type": "font/woff2",
    "etag": "\"4b5c-TAo9mx7r3xQs52+HbHcHJ52z8Qo\"",
    "mtime": "2026-11-23T13:42:59.275Z",
    "size": 19292,
    "path": "../public/_fonts/57NSSoFy1VLVs2gqly8Ls9awBnZMFyXGrefpmqvdqmc-zJfbBtpgM4cDmcXBsqZNW79_kFnlpPd62b48glgdydA.woff2"
  },
  "/_fonts/8VR2wSMN-3U4NbWAVYXlkRV6hA0jFBXP-0RtL3X7fko-x2gYI4qfmkRdxyQQUPaBZdZdgl1TeVrquF_TxHeM4lM.woff2": {
    "type": "font/woff2",
    "etag": "\"212c-FshXJibFzNhd2HEIMP8C3JR5PYg\"",
    "mtime": "2026-11-23T13:42:59.275Z",
    "size": 8492,
    "path": "../public/_fonts/8VR2wSMN-3U4NbWAVYXlkRV6hA0jFBXP-0RtL3X7fko-x2gYI4qfmkRdxyQQUPaBZdZdgl1TeVrquF_TxHeM4lM.woff2"
  },
  "/_fonts/GsKUclqeNLJ96g5AU593ug6yanivOiwjW_7zESNPChw-jHA4tBeM1bjF7LATGUpfBuSTyomIFrWBTzjF7txVYfg.woff2": {
    "type": "font/woff2",
    "etag": "\"680c-mJtsV33lkTAKSmfq5k3lKHSllcU\"",
    "mtime": "2026-11-23T13:42:59.280Z",
    "size": 26636,
    "path": "../public/_fonts/GsKUclqeNLJ96g5AU593ug6yanivOiwjW_7zESNPChw-jHA4tBeM1bjF7LATGUpfBuSTyomIFrWBTzjF7txVYfg.woff2"
  },
  "/_fonts/iTkrULNFJJkTvihIg1Vqi5IODRH_9btXCioVF5l98I8-AndUyau2HR2felA_ra8V2mutQgschhasE5FD1dXGJX8.woff2": {
    "type": "font/woff2",
    "etag": "\"47c4-5xyngHnzzhetUee74tMx9OTgqNQ\"",
    "mtime": "2026-11-23T13:42:59.277Z",
    "size": 18372,
    "path": "../public/_fonts/iTkrULNFJJkTvihIg1Vqi5IODRH_9btXCioVF5l98I8-AndUyau2HR2felA_ra8V2mutQgschhasE5FD1dXGJX8.woff2"
  },
  "/_fonts/NdzqRASp2bovDUhQT1IRE_EMqKJ2KYQdTCfFcBvL8yw-KhwZiS86o3fErOe5GGMExHUemmI_dBfaEFxjISZrBd0.woff2": {
    "type": "font/woff2",
    "etag": "\"1d98-cDZfMibtk4T04FTTAmlfhWDpkN0\"",
    "mtime": "2026-11-23T13:42:59.277Z",
    "size": 7576,
    "path": "../public/_fonts/NdzqRASp2bovDUhQT1IRE_EMqKJ2KYQdTCfFcBvL8yw-KhwZiS86o3fErOe5GGMExHUemmI_dBfaEFxjISZrBd0.woff2"
  },
  "/_fonts/Ld1FnTo3yTIwDyGfTQ5-Fws9AWsCbKfMvgxduXr7JcY-W25bL8NF1fjpLRSOgJb7RoZPHqGQNwMTM7S9tHVoxx8.woff2": {
    "type": "font/woff2",
    "etag": "\"6ec4-8OoFFPZKF1grqmfGVjh5JDE6DOU\"",
    "mtime": "2026-11-23T13:42:59.277Z",
    "size": 28356,
    "path": "../public/_fonts/Ld1FnTo3yTIwDyGfTQ5-Fws9AWsCbKfMvgxduXr7JcY-W25bL8NF1fjpLRSOgJb7RoZPHqGQNwMTM7S9tHVoxx8.woff2"
  },
  "/_nuxt/B9dYZPiF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19871-3meFkCdxNMnezGsCZalj3UmiwrI\"",
    "mtime": "2026-11-23T13:42:59.062Z",
    "size": 104561,
    "path": "../public/_nuxt/B9dYZPiF.js"
  },
  "/_nuxt/BDNMzG2s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"54-MasMfSk/A98C3Gn9uIOxtFxkWNw\"",
    "mtime": "2026-11-23T13:42:59.062Z",
    "size": 84,
    "path": "../public/_nuxt/BDNMzG2s.js"
  },
  "/_nuxt/Bdr7PrsY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8792-e0kO1Le27JT9nIaUDQWCw75GNbI\"",
    "mtime": "2026-11-23T13:42:59.075Z",
    "size": 34706,
    "path": "../public/_nuxt/Bdr7PrsY.js"
  },
  "/_nuxt/BMqtJfub.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"88c-3AQjDPKMS3JjhkVQWdb/MzmZ/Jc\"",
    "mtime": "2026-11-23T13:42:59.062Z",
    "size": 2188,
    "path": "../public/_nuxt/BMqtJfub.js"
  },
  "/_nuxt/Bp4g78sy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"106a9-tOvfCPoHESUe/VDKPlo6edQOMR0\"",
    "mtime": "2026-11-23T13:42:59.079Z",
    "size": 67241,
    "path": "../public/_nuxt/Bp4g78sy.js"
  },
  "/_nuxt/BsfSQkeJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14a0-fhRFcCYjMfe+cC6YDwE5c93V1XQ\"",
    "mtime": "2026-11-23T13:42:59.079Z",
    "size": 5280,
    "path": "../public/_nuxt/BsfSQkeJ.js"
  },
  "/_nuxt/BV7VikSy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fe2-hHb5byXrI8FR3G0b89PT6F6o6E8\"",
    "mtime": "2026-11-23T13:42:59.062Z",
    "size": 4066,
    "path": "../public/_nuxt/BV7VikSy.js"
  },
  "/_nuxt/BvIGhR9u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"41d6-YazIaJzFXx0M2siQzaVEDr5y+h4\"",
    "mtime": "2026-11-23T13:42:59.079Z",
    "size": 16854,
    "path": "../public/_nuxt/BvIGhR9u.js"
  },
  "/_nuxt/BXGsCXk8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a87-uMihNeD61P3gVJoZZlj2He/QjtA\"",
    "mtime": "2026-11-23T13:42:59.065Z",
    "size": 2695,
    "path": "../public/_nuxt/BXGsCXk8.js"
  },
  "/_nuxt/B_P-Psb-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8daa-THFWNoqsoqxyz29uFHvvomSmYX8\"",
    "mtime": "2026-11-23T13:42:59.075Z",
    "size": 36266,
    "path": "../public/_nuxt/B_P-Psb-.js"
  },
  "/_nuxt/C-_3hHvi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5b0-w+1aY7ywY8Km50APKgm8U2APjIc\"",
    "mtime": "2026-11-23T13:42:59.079Z",
    "size": 1456,
    "path": "../public/_nuxt/C-_3hHvi.js"
  },
  "/_nuxt/C8H4Lci6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a984-HoHTmLLh5NpoKFAjcnIAInjWlz8\"",
    "mtime": "2026-11-23T13:42:59.082Z",
    "size": 43396,
    "path": "../public/_nuxt/C8H4Lci6.js"
  },
  "/_nuxt/CV5Ggnxr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2e0b-FqV5dljbsv/re22Kb+TCIRvSwBE\"",
    "mtime": "2026-11-23T13:42:59.082Z",
    "size": 11787,
    "path": "../public/_nuxt/CV5Ggnxr.js"
  },
  "/_nuxt/CzErth1i.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d98e-OXx+b3LHC/HIz2jQhYEUwk9XoEM\"",
    "mtime": "2026-11-23T13:42:59.082Z",
    "size": 121230,
    "path": "../public/_nuxt/CzErth1i.js"
  },
  "/_nuxt/Dijzp4_J.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e147-wEvhp0/7hc+3kLnoCTYH3nCih4Q\"",
    "mtime": "2026-11-23T13:42:59.085Z",
    "size": 57671,
    "path": "../public/_nuxt/Dijzp4_J.js"
  },
  "/_nuxt/DK3Fl9T5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9e-/3ZreeJJ1QByVcY6NKPe1BzCjpo\"",
    "mtime": "2026-11-23T13:42:59.082Z",
    "size": 158,
    "path": "../public/_nuxt/DK3Fl9T5.js"
  },
  "/_nuxt/DRi5KiSl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2589-rmeLKn+l092XumfoU+qofcpGS/c\"",
    "mtime": "2026-11-23T13:42:59.085Z",
    "size": 9609,
    "path": "../public/_nuxt/DRi5KiSl.js"
  },
  "/_nuxt/Dumnw_3a.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d95b-3ssZM/wv1IXUXtqbWjdSZNI/wPc\"",
    "mtime": "2026-11-23T13:42:59.060Z",
    "size": 186715,
    "path": "../public/_nuxt/Dumnw_3a.js"
  },
  "/_nuxt/entry.CNv6JYta.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"33ae8-rxYZ/7aHya+esqyOPXOLb+uCeW0\"",
    "mtime": "2026-11-23T13:42:59.089Z",
    "size": 211688,
    "path": "../public/_nuxt/entry.CNv6JYta.css"
  },
  "/_nuxt/error-404.DpKY_dMl.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a8d-ikaaK5LbtZuaZygnIu5mAjYDRiQ\"",
    "mtime": "2026-11-23T13:42:59.089Z",
    "size": 2701,
    "path": "../public/_nuxt/error-404.DpKY_dMl.css"
  },
  "/_nuxt/error-500.CmR4p1fc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79f-oUFNPOuVEcj5aJV0yQGGzo21VAE\"",
    "mtime": "2026-11-23T13:42:59.090Z",
    "size": 1951,
    "path": "../public/_nuxt/error-500.CmR4p1fc.css"
  },
  "/_nuxt/gDoGwUNU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4a-oCtv1WvVeztTlQYpBXKFrwYY9mo\"",
    "mtime": "2026-11-23T13:42:59.086Z",
    "size": 2890,
    "path": "../public/_nuxt/gDoGwUNU.js"
  },
  "/_nuxt/leRfc5OG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1661-IOIjxgRKHTK6EB5PSjztY0EZDLM\"",
    "mtime": "2026-11-23T13:42:59.086Z",
    "size": 5729,
    "path": "../public/_nuxt/leRfc5OG.js"
  },
  "/_nuxt/XNjmCFWu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7a8-I15b3fGfRNu/q/SSED3oTmcaWHQ\"",
    "mtime": "2026-11-23T13:42:59.086Z",
    "size": 1960,
    "path": "../public/_nuxt/XNjmCFWu.js"
  },
  "/scenarios/satisfactory/data.json": {
    "type": "application/json",
    "etag": "\"a525-e7GQb/Y3K9WVQKBvfeq+Ta4rcLU\"",
    "mtime": "2026-11-23T09:08:12.367Z",
    "size": 42277,
    "path": "../public/scenarios/satisfactory/data.json"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-w9ZHEDPldfM9vOAkDekI+HqGdCk\"",
    "mtime": "2026-11-23T13:42:59.282Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/scenarios/satisfactory/locales/en.json": {
    "type": "application/json",
    "etag": "\"1ed4-P7Qx0DVhwKzx7gc7ch9+L0+Z0w0\"",
    "mtime": "2026-11-20T14:58:25.644Z",
    "size": 7892,
    "path": "../public/scenarios/satisfactory/locales/en.json"
  },
  "/_nuxt/builds/meta/5b018163-ca00-42c9-9e5c-0e030da357b4.json": {
    "type": "application/json",
    "etag": "\"58-H5x8J7FqO94owGdwW6g39P1tfgs\"",
    "mtime": "2026-11-23T13:42:59.282Z",
    "size": 88,
    "path": "../public/_nuxt/builds/meta/5b018163-ca00-42c9-9e5c-0e030da357b4.json"
  },
  "/scenarios/satisfactory/img/accelerator.png": {
    "type": "image/png",
    "etag": "\"b73-lXIMV8vHbkhvzMB0SYcPLpKDmOs\"",
    "mtime": "2026-11-18T08:22:55.801Z",
    "size": 2931,
    "path": "../public/scenarios/satisfactory/img/accelerator.png"
  },
  "/scenarios/satisfactory/img/adaptive_control_unit.png": {
    "type": "image/png",
    "etag": "\"5eb-eASoNi8/0pJkH0/g9YHdXU6Dc+U\"",
    "mtime": "2026-11-18T08:22:55.803Z",
    "size": 1515,
    "path": "../public/scenarios/satisfactory/img/adaptive_control_unit.png"
  },
  "/scenarios/satisfactory/img/ai_expansion_server.png": {
    "type": "image/png",
    "etag": "\"486-Mp+xPN4p++bmeLZFtMfIzq4nkX4\"",
    "mtime": "2026-11-18T08:22:55.803Z",
    "size": 1158,
    "path": "../public/scenarios/satisfactory/img/ai_expansion_server.png"
  },
  "/scenarios/satisfactory/img/alien.png": {
    "type": "image/png",
    "etag": "\"801-QxagT5Q/h2yXQ3yFmgC7TYMt8X0\"",
    "mtime": "2026-11-18T08:22:55.805Z",
    "size": 2049,
    "path": "../public/scenarios/satisfactory/img/alien.png"
  },
  "/scenarios/satisfactory/img/alien_fluctuator.png": {
    "type": "image/png",
    "etag": "\"42d-3NndWjhPK/weZomAGIHhhvtdNu0\"",
    "mtime": "2026-11-18T08:22:55.805Z",
    "size": 1069,
    "path": "../public/scenarios/satisfactory/img/alien_fluctuator.png"
  },
  "/scenarios/satisfactory/img/alien_ingot.png": {
    "type": "image/png",
    "etag": "\"6b5-c4C9Fw+YHhFjC1WH3hwjEQKulMM\"",
    "mtime": "2026-11-18T08:22:55.805Z",
    "size": 1717,
    "path": "../public/scenarios/satisfactory/img/alien_ingot.png"
  },
  "/scenarios/satisfactory/img/alien_reanimated.png": {
    "type": "image/png",
    "etag": "\"96b-Q9xTfGOLnGcQssjfSPI1gS9BGU8\"",
    "mtime": "2026-11-18T08:22:55.807Z",
    "size": 2411,
    "path": "../public/scenarios/satisfactory/img/alien_reanimated.png"
  },
  "/scenarios/satisfactory/img/alien_sculptor.png": {
    "type": "image/png",
    "etag": "\"30b-hnoy9ufD7oYdXDAfa0xrS+30txw\"",
    "mtime": "2026-11-18T08:22:55.807Z",
    "size": 779,
    "path": "../public/scenarios/satisfactory/img/alien_sculptor.png"
  },
  "/scenarios/satisfactory/img/aluminum.png": {
    "type": "image/png",
    "etag": "\"549-dtFQH8o0Pg7YvvtmOX5TKHqNAm8\"",
    "mtime": "2026-11-18T08:22:55.809Z",
    "size": 1353,
    "path": "../public/scenarios/satisfactory/img/aluminum.png"
  },
  "/scenarios/satisfactory/img/alien_trigon.png": {
    "type": "image/png",
    "etag": "\"47a-WUBGTGhS0f46fzdxN7zAJoljcJo\"",
    "mtime": "2026-11-18T08:22:55.807Z",
    "size": 1146,
    "path": "../public/scenarios/satisfactory/img/alien_trigon.png"
  },
  "/scenarios/satisfactory/img/aluminum_casing.png": {
    "type": "image/png",
    "etag": "\"1b2-3fa24hpnqhyIZ//FdQCBa88kD4o\"",
    "mtime": "2026-11-18T08:22:55.809Z",
    "size": 434,
    "path": "../public/scenarios/satisfactory/img/aluminum_casing.png"
  },
  "/scenarios/satisfactory/img/aluminum_ingot.png": {
    "type": "image/png",
    "etag": "\"3ce-OEgT7Oj6ty6Gc6dSjCpG3LPIpcg\"",
    "mtime": "2026-11-18T08:22:55.809Z",
    "size": 974,
    "path": "../public/scenarios/satisfactory/img/aluminum_ingot.png"
  },
  "/scenarios/satisfactory/img/aluminum_prod.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/aluminum_prod.png"
  },
  "/scenarios/satisfactory/img/aluminum_scrap.png": {
    "type": "image/png",
    "etag": "\"789-KY4GIXK6nUrPmRdClQwjPnJFz4I\"",
    "mtime": "2026-11-18T08:22:55.811Z",
    "size": 1929,
    "path": "../public/scenarios/satisfactory/img/aluminum_scrap.png"
  },
  "/scenarios/satisfactory/img/aluminum_sheet.png": {
    "type": "image/png",
    "etag": "\"39d-0bD94RrVKF+eHoGtZgZLkq1kAV8\"",
    "mtime": "2026-11-18T08:22:55.811Z",
    "size": 925,
    "path": "../public/scenarios/satisfactory/img/aluminum_sheet.png"
  },
  "/scenarios/satisfactory/img/aluminum_solution.png": {
    "type": "image/png",
    "etag": "\"64a-b2K91DpK1re2ROrC3TFCeRQpKm4\"",
    "mtime": "2026-11-18T08:22:55.811Z",
    "size": 1610,
    "path": "../public/scenarios/satisfactory/img/aluminum_solution.png"
  },
  "/scenarios/satisfactory/img/assembler.png": {
    "type": "image/png",
    "etag": "\"4c9-kYCFP5B1nvaarjiJEdfFLsh5zaw\"",
    "mtime": "2026-11-18T08:22:55.813Z",
    "size": 1225,
    "path": "../public/scenarios/satisfactory/img/assembler.png"
  },
  "/scenarios/satisfactory/img/bauxite_refinement.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/bauxite_refinement.png"
  },
  "/scenarios/satisfactory/img/assembly_director_system.png": {
    "type": "image/png",
    "etag": "\"49e-8f4O9EbS8UhL6Y1+P2yaByys8y8\"",
    "mtime": "2026-11-18T08:22:55.813Z",
    "size": 1182,
    "path": "../public/scenarios/satisfactory/img/assembly_director_system.png"
  },
  "/scenarios/satisfactory/img/biomass.png": {
    "type": "image/png",
    "etag": "\"461-xa1Xfe+tlVKF2pk5WBjItR0E7G8\"",
    "mtime": "2026-11-18T08:22:55.815Z",
    "size": 1121,
    "path": "../public/scenarios/satisfactory/img/biomass.png"
  },
  "/scenarios/satisfactory/img/blender.png": {
    "type": "image/png",
    "etag": "\"66e-4q16x5OtuiZHDjJucXcmckU0lig\"",
    "mtime": "2026-11-18T08:22:55.815Z",
    "size": 1646,
    "path": "../public/scenarios/satisfactory/img/blender.png"
  },
  "/scenarios/satisfactory/img/builder.png": {
    "type": "image/png",
    "etag": "\"56b-xZ2ZQqTNDh8zsIOh7G6/JzgavZg\"",
    "mtime": "2026-11-18T08:22:55.815Z",
    "size": 1387,
    "path": "../public/scenarios/satisfactory/img/builder.png"
  },
  "/scenarios/satisfactory/img/caterium.png": {
    "type": "image/png",
    "etag": "\"940-PfR3sNhS4xK78/uVLhkfqmKcw7Y\"",
    "mtime": "2026-11-18T08:22:55.817Z",
    "size": 2368,
    "path": "../public/scenarios/satisfactory/img/caterium.png"
  },
  "/scenarios/satisfactory/img/caterium_circuit.png": {
    "type": "image/png",
    "etag": "\"5cf-9LzDs+HEFbmrHP9kqZwhzynePlA\"",
    "mtime": "2026-11-18T08:22:55.823Z",
    "size": 1487,
    "path": "../public/scenarios/satisfactory/img/caterium_circuit.png"
  },
  "/scenarios/satisfactory/img/caterium_wire.png": {
    "type": "image/png",
    "etag": "\"5f6-Yt2X34Cor7mPEryeH+ebnv3VDOA\"",
    "mtime": "2026-11-18T08:22:55.825Z",
    "size": 1526,
    "path": "../public/scenarios/satisfactory/img/caterium_wire.png"
  },
  "/scenarios/satisfactory/img/caterium_ingot.png": {
    "type": "image/png",
    "etag": "\"6a5-3RAFjqNSrRUux8jXNcjara60SRY\"",
    "mtime": "2026-11-18T08:22:55.823Z",
    "size": 1701,
    "path": "../public/scenarios/satisfactory/img/caterium_ingot.png"
  },
  "/scenarios/satisfactory/img/circuit_board.png": {
    "type": "image/png",
    "etag": "\"2c6-4YwoDCnzHENuTWfOqJobPyI01Go\"",
    "mtime": "2026-11-18T08:22:55.825Z",
    "size": 710,
    "path": "../public/scenarios/satisfactory/img/circuit_board.png"
  },
  "/scenarios/satisfactory/img/coal.png": {
    "type": "image/png",
    "etag": "\"520-H/imLGIXTbJjEYi0Uv1hNmbae+E\"",
    "mtime": "2026-11-18T08:22:55.825Z",
    "size": 1312,
    "path": "../public/scenarios/satisfactory/img/coal.png"
  },
  "/scenarios/satisfactory/img/computer.png": {
    "type": "image/png",
    "etag": "\"386-qjZlznoEKHrP7fEVMMUFPGSxxH4\"",
    "mtime": "2026-11-18T08:22:55.827Z",
    "size": 902,
    "path": "../public/scenarios/satisfactory/img/computer.png"
  },
  "/scenarios/satisfactory/img/concrete.png": {
    "type": "image/png",
    "etag": "\"82b-h+dFsEv+KO90f0aczAxUfpekcHE\"",
    "mtime": "2026-11-18T08:22:55.827Z",
    "size": 2091,
    "path": "../public/scenarios/satisfactory/img/concrete.png"
  },
  "/scenarios/satisfactory/img/control_rod.png": {
    "type": "image/png",
    "etag": "\"4af-uLIrhTYc0tX/v1gHq4Dg+eglMKo\"",
    "mtime": "2026-11-18T08:22:55.829Z",
    "size": 1199,
    "path": "../public/scenarios/satisfactory/img/control_rod.png"
  },
  "/scenarios/satisfactory/img/control_system.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/control_system.png"
  },
  "/scenarios/satisfactory/img/cooling_system.png": {
    "type": "image/png",
    "etag": "\"33c-eF6fM49l4f0wcf92lfSOlBYvqM8\"",
    "mtime": "2026-11-18T08:22:55.833Z",
    "size": 828,
    "path": "../public/scenarios/satisfactory/img/cooling_system.png"
  },
  "/scenarios/satisfactory/img/converter.png": {
    "type": "image/png",
    "etag": "\"431-eqB+xZvCX9GNwjAKN2Js0YiwiVs\"",
    "mtime": "2026-11-18T08:22:55.830Z",
    "size": 1073,
    "path": "../public/scenarios/satisfactory/img/converter.png"
  },
  "/scenarios/satisfactory/img/copper.png": {
    "type": "image/png",
    "etag": "\"953-k5iDZtQjQtbI7Z7+Q5qv1r2tAvc\"",
    "mtime": "2026-11-18T08:22:55.833Z",
    "size": 2387,
    "path": "../public/scenarios/satisfactory/img/copper.png"
  },
  "/scenarios/satisfactory/img/copper_powder.png": {
    "type": "image/png",
    "etag": "\"794-tnqBjmKinTlT17ZHW8V+WCJhO48\"",
    "mtime": "2026-11-18T08:22:55.834Z",
    "size": 1940,
    "path": "../public/scenarios/satisfactory/img/copper_powder.png"
  },
  "/scenarios/satisfactory/img/copper_ingot.png": {
    "type": "image/png",
    "etag": "\"5f2-abGSEMQLMKgQVZYxgd8lMNdOTGA\"",
    "mtime": "2026-11-18T08:22:55.834Z",
    "size": 1522,
    "path": "../public/scenarios/satisfactory/img/copper_ingot.png"
  },
  "/scenarios/satisfactory/img/copper_sheet.png": {
    "type": "image/png",
    "etag": "\"59f-2tvZUk8SSPpa2mOGKPIOzRcHQas\"",
    "mtime": "2026-11-18T08:22:55.835Z",
    "size": 1439,
    "path": "../public/scenarios/satisfactory/img/copper_sheet.png"
  },
  "/scenarios/satisfactory/img/copper_wire_1.png": {
    "type": "image/png",
    "etag": "\"679-wMrjqsTzudkQ1eNDQUZzmlGov3g\"",
    "mtime": "2026-11-18T08:22:55.835Z",
    "size": 1657,
    "path": "../public/scenarios/satisfactory/img/copper_wire_1.png"
  },
  "/scenarios/satisfactory/img/copper_wire_2.png": {
    "type": "image/png",
    "etag": "\"887-iOGjfR4YZ16tjKlkF/S8FLTgoTg\"",
    "mtime": "2026-11-18T08:22:55.837Z",
    "size": 2183,
    "path": "../public/scenarios/satisfactory/img/copper_wire_2.png"
  },
  "/scenarios/satisfactory/img/copper_wire_3.png": {
    "type": "image/png",
    "etag": "\"94f-anpUVAaoQqq/35IMec2DYPPXtL8\"",
    "mtime": "2026-11-18T08:22:55.837Z",
    "size": 2383,
    "path": "../public/scenarios/satisfactory/img/copper_wire_3.png"
  },
  "/scenarios/satisfactory/img/dark_matter_crystal.png": {
    "type": "image/png",
    "etag": "\"4fa-sQ0/2Ryduy0CiLvTFdgs5mRhu88\"",
    "mtime": "2026-11-18T08:22:55.837Z",
    "size": 1274,
    "path": "../public/scenarios/satisfactory/img/dark_matter_crystal.png"
  },
  "/scenarios/satisfactory/img/diamonds.png": {
    "type": "image/png",
    "etag": "\"50f-qCzGqQCXR6eIrcNcXUivmJMj02I\"",
    "mtime": "2026-11-18T08:22:55.839Z",
    "size": 1295,
    "path": "../public/scenarios/satisfactory/img/diamonds.png"
  },
  "/scenarios/satisfactory/img/dark_matter_solution.png": {
    "type": "image/png",
    "etag": "\"4c4-/YuFjEP7ZCUwtAFnkJq4FF5cDoQ\"",
    "mtime": "2026-11-18T08:22:55.837Z",
    "size": 1220,
    "path": "../public/scenarios/satisfactory/img/dark_matter_solution.png"
  },
  "/scenarios/satisfactory/img/encoder.png": {
    "type": "image/png",
    "etag": "\"5cf-Qb638Wyxz/YxWychpErrte6lnuA\"",
    "mtime": "2026-11-18T08:22:55.839Z",
    "size": 1487,
    "path": "../public/scenarios/satisfactory/img/encoder.png"
  },
  "/scenarios/satisfactory/img/energy_biomass.png": {
    "type": "image/png",
    "etag": "\"3ed-1QCQGxZM9evqkgMaLyuTmkKt7Fw\"",
    "mtime": "2026-11-18T08:22:55.839Z",
    "size": 1005,
    "path": "../public/scenarios/satisfactory/img/energy_biomass.png"
  },
  "/scenarios/satisfactory/img/energy_coal.png": {
    "type": "image/png",
    "etag": "\"4bc-OIKoAau8i5mp2h0VkVO/I2kkWyQ\"",
    "mtime": "2026-11-18T08:22:55.839Z",
    "size": 1212,
    "path": "../public/scenarios/satisfactory/img/energy_coal.png"
  },
  "/scenarios/satisfactory/img/energy_fuel.png": {
    "type": "image/png",
    "etag": "\"3b4-QgvbK5GF1rOETOO71qWlwLDcX+8\"",
    "mtime": "2026-11-18T08:22:55.843Z",
    "size": 948,
    "path": "../public/scenarios/satisfactory/img/energy_fuel.png"
  },
  "/scenarios/satisfactory/img/energy_nuclear.png": {
    "type": "image/png",
    "etag": "\"403-kp5KeeaN8bWdlDvkoWMil5UXbAk\"",
    "mtime": "2026-11-18T08:22:55.845Z",
    "size": 1027,
    "path": "../public/scenarios/satisfactory/img/energy_nuclear.png"
  },
  "/scenarios/satisfactory/img/engine_1.png": {
    "type": "image/png",
    "etag": "\"42c-3KJCIcSlpVNIbA3PftDMJwIWoro\"",
    "mtime": "2026-11-18T08:22:55.845Z",
    "size": 1068,
    "path": "../public/scenarios/satisfactory/img/engine_1.png"
  },
  "/scenarios/satisfactory/img/engine_2.png": {
    "type": "image/png",
    "etag": "\"651-wHLLRG6BoHQ04GUJozFlRwOZqcY\"",
    "mtime": "2026-11-18T08:22:55.847Z",
    "size": 1617,
    "path": "../public/scenarios/satisfactory/img/engine_2.png"
  },
  "/scenarios/satisfactory/img/engine_3.png": {
    "type": "image/png",
    "etag": "\"594-s890lCoNggPCer5FzWKqlbStGag\"",
    "mtime": "2026-11-18T08:22:55.847Z",
    "size": 1428,
    "path": "../public/scenarios/satisfactory/img/engine_3.png"
  },
  "/scenarios/satisfactory/img/engine_4.png": {
    "type": "image/png",
    "etag": "\"623-mK/i1ue147hP05pJHwLxMoLXgKs\"",
    "mtime": "2026-11-18T08:22:55.847Z",
    "size": 1571,
    "path": "../public/scenarios/satisfactory/img/engine_4.png"
  },
  "/scenarios/satisfactory/img/engine_5.png": {
    "type": "image/png",
    "etag": "\"5c9-8brTb2P46etdeAs+InCQLgSY5Ho\"",
    "mtime": "2026-11-18T08:22:55.847Z",
    "size": 1481,
    "path": "../public/scenarios/satisfactory/img/engine_5.png"
  },
  "/scenarios/satisfactory/img/excited_photonic_matter.png": {
    "type": "image/png",
    "etag": "\"290-0vgvntaxeDZ7gh0T/Py9BsyBFcg\"",
    "mtime": "2026-11-18T08:22:55.849Z",
    "size": 656,
    "path": "../public/scenarios/satisfactory/img/excited_photonic_matter.png"
  },
  "/scenarios/satisfactory/img/foundry.png": {
    "type": "image/png",
    "etag": "\"4b7-H3HQQN+b5I0BwCfO77SbQeh1Nig\"",
    "mtime": "2026-11-18T08:22:55.849Z",
    "size": 1207,
    "path": "../public/scenarios/satisfactory/img/foundry.png"
  },
  "/scenarios/satisfactory/img/fuel.png": {
    "type": "image/png",
    "etag": "\"3a9-pnFz5S93LS+tfp40xMISbzp0caM\"",
    "mtime": "2026-11-18T08:22:55.849Z",
    "size": 937,
    "path": "../public/scenarios/satisfactory/img/fuel.png"
  },
  "/scenarios/satisfactory/img/generator_biomass.png": {
    "type": "image/png",
    "etag": "\"5b6-EvOkAwseFL9dmDQ0CGNZI6XjHbw\"",
    "mtime": "2026-11-18T08:22:55.850Z",
    "size": 1462,
    "path": "../public/scenarios/satisfactory/img/generator_biomass.png"
  },
  "/scenarios/satisfactory/img/generator_coal.png": {
    "type": "image/png",
    "etag": "\"725-Y/5o3UbHZCqu79znHAsof4C7mVo\"",
    "mtime": "2026-11-18T08:22:55.852Z",
    "size": 1829,
    "path": "../public/scenarios/satisfactory/img/generator_coal.png"
  },
  "/scenarios/satisfactory/img/generator_fuel.png": {
    "type": "image/png",
    "etag": "\"749-FBfL/3XFyReHKwIfmcKMacAC/pE\"",
    "mtime": "2026-11-18T08:22:55.852Z",
    "size": 1865,
    "path": "../public/scenarios/satisfactory/img/generator_fuel.png"
  },
  "/scenarios/satisfactory/img/generator_nuclear.png": {
    "type": "image/png",
    "etag": "\"63d-pd29tNxUpwxwBW1dY4tv8gWYYLw\"",
    "mtime": "2026-11-18T08:22:55.852Z",
    "size": 1597,
    "path": "../public/scenarios/satisfactory/img/generator_nuclear.png"
  },
  "/scenarios/satisfactory/img/heat_sink.png": {
    "type": "image/png",
    "etag": "\"3eb-ftCmeWaftxvdKGK4OmYyXhb9gXs\"",
    "mtime": "2026-11-18T08:22:55.852Z",
    "size": 1003,
    "path": "../public/scenarios/satisfactory/img/heat_sink.png"
  },
  "/scenarios/satisfactory/img/high_speed_connector.png": {
    "type": "image/png",
    "etag": "\"3c2-t6DBQEudxpaItHiKvXMxoWhRMlM\"",
    "mtime": "2026-11-18T08:22:55.855Z",
    "size": 962,
    "path": "../public/scenarios/satisfactory/img/high_speed_connector.png"
  },
  "/scenarios/satisfactory/img/iron.png": {
    "type": "image/png",
    "etag": "\"a4e-EYJ86pECGjx7fcvxmiC9kfF4kXs\"",
    "mtime": "2026-11-18T08:22:55.855Z",
    "size": 2638,
    "path": "../public/scenarios/satisfactory/img/iron.png"
  },
  "/scenarios/satisfactory/img/iron_frame_1.png": {
    "type": "image/png",
    "etag": "\"747-a59o6u13dX5PSxbizn0KLycxT/k\"",
    "mtime": "2026-11-18T08:22:55.855Z",
    "size": 1863,
    "path": "../public/scenarios/satisfactory/img/iron_frame_1.png"
  },
  "/scenarios/satisfactory/img/iron_frame_2.png": {
    "type": "image/png",
    "etag": "\"5f6-ppwUjJsiWisFmKqzeMMuvjKSWC0\"",
    "mtime": "2026-11-18T08:22:55.857Z",
    "size": 1526,
    "path": "../public/scenarios/satisfactory/img/iron_frame_2.png"
  },
  "/scenarios/satisfactory/img/iron_plate_1.png": {
    "type": "image/png",
    "etag": "\"464-kR4Ps+PqAJeer4abISfivQFYNj8\"",
    "mtime": "2026-11-18T08:22:55.857Z",
    "size": 1124,
    "path": "../public/scenarios/satisfactory/img/iron_plate_1.png"
  },
  "/scenarios/satisfactory/img/iron_ingot.png": {
    "type": "image/png",
    "etag": "\"661-GbuQMCgoix2hpb6H3EOM5OuvyJw\"",
    "mtime": "2026-11-18T08:22:55.857Z",
    "size": 1633,
    "path": "../public/scenarios/satisfactory/img/iron_ingot.png"
  },
  "/scenarios/satisfactory/img/iron_plate_2.png": {
    "type": "image/png",
    "etag": "\"41b-tQA3JVHSRAdDVqysoJOI5flkHo8\"",
    "mtime": "2026-11-18T08:22:55.859Z",
    "size": 1051,
    "path": "../public/scenarios/satisfactory/img/iron_plate_2.png"
  },
  "/scenarios/satisfactory/img/iron_plate_3.png": {
    "type": "image/png",
    "etag": "\"53e-V8S7NB/TniuSm7KBb7LLga1b4os\"",
    "mtime": "2026-11-18T08:22:55.861Z",
    "size": 1342,
    "path": "../public/scenarios/satisfactory/img/iron_plate_3.png"
  },
  "/scenarios/satisfactory/img/iron_rod.png": {
    "type": "image/png",
    "etag": "\"4e7-4sO0mX8tcfKwzYoRPHfsVnrGSNw\"",
    "mtime": "2026-11-18T08:22:55.861Z",
    "size": 1255,
    "path": "../public/scenarios/satisfactory/img/iron_rod.png"
  },
  "/scenarios/satisfactory/img/iron_rotor.png": {
    "type": "image/png",
    "etag": "\"5fd-rTEAlEFHLoxSPBel4J4jcCXGUoI\"",
    "mtime": "2026-11-18T08:22:55.863Z",
    "size": 1533,
    "path": "../public/scenarios/satisfactory/img/iron_rotor.png"
  },
  "/scenarios/satisfactory/img/iron_screw.png": {
    "type": "image/png",
    "etag": "\"723-51VwJ+kXvZGJ3dKViwLViR0r3lk\"",
    "mtime": "2026-11-18T08:22:55.863Z",
    "size": 1827,
    "path": "../public/scenarios/satisfactory/img/iron_screw.png"
  },
  "/scenarios/satisfactory/img/leading_edge_prod.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/leading_edge_prod.png"
  },
  "/scenarios/satisfactory/img/limestone.png": {
    "type": "image/png",
    "etag": "\"a0f-6LoHebfgfgMV/hiiAvcDAt5z8Ps\"",
    "mtime": "2026-11-18T08:22:55.865Z",
    "size": 2575,
    "path": "../public/scenarios/satisfactory/img/limestone.png"
  },
  "/scenarios/satisfactory/img/magnetic_field_generator.png": {
    "type": "image/png",
    "etag": "\"45f-thgBawbW0fssPKNt/AN3e5AEV/I\"",
    "mtime": "2026-11-18T08:22:55.865Z",
    "size": 1119,
    "path": "../public/scenarios/satisfactory/img/magnetic_field_generator.png"
  },
  "/scenarios/satisfactory/img/manufacturer.png": {
    "type": "image/png",
    "etag": "\"81d-aDBb+May+F/XSR2kHGaZdSu5MNk\"",
    "mtime": "2026-11-18T08:22:55.867Z",
    "size": 2077,
    "path": "../public/scenarios/satisfactory/img/manufacturer.png"
  },
  "/scenarios/satisfactory/img/matter_conversion.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/matter_conversion.png"
  },
  "/scenarios/satisfactory/img/manufacturing.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/manufacturing.png"
  },
  "/scenarios/satisfactory/img/miner_1.png": {
    "type": "image/png",
    "etag": "\"535-IAc6gIBBeZ0uSBL7kD2K6Hmnkrg\"",
    "mtime": "2026-11-18T08:22:55.870Z",
    "size": 1333,
    "path": "../public/scenarios/satisfactory/img/miner_1.png"
  },
  "/scenarios/satisfactory/img/miner_2.png": {
    "type": "image/png",
    "etag": "\"551-aLJVrMb22snQ9UyI4qJvb712l44\"",
    "mtime": "2026-11-18T08:22:55.870Z",
    "size": 1361,
    "path": "../public/scenarios/satisfactory/img/miner_2.png"
  },
  "/scenarios/satisfactory/img/miner_3.png": {
    "type": "image/png",
    "etag": "\"6a2-w8Faoki7hm60er3UDykZAZBAHng\"",
    "mtime": "2026-11-18T08:22:55.870Z",
    "size": 1698,
    "path": "../public/scenarios/satisfactory/img/miner_3.png"
  },
  "/scenarios/satisfactory/img/miner_0.png": {
    "type": "image/png",
    "etag": "\"50d-+DNORqtTkKcIz5idlSwcNSybPYY\"",
    "mtime": "2026-11-18T08:22:55.868Z",
    "size": 1293,
    "path": "../public/scenarios/satisfactory/img/miner_0.png"
  },
  "/scenarios/satisfactory/img/neural_quantum_processor.png": {
    "type": "image/png",
    "etag": "\"586-wtf2x8BxPgrfjEPhQia+R4frHTU\"",
    "mtime": "2026-11-18T08:22:55.870Z",
    "size": 1414,
    "path": "../public/scenarios/satisfactory/img/neural_quantum_processor.png"
  },
  "/scenarios/satisfactory/img/nitrogen.png": {
    "type": "image/png",
    "etag": "\"558-8hb1JPjueyOEKZNyxXNO8q4QVqg\"",
    "mtime": "2026-11-18T08:22:55.872Z",
    "size": 1368,
    "path": "../public/scenarios/satisfactory/img/nitrogen.png"
  },
  "/scenarios/satisfactory/img/oil.png": {
    "type": "image/png",
    "etag": "\"433-zGjiWtsKUrA4Me25IIG31r1M398\"",
    "mtime": "2026-11-18T08:22:55.872Z",
    "size": 1075,
    "path": "../public/scenarios/satisfactory/img/oil.png"
  },
  "/scenarios/satisfactory/img/oil_prod.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/oil_prod.png"
  },
  "/scenarios/satisfactory/img/onboarding_0.png": {
    "type": "image/png",
    "etag": "\"213-hF6z4ZfkBnQXwiWaDnCtRg1vCks\"",
    "mtime": "2026-11-20T13:45:28.798Z",
    "size": 531,
    "path": "../public/scenarios/satisfactory/img/onboarding_0.png"
  },
  "/scenarios/satisfactory/img/onboarding_1.png": {
    "type": "image/png",
    "etag": "\"213-hF6z4ZfkBnQXwiWaDnCtRg1vCks\"",
    "mtime": "2026-11-20T13:45:28.798Z",
    "size": 531,
    "path": "../public/scenarios/satisfactory/img/onboarding_1.png"
  },
  "/scenarios/satisfactory/img/onboarding_4.png": {
    "type": "image/png",
    "etag": "\"213-hF6z4ZfkBnQXwiWaDnCtRg1vCks\"",
    "mtime": "2026-11-20T13:45:28.798Z",
    "size": 531,
    "path": "../public/scenarios/satisfactory/img/onboarding_4.png"
  },
  "/scenarios/satisfactory/img/onboarding_3.png": {
    "type": "image/png",
    "etag": "\"213-hF6z4ZfkBnQXwiWaDnCtRg1vCks\"",
    "mtime": "2026-11-20T13:45:28.798Z",
    "size": 531,
    "path": "../public/scenarios/satisfactory/img/onboarding_3.png"
  },
  "/scenarios/satisfactory/img/onboarding_2.png": {
    "type": "image/png",
    "etag": "\"213-hF6z4ZfkBnQXwiWaDnCtRg1vCks\"",
    "mtime": "2026-11-20T13:45:28.798Z",
    "size": 531,
    "path": "../public/scenarios/satisfactory/img/onboarding_2.png"
  },
  "/scenarios/satisfactory/img/onboarding_5.png": {
    "type": "image/png",
    "etag": "\"213-hF6z4ZfkBnQXwiWaDnCtRg1vCks\"",
    "mtime": "2026-11-20T13:45:28.798Z",
    "size": 531,
    "path": "../public/scenarios/satisfactory/img/onboarding_5.png"
  },
  "/scenarios/satisfactory/img/oscillator_1.png": {
    "type": "image/png",
    "etag": "\"1d0-Fey4V5N3I/z39ET0Sh+an9LZMxU\"",
    "mtime": "2026-11-18T08:22:55.876Z",
    "size": 464,
    "path": "../public/scenarios/satisfactory/img/oscillator_1.png"
  },
  "/scenarios/satisfactory/img/oscillator_2.png": {
    "type": "image/png",
    "etag": "\"4a8-hRjartDO6yBJ4mhaxjRA+DtfUlk\"",
    "mtime": "2026-11-18T08:22:55.876Z",
    "size": 1192,
    "path": "../public/scenarios/satisfactory/img/oscillator_2.png"
  },
  "/scenarios/satisfactory/img/particle_enrichment.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/particle_enrichment.png"
  },
  "/scenarios/satisfactory/img/part_assembly.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/part_assembly.png"
  },
  "/scenarios/satisfactory/img/phase_1.png": {
    "type": "image/png",
    "etag": "\"495-gwW2xk4of9W7xt1T6rUTqtw7Ls4\"",
    "mtime": "2026-11-20T14:08:30.317Z",
    "size": 1173,
    "path": "../public/scenarios/satisfactory/img/phase_1.png"
  },
  "/scenarios/satisfactory/img/phase_0.png": {
    "type": "image/png",
    "etag": "\"495-gwW2xk4of9W7xt1T6rUTqtw7Ls4\"",
    "mtime": "2026-11-20T14:08:30.317Z",
    "size": 1173,
    "path": "../public/scenarios/satisfactory/img/phase_0.png"
  },
  "/scenarios/satisfactory/img/phase_3.png": {
    "type": "image/png",
    "etag": "\"495-gwW2xk4of9W7xt1T6rUTqtw7Ls4\"",
    "mtime": "2026-11-20T14:08:30.317Z",
    "size": 1173,
    "path": "../public/scenarios/satisfactory/img/phase_3.png"
  },
  "/scenarios/satisfactory/img/phase_2.png": {
    "type": "image/png",
    "etag": "\"495-gwW2xk4of9W7xt1T6rUTqtw7Ls4\"",
    "mtime": "2026-11-20T14:08:30.317Z",
    "size": 1173,
    "path": "../public/scenarios/satisfactory/img/phase_2.png"
  },
  "/scenarios/satisfactory/img/phase_5.png": {
    "type": "image/png",
    "etag": "\"495-gwW2xk4of9W7xt1T6rUTqtw7Ls4\"",
    "mtime": "2026-11-20T14:08:30.317Z",
    "size": 1173,
    "path": "../public/scenarios/satisfactory/img/phase_5.png"
  },
  "/scenarios/satisfactory/img/phase_4.png": {
    "type": "image/png",
    "etag": "\"495-gwW2xk4of9W7xt1T6rUTqtw7Ls4\"",
    "mtime": "2026-11-20T14:08:30.317Z",
    "size": 1173,
    "path": "../public/scenarios/satisfactory/img/phase_4.png"
  },
  "/scenarios/satisfactory/img/plastic.png": {
    "type": "image/png",
    "etag": "\"53c-9zuuwYnjIeNsca8ujEK03Djrn4A\"",
    "mtime": "2026-11-18T08:22:55.884Z",
    "size": 1340,
    "path": "../public/scenarios/satisfactory/img/plastic.png"
  },
  "/scenarios/satisfactory/img/power_coal.png": {
    "type": "image/png",
    "etag": "\"2da-voAelfYTrOdebdA8qfUYxyHO6V0\"",
    "mtime": "2026-11-20T13:54:59.681Z",
    "size": 730,
    "path": "../public/scenarios/satisfactory/img/power_coal.png"
  },
  "/scenarios/satisfactory/img/power_fuel.png": {
    "type": "image/png",
    "etag": "\"2da-voAelfYTrOdebdA8qfUYxyHO6V0\"",
    "mtime": "2026-11-20T13:54:59.681Z",
    "size": 730,
    "path": "../public/scenarios/satisfactory/img/power_fuel.png"
  },
  "/scenarios/satisfactory/img/power_nuclear.png": {
    "type": "image/png",
    "etag": "\"2da-voAelfYTrOdebdA8qfUYxyHO6V0\"",
    "mtime": "2026-11-20T13:54:59.681Z",
    "size": 730,
    "path": "../public/scenarios/satisfactory/img/power_nuclear.png"
  },
  "/scenarios/satisfactory/img/pump_nitrogen.png": {
    "type": "image/png",
    "etag": "\"464-8VrXV9ZB+02jNB3ItKfg3Jlls+E\"",
    "mtime": "2026-11-18T08:22:55.886Z",
    "size": 1124,
    "path": "../public/scenarios/satisfactory/img/pump_nitrogen.png"
  },
  "/scenarios/satisfactory/img/pump_oil.png": {
    "type": "image/png",
    "etag": "\"6e1-g1+cI7eJ1iqINGeXPFbefy3OqiU\"",
    "mtime": "2026-11-18T08:22:55.887Z",
    "size": 1761,
    "path": "../public/scenarios/satisfactory/img/pump_oil.png"
  },
  "/scenarios/satisfactory/img/pump_water.png": {
    "type": "image/png",
    "etag": "\"653-G8jTdtlQjTP46BHn0mD2SCrKc1A\"",
    "mtime": "2026-11-18T08:22:55.887Z",
    "size": 1619,
    "path": "../public/scenarios/satisfactory/img/pump_water.png"
  },
  "/scenarios/satisfactory/img/quantum_encoding.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/quantum_encoding.png"
  },
  "/scenarios/satisfactory/img/quartz.png": {
    "type": "image/png",
    "etag": "\"994-lYWqdurAVoAkJh7zpBlAzPAnIsE\"",
    "mtime": "2026-11-18T08:22:55.892Z",
    "size": 2452,
    "path": "../public/scenarios/satisfactory/img/quartz.png"
  },
  "/scenarios/satisfactory/img/quartz_crystal.png": {
    "type": "image/png",
    "etag": "\"501-2sc6zXILRcyN59e8G/Ei29/eCvw\"",
    "mtime": "2026-11-18T08:22:55.892Z",
    "size": 1281,
    "path": "../public/scenarios/satisfactory/img/quartz_crystal.png"
  },
  "/scenarios/satisfactory/img/quartz_powder.png": {
    "type": "image/png",
    "etag": "\"854-wFNf696dq2Vl0n9ga/k2aiLXSqU\"",
    "mtime": "2026-11-18T08:22:55.892Z",
    "size": 2132,
    "path": "../public/scenarios/satisfactory/img/quartz_powder.png"
  },
  "/scenarios/satisfactory/img/radio_control_unit.png": {
    "type": "image/png",
    "etag": "\"342-Re+LSYP7vMG7YIeE1zY6erA+ofM\"",
    "mtime": "2026-11-18T08:22:55.894Z",
    "size": 834,
    "path": "../public/scenarios/satisfactory/img/radio_control_unit.png"
  },
  "/scenarios/satisfactory/img/refinery.png": {
    "type": "image/png",
    "etag": "\"592-cPGRUXfQXyOQtYQgV0P4ir8e+rA\"",
    "mtime": "2026-11-18T08:22:55.894Z",
    "size": 1426,
    "path": "../public/scenarios/satisfactory/img/refinery.png"
  },
  "/scenarios/satisfactory/img/resin.png": {
    "type": "image/png",
    "etag": "\"5e3-0ZF3W/x20RI5EtQfdtDXr1hNQiw\"",
    "mtime": "2026-11-18T08:22:55.894Z",
    "size": 1507,
    "path": "../public/scenarios/satisfactory/img/resin.png"
  },
  "/scenarios/satisfactory/img/rubber.png": {
    "type": "image/png",
    "etag": "\"81d-xvq+NhLj2r5reiLoLnhWByecPrk\"",
    "mtime": "2026-11-18T08:22:55.896Z",
    "size": 2077,
    "path": "../public/scenarios/satisfactory/img/rubber.png"
  },
  "/scenarios/satisfactory/img/smelter.png": {
    "type": "image/png",
    "etag": "\"4ad-XT3OvtwSbuOEDpSfaIWsKh3833w\"",
    "mtime": "2026-11-18T08:22:55.897Z",
    "size": 1197,
    "path": "../public/scenarios/satisfactory/img/smelter.png"
  },
  "/scenarios/satisfactory/img/singularity.png": {
    "type": "image/png",
    "etag": "\"285-mMRgEL/bYE0Ie3vddlmHHAzTUbo\"",
    "mtime": "2026-11-18T08:22:55.896Z",
    "size": 645,
    "path": "../public/scenarios/satisfactory/img/singularity.png"
  },
  "/scenarios/satisfactory/img/spatial_regulation.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/spatial_regulation.png"
  },
  "/scenarios/satisfactory/img/stator.png": {
    "type": "image/png",
    "etag": "\"3e1-t86n10n695X4Lp3aHoZLGmtIhJk\"",
    "mtime": "2026-11-18T08:22:55.898Z",
    "size": 993,
    "path": "../public/scenarios/satisfactory/img/stator.png"
  },
  "/scenarios/satisfactory/img/steel_beam_1.png": {
    "type": "image/png",
    "etag": "\"809-HyZIwHMUIRyfDI+1e1oZQrZqMvk\"",
    "mtime": "2026-11-18T08:22:55.898Z",
    "size": 2057,
    "path": "../public/scenarios/satisfactory/img/steel_beam_1.png"
  },
  "/scenarios/satisfactory/img/steel_frame_1.png": {
    "type": "image/png",
    "etag": "\"54d-F4HSOeQPIVlnNEwQ+qnyFeGaXFc\"",
    "mtime": "2026-11-18T08:22:55.900Z",
    "size": 1357,
    "path": "../public/scenarios/satisfactory/img/steel_frame_1.png"
  },
  "/scenarios/satisfactory/img/steel_beam_2.png": {
    "type": "image/png",
    "etag": "\"38d-gRWzYxTyRzxVTAMiujU2FbSgHWc\"",
    "mtime": "2026-11-18T08:22:55.898Z",
    "size": 909,
    "path": "../public/scenarios/satisfactory/img/steel_beam_2.png"
  },
  "/scenarios/satisfactory/img/steel_frame_2.png": {
    "type": "image/png",
    "etag": "\"5c4-snw5Pu3r++0sx3LDrYMlg7iCtbw\"",
    "mtime": "2026-11-18T08:22:55.900Z",
    "size": 1476,
    "path": "../public/scenarios/satisfactory/img/steel_frame_2.png"
  },
  "/scenarios/satisfactory/img/steel_frame_3.png": {
    "type": "image/png",
    "etag": "\"695-6D+OUyCAUghVGrLDxDWG8C4n4FE\"",
    "mtime": "2026-11-18T08:22:55.900Z",
    "size": 1685,
    "path": "../public/scenarios/satisfactory/img/steel_frame_3.png"
  },
  "/scenarios/satisfactory/img/steel_frame_4.png": {
    "type": "image/png",
    "etag": "\"5b7-xvACrFi7xnNky+w6GYTBRaRaK+s\"",
    "mtime": "2026-11-18T08:22:55.902Z",
    "size": 1463,
    "path": "../public/scenarios/satisfactory/img/steel_frame_4.png"
  },
  "/scenarios/satisfactory/img/steel_ingot.png": {
    "type": "image/png",
    "etag": "\"6db-3PnNQ50H3o8oGpCwhhcM36SYyHE\"",
    "mtime": "2026-11-18T08:22:55.902Z",
    "size": 1755,
    "path": "../public/scenarios/satisfactory/img/steel_ingot.png"
  },
  "/scenarios/satisfactory/img/steel_pipe.png": {
    "type": "image/png",
    "etag": "\"a7a-5uZnA7dnL6exGrwiwKwN7hDbrkE\"",
    "mtime": "2026-11-18T08:22:55.902Z",
    "size": 2682,
    "path": "../public/scenarios/satisfactory/img/steel_pipe.png"
  },
  "/scenarios/satisfactory/img/steel_prod_1.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/steel_prod_1.png"
  },
  "/scenarios/satisfactory/img/steel_prod_2.png": {
    "type": "image/png",
    "etag": "\"200-2d5shGAE40VYwy1ZuvhcAS7tulU\"",
    "mtime": "2026-11-20T13:59:40.889Z",
    "size": 512,
    "path": "../public/scenarios/satisfactory/img/steel_prod_2.png"
  },
  "/scenarios/satisfactory/img/storer_fluid.png": {
    "type": "image/png",
    "etag": "\"3d6-KaE00nrSkW1i1i9VMnuY6em16Yo\"",
    "mtime": "2026-11-18T08:22:55.904Z",
    "size": 982,
    "path": "../public/scenarios/satisfactory/img/storer_fluid.png"
  },
  "/scenarios/satisfactory/img/storer_solid.png": {
    "type": "image/png",
    "etag": "\"5b8-GQKij3qEvVCRRQrl+NIBTBXHC10\"",
    "mtime": "2026-11-18T08:22:55.904Z",
    "size": 1464,
    "path": "../public/scenarios/satisfactory/img/storer_solid.png"
  },
  "/scenarios/satisfactory/img/sulfur.png": {
    "type": "image/png",
    "etag": "\"a7d-uPfHiGCa3MI/LY5+/P7lknU+07A\"",
    "mtime": "2026-11-18T08:22:55.906Z",
    "size": 2685,
    "path": "../public/scenarios/satisfactory/img/sulfur.png"
  },
  "/scenarios/satisfactory/img/sulfuric_acid.png": {
    "type": "image/png",
    "etag": "\"6c5-hjkPeokk07b8h9KgQ0DOje7HAa8\"",
    "mtime": "2026-11-18T08:22:55.906Z",
    "size": 1733,
    "path": "../public/scenarios/satisfactory/img/sulfuric_acid.png"
  },
  "/scenarios/satisfactory/img/supercomputer.png": {
    "type": "image/png",
    "etag": "\"3b6-s6v2fpUoDTa2C/d+FqP3OJJqWOk\"",
    "mtime": "2026-11-18T08:22:55.906Z",
    "size": 950,
    "path": "../public/scenarios/satisfactory/img/supercomputer.png"
  },
  "/scenarios/satisfactory/img/time_crystal.png": {
    "type": "image/png",
    "etag": "\"500-95HokTA6aWzcQMyMtaOI5QOV/is\"",
    "mtime": "2026-11-18T08:22:55.908Z",
    "size": 1280,
    "path": "../public/scenarios/satisfactory/img/time_crystal.png"
  },
  "/scenarios/satisfactory/img/uranium.png": {
    "type": "image/png",
    "etag": "\"80d-/QvS/xNewGmccYOcWtwZheIvbVM\"",
    "mtime": "2026-11-18T08:22:55.908Z",
    "size": 2061,
    "path": "../public/scenarios/satisfactory/img/uranium.png"
  },
  "/scenarios/satisfactory/img/uranium_cell.png": {
    "type": "image/png",
    "etag": "\"41f-bKGNszs4Iw14waO3TN3oEZ07AkY\"",
    "mtime": "2026-11-18T08:22:55.908Z",
    "size": 1055,
    "path": "../public/scenarios/satisfactory/img/uranium_cell.png"
  },
  "/scenarios/satisfactory/img/uranium_fuel.png": {
    "type": "image/png",
    "etag": "\"47b-cVsM6N2N1dXIyjg0uV6hkzKh+4I\"",
    "mtime": "2026-11-18T08:22:55.908Z",
    "size": 1147,
    "path": "../public/scenarios/satisfactory/img/uranium_fuel.png"
  },
  "/scenarios/satisfactory/img/water.png": {
    "type": "image/png",
    "etag": "\"4b7-sq/gBi5icB8ythy5FupTxeekh0A\"",
    "mtime": "2026-11-18T08:22:55.910Z",
    "size": 1207,
    "path": "../public/scenarios/satisfactory/img/water.png"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const _ROOT_FOLDER_RE = /^\/([A-Za-z]:)?$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const relative = function(from, to) {
  const _from = resolve(from).replace(_ROOT_FOLDER_RE, "$1").split("/");
  const _to = resolve(to).replace(_ROOT_FOLDER_RE, "$1").split("/");
  if (_to[0][1] === ":" && _from[0][1] === ":" && _from[0] !== _to[0]) {
    return _to.join("/");
  }
  const _fromCopy = [..._from];
  for (const segment of _fromCopy) {
    if (_to[0] !== segment) {
      break;
    }
    _from.shift();
    _to.shift();
  }
  return [..._from.map(() => ".."), ..._to].join("/");
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  // Public dirs might be pruned after the build (uploaded to a CDN, sourcemaps
  // stripped), so a manifest entry with no file behind it reads as absent, not broken.
  return promises.readFile(resolve(serverDir, assets[id].path)).catch((error) => {
    if (error?.code !== 'ENOENT') { throw error }
  })
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_fonts/":{"maxAge":31536000},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _Yd9Rcp = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  const data = readAsset(id);
  return typeof data?.then === "function" ? data.then(
    (resolved) => assertAssetData(event, resolved)
  ) : assertAssetData(event, data);
});
function assertAssetData(event, data) {
  if (data === null || data === void 0) {
    removeResponseHeader(event, "Cache-Control");
    throw createError$1({ statusCode: 404 });
  }
  return data;
}

const _messagesHandler = defineEventHandler(async (event) => {
  const locale = getRouterParam(event, "locale");
  if (!locale) {
    throw createError$1({ status: 400, message: "Locale not specified." });
  }
  const ctx = useI18nContext(event);
  if (ctx.localeConfigs && locale in ctx.localeConfigs === false) {
    throw createError$1({ status: 404, message: `Locale '${locale}' not found.` });
  }
  const messages = await ctx.loadMessages(locale);
  return messages;
});
const getCacheKey = (event) => [getRouterParam(event, "locale") ?? "null", getRouterParam(event, "hash") ?? "null"].join("-");
async function shouldBypassCache(event) {
  const locale = getRouterParam(event, "locale");
  if (locale == null) {
    return false;
  }
  const ctx = tryUseI18nContext(event) || await initializeI18nContext(event);
  return !ctx.localeConfigs?.[locale]?.cacheable;
}
const _cachedMessageLoader = defineCachedFunction(_messagesHandler, {
  name: "i18n:messages-internal",
  maxAge: 60 * 60 * 24,
  getKey: getCacheKey,
  shouldBypassCache
});
const _messagesHandlerCached = defineCachedEventHandler(_cachedMessageLoader, {
  name: "i18n:messages",
  maxAge: 10,
  swr: false,
  getKey: getCacheKey,
  shouldBypassCache
});
const _cWm4_o = _messagesHandlerCached;

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_WRVyHU = () => import('../routes/renderer.mjs');

const handlers = [
  { route: '', handler: _Yd9Rcp, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_WRVyHU, lazy: true, middleware: false, method: undefined },
  { route: '/_i18n/:hash/:locale/messages.json', handler: _cWm4_o, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_WRVyHU, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp = createNitroApp();
function useNitroApp() {
  return nitroApp;
}
runNitroPlugins(nitroApp);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

export { appTeleportTag as A, NUXT_PAGE_PATTERNS as B, defineRenderHandler as C, toRequestEvent as D, setResponseHeader as E, NUXT_PRERENDER_NO_SSR_ROUTES as N, trapUnhandledNodeErrors as a, useNitroApp as b, appRootTag as c, destr as d, appRootAttrs as e, appSpaLoaderTag as f, appSpaLoaderAttrs as g, buildAssetsURL as h, createError$1 as i, getRouteRules as j, createHead as k, unheadOptions as l, appId as m, getQuery as n, appHead as o, publicAssetsURL as p, NUXT_SSR_STREAMING as q, renderSSRHeadOptions as r, setupGracefulShutdown as s, toNodeListener as t, useRuntimeConfig as u, appTeleportAttrs as v, writeEarlyHints as w, NUXT_NO_SCRIPTS_PATTERNS as x, relative as y, joinURL as z };
//# sourceMappingURL=nitro.mjs.map
