import APIs from "../connections/api";

const UserService = {
  updateUserDarkMode: (data) => {
    return APIs.post("/user/single-user-update", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getOneUser: (data) => {
    return APIs.post("/user/single-user", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default UserService;
