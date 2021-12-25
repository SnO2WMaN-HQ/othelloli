import { BareFetcher } from "swr";

export const defaultFetcher: BareFetcher = (resource, init) => fetch(resource, init).then((res) => res.json());
