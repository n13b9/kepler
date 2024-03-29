const {
        getAllLaunches,
        scheduleNewLaunch,
        existsLaunchWithId,
        abortLaunchById,
    } = require('../../models/launches.model');

async function httpGetAllLaunches(req,res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req,res){
    const launch = req.body;
    if(!launch.mission || !launch.launchDate || !launch.rocket || !launch.target){
        return res.status(400).json({
            error:'mission required property'
        })
    }
    
    launch.launchDate = new Date(launch.launchDate)
    if(launch.launchDate.toString()==='Invalid Date'){
        return res.status(400).json({
            error:'invalid date'
        })
    }

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id);

    const existsLaunch = await existsLaunchWithId(launchId);

    if(!existsLaunch) {
        return res.status(404).json({
            error:'launch not found',
        });
    }

    const aborted = await abortLaunchById(launchId);
    if(!aborted) {
        return res.status(400).json({
            error:"launch not aborted"
        })
    }

    return res.status(200).json({
        ok:true,
    })
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}