const { v4 } = require('uuid');
const { gymClassModel } = require('../schema/GymClass');
const { getAvails, checkAvail } = require('crawl')
const { gymHomeUrls, gymList} = require('gyms')

const addGymClass= async (url) => {
    const classInfos = await getAvails(url)
    const prom = classInfos.map(async (classInfo)=>{
        return  await gymClassModel.create({//it returns a Item initializer that you can use to create instances of the given model.
            gym: classInfo["센터"],
            id: v4(),
            residue: classInfo["잔여"],
            time: classInfo["시간"],
            price: classInfo["수강료"],
            target: classInfo["교육대상"],
            className: classInfo["강좌명"]
        });

    })
    await Promise.all(prom)
};

const addGymClasses = async () =>{

    const prom = gymList.map(async (url)=>{
      return await addGymClass(url)
    })
    await Promise.all(prom)
}
const getClassByGym = async (gym) => {
    const result = await gymClassModel.get({gym});
    if (!result) {
        throw "error"
    }
    return result;

};
module.exports = {addGymClasses, getClassByGym}