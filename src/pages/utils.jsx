export function createPageUrl(pageName, params) {
    let url = `/${pageName.toLowerCase()}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }
    return url;
}

export default { createPageUrl };