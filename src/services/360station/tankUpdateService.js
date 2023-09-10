import APIs from "../connections/api";

const TankUpdateService = {
  createTankUpdate: (data) => {
    return APIs.post("/tank-update/create", data)
      .then(({ data }) => {
        return data.update;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getAllTankUpdate: (data) => {
    return APIs.post("/tank-update/allRecords", data)
      .then(({ data }) => {
        return data.update;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default TankUpdateService;
