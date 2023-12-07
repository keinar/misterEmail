import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const robotService = {
    query,
    save,
    remove,
    getById,
    createRobot,
}

const STORAGE_KEY = 'robots'

_createRobots()

async function query(filterBy) {
    const robots = await storageService.query(STORAGE_KEY)
    if (filterBy) {
        var { type, maxBatteryStatus, minBatteryStatus, model } = filterBy
        maxBatteryStatus = maxBatteryStatus || Infinity
        minBatteryStatus = minBatteryStatus || 0
        robots = robots.filter(robot => robot.type.toLowerCase().includes(type.toLowerCase()) && robot.model.toLowerCase().includes(model.toLowerCase())
            && (robot.batteryStatus < maxBatteryStatus)
            && robot.batteryStatus > minBatteryStatus)
    }
    return robots
}

function getById(id) {
    return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}

function save(robotToSave) {
    if (robotToSave.id) {
        return storageService.put(STORAGE_KEY, robotToSave)
    } else {
        robotToSave.isOn = false
        return storageService.post(STORAGE_KEY, robotToSave)
    }
}

function createRobot(model = '', type = '', batteryStatus = 100) {
    return {
        model,
        batteryStatus,
        type
    }
}

function _createRobots() {
    let robots = utilService.loadFromStorage(STORAGE_KEY)
    if (!robots || !robots.length) {
        robots = [
            { _id: 'r2', model: 'Salad-O-Matic', batteryStatus: 80, type: 'Cooking' },
            { _id: 'r3', model: 'Dusty', batteryStatus: 100, type: 'Cleaning' },
            { _id: 'r1', model: 'Dominique Sote', batteryStatus: 100, type: 'Pleasure' },
            { _id: 'r4', model: 'DevTron', batteryStatus: 40, type: 'Office' }
        ]
        utilService.saveToStorage(STORAGE_KEY, robots)
    }
}




