const projectRepo = require("./project.repo");
const projectMemberRepo = require("./projectMembers.repo");
const dbInitialization = require("../../models/modelInit");
const eventBus = require("../../event/eventBus");
const ProjectEvents = require("../../event/project/events");

class ProjectService {
  constructor({projectRepo,projectMemberRepo}, sequelize) {
    this.ProjectRepo = projectRepo;
    this.ProjectMemberRepo = projectMemberRepo;
    this.sequelize = sequelize;
  }

  async createProject(data) {
    const transaction = await this.sequelize.transaction();

    try {
      const project = await this.ProjectRepo.create(data, { transaction });
      const projectMember = await this.ProjectMemberRepo.create({
        projectId: project.id,
        userId: data.ownerId, // Assuming ownerId is passed in data
        role: "owner",
      }, { transaction });
      await transaction.commit();

      eventBus.emit(ProjectEvents.PROJECT_CREATED, project);

      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateProject(projectId, data) {
    const transaction = await this.sequelize.transaction();

    try {
      const project = await this.repo.update(
        projectId,
        data,
        { transaction }
      );

      await transaction.commit();

      eventBus.emit(ProjectEvents.PROJECT_UPDATED, {
        projectId,
        changes: data,
        project,
      });

      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async archiveProject(projectId) {
    const transaction = await this.sequelize.transaction();

    try {
      const project = await this.repo.archive(
        projectId,
        { transaction }
      );

      await transaction.commit();

      eventBus.emit(ProjectEvents.PROJECT_ARCHIVED, project);

      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async unArchiveProject(projectId) {
    const transaction = await this.sequelize.transaction();

    try {
      const project = await this.repo.unArchive(
        projectId,
        { transaction }
      );

      await transaction.commit();

      eventBus.emit(ProjectEvents.PROJECT_UNARCHIVED, project);

      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteProject(projectId) {
    const transaction = await this.sequelize.transaction();

    try {
      await this.repo.delete(projectId, { transaction });
      await transaction.commit();

      eventBus.emit(ProjectEvents.PROJECT_DELETED, projectId);

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getAllProjects() {
    return this.repo.findAll({ isArchived: false });
  }

  async getAllArchivedProjects() {
    return this.repo.findAll({ isArchived: true });
  }

  async getProjectById(projectId) {
    return this.repo.findById(projectId);
  }
}

module.exports = async function createProjectService() {
  const { sequelize } = await dbInitialization;
  const projectRepoInstance = await projectRepo();
  const projectMemberRepoInstance = await projectMemberRepo();
  return new ProjectService({projectRepo: projectRepoInstance, projectMemberRepo: projectMemberRepoInstance}, sequelize);
};
