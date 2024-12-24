import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Tag',
    {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      CreateDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      CreateUserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'Tag', //直接提供資料表名稱
      timestamps: false, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: false, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
