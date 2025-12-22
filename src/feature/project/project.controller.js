const ProjectService = require("./project.service");

class ProjectController {
  constructor(service) {
    this.service = service;
  }

  createProject = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in the request
    req.body.ownerId = userId; // Set the ownerId to the current user's ID
    req.body.createdBy = userId; // Set the createdBy field to the current user's ID
    req.body.updatedBy = userId; // Set the updatedBy field to the current user's ID
    const project = await this.service.createProject(req.body);
    res.status(201).json(project);
  };

  updateProject = async (req, res) => {
    const project = await this.service.updateProject(req.params.id, req.body);
    res.status(200).json(project);
  };

  archiveProject = async (req, res) => {
    const project = await this.service.archiveProject(req.params.id);
    res.status(200).json(project);
  };

  unArchiveProject = async (req, res) => {
    const project = await this.service.unArchiveProject(req.params.id);
    res.status(200).json(project);
  };

  deleteProject = async (req, res) => {
    await this.service.deleteProject(req.params.id);
    res.status(204).send();
  };

  getProjectById = async (req, res) => {
    const project = await this.service.getProjectById(req.params.id);
    res.status(200).json(project);
  };

  getAllProjects = async (req, res) => {
    const projects = await this.service.getAllProjects();
    res.status(200).json(projects);
  };

  getAllArchivedProjects = async (req, res) => {
    const projects = await this.service.getAllArchivedProjects();
    res.status(200).json(projects);
  };
}


module.exports = async function createController(){
    const service = await ProjectService();
    return new ProjectController(service);  
}