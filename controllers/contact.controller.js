/**
  * @typedef {import("express").Request} Request
  * @member {string} Request.body
  * @typedef {import("express").Response} Response
  * @typedef {import("express").NextFunction} NextFunction
  */

const UserService = require("../services/user.service");

module.exports = class ContactController {

  /**
   * @param {Request} request
   * @param {Response} response
   */
  static async createContact(request, response) {

    const { id: contactId } = request.body;
    const { _id: currentUserId } = request.user;
    try {

      const foundUser = await UserService.getUserByID(contactId);

      if (!foundUser) {
        response.status(400).json({ message: "Invalid Contact Id" });
        return;
      }
      let updatedUser = await UserService.findUserByIdAndUpdate(currentUserId, { contacts: contactId }, "$push");
      response.status(200).json(updatedUser);
    }
    catch (ex) {
      console.log(ex)
      response.status(500).json({ message: `Something went wrong: ${ex.message}` });
    }
  }
  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async getContactsByCurrentUserId(request, response, next) {
    try {
      const { _id: currentUserId } = request.user;
      const currentUser = await UserService.getUserByID(currentUserId);
      let contacts = [];
      await Promise.all(
        currentUser.contacts.map(async contactId => {
          const contact = await UserService.getUserByID(contactId);
          contacts.push(contact);
        })
      )

      response.status(200).json(contacts);
    } catch (ex) {
      response.status(500).json({ message: `Something went wrong: ${ex.message}` });
    }
  }
}