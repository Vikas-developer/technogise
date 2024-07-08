const { createUser, getUsers } = require("./user");
const userModel = require("../models/user");

jest.mock("../models/user");

describe("User Controller", () => {
  describe("createUser", () => {
    it("should create a user and return it", async () => {
      const req = { body: { name: "John Doe" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockUser = { id: 1, name: "John Doe" };
      userModel.createUser.mockResolvedValue(mockUser);

      await createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should handle errors", async () => {
      const req = { body: { name: "John Doe" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockError = new Error("Database error");
      userModel.createUser.mockRejectedValue(mockError);

      await createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });

  describe("getUsers", () => {
    it("should get all users and return them", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockUsers = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
      ];
      userModel.getUsers.mockResolvedValue(mockUsers);

      await getUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should handle errors", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockError = new Error("Database error");
      userModel.getUsers.mockRejectedValue(mockError);

      await getUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });
});
