const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');

const gymHomeUrl = "https://sports.idongjak.or.kr/home/171?center=DONGJAK07&category1=ALL&category2=ALL&title=&train_day="
const hrefList = [];
const getHtml = async () => {
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
            await checkAvail(gymHomeUrl+url)
        })
        await Promise.all(prom)

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

        dlElements.each((i, element) => {
            // Use `$(element)` to work within the current <dl> element
            // Find the <dd> elements within the current <dl> element
            const ddElements = $(element).find("dd");
            const dtElements = $(element).find("dt");
            let className
            const regex = /\d+/;
            ddElements.each((j, ddElement) => {
                const dt = $(dtElements[j]).text().trim()
                // const dd = $(ddElements[j]).text()
                const text = $(ddElements[j]).contents()
                    .filter((index, el) => el.nodeType === 3) // Filter out non-text nodes (comments)
                    .map((index, el) => $(el).text().trim())
                    .get()
                    .join('');
                if(dt ==="강좌명"){
                    className = text
                }
                if(dt === "잔여" && regex.test(text)){
                    console.log( `${className}, ${dt}, ${text}`)
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
}

getHtml();
