import { CompanyProfile } from './companyProfiles/model/companyProfile.model';
import { Job } from './jobs/model/job.model';
import { User } from './users/model/user.model';

export function associateModels() {
  User.belongsTo(CompanyProfile, { foreignKey: 'companyId', as: 'company' });
  CompanyProfile.hasMany(User, { foreignKey: 'companyId', as: 'employees' });

  User.hasMany(Job, { foreignKey: 'employerId', as: 'postedJobs' });
  User.hasMany(Job, { foreignKey: 'approvedBy', as: 'approvedJobs' });
  User.hasMany(Job, { foreignKey: 'rejectedBy', as: 'rejectedJobs' });

  Job.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });
  Job.belongsTo(User, { foreignKey: 'approvedBy', as: 'approvedByUser' });
  Job.belongsTo(User, { foreignKey: 'rejectedBy', as: 'rejectedByUser' });
  Job.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });
  Job.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
  Job.belongsTo(User, { foreignKey: 'deletedBy', as: 'deletedByUser' });
}
