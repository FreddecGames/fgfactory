import { c as appRootTag, e as appRootAttrs, f as appSpaLoaderTag, g as appSpaLoaderAttrs, h as buildAssetsURL, p as publicAssetsURL, w as writeEarlyHints, i as createError, b as useNitroApp, j as getRouteRules, u as useRuntimeConfig, k as createHead, N as NUXT_PRERENDER_NO_SSR_ROUTES, l as unheadOptions, m as appId, n as getQuery, o as appHead, d as destr, q as NUXT_SSR_STREAMING, r as renderSSRHeadOptions, v as appTeleportAttrs, x as NUXT_NO_SCRIPTS_PATTERNS, y as relative, z as joinURL, A as appTeleportTag, B as NUXT_PAGE_PATTERNS, C as defineRenderHandler, D as toRequestEvent, E as setResponseHeader } from '../_/nitro.mjs';
import { defineDiagnostics, createConsoleReporter } from 'nostics';
import { renderToString } from 'vue/server-renderer';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'vue-bundle-renderer/runtime';
import { propsToString, renderSSRHead } from 'unhead/server';
import { stringify, uneval } from 'devalue';
import 'vue';
import 'unhead/legacy';
import 'unhead/plugins';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'vue-router';
import 'node:url';
import 'node:crypto';

//#region src/runtime/utils/response.ts
/**
* The response the renderer builds, keeping its body as the renderer produced it.
*
* A real `Response` turns every body into a `ReadableStream`, which would send a rendered
* document as a chunked stream where nitro sends the string it was given. The renderer only
* reads the fields below back, so this describes just those.
*/
var NodeRenderResponse = class {
	body;
	status;
	statusText;
	headers;
	constructor(body, init) {
		this.body = body;
		this.status = init?.status || 200;
		this.statusText = init?.statusText || "";
		this.headers = init?.headers instanceof Headers ? init.headers : new Headers(init?.headers);
	}
};
/**
* The headers of a node response as the record nitro's `render:response` hook passes,
* read from and written to the node response itself. `set-cookie` is omitted, as it
* cannot be represented as one string. The proxy target is kept as a snapshot for
* `util.inspect`, which bypasses the traps.
*/
function createResponseHeaderRecord(res) {
	const read = (name) => {
		if (typeof name !== "string" || name.toLowerCase() === "set-cookie") return;
		const value = res.getHeader(name);
		if (value === void 0) return;
		return Array.isArray(value) ? value.join(", ") : String(value);
	};
	const snapshot = {};
	const sync = (name) => {
		const value = read(name);
		if (value === void 0) delete snapshot[name.toLowerCase()];
		else snapshot[name.toLowerCase()] = value;
	};
	for (const name of res.getHeaderNames()) sync(name);
	return new Proxy(snapshot, {
		get: (_, name) => read(name),
		has: (_, name) => read(name) !== void 0,
		set(_, name, value) {
			if (typeof name === "string") {
				if (value === void 0 || value === null) res.removeHeader(name);
				else res.setHeader(name, value);
				sync(name);
			}
			return true;
		},
		deleteProperty(_, name) {
			if (typeof name === "string") {
				res.removeHeader(name);
				sync(name);
			}
			return true;
		},
		ownKeys: () => res.getHeaderNames().filter((name) => name !== "set-cookie"),
		getOwnPropertyDescriptor(_, name) {
			const value = read(name);
			return value === void 0 ? void 0 : {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			};
		}
	});
}

//#region src/runtime/server/renderer/cache.ts
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) res = fn().catch((err) => {
			res = null;
			throw err;
		});
		return res;
	};
}

/**
* E8xxx
* SSR rendering diagnostics, sharing the range with the server runtime that
* hosts the renderer.
*/
const docsBase = (code) => `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
const rendererDiagnostics = /* #__PURE__ */ defineDiagnostics({
	docsBase,
	reporters: [/* @__PURE__ */ createConsoleReporter(void 0)],
	codes: {
		NUXT_E8001: {
			why: (p) => `\`render:html\` mutated \`body\`/\`bodyAppend\` while streaming (\`${p.path}\`). These fields are silently dropped because the body is about to stream.`,
			fix: "Use the `render:html:close` hook instead.",
			docs: false
		},
		NUXT_E8002: {
			why: (p) => `SSR streaming committed the response before render completed (\`${p.path}\`). The following mutations did not reach the client and were dropped:\n  - ${p.mutations}`,
			fix: (p) => `Move the mutation into a plugin (which runs before the shell is flushed), or opt this route out of streaming with \`routeRules: { '${p.path}': { streaming: false } }\` or the \`render:route\` hook.`,
			docs: false
		},
		NUXT_E8004: {
			why: "The server bundle is not available.",
			fix: "Ensure the Nuxt build completed successfully and the server entry was emitted by your builder.",
			docs: false
		},
		NUXT_E8006: {
			why: (p) => `The payload for \`${p.path}\` is ${p.size}, which will increase the page size and slow down hydration.${p.keys ? ` Largest payload keys:\n  - ${p.keys}` : ""}`,
			fix: "Use the `pick` or `transform` options of `useAsyncData`/`useFetch` to strip out data the client does not need.",
			docs: false
		},
		NUXT_E8007: {
			why: (p) => `\`${p.path}\` relies on client-side JavaScript, but \`features.noScripts: 'production'\` will strip scripts from this route in production:\n  - ${p.reasons}`,
			fix: "Remove the client-side dependency from this route, or scope script stripping with the `noScripts` route rule instead of enabling it globally."
		},
		NUXT_E8009: {
			why: (p) => `A page error interrupted the stream for \`${p.path}\`, and ${p.what} also failed while rendering the error response.\n  ${p.cause}`,
			fix: "Fix the page error first. If it keeps happening, report the failure below - the browser will show a blank or partial page instead of the error page."
		}
	}
});

//#region src/runtime/server/renderer/build-files.ts
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('../virtual/entry.mjs').then((r) => r.default || r);
const getPrecomputedDependencies = () => import('../virtual/precomputed.mjs').then((r) => "default" in r ? r.default : r).then((r) => typeof r === "function" ? r() : r);
/** Load the build artifacts for a set of renderer options, caching each of them on the returned object. */
function createBuildFiles(options) {
	const buildAssetsURL = (...path) => options.buildAssetsURL(...path);
	const getSSRRenderer = lazyCachedFunction(async () => {
		const createSSRApp = await getServerEntry();
		if (!createSSRApp) throw rendererDiagnostics.NUXT_E8004();
		const precomputed = await getPrecomputedDependencies();
		const renderer = createRenderer(createSSRApp, {
			precomputed,
			manifest: void 0,
			renderToString: renderToString$1,
			buildAssetsURL
		});
		async function renderToString$1(input, context) {
			const html = await renderToString(input, context);
			return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
		}
		return renderer;
	});
	const getSPARenderer = lazyCachedFunction(async () => {
		const precomputed = await getPrecomputedDependencies();
		const template = renderSPATemplate();
		const renderer = createRenderer(() => () => {}, {
			precomputed,
			manifest: void 0,
			renderToString: () => template,
			buildAssetsURL
		});
		const result = await renderer.renderToString({});
		const renderToString = (ssrContext) => {
			const config = ssrContext.runtimeConfig;
			ssrContext.modules ||= /* @__PURE__ */ new Set();
			ssrContext.payload.serverRendered = false;
			ssrContext.config = {
				public: config.public,
				app: config.app
			};
			return Promise.resolve(result);
		};
		return {
			rendererContext: renderer.rendererContext,
			renderToString
		};
	});
	return {
		getRenderer: (ssrContext) => getSPARenderer() ,
		getSSRRenderer,
		getServerApp: lazyCachedFunction(getServerEntry)
	};
}
function renderSPATemplate() {
	{
		`<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
		return APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG + ("");
	}
}

//#region src/runtime/server/renderer/instance.ts
/**
* Create the renderer state for a set of options.
*
* Called by `createNuxtRenderer()`; call it directly only to render against the same
* artifacts as a renderer created elsewhere (an island handler sharing the server bundle
* loaded for page renders), and pass the result to `createNuxtRenderer()`.
*/
function createRendererInstance(options) {
	return {
		options,
		...createBuildFiles(options)
	};
}

//#region src/runtime/server/renderer/runtime.ts
/** The event to pass to application code and to the render hooks. */
function appEvent(event) {
	return event["~app"] ?? event;
}
function getRequestState(event) {
	return event.context.nuxt;
}

//#region src/runtime/utils/renderer/options.ts
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
/** The capabilities a nitropack v2 host provides to the Nuxt renderer. */
const rendererOptions = {
	runtimeConfig: (event) => useRuntimeConfig(appEvent(event)),
	buildAssetsURL,
	publicAssetsURL,
	getRouteRules: (event) => getRouteRules(appEvent(event)),
	hooks: () => useNitroApp().hooks,
	createResponse: (body, init) => new NodeRenderResponse(body, init),
	createError: (init) => createError({
		statusCode: init.status,
		statusMessage: init.statusText,
		message: init.statusText,
		data: init.data
	}),
	writeEarlyHints: (event, hints) => writeEarlyHints(appEvent(event), hints.link),
	onRenderSuccess: void 0,
	prerender: void 0
};
/**
* The renderer the page and island handlers share, so that both render against a single
* load of the server bundle and its manifest.
*/
const rendererInstance = createRendererInstance(rendererOptions);

//#region src/runtime/server/renderer/url.ts
/**
* The fragment of a request URL, avoiding the lazy URL parse that reading `hash` triggers when
* there is none. A fragment is never sent over the wire, so it can only appear on a URL the
* server constructed itself.
*/
function urlHash(url) {
	return url.href.includes("#") ? url.hash : "";
}

//#region src/runtime/server/renderer/app.ts
new Set(NUXT_PRERENDER_NO_SSR_ROUTES);
function createServerHead() {
	return createHead(unheadOptions);
}
function createSSRContext(options, event) {
	const url = event.url.pathname + event.url.search + urlHash(event.url);
	const ssrContext = {
		url,
		event: appEvent(event),
		runtimeConfig: options.runtimeConfig(event),
		noSSR: true,
		head: createServerHead(),
		error: false,
		nuxt: void 0,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: /* @__PURE__ */ new Set()
	};
	return ssrContext;
}
/**
* Turn the response the renderer assembled into a web-standard `Response`, carrying the
* headers queued on the event alongside the ones the response names for itself.
*/
function returnRenderResponse(options, event, response) {
	const headers = new Headers(event.res.headers);
	for (const name in response.headers) headers.set(name, response.headers[name]);
	return options.createResponse(response.body ?? null, {
		status: response.statusCode ?? event.res.status,
		statusText: response.statusMessage ?? event.res.statusText,
		headers
	});
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

function renderPayloadJsonScript(opts) {
	const contents = opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "";
	const payload = {
		"type": "application/json",
		"innerHTML": contents,
		"data-nuxt-data": appId,
		"data-ssr": false
	};
	payload.id = "__NUXT_DATA__";
	if (opts.src) payload["data-src"] = opts.src;
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}
/**
* Encode forward slashes as unicode escape sequences to prevent
* Google from treating them as internal links and trying to crawl them.
* @see https://github.com/nuxt/nuxt/issues/24175
*/
function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}

const entryFileName = "Dumnw_3a.js";

//#region src/runtime/server/renderer/index.ts
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
/**
* Create a Nuxt SSR renderer, returning a web-standard handler for the requests a Nuxt
* app serves from its pages.
*
* Everything the renderer reads belongs to the renderer it was created for, so a bundle
* may create as many as it needs. Pass an instance from `createRendererInstance()` to
* render against the artifacts already loaded for another renderer.
*/
function createNuxtRenderer(optionsOrInstance) {
	const instance = "getRenderer" in optionsOrInstance ? optionsOrInstance : createRendererInstance(optionsOrInstance);
	return { fetch: (event) => fetch(instance, event) };
}
function fetch(instance, event) {
	const runtime = instance.options;
	const isErrorRoute = event.url.pathname.startsWith("/__nuxt_error");
	if (isErrorRoute && !getRequestState(event)?.["~rendering-error"]) {
		return Promise.reject(runtime.createError({
			status: 404,
			statusText: "Page Not Found: /__nuxt_error"
		}));
	}
	const ssrError = isErrorRoute ? getQuery(event.url.href) : null;
	const render = () => renderRoute(instance, event, ssrError).then((response) => returnRenderResponse(runtime, event, response));
	const rendering = render();
	return rendering;
}
async function renderRoute(instance, event, ssrError) {
	const runtime = instance.options;
	const hooks = runtime.hooks();
	const hookEvent = appEvent(event);
	runtime.prerender?.payloadCache;
	const ssrContext = createSSRContext(runtime, event);
	ssrContext.head.push(appHead);
	if (ssrError) {
		const status = ssrError.status || ssrError.statusCode;
		if (status) ssrError.status = ssrError.statusCode = Number.parseInt(status);
		if (typeof ssrError.data === "string") try {
			ssrError.data = destr(ssrError.data);
		} catch {}
		setSSRError(ssrContext, ssrError);
	}
	const routeOptions = runtime.getRouteRules(event);
	const NO_SCRIPTS = !!routeOptions.noScripts;
	if (routeOptions.ssr === false && true) ssrContext.noSSR = true;
	!ssrContext.noSSR && !ssrError && false;
	const renderer = await instance.getRenderer(ssrContext);
	const canStream = NUXT_SSR_STREAMING;
	const renderRouteContext = {
		canStream,
		prefersStream: false
	};
	await hooks.callHook("render:route", renderRouteContext, { event: hookEvent });
	const _rendered = await (renderer.renderToString(ssrContext)).catch(async (error) => {
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") return {};
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	if (ssrContext.payload?.error && !ssrError) throw ssrContext.payload.error;
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	pushNoScriptsHints(ssrContext, NO_SCRIPTS);
	if (!NO_SCRIPTS) {
		const path = entryImportMapPath(instance, event, ssrContext);
		ssrContext.head.push({ script: [{
			type: "importmap",
			innerHTML: { imports: { "#entry": path } }
		}] });
	}
	if (inlinedStyles.length) ssrContext.head.push({ style: inlinedStyles });
	const link = [];
	const inlinedHrefs = [];
	for (const resource of Object.values(styles)) {
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) ssrContext.head.push({ link });
	const dependencyOptions = {
		exclude: ssrContext["~lazyHydratedModules"]?.size ? ssrContext["~lazyHydratedModules"] : void 0,
		scripts: !NO_SCRIPTS
	};
	const excludeHrefs = new Set(link.map((l) => l.href));
	for (const href of inlinedHrefs) excludeHrefs.add(href);
	for (const id of ssrContext["~neverHydratedModules"] ?? []) {
		const file = renderer.rendererContext.manifest?.[id]?.file;
		if (file) excludeHrefs.add(renderer.rendererContext.buildAssetsURL(file));
	}
	const hints = [];
	for (const l of getPreloadLinks(ssrContext, renderer.rendererContext, dependencyOptions)) if (!excludeHrefs.has(l.href)) hints.push(l);
	for (const l of getPrefetchLinks(ssrContext, renderer.rendererContext, dependencyOptions)) if (!excludeHrefs.has(l.href)) hints.push(l);
	if (hints.length) ssrContext.head.push({ link: hints });
	if (!NO_SCRIPTS) ssrContext.head.push({ script: renderPayloadJsonScript({
		ssrContext,
		data: stripInlineOnlyPayloadFields(ssrContext.payload)
	})   }, {
		tagPosition: "bodyClose",
		tagPriority: "high"
	});
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			tagPosition,
			crossorigin: ""
		})) });
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [_rendered.html, APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	await hooks.callHook("render:html", htmlContext, { event: hookEvent });
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: event.res.status,
		statusMessage: event.res.statusText,
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
/**
* Routes served without scripts navigate with full-page loads. This emits the
* declarative navigation hints that speed those up, on both the pages served
* without scripts (a blanket rule over same-origin links) and scripted pages
* that may link to them (rules scoped to the `noScripts` route patterns):
*
* - speculation rules, so supporting browsers prefetch and prerender the
*   target ahead of the navigation;
* - when view transitions are enabled, an opt-in to same-origin cross-document
*   view transitions, animating the navigation without a client runtime (the
*   client-side `startViewTransition` plugin is not shipped).
*
* Both tags are declarative and execute no JavaScript.
*/
function pushNoScriptsHints(ssrContext, noScripts) {
	if (noScripts) pushSpeculationRulesScript(ssrContext, NUXT_PAGE_PATTERNS.length ? NUXT_PAGE_PATTERNS : ["/*"]);
	else if (NUXT_NO_SCRIPTS_PATTERNS.length) pushSpeculationRulesScript(ssrContext, NUXT_NO_SCRIPTS_PATTERNS);
	else return;
}
const entryPaths = /* @__PURE__ */ new WeakMap();
/** URL of the hashed entry chunk, which `#entry` is pinned to so chunk hashes stay stable across it. */
function entryImportMapPath(instance, event, ssrContext) {
	const cached = entryPaths.get(instance);
	if (cached) return cached;
	const url = instance.options.buildAssetsURL(entryFileName);
	if (ssrContext.runtimeConfig.app.cdnURL || /^(?:\/|\.+\/)/.test(url)) {
		entryPaths.set(instance, url);
		return url;
	}
	const path = relative(event.url.pathname.replace(/\/[^/]+$/, "/"), joinURL("/", url));
	return /^(?:\/|\.+\/)/.test(path) ? path : `./${path}`;
}
function pushSpeculationRulesScript(ssrContext, patterns) {
	const rules = patterns.map((href_matches) => ({
		where: { href_matches },
		eagerness: "moderate"
	}));
	ssrContext.head.push({ script: [{
		tagPosition: "head",
		type: "speculationrules",
		innerHTML: {
			prefetch: rules,
			prerender: rules
		}
	}] });
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) result.push(chunk);
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) return "";
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}
function stripInlineOnlyPayloadFields(payload) {
	if (!payload.prefetchLinks) return payload;
	const { prefetchLinks: _, ...rest } = payload;
	return rest;
}

const renderer = createNuxtRenderer(rendererInstance);
const handler = defineRenderHandler(async (event) => {
	const response = await renderer.fetch(toRequestEvent(event));
	for (const [name, value] of response.headers) {
		if (name === "set-cookie") continue;
		setResponseHeader(event, name, value);
	}
	return {
		body: response.body,
		statusCode: response.status,
		statusMessage: response.statusText || void 0,
		headers: createResponseHeaderRecord(event.node.res)
	};
});

export { handler as default };
//# sourceMappingURL=renderer.mjs.map
