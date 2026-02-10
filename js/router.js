// Lightweight Hash Router
export class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.beforeHooks = [];
        window.addEventListener('hashchange', () => this.resolve());
    }

    on(path, handler) {
        this.routes[path] = handler;
        return this;
    }

    before(hook) {
        this.beforeHooks.push(hook);
        return this;
    }

    navigate(path) {
        window.location.hash = path;
    }

    resolve() {
        const hash = window.location.hash.slice(1) || '/';
        const [path, queryString] = hash.split('?');
        const params = {};

        if (queryString) {
            queryString.split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            });
        }

        // Find matching route (support :param patterns)
        let handler = null;
        let routeParams = {};

        for (const [routePath, routeHandler] of Object.entries(this.routes)) {
            const match = this.matchRoute(routePath, path);
            if (match) {
                handler = routeHandler;
                routeParams = match;
                break;
            }
        }

        if (!handler) {
            handler = this.routes['/'] || (() => { });
        }

        // Run before hooks
        for (const hook of this.beforeHooks) {
            if (hook(path, this.currentRoute) === false) return;
        }

        this.currentRoute = path;
        handler({ path, params: { ...params, ...routeParams } });
    }

    matchRoute(routePath, actualPath) {
        const routeParts = routePath.split('/');
        const actualParts = actualPath.split('/');

        if (routeParts.length !== actualParts.length) return null;

        const params = {};
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                params[routeParts[i].slice(1)] = actualParts[i];
            } else if (routeParts[i] !== actualParts[i]) {
                return null;
            }
        }
        return params;
    }

    start() {
        this.resolve();
    }
}

export const router = new Router();
