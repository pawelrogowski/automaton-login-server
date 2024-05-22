// server.js
require("dotenv").config();
const fastify = require("fastify")({
  ignoreTrailingSlash: true,
});
const connectDb = require("./db/connectDb");
const UserController = require("./controllers/UserController");

connectDb()
  .then(() => {
    console.log("Connected to MongoDB successfully.");

    fastify.post("/users", async (request, reply) => {
      const userData = request.body;
      try {
        const newUser = await UserController.createUser(userData);
        return newUser;
      } catch (error) {
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    });

    fastify.get("/users", async (request, reply) => {
      const { email } = request.query;
      console.log(email);
      try {
        const user = await UserController.getUserByEmail(email);
        if (!user) {
          return reply.status(404).send({ message: "User not found" });
        }
        return user;
      } catch (error) {
        console.log(error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    });

    fastify.put("/users", async (request, reply) => {
      const { email } = request.body;
      const userData = request.body;
      try {
        const updatedUser = await UserController.updateUser(email, userData);
        return updatedUser;
      } catch (error) {
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    });
    // Add this route after the existing routes in server.js
    fastify.put("/users/change-email", async (request, reply) => {
      const { email, newEmail } = request.body;
      try {
        const user = await UserController.changeEmail(email, newEmail);
        return user;
      } catch (error) {
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    });

    // Add this route after the previous new route in server.js
    fastify.put("/users/change-password", async (request, reply) => {
      const { email, newPassword } = request.body;
      try {
        const user = await UserController.changePassword(email, newPassword);
        return user;
      } catch (error) {
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    });

    // Delete User by Email
    fastify.delete("/users", async (request, reply) => {
      const { email } = request.body;
      try {
        const deletedUser = await UserController.deleteUser(email);
        return deletedUser;
      } catch (error) {
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    });

    // Start the server
    fastify.listen(
      { port: process.env.RENDER_PORT || 3000 },
      (err, address) => {
        if (err) {
          fastify.log.error(err);
          process.exit(1);
        }
        console.log(`Server listening at ${address}`);
      }
    );
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
