const { PrismaClient } = require("@prisma/client");
const verifyAdmin = require("./verify_admin");
const generateApiKey = require("./generate_api_key");

const prisma = new PrismaClient();

/**
 * Adds a new admin to the Admin model.
 *
 * @async
 * @function addNewAdmin
 * @param {string} apiKey - API key of the current admin.
 * @param {string} authToken - JWT token of the current admin.
 * @param {string} jwtSecret - Secret used to verify the token.
 * @param {object} newAdmin - Object containing the new admin's details.
 * @param {string} newAdmin.username
 * @param {string} newAdmin.email
 * @param {string} newAdmin.phoneNumber
 * @param {string} newAdmin.role
 * @returns {Promise<object>} Result with status and optionally new API key
 */
async function addNewAdmin(apiKey, authToken, jwtSecret, newAdmin) {
  try {
    // ✅ Step 1: Verify the calling admin
    const admin = await verifyAdmin(apiKey, authToken, jwtSecret);

    if (
      admin === "logged_out" ||
      admin === "not_an_admin" ||
      admin === "incorrect_api_key"
    ) {
      return { status: admin };
    }

    if (admin.role !== "superAdmin") {
      return { status: "unauthorized" };
    }

    // ✅ Step 2: Validate the new admin object
    const requiredFields = ["username", "email", "phoneNumber", "role"];
    const hasAllFields = requiredFields.every(
      (field) =>
        Object.prototype.hasOwnProperty.call(newAdmin, field) &&
        typeof newAdmin[field] === "string" &&
        newAdmin[field].trim() !== ""
    );

    if (!hasAllFields) {
      return { status: "invalid_admin_object" };
    }

    // ✅ Step 3: Ensure username/email/phone are unique
    const existingAdmin = await prisma.Admin.findFirst({
      where: {
        OR: [
          { username: newAdmin.username },
          { email: newAdmin.email },
          { phoneNumber: newAdmin.phoneNumber },
        ],
      },
    });

    if (existingAdmin) {
      if (existingAdmin.username === newAdmin.username) {
        return { status: "username_already_exists" };
      }
      if (existingAdmin.email === newAdmin.email) {
        return { status: "email_already_exists" };
      }
      if (existingAdmin.phoneNumber === newAdmin.phoneNumber) {
        return { status: "phone_number_already_exists" };
      }
    }

    // ✅ Step 4: Generate API key
    const apiKeyForNewAdmin = generateApiKey(newAdmin.username);

    // ✅ Step 5: Insert into Admin model
    await prisma.Admin.create({
      data: {
        username: newAdmin.username,
        email: newAdmin.email,
        phoneNumber: newAdmin.phoneNumber,
        role: newAdmin.role,
        apiKey: apiKeyForNewAdmin,
      },
    });

    return {
      status: "admin_created_successfully",
      apiKey: apiKeyForNewAdmin,
    };
  } catch (error) {
    console.error("Error adding new admin:", error);
    return { status: "error", message: error.message };
  }
}

module.exports = addNewAdmin;
