import { AllowNull, Column, CreatedAt, IsEmail, Length, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { Role } from '../../auth/role';

@Table({
  modelName: 'users',
  timestamps: true,
  underscored: true,
  freezeTableName: true
})
class User extends Model<User> {

  @AllowNull(false)
  @Length({min: 1, max: 255, msg: 'Wrong first name length'})
  @Column({
    field: 'first_name'
  })
  public firstName: string;

  @AllowNull(false)
  @Length({min: 1, max: 255, msg: 'Wrong last name length'})
  @Column({
    field: 'last_name'
  })
  public lastName: string;

  @IsEmail
  @AllowNull(false)
  @Column
  public email: string;

  @AllowNull(false)
  @Column
  public role: Role;

  @CreatedAt
  @Column({
    field: 'created_at'
  })
  public createdAt: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at'
  })
  public updatedAt: Date;
}

export default User;
