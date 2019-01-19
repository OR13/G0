import getIPFS from "./ipfs-helpers";

const OrbitDB = require("orbit-db");

const getOrbitDB = async () => {
  if (window.orbitdb) {
    return Promise.resolve(window.orbitdb);
  }

  const ipfs = await getIPFS();
  const orbitOptions = undefined;
  const orbitdb = new OrbitDB(ipfs, "./orbitdb", orbitOptions);
  if (!window.orbitdb) {
    window.orbitdb = orbitdb;
  }
  return Promise.resolve(window.orbitdb);
};

export { getOrbitDB };
