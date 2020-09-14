import chalk from "chalk";
import {HttpProxyAgent} from "http-proxy-agent";
import {default as nodeFetch, RequestInfo, RequestInit, Response} from "node-fetch";

const proxy = process.env.http_proxy || process.env.HTTP_PROXY;
let agent: HttpProxyAgent | undefined;
if (proxy) {
    console.log(chalk.yellow("using proxy"), chalk.green(proxy));
    agent = new HttpProxyAgent(proxy);
}

export default function fetch(
    url: RequestInfo,
    init?: RequestInit
): Promise<Response> {
    const i: RequestInit = init || {};
    // @ts-ignore
    const i2: RequestInit = agent
        ? { ...i, agent }
        : i
    return nodeFetch(url, i2);
}

