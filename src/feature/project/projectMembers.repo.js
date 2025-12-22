const dbInitialization = require("../../models/modelInit");

class ProjectMemberRepo {
  constructor(models) {
    this.ProjectMember = models.ProjectMember;
  }

  async create(data, options = {}) {
    return this.ProjectMember.create(data, options);
  }

  async findById(projectMemberId, options = {}) {
    return this.ProjectMember.findOne({
      where: { id: projectMemberId },
      ...options,
    });
  }

  async findAll(where = {}, options = {}) {
    return this.ProjectMember.findAll({
      where,
      ...options,
    });
  }

  async update(projectMemberId, data, options = {}) {
    const [_, [projectMember]] = await this.ProjectMember.update(
      data,
      {
        where: { id: projectMemberId },
        returning: true, // Postgres
        ...options,
      }
    );

    return projectMember;
  }


  async softDelete(projectMemberId,removedById, options = {}) {
    return this.ProjectMember.update(
      { isActive: false, removedAt: new Date(), removedBy: removedById },
      {
        where: { id: projectMemberId },
        ...options,
      }
    );
  }
}

module.exports = async () => {
  const { models } = await dbInitialization;
  return new ProjectMemberRepo(models);
};
