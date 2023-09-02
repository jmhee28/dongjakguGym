const { getAvails, checkAvail, getSingle } = require('crawl')
const { gymHomeUrls, gymList} = require('gyms')
const {addGymClasses, getClassByGym} = require('gymClasses/gymClasses')
module.exports.handler = async (event) => {
    const { httpMethod, resource } = event;
    let result
    if(httpMethod){
         if (resource === '/' && httpMethod === 'GET') {
             const url = gymHomeUrls["사당문화회관"]
             // console.log(url)
             const avails = await getAvails(url)
             result = avails.map((a)=>{
                 return a[0]
             })
         } else if (resource === '/{gymName}' && httpMethod === 'GET') {
             const { gymName } = event.pathParameters;
             console.log("gymName:::::", gymName)
             const url = gymList[gymName]
             console.log(url)
             const avails = await getAvails(url)
             result = avails.map((a)=>{
                 return a[0]
             })
         } else if(resource === 'default/{gymName}' && httpMethod === 'GET'){
             const gymNames = Object.keys(gymHomeUrls)
             const { gymName } = event.pathParameters;
             result = await getClassByGym(gymNames[gymName])
         }
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(
                result
            ),
        };
    } else { // eventbridge
        const my = 'https://sports.idongjak.or.kr/home/171?category2=ALL&comcd=DONGJAK03&center=DONGJAK03&category1=01&action=read&class_cd=01845&item_cd=I000662'
        await getSingle(my)
        // await addGymClasses()

     }

};
