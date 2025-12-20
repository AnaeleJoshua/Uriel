const dbInitialization = require("../../models/modelInit");

class ProjectRepo {
  constructor(models) {
    this.Project = models.Project;
  }

  async create(data, options = {}) {
    return this.Project.create(data, options);
  }

  async findById(projectId, options = {}) {
    return this.Project.findOne({
      where: { id: projectId },
      ...options,
    });
  }

  async findAll(where = {}, options = {}) {
    return this.Project.findAll({
      where,
      ...options,
    });
  }

  async update(projectId, data, options = {}) {
    const [_, [project]] = await this.Project.update(
      data,
      {
        where: { id: projectId },
        returning: true, // Postgres
        ...options,
      }
    );

    return project;
  }

  async archive(projectId, options = {}) {
    return this.update(
      projectId,
      { isArchived: true },
      options
    );
  }

  async unArchive(projectId, options = {}) {
    return this.update(
      projectId,
      { isArchived: false },
      options
    );
  }

  async delete(projectId, options = {}) {
    return this.Project.destroy({
      where: { id: projectId },
      ...options,
    });
  }
}

module.exports = async () => {
  const { models } = await dbInitialization;
  return new ProjectRepo(models);
};
