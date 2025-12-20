const eventBus = require('../eventBus')
const projectEvents = require('./events')

eventBus.on(projectEvents.PROJECT_CREATED,(project)=>{
    console.log("Project created event received",project.Id);
})

eventBus.on(projectEvents.PROJECT_UPDATED,(project)=>{
    console.log("Project updated event received",project.Id);
})

eventBus.on(projectEvents.PROJECT_ARCHIVED,(project)=>{
    console.log("Project archived event received",project.Id);
})

eventBus.on(projectEvents.PROJECT_UNARCHIVED,(project)=>{
    console.log("Project unarchived event received",project.Id);
})

eventBus.on(projectEvents.PROJECT_DELETED,(project)=>{
    console.log("Project deleted event received",project.Id);
})  