const apiUrl = process.env.REACT_APP_API_URL;

export const allTags = async () => {
    const res = await fetch(`${apiUrl}/tags`);
    const tags = await res.json();
    console.log(tags);
    return tags;
}

export const getTagsByType = (type: string) => {

    return null;
};