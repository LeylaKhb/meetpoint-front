const apiUrl = process.env.REACT_APP_API_URL;

export const refreshAccessToken = (): Promise<string> => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) {
        return Promise.reject(new Error("No refresh token found"));
    }

    return fetch(`${apiUrl}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken })
    })
        .then(response => {
            if (!response.ok) {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.assign('/');
                throw new Error("Failed to refresh token");
            }
            return response.json();
        })
        .then((data: { access: string }) => {
            localStorage.setItem("access", data.access);
            return data.access;
        });
};

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const fetchWithAuthRetry = async (
    url: string,
    options: FetchOptions = {}
): Promise<Response> => {
    const accessToken = localStorage.getItem("access") || "";

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
    };

    let response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        const retryHeaders = {
            ...options.headers,
            'Authorization': `Bearer ${newAccess}`
        };
        response = await fetch(url, {
            ...options,
            headers: retryHeaders
        });
    }

    return response;
};