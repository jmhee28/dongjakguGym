const axios = require("axios");
const cheerio = require("cheerio");

// const gymHomeUrl = "https://sports.idongjak.or.kr/home/171?center=DONGJAK07&category1=ALL&category2=ALL&title=&train_day="
const hrefList = [];
const getAvails = async (gymHomeUrl) => {
    try {
        // 1. Make an HTTP request to the URL
        const response = await axios.get(gymHomeUrl);

        // 2. Load the HTML content into Cheerio
        const $ = cheerio.load(response.data);

        // 3. Select the <a> elements within the specified <td> elements
        const links = $("td.td4.txtleft a");

        // 4. Iterate over the <a> elements and extract the href attribute
        links.each((i, element) => {
            const href = $(element).attr("href");
            hrefList.push(href);
        });
        const prom = hrefList.map(async (url)=>{
            const info = await checkAvail(gymHomeUrl+url)
            return info
        })
        const temp = await Promise.all(prom)
        return temp
    } catch (error) {
        console.error(error);
    }
};

const checkAvail = async (url) =>{
    try {
        // 1. Make an HTTP request to the URL
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        // 2. Load the HTML content into Cheerio
        const dlElements = $("dl");
        const result = []
        dlElements.each((i, element) => {
            // Use `$(element)` to work within the current <dl> element
            // Find the <dd> elements within the current <dl> element
            const ddElements = $(element).find("dd");
            const dtElements = $(element).find("dt");
            // let className
            // let residue
            // let num
            // let price
            let infos = {}
            const regex = /\d+/;
            ddElements.each((j, ddElement) => {
                const dt = $(dtElements[j]).text().trim()
                // const dd = $(ddElements[j]).text()
                const text = $(ddElements[j]).contents()
                    .filter((index, el) => el.nodeType === 3) // Filter out non-text nodes (comments)
                    .map((index, el) => $(el).text().trim())
                    .get()
                    .join('');
                infos[dt] = text
            });
            infos.url = url
            result.push(infos)
        });

        return result
    } catch (error) {
        console.error(error);
    }
}
module.exports = {
    getAvails, checkAvail
}
// getHtml();
