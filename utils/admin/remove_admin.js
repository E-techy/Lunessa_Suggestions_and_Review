// utils/admin/remove_admin.js

const { PrismaClient } = require("@prisma/client");
const verifyAdmin = require("./verify_admin");

const prisma = new PrismaClient();

/**
 * Removes an admin account if the requesting admin has superAdmin privileges.
 *
 * @async
 * @function removeAdmin
 * @param {string} apiKey - API key for verifying the requester.
 * @param {string} authToken - JWT token for authentication.
 * @param {string} jwtSecret - Secret used to decode JWT.
 * @param {string} adminToRemove - Username of the admin account to remove.
 * @returns {Promise<(
 *   "logged_out" |
 *   "not_an_admin" |
 *   "incorrect_api_key" |
 *   "unauthorized" |
 *   "admin_not_found" |
 *   "admin_removed_successfully"
 * )>}
 *
 * @example
 * const result = await removeAdmin(apiKey, authToken, process.env.JWT_SECRET, "targetAdmin");
 * if (result === "admin_removed_successfully") {
 *   console.log("Admin removed");
 * }
 */
async function removeAdmin(apiKey, authToken, jwtSecret, adminToRemove) {
  try {
    // ✅ Verify the requesting admin
    const admin = await verifyAdmin(apiKey, authToken, jwtSecret);

    if (
      admin === "logged_out" ||
      admin === "not_an_admin" ||
      admin === "incorrect_api_key"
    ) {
      return admin;
    }

    // ✅ Only superAdmin can remove admins
    if (admin.role !== "superAdmin") {
      return "unauthorized";
    }

    // ✅ Check if target admin exists
    const targetAdmin = await prisma.Admin.findUnique({
      where: { username: adminToRemove },
    });

    if (!targetAdmin) {
      return "admin_not_found";
    }

    // ✅ Delete the admin
    await prisma.Admin.delete({
      where: { username: adminToRemove },
    });

    return "admin_removed_successfully";
  } catch (error) {
    console.error("Error removing admin:", error);
    return "logged_out";
  }
}

module.exports = removeAdmin;
