const launchesDB = require('./launches.mongo')
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;


let latestFlightNumber =100;

const launch = {
    flightNumber:100,
    mission:'kepler exploration x',
    rocket:'explorer 1',
    launchDate: new Date('December 27,2030'),
    target:'kepler-442 b',
    customers: ['NASA','ZTM'],
    upcoming: true,
    success:true,
}

saveLaunch(launch);


async function existsLaunchWithId(launchId){
    return await launchesDB.findOne({
            flightNumber:launchId,
        })
}

async function getAllLaunches(){
    return await launchesDB
        .find({},{_id:0,__v:0,})
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDB
        .findOne()
        .sort('-flightNumber')

    return latestLaunch.flightNumber;

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName:launch.target,
    })

    if(!planet){
        throw new Error('No match found')
    }

    await launchesDB.updateOne({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert:true,
    })
}


async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber()+1

    const newLaunch = Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:['ZTM','NASA'],
        flightNumber:newFlightNumber,
    });

    await saveLaunch(newLaunch)
}


async function abortLaunchById(launchId){
    const aborted = await launchesDB.updateOne({
        flightNumber:launchId,
    },{
        upcoming:false,
        success:false,
    });

    return aborted.ok == 1 && aborted.nModified === 1;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
}