function getFullSubredditJson(subreddit: string, options: string){
   return fetch(`https://www.reddit.com/r/${subreddit}/search.json?${options}`)
   .then(res => res.json())
}

function getSubrreditJson(subreddit: string, options: Ioptions | string){
    return getFullSubredditJson(subreddit, getOptions(options as Ioptions))
    .then(res => res.data.children
        .reduce((prev: object[], {data: {
            title, 
            post_hint,
            is_gallery, 
            url, 
            media,
            gallery_data
            } 
        }) => prev.push({
            title, 
            post_hint, 
            url, 
            media, 
            is_gallery, 
            gallery_data: is_gallery ? gallery_data.items.map(el => el.media_id) : null
        }) && prev, []))
}

function getSubrreditMedia(subreddit: string, options: Ioptions | string): object{
    return getSubrreditJson(subreddit, getOptions(options as Ioptions))
    .then(res => res.filter(el => el.post_hint == "image" || el.post_hint == "hosted:video" || el.is_gallery))
}

interface Ioptions{
    search: string,
    time: "hour" | "day" | "week" | "month" | "year" | "all",
    sort: "new" | "hot" | "top" | "rising",
    nsfw: boolean,
    limit: number
}

function getOptions(options: Ioptions){
    let searchStr = "";
    searchStr += `q=${options.hasOwnProperty("search") ? options["search"] : "*"}`;
    searchStr += `${options.nsfw ? "&include_over_18=1" : ""}`;
    searchStr += `&sort=${options.hasOwnProperty("sort") ? options["sort"] : "new"}`;
    searchStr +=  `&t=${options.hasOwnProperty("time") ? options["time"] : ""}`;
    searchStr += `&limit=${options.hasOwnProperty("limit") ? options["limit"] : "10"}`;
    return searchStr
}