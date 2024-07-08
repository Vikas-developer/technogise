const pool = require("../utils/databaseConfig");
const userModel = require("../models/user");

jest.mock("../utils/databaseConfig");

describe("User Model", () => {
  describe("createUser", () => {
    it("should create a user and return the user object", async () => {
      const mockName = "John Doe";
      const mockResult = [{ insertId: 1 }];

      pool.query.mockResolvedValue(mockResult);

      const user = await userModel.createUser(mockName);

      expect(user).toEqual({ id: 1, name: mockName });
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO users (name) VALUES (?)",
        [mockName]
      );
    });

    it("should handle errors", async () => {
      const mockName = "John Doe";
      const mockError = new Error("Database error");

      pool.query.mockRejectedValue(mockError);

      await expect(userModel.createUser(mockName)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("getUsers", () => {
    it("should get all users and return the users array", async () => {
      const mockRows = [
        [
          { id: 1, name: "John Doe" },
          { id: 2, name: "Jane Doe" },
        ],
      ];

      pool.query.mockResolvedValue(mockRows);

      const users = await userModel.getUsers();

      expect(users).toEqual(mockRows[0]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users");
    });

    it("should handle errors", async () => {
      const mockError = new Error("Database error");

      pool.query.mockRejectedValue(mockError);

      await expect(userModel.getUsers()).rejects.toThrow("Database error");
    });
  });
});
